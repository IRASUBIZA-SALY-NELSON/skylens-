import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Users,
  TrendingUp,
  TrendingDown,
  ChevronDown,
  Search,
  Bell,
  Plus,
  Settings,
  MoreHorizontal,
  BriefcaseBusiness,
  icons,
  ScrollText,
  User,
  File,
} from "lucide-react";
import { Listbox } from '@headlessui/react';
import { Menu } from '@headlessui/react';

import { Card, CardContent } from "../../components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import Skeleton from "../../components/ui/skeleton"
import { API_ENDPOINTS, apiCall } from "../../config/api"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

const Dashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [orders, setOrders] = useState([]);

  // Get current month dynamically
  const getCurrentMonth = () => {
    const months = ['january', 'february', 'march', 'april', 'may', 'june',
      'july', 'august', 'september', 'october', 'november', 'december'];
    return months[new Date().getMonth()];
  };

  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());

  useEffect(() => {
    fetchData();
  }, []);

  // Recalculate chart data when selected month changes
  useEffect(() => {
    // This will trigger a re-render with updated chart data
  }, [selectedMonth, users]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch current user to get tenant context
      const currentUserResponse = await apiCall(API_ENDPOINTS.USER_ME);
      setCurrentUser(currentUserResponse);

      // Fetch users for current tenant only
      const { usersResponse, usedTenantFilter } = await (async () => {
        // Try to use server-side filtering when tenantId is known
        const tenantId = currentUserResponse?.tenantId || currentUserResponse?.tenant?.id || currentUserResponse?.companyId;
        if (tenantId) {
          try {
            console.log('🔎 Fetching users with tenant filter param:', tenantId);
            const resp = await apiCall(`${API_ENDPOINTS.USERS}?tenantId=${encodeURIComponent(tenantId)}`);
            return { usersResponse: resp, usedTenantFilter: true };
          } catch (e) {
            console.warn('Users API with tenantId param failed, falling back to unfiltered users fetch:', e?.message || e);
            // Fall through to fetch all users
          }
        }
        // Fallback: fetch all users
        const resp = await apiCall(API_ENDPOINTS.USERS);
        return { usersResponse: resp, usedTenantFilter: false };
      })();

      // Normalize users array from various API shapes
      const usersDataRaw = Array.isArray(usersResponse)
        ? usersResponse
        : (
          usersResponse?.content ||
          usersResponse?.items ||
          usersResponse?.data ||
          usersResponse?.results ||
          usersResponse?.users ||
          []
        );

      // Filter users by tenant only if we did NOT already apply server-side filter
      const tenantId = currentUserResponse?.tenantId || currentUserResponse?.tenant?.id || currentUserResponse?.companyId;
      let filteredUsers = Array.isArray(usersDataRaw) ? usersDataRaw : [];
      if (!usedTenantFilter && tenantId) {
        filteredUsers = filteredUsers.filter((user) => {
          const userTenantId = user?.tenantId || user?.companyId || user?.tenant?.id || user?.company?.id;
          return String(userTenantId) === String(tenantId);
        });
      }

      setUsers(filteredUsers);
      console.log("👥 Users API raw:", usersResponse);
      console.log("📊 Users parsed count (post-filter):", filteredUsers.length, { usedTenantFilter });

      // Fetch orders for current tenant
      try {
        const { ordersResponse, usedOrdersTenantFilter } = await (async () => {
          const tenantId = currentUserResponse?.tenantId || currentUserResponse?.tenant?.id || currentUserResponse?.companyId;
          if (tenantId) {
            try {
              console.log('🔎 Fetching orders with tenant filter param:', tenantId);
              const resp = await apiCall(`${API_ENDPOINTS.ORDERS}?tenantId=${encodeURIComponent(tenantId)}`);
              return { ordersResponse: resp, usedOrdersTenantFilter: true };
            } catch (e) {
              console.warn('Orders API with tenantId param failed, falling back to unfiltered orders fetch:', e?.message || e);
            }
          }
          const resp = await apiCall(API_ENDPOINTS.ORDERS);
          return { ordersResponse: resp, usedOrdersTenantFilter: false };
        })();

        // Normalize orders array from various API shapes (supports pagination "content")
        const ordersDataRaw = Array.isArray(ordersResponse)
          ? ordersResponse
          : (
            ordersResponse?.content ||
            ordersResponse?.items ||
            ordersResponse?.data ||
            ordersResponse?.results ||
            []
          );

        const tenantId = currentUserResponse?.tenantId || currentUserResponse?.tenant?.id || currentUserResponse?.companyId;
        let filteredOrders = Array.isArray(ordersDataRaw) ? ordersDataRaw : [];

        // Only client-filter when we didn't use server-side filter AND orders carry tenant/company identifiers
        if (!usedOrdersTenantFilter && tenantId) {
          const hasTenantField = filteredOrders.some(o => o?.tenantId || o?.companyId || o?.tenant?.id || o?.company?.id);
          if (hasTenantField) {
            filteredOrders = filteredOrders.filter((order) => {
              const orderTenantId = order?.tenantId || order?.companyId || order?.tenant?.id || order?.company?.id;
              return String(orderTenantId) === String(tenantId);
            });
          }
        }

        setOrders(filteredOrders);
        console.log("📦 Orders API raw:", ordersResponse);
        console.log("📦 Orders parsed count (post-filter):", filteredOrders.length, { usedOrdersTenantFilter });
      } catch (ordersError) {
        console.warn("Could not fetch orders:", ordersError);
        setOrders([]);
      }

    } catch (error) {
      console.error("❌ Error fetching data:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getRoleDisplayName = (role) => {
    const roleMap = {
      ADMIN: "Administrator",
      MANAGER: "Manager",
      SALES_MANAGER: "Sales Manager",
      STORE_MANAGER: "Store Manager",
      WAREHOUSE_MANAGER: "Warehouse Manager",
      ACCOUNTANT: "Accountant",
      USER: "User",
      TENANT: 'Tenant',
      DISTRIBUTOR: 'Distributor',
      MANAGING_DIRECTOR: "Managing Director",

      ACCOUNTANT_AT_STORE: "Distributor Accountant",
      RETAILER: 'Retailer',

      SUPER_ADMIN: "Super Administrator"

    };
    return roleMap[role] || role;
  };

  const getUserInitials = (firstName, lastName) => {
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }
    if (firstName) {
      return firstName.charAt(0).toUpperCase();
    }
    return "U";
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) return "N/A";
    const date = new Date(dateTime);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getLastActivity = (activities) => {
    if (!activities || activities.length === 0) return "No activity";
    const lastActivity = activities[activities.length - 1];
    return lastActivity.activityName || "Recent activity";
  };

  // Filter users by month
  const getUsersByMonth = (month) => {
    if (!users.length) return users;

    const monthMap = {
      'january': 0, 'february': 1, 'march': 2, 'april': 3,
      'may': 4, 'june': 5, 'july': 6, 'august': 7,
      'september': 8, 'october': 9, 'november': 10, 'december': 11
    };

    const targetMonth = monthMap[month];
    const currentYear = new Date().getFullYear();

    return users.filter(user => {
      if (!user.createdAt) return false;
      const userDate = new Date(user.createdAt);
      return userDate.getMonth() === targetMonth && userDate.getFullYear() === currentYear;
    });
  };

  // Calculate user role statistics
  const calculateRoleStats = (month = selectedMonth) => {
    const filteredUsers = getUsersByMonth(month);
    const roleCount = {};
    const totalUsers = filteredUsers.length;

    filteredUsers.forEach((user) => {
      const role = getRoleDisplayName(user.role);
      roleCount[role] = (roleCount[role] || 0) + 1;
    });

    return Object.entries(roleCount).map(([role, count], index) => ({
      name: role,
      count: `${count} people`,
      percentage: totalUsers > 0 ? Math.round((count / totalUsers) * 100) : 0,
      color: [
        "bg-purple-600",
        "bg-purple-500",
        "bg-purple-400",
        "bg-purple-300",
        "bg-purple-200",
        "bg-purple-100",
      ][index % 6],
    }));
  };

  // Calculate percentage change (simplified - you can enhance this with historical data)
  const calculatePercentageChange = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  // Dynamic stats based on selected month
  const getStatsForMonth = (month = selectedMonth) => {
    const filteredUsers = getUsersByMonth(month);
    const distributors = filteredUsers.filter(user => user.role === 'DISTRIBUTOR').length;
    const totalDistributors = users.filter(user => user.role === 'DISTRIBUTOR').length;

    // Calculate changes (simplified - in real app, you'd compare with previous period)
    const monthlyUsersChange = calculatePercentageChange(filteredUsers.length, Math.max(1, filteredUsers.length - 2));
    const distributorsChange = calculatePercentageChange(distributors, Math.max(1, distributors - 1));
    const totalOrdersChange = calculatePercentageChange(orders.length, Math.max(1, orders.length - 1));

    return [
      {
        title: "Total Users",
        value: users.length.toString(),
        change: `${users.length > 0 ? '+' : ''}${calculatePercentageChange(users.length, Math.max(1, users.length - 1))}%`,
        changeType: users.length > 0 ? "increase" : "decrease",
        period: `All time`,
        icon: Users,
      },
      {
        title: "Products",
        value: filteredUsers.length.toString(),
        change: `${monthlyUsersChange > 0 ? '+' : ''}${monthlyUsersChange}%`,
        changeType: monthlyUsersChange >= 0 ? "increase" : "decrease",
        period: `${month.charAt(0).toUpperCase() + month.slice(1)} ${new Date().getFullYear()}`,
        icon: BriefcaseBusiness
      },
      {
        title: "Total Distributors",
        value: distributors.toString(),
        change: `${distributorsChange > 0 ? '+' : ''}${distributorsChange}%`,
        changeType: distributorsChange >= 0 ? "increase" : "decrease",
        period: `${month.charAt(0).toUpperCase() + month.slice(1)} ${new Date().getFullYear()}`,
        icon: Users
      },
      {
        title: "Total Orders",
        value: orders.length.toString(),
        change: `${totalOrdersChange > 0 ? '+' : ''}${totalOrdersChange}%`,
        changeType: totalOrdersChange >= 0 ? "increase" : "decrease",
        period: "All time",
        icon: ScrollText
      },
    ];
  };

  const stats = getStatsForMonth();
  // Dynamic chart data based on actual user roles and selected month
  const getChartData = (month = selectedMonth) => {
    const roleStats = calculateRoleStats(month);
    const colors = [
      "rgba(113, 82, 243, 1)",
      "rgba(113, 82, 243, 0.8)",
      "rgba(113, 82, 243, 0.6)",
      "rgba(113, 82, 243, 0.4)",
      "rgba(113, 82, 243, 0.2)",
      "rgba(113, 82, 243, 0.1)",
      "rgba(113, 82, 243, 0.9)",
      "rgba(113, 82, 243, 0.7)",
      "rgba(113, 82, 243, 0.5)",
      "rgba(113, 82, 243, 0.3)",
    ];

    return roleStats.map((role, index) => ({
      name: role.name,
      value: role.percentage,
      count: parseInt(role.count),
      color: colors[index % colors.length]
    }));
  };

  const data = getChartData();

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="rounded-lg border bg-white p-3 shadow-md">
          <p className=" text-card-foreground">{data.name}</p>
          <p className="text-sm text-gray-600">
            {data.value}%
          </p>
          <p className="text-sm text-gray-600">
            {data.count} people
          </p>
        </div>
      )
    }
    return null
  }

  const LegendItem = ({ name, value, count, color }) => (
    <div className="flex items-center justify-between py-2 bg-white">
      <div className="flex items-center gap-3">
        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
        <span className="text-[16px]  text-[#16151C]">{name}</span>
      </div>
      <div className="flex items-center gap-4 text-[16px] text-[#16151C]">
        <span>{value}%</span>
        <span>{count} people</span>
      </div>
    </div>
  )
  const userRoles = calculateRoleStats();

  const timeRanges = [
    { id: 1, name: 'Today' },
    { id: 2, name: 'Yesterday' },
    { id: 3, name: 'This Week' },
    { id: 4, name: 'This Month' },
  ];

  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRanges[0]);

  // Navigation handlers for Quick Links
  const handleUserManagement = () => {
    navigate("/admin/user-management");
  };

  const handleAddNewUser = () => {
    navigate("/admin/user-management", { state: { openAddModal: true } });
  };

  const handleSettings = () => {
    navigate("/admin/settings");
  };
  const handleReports = () => {
    navigate("/admin/reports");
  };

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5; // Number of users to show per page

  // Calculate pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Go to next page
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Go to previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="flex-1 p-6 bg-white min-h-screen">
      {/* Header with tenant info and refresh */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          {loading ? (
            <>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-36" />
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">
                {currentUser?.tenantId ? `Company: ${currentUser.tenantId}` : 'Admin Dashboard'}
              </p>
            </>
          )}
        </div>
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

      <div className="grid grid-cols-1 gap-6">
        {/* Left Column - Stats */}
        <div className="col-span-full flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 flex-1 gap-6">
            {loading ? (
              // Skeleton for stats cards
              Array(4).fill(0).map((_, index) => (
                <div key={index} className="bg-white rounded-lg p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Skeleton className="h-10 w-10 rounded-lg" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-8 w-32 rounded-md" />
                  </div>
                  <div className="flex items-end justify-between">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                  <Skeleton className="h-4 w-32 mt-2" />
                </div>
              ))
            ) : (
              stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg p-6 border border-gray-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-[10px]">
                      {stat.icon && (
                        <div className="bg-[rgba(113,82,243,0.05)] rounded-[8px] h-[40px] w-[40px] flex items-center justify-center">
                          <stat.icon className="h-5 w-5 text-purple-600" />
                        </div>
                      )}
                      <span className="text-[16px] font-medium text-[#16151C]">
                        {stat.title}
                      </span>
                    </div>
                    {(stat.title != 'Total Users') && (
                      <Listbox value={selectedTimeRange} onChange={setSelectedTimeRange}>
                        {({ open }) => (
                          <div className="relative">
                            <Listbox.Button className="flex items-center space-x-[10px] border border-[rgba(162, 161, 168, 0.2)] h-[40px] px-3 rounded-[10px] transition-colors hover:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                              <span className="text-[16px] text-[#16151C]">{selectedTimeRange.name}</span>
                              <ChevronDown
                                className={`h-[15px] w-[15px] text-[#16151C] transition-transform ${open ? 'transform rotate-180' : ''}`}
                                aria-hidden="true"
                              />
                            </Listbox.Button>
                            <Listbox.Options className="absolute z-10 w-[200px] mt-1 bg-white shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none">
                              {timeRanges.map((range) => (
                                <Listbox.Option
                                  key={range.id}
                                  value={range}
                                  className={({ active }) =>
                                    `${active ? 'bg-purple-100 text-purple-900' : 'text-gray-900'}
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
                      </Listbox>)}
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
                  <p className="text-xs border-t-[1px] border-[rgba(162,161,168,0.2)] pt-[10px] text-gray-500 mt-1">{stat.period}</p>
                </div>
              ))
            )}
          </div>

          {/* Quick Links */}
          <div className="w-full md:w-1/3 space-y-6">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              {loading ? (
                <Skeleton className="h-6 w-32 mb-4" />
              ) : (
                <h3 className="text-[20px] font-semibold text-[#16151C] mb-4">
                  Quick Links
                </h3>
              )}
              <div className="space-y-3">
                {loading ? (
                  // Skeleton for quick links
                  Array(4).fill(0).map((_, index) => (
                    <Skeleton key={index} className="h-14 w-full rounded-lg" />
                  ))
                ) : (
                  <>
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center space-x-2 h-[56px] bg-[#7152F3] hover:bg-purple-700 text-white rounded-[10px] text-[16px]"
                      onClick={handleUserManagement}
                    >
                      <Users className="h-4 w-4" />
                      <span>User Management</span>
                    </button>
                    <button
                      onClick={handleAddNewUser}
                      className="w-full flex items-center justify-center space-x-2 h-[56px] bg-[#7152F3] hover:bg-purple-700 text-white rounded-[10px] text-[16px]"
                    >
                      <User className="h-4 w-4" />
                      <span>Add New User</span>
                    </button>
                    <button
                      onClick={handleSettings}
                      className="w-full flex items-center justify-center space-x-2 h-[56px] bg-[#7152F3] hover:bg-purple-700 text-white rounded-[10px] text-[16px]"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </button>
                    <button
                      onClick={handleReports}
                      className="w-full flex items-center justify-center space-x-2 h-[56px] bg-[#7152F3] hover:bg-purple-700 text-white rounded-[10px] text-[16px]"
                    >
                      <File className="h-4 w-4" />
                      <span>Reports</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col space-y-6">
          <div className="bg-white rounded-lg p-[20px] border border-gray-200">


            <div className="space-y-6">
              <div className="flex items-center justify-between">
                {loading ? (
                  <Skeleton className="h-6 w-48" />
                ) : (
                  <h1 className="text-[20px] font-semibold text-[#16151C]">Users Roles Analytics Overview</h1>
                )}
                {loading ? (
                  <div className="relative w-32">
                    <Skeleton className="h-10 w-full rounded-md border border-gray-200" />
                  </div>
                ) : (
                  <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="january">January</SelectItem>
                      <SelectItem value="february">February</SelectItem>
                      <SelectItem value="march">March</SelectItem>
                      <SelectItem value="april">April</SelectItem>
                      <SelectItem value="may">May</SelectItem>
                      <SelectItem value="june">June</SelectItem>
                      <SelectItem value="july">July</SelectItem>
                      <SelectItem value="august">August</SelectItem>
                      <SelectItem value="september">September</SelectItem>
                      <SelectItem value="october">October</SelectItem>
                      <SelectItem value="november">November</SelectItem>
                      <SelectItem value="december">December</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>

              <Card className="w-full">
                <CardContent className="pt-[20px]">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-[20px]">
                    {/* Chart Section */}
                    <div className="flex items-center justify-center">
                      <div className="relative h-80 w-80">
                        {loading ? (
                          <div className="space-y-4">
                            <Skeleton className="h-64 w-64 rounded-full" />
                          </div>
                        ) : data.length > 0 ? (
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={80}
                                outerRadius={140}
                                paddingAngle={0}
                                dataKey="value"
                              >
                                {data.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                          </ResponsiveContainer>
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                              <p className="text-gray-500 text-lg">No data available</p>
                              <p className="text-gray-400 text-sm">for {selectedMonth.charAt(0).toUpperCase() + selectedMonth.slice(1)}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Legend Section */}
                    <div className="space-y-1">
                      {loading ? (
                        <div className="space-y-4">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="grid grid-cols-4 gap-4 items-center">
                              <Skeleton className="h-4 w-3/4" />
                              <Skeleton className="h-4 w-1/2" />
                              <Skeleton className="h-4 w-1/3" />
                              <Skeleton className="h-4 w-1/4" />
                            </div>
                          ))}
                        </div>
                      ) : data.length > 0 ? (
                        data.map((item, index) => (
                          <LegendItem key={index} name={item.name} value={item.value} count={item.count} color={item.color} />
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-gray-500">No role data available</p>
                          <p className="text-gray-400 text-sm">for {selectedMonth.charAt(0).toUpperCase() + selectedMonth.slice(1)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Recently Created Users */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              {loading ? (
                <Skeleton className="h-6 w-48" />
              ) : (
                <h2 className="text-lg font-semibold text-gray-900">
                  Recently Created Users
                </h2>
              )}
              {!loading && (
                <Link
                  to="/admin/user-management"
                  className="text-[#16151C] hover:underline border border-[rgba(162, 161, 168, 0.2)] rounded-[10px] px-4 py-2 text-sm"
                >
                  View All
                </Link>
              )}
            </div>

            {loading ? (
              <div className="space-y-4 p-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="grid grid-cols-4 gap-4 items-center">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-600">Error loading users: {error}</p>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-4 text-[16px]  text-[#A2A1A8] pb-2 pt-[20px] border-b border-gray-100">
                    <span>User Name</span>
                    <span>Last Activity</span>
                    <span>User Role</span>
                    <span>Status</span>
                  </div>

                  {currentUsers.map((user, index) => (
                    <div
                      key={user.id || index}
                      className="grid grid-cols-4 gap-4 items-center py-2"
                    >
                      <div className="flex items-center space-x-2">
                        <div className="w-[36px] h-[36px] bg-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-medium">
                            {getUserInitials(user.firstName, user.lastName)}
                          </span>
                        </div>
                        <span className="text-[16px] text-[#16151C] truncate">
                          {user.firstName && user.lastName
                            ? `${user.firstName} ${user.lastName}`
                            : user.email || "Unknown User"}
                        </span>
                      </div>
                      <span className="text-[16px] text-[#16151C] truncate">
                        {getLastActivity(user.activities)}
                      </span>
                      <span className="text-[16px] text-[#16151C] truncate">
                        {getRoleDisplayName(user.role)}
                      </span>
                      <span
                        className={`text-sm px-2 py-1 rounded-full w-fit text-xs ${(((user?.userStatus || '').toUpperCase() === 'ACTIVE') || user?.enabled === true)
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                          }`}
                      >
                        {(((user?.userStatus || '').toUpperCase() === 'ACTIVE') || user?.enabled === true) ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  ))}

                  {users.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No users found</p>
                    </div>
                  )}
                </div>

                {/* Pagination Controls */}
                {users.length > usersPerPage && (
                  <div className="flex items-center justify-between mt-4 px-2">
                    <button
                      onClick={prevPage}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 border-[2px] rounded-md ${currentPage === 1 
                        ? 'text-gray-400 border-gray-200 cursor-not-allowed' 
                        : 'text-[#7152F3] border-[#7152F3] hover:bg-purple-50'}`}
                    >
                      Previous
                    </button>
                    <div className="flex space-x-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                        <button
                          key={number}
                          onClick={() => paginate(number)}
                          className={`w-10 h-10 flex items-center justify-center  rounded-md ${currentPage === number 
                            ? 'bg-white text-[#7152F3] border-[2px] border-[#7152F3]' 
                            : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                          {number}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={nextPage}
                      disabled={currentPage === totalPages}
                      className={`px-4 py-2 border-[2px] rounded-md ${currentPage === totalPages 
                        ? 'text-gray-400 border-gray-200 cursor-not-allowed' 
                        : 'text-[#7152F3] border-[#7152F3] hover:bg-purple-50'}`}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        {/* Right Column - Quick Links Only */}

      </div>
    </div>
  );
};

export default Dashboard;
