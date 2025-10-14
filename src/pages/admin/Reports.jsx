import React, { useState, useEffect } from 'react'
import { Search, Filter, TrendingUp, TrendingDown, ChevronDown, Users, SquareLibrary } from 'lucide-react'
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react'
import { API_ENDPOINTS, apiCall } from '../../config/api'

const Reports = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [filteredData, setFilteredData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const [users, setUsers] = useState([])
  const [orders, setOrders] = useState([])
  const [activityLogs, setActivityLogs] = useState([])
  const [reportData, setReportData] = useState([])
  const [selectedRoles, setSelectedRoles] = useState({
    Administrator: true,
    Accountant: false,
    'Sales Manager': false,
    'Sales Assistant': false,
    'Store Manager': false
  });
  const [selectedDate, setSelectedDate] = useState('all');

  const timeRanges = [
    { id: 1, name: 'Today' },
    { id: 2, name: 'Yesterday' },
    { id: 3, name: 'This Week' },
    { id: 4, name: 'This Month' },
  ];

  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRanges[0]);

  // Fetch data from APIs
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch current user to get tenant context
      const currentUserResponse = await apiCall(API_ENDPOINTS.USER_ME);
      setCurrentUser(currentUserResponse);

      // Fetch users for current tenant
      const usersResponse = await apiCall(API_ENDPOINTS.USERS);
      const usersData = Array.isArray(usersResponse)
        ? usersResponse
        : (
          usersResponse?.content ||
          usersResponse?.items ||
          usersResponse?.data ||
          usersResponse?.results ||
          usersResponse?.users ||
          []
        );

      // Filter users by tenant (only if tenant/company fields exist)
      let filteredUsers = usersData;
      if (currentUserResponse?.tenantId && Array.isArray(usersData) && usersData.length > 0) {
        const hasTenantField = usersData.some(u => u?.tenantId || u?.companyId || u?.tenant?.id || u?.company?.id);
        if (hasTenantField) {
          filteredUsers = usersData.filter(u => {
            const uid = u?.tenantId || u?.companyId || u?.tenant?.id || u?.company?.id;
            return String(uid) === String(currentUserResponse.tenantId);
          });
        }
      }
      setUsers(filteredUsers);

      // Fetch orders for current tenant
      try {
        const { ordersResponse, usedOrdersTenantFilter } = await (async () => {
          const tenantId = currentUserResponse?.tenantId || currentUserResponse?.tenant?.id || currentUserResponse?.companyId;
          if (tenantId) {
            try {
              const resp = await apiCall(`${API_ENDPOINTS.ORDERS}?tenantId=${encodeURIComponent(tenantId)}`);
              return { ordersResponse: resp, usedOrdersTenantFilter: true };
            } catch (e) {
              // fallback to unfiltered
            }
          }
          const resp = await apiCall(API_ENDPOINTS.ORDERS);
          return { ordersResponse: resp, usedOrdersTenantFilter: false };
        })();

        const ordersData = Array.isArray(ordersResponse)
          ? ordersResponse
          : (
            ordersResponse?.content ||
            ordersResponse?.items ||
            ordersResponse?.data ||
            ordersResponse?.results ||
            []
          );

        const tenantId = currentUserResponse?.tenantId || currentUserResponse?.tenant?.id || currentUserResponse?.companyId;
        let filteredOrders = Array.isArray(ordersData) ? ordersData : [];

        // Client-side filter only if server-side filter not used AND orders carry tenant/company identifiers
        if (!usedOrdersTenantFilter && tenantId) {
          const hasTenantField = filteredOrders.some(o => o?.tenantId || o?.companyId || o?.tenant?.id || o?.company?.id);
          if (hasTenantField) {
            filteredOrders = filteredOrders.filter(order => {
              const oid = order?.tenantId || order?.companyId || order?.tenant?.id || order?.company?.id;
              return String(oid) === String(tenantId);
            });
          }
        }

        setOrders(filteredOrders);
      } catch (ordersError) {
        console.warn("Could not fetch orders:", ordersError);
        setOrders([]);
      }

      // Fetch activity logs (if available)
      try {
        const activityResponse = await apiCall(API_ENDPOINTS.ACTIVITIES);
        const activityData = Array.isArray(activityResponse)
          ? activityResponse
          : (
            activityResponse?.content ||
            activityResponse?.items ||
            activityResponse?.data ||
            activityResponse?.results ||
            []
          );

        let filteredActivities = activityData;
        if (currentUserResponse?.tenantId) {
          filteredActivities = activityData.filter(activity =>
            activity.tenantId === currentUserResponse.tenantId ||
            activity.companyId === currentUserResponse.tenantId
          );
        }
        setActivityLogs(filteredActivities);

        // Transform activity logs to report format
        const transformedReports = filteredActivities.map((activity, index) => ({
          id: activity.id || index + 1,
          date: activity.createdAt ? new Date(activity.createdAt).toLocaleDateString() : 'N/A',
          user: activity.userName || activity.user?.firstName + ' ' + activity.user?.lastName || 'Unknown User',
          role: activity.userRole || activity.user?.role || 'Unknown Role',
          activity: activity.description || activity.activityName || activity.action || 'Unknown Activity',
          avatar: activity.userName ? activity.userName.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'
        }));
        setReportData(transformedReports);
      } catch (activityError) {
        console.warn("Could not fetch activity logs:", activityError);
        setActivityLogs([]);
        setReportData([]);
      }

    } catch (error) {
      console.error("Error fetching reports data:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Calculate dynamic stats
  const calculateStats = () => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    // Get today's distributors
    const todayDistributors = users.filter(user => {
      if (user.role !== 'DISTRIBUTOR') return false;
      if (!user.createdAt) return false;
      return user.createdAt.split('T')[0] === todayStr;
    }).length;

    // Get total users
    const totalUsers = users.length;

    // Get total orders
    const totalOrders = orders.length;

    // Calculate percentage changes (simplified)
    const calculateChange = (current) => {
      const previous = Math.max(1, current - Math.floor(Math.random() * 5));
      const change = Math.round(((current - previous) / previous) * 100);
      return {
        value: change,
        type: change >= 0 ? 'increase' : 'decrease'
      };
    };

    return [
      {
        title: 'Today Distributors',
        value: todayDistributors.toString(),
        change: `+${calculateChange(todayDistributors).value}%`,
        changeType: calculateChange(todayDistributors).type,
        period: `Today, ${today.toLocaleDateString()}`,
        icon: Users,
        iconBg: 'bg-[rgba(113,82,243,0.05)]',
        iconColor: 'text-purple-600'
      },
      {
        title: 'Total Users',
        value: totalUsers.toString(),
        change: `+${calculateChange(totalUsers).value}%`,
        changeType: calculateChange(totalUsers).type,
        period: `As of ${today.toLocaleDateString()}`,
        icon: Users,
        iconBg: 'bg-[rgba(113,82,243,0.05)]',
        iconColor: 'text-purple-600'
      },
      {
        title: 'Total Orders',
        value: totalOrders.toString(),
        change: `+${calculateChange(totalOrders).value}%`,
        changeType: calculateChange(totalOrders).type,
        period: `As of ${today.toLocaleDateString()}`,
        icon: SquareLibrary,
        iconBg: 'bg-[rgba(113,82,243,0.05)]',
        iconColor: 'text-purple-600'
      }
    ];
  };

  const statsCards = calculateStats();

  // Keep filteredData in sync with reportData
  useEffect(() => {
    setFilteredData(reportData)
  }, [reportData])

  // Filter data based on search term
  useEffect(() => {
    const filtered = reportData.filter(report =>
      report.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.activity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.date.includes(searchTerm)
    )
    setFilteredData(filtered)
    setCurrentPage(1) // Reset to first page when search changes
  }, [searchTerm])

  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  // Go to next page
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1)
    }
  }

  // Go to previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1)
    }
  }

  // Handle items per page change
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value))
    setCurrentPage(1) // Reset to first page when changing items per page
  }

  const handleRoleChange = (role) => {
    setSelectedRoles(prev => ({
      ...prev,
      [role]: !prev[role]
    }));
  };

  const handleClearFilters = () => {
    setSelectedRoles({
      Administrator: true,
      Accountant: false,
      'Sales Manager': false,
      'Sales Assistant': false,
      'Store Manager': false
    });
    setSelectedDate('all');
    // Apply the cleared filters immediately
    applyFilters({
      selectedRoles: {
        Administrator: true,
        Accountant: false,
        'Sales Manager': false,
        'Sales Assistant': false,
        'Store Manager': false
      },
      selectedDate: 'all'
    });
    setShowFilterDropdown(false);
  };

  const handleApplyFilters = () => {
    applyFilters({ selectedRoles, selectedDate });
    setShowFilterDropdown(false);
  };

  const applyFilters = (filters) => {
    const { selectedRoles, selectedDate } = filters;

    // Apply role filter
    let filtered = reportData.filter(report =>
      selectedRoles[report.role] === true
    );

    // Apply date filter
    const now = new Date();
    const today = new Date(now.setHours(0, 0, 0, 0));

    filtered = filtered.filter(report => {
      const reportDate = new Date(report.date);

      switch (selectedDate) {
        case 'today':
          return reportDate >= today;
        case 'yesterday':
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);
          return reportDate >= yesterday && reportDate < today;
        case 'week':
          const weekAgo = new Date(today);
          weekAgo.setDate(weekAgo.getDate() - 7);
          return reportDate >= weekAgo;
        case 'month':
          const monthAgo = new Date(today);
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          return reportDate >= monthAgo;
        default:
          return true; // 'all' or any other value
      }
    });

    setFilteredData(filtered);
    setCurrentPage(1);
  };

  // Generate page numbers
  const pageNumbers = []
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i)
  }

  // Only show a subset of page numbers if there are many pages
  const getPageNumbers = () => {
    const maxPageNumbers = 4 // Maximum number of page numbers to show
    const halfMax = Math.floor(maxPageNumbers / 2)

    if (totalPages <= maxPageNumbers) {
      return pageNumbers
    }

    if (currentPage <= halfMax) {
      return [...pageNumbers.slice(0, maxPageNumbers), '...', totalPages]
    }

    if (currentPage >= totalPages - halfMax) {
      return [1, '...', ...pageNumbers.slice(-maxPageNumbers)]
    }

    return [
      1,
      '...',
      ...pageNumbers.slice(currentPage - halfMax - 1, currentPage + halfMax - 1),
      '...',
      totalPages
    ]
  }

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          {loading ? (
            <div className="space-y-2">
              <div className="h-7 w-48 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-4 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          ) : (
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
              <p className="text-gray-600">
                {currentUser?.tenantId ? `Company: ${currentUser.tenantId}` : 'Activity Reports'}
              </p>
            </div>
          )}
          <button
            onClick={fetchData}
            disabled={loading}
            className="px-4 py-2 bg-[#7152F3] text-white rounded-lg hover:bg-[#5a3fd8] transition-colors disabled:opacity-50"
          >
            {loading ? 'Refreshing...' : 'Refresh Data'}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            Error: {error}
            <button onClick={fetchData} className="ml-2 underline">Retry</button>
          </div>
        )}

        {/* Search and Filter Bar */}
        <div className="flex items-center justify-between mb-6">
          {loading ? (
            <div className="flex-1 max-w-md">
              <div className="h-[50px] bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          ) : (
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search reports"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 h-[50px] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7152F3] focus:border-[#7152F3]"
              />
            </div>
          )}

          <div className="flex items-center space-x-4">
            {loading ? (
              <div className="h-[40px] w-[120px] bg-gray-200 rounded-lg animate-pulse"></div>
            ) : (
              <div className="relative">
                <Listbox value={selectedDate} onChange={setSelectedDate}>
                  {({ open }) => (
                    <div className="relative">
                      <Listbox.Button className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                        <Filter className="h-4 w-4 text-gray-500" />
                        <span>Filter</span>
                        <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'transform rotate-180' : ''}`} />
                      </Listbox.Button>
                      <Listbox.Options className="absolute right-0 z-10 mt-1 w-64 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="p-4">
                          <h3 className="text-sm font-medium text-gray-900 mb-3">Filter by Role</h3>
                          <div className="space-y-2">
                            {Object.keys(selectedRoles).map((role) => (
                              <div key={role} className="flex items-center">
                                <input
                                  id={`role-${role}`}
                                  type="checkbox"
                                  checked={selectedRoles[role]}
                                  onChange={() => handleRoleChange(role)}
                                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                                />
                                <label htmlFor={`role-${role}`} className="ml-2 text-sm text-gray-700">
                                  {role}
                                </label>
                              </div>
                            ))}
                          </div>

                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <h3 className="text-sm font-medium text-gray-900 mb-2">Date Range</h3>
                            <select
                              value={selectedDate}
                              onChange={(e) => setSelectedDate(e.target.value)}
                              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
                            >
                              <option value="today">Today</option>
                              <option value="yesterday">Yesterday</option>
                              <option value="week">This Week</option>
                              <option value="month">This Month</option>
                              <option value="all">All Time</option>
                            </select>
                          </div>

                          <div className="mt-4 flex justify-end space-x-2">
                            <button
                              type="button"
                              onClick={handleClearFilters}
                              className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900"
                            >
                              Clear
                            </button>
                            <button
                              type="button"
                              onClick={handleApplyFilters}
                              className="px-3 py-1.5 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                            >
                              Apply
                            </button>
                          </div>
                        </div>
                      </Listbox.Options>
                    </div>
                  )}
                </Listbox>
              </div>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {loading ? (
            // Loading state for stats cards
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-[10px]">
                    <div className="bg-gray-200 rounded-[8px] h-[40px] w-[40px] animate-pulse"></div>
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="flex w-full justify-between items-baseline space-x-2">
                  <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-6 w-12 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="h-3 w-32 bg-gray-200 rounded animate-pulse mt-2"></div>
              </div>
            ))
          ) : (
            statsCards.map((stat, index) => (
              <div key={index} className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-[10px]">
                    <div className="bg-[rgba(113,82,243,0.05)] rounded-[8px] h-[40px] w-[40px] flex items-center justify-center">
                      <stat.icon className="h-5 w-5 text-[#7152F3]" />
                    </div>
                    <span className="text-[16px] font-medium text-[#16151C]">
                      {stat.title}
                    </span>
                  </div>
                  <Listbox value={selectedTimeRange} onChange={setSelectedTimeRange}>
                    {({ open }) => (
                      <div className="relative">
                        <Listbox.Button className="flex items-center space-x-[10px] border border-[rgba(162,161,168,0.2)] h-[40px] px-3 rounded-[10px] transition-colors hover:border-[#7152F3] focus:outline-none focus:ring-2 focus:ring-[#7152F3] focus:border-transparent">
                          <span className="text-[16px] text-[#16151C]">{selectedTimeRange.name}</span>
                          <ChevronDown
                            className={`h-[15px] w-[15px] text-[#16151C] transition-transform ${open ? 'transform rotate-180' : ''}`}
                            aria-hidden="true"
                          />
                        </Listbox.Button>
                        <Listbox.Options className="absolute z-10 w-[170px] mt-1 bg-white shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none">
                          {timeRanges.map((range) => (
                            <Listbox.Option
                              key={range.id}
                              value={range}
                              className={({ active }) =>
                                `${active ? 'bg-purple-100 text-[#7152F3]' : 'text-gray-900'}
                                 cursor-pointer select-none relative py-2 pl-3 pr-9`
                              }
                            >
                              {({ selected }) => (
                                <span className={`${selected ? 'font-medium' : 'font-normal'} block truncate`}>
                                  {range.name}
                                </span>
                              )}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </div>
                    )}
                  </Listbox>
                </div>
                <div className="flex w-full justify-between items-baseline space-x-2">
                  <span className="text-[30px] font-bold text-gray-900">
                    {stat.value}
                  </span>
                  {/* <div
                    className={`flex items-center text-[11px] p-[5px] ${stat.changeType === "increase"
                      ? "text-green-600 bg-green-100 rounded-[8px]"
                      : "text-red-600 bg-red-100 rounded-[8px]"
                      }`}
                  >
                    {stat.changeType === "increase" ? (
                      <TrendingUp className="h-[17px] w-[17px] mr-1" />
                    ) : (
                      <TrendingDown className="h-[17px] w-[17px] mr-1" />
                    )}
                    {stat.change}
                  </div> */}
                </div>
                <p className="text-xs text-gray-500 border-t-[1px] border-gray-200 pt-[10px] mt-2">{stat.period}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-lg w-full border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white border-b border-gray-200">
              <tr>
                {loading ? (
                  <th colSpan="4" className="px-6 py-3">
                    <div className="flex space-x-6">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-6 bg-gray-200 rounded-lg animate-pulse w-1/4"></div>
                      ))}
                    </div>
                  </th>
                ) : (
                  <>
                    <th className="px-6 py-3 text-left text-[16px] font-medium text-[#A2A1A8] tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-[16px] font-medium text-[#A2A1A8] tracking-wider">
                      User Name
                    </th>
                    <th className="px-6 py-3 text-left text-[16px] font-medium text-[#A2A1A8] tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-[16px] font-medium text-[#A2A1A8] tracking-wider">
                      Activity
                    </th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                // Loading state for table rows
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 w-40 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                  </tr>
                ))
              ) : currentItems.length > 0 ? (
                currentItems.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-[16px] text-[#16151C]">
                      {report.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-[#7152F3] rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">{report.avatar}</span>
                        </div>
                        <span className="text-[16px] font-medium text-[#16151C]">{report.user}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-[16px] text-[#16151C]">
                      {report.role}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-[16px] text-[#16151C]">
                      {report.activity}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-[#A2A1A8]">
                    <div className="flex flex-col items-center">
                      {/* <div className="text-lg mb-2"></div> */}
                      <div>No activity reports found</div>
                      <div className="text-sm text-gray-400 mt-1">
                        {reportData.length === 0 ? 'No data available .' : 'Try adjusting your search or filters'}
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white px-6 py-3 border-t border-gray-200">
          {loading ? (
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
              <div className="flex items-center space-x-2">
                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="flex items-center space-x-1">
                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                {[1, 2, 3, 4].map((_, index) => (
                  <div key={index} className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
                ))}
                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-[#A2A1A8]">Show</span>
                <select
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  className="border border-gray-300 rounded px-2 py-1 text-sm text-[#16151C]"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                <span className="text-sm text-[#A2A1A8]">
                  Showing {filteredData.length > 0 ? indexOfFirstItem + 1 : 0} to{' '}
                  {Math.min(indexOfLastItem, filteredData.length)} of {filteredData.length} records
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <button
                  className={`px-3 py-1 text-sm text-[#A2A1A8] hover:text-[#7152F3] ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={prevPage}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>

                {getPageNumbers().map((number, index) => (
                  <button
                    key={index}
                    className={`px-3 py-1 text-sm rounded ${number === currentPage
                      ? 'border-[#7152F3] border-[2px] text-[#7152F3]'
                      : 'text-[#A2A1A8] hover:text-[#7152F3]'
                      }`}
                    onClick={() => typeof number === 'number' && paginate(number)}
                    disabled={number === '...'}
                  >
                    {number}
                  </button>
                ))}

                <button
                  className={`px-3 py-1 text-sm text-[#A2A1A8] hover:text-[#7152F3] ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Reports
