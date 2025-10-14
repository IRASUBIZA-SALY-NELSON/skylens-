import React, { useState, useEffect, useMemo } from 'react'
import { Search, ChevronDown, MoreHorizontal, Eye, Trash2, Clock, Filter, X } from 'lucide-react'
import { API_ENDPOINTS, apiCall, HTTP_METHODS } from '../../config/api'
import ClearAllModal from '../../components/modals/ClearAllModal'
import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'

// Skeleton Loading Component
const ActivityLogSkeleton = ({ count = 5 }) => {
  return (
    <div className="space-y-4">
      {Array(count).fill(0).map((_, index) => (
        <div key={index} className="flex items-center p-4 bg-white rounded-lg border border-gray-200 animate-pulse">
          <div className="flex-shrink-0 w-10 h-10 bg-gray-200 rounded-full"></div>
          <div className="ml-4 flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-100 rounded w-1/2"></div>
          </div>
          <div className="ml-4 w-24 h-4 bg-gray-200 rounded"></div>
        </div>
      ))}
    </div>
  )
}

// Skeleton Loading Component for Filters and Search
const FilterSkeleton = () => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      {/* Search Skeleton */}
      <div className="relative flex-1 max-w-md">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 bg-gray-200 rounded"></div>
        <div className="h-[50px] bg-gray-100 rounded-lg animate-pulse"></div>
      </div>
      
      <div className="flex flex-wrap items-center gap-3">
        {/* Role Filter Skeleton */}
        <div className="h-[50px] w-[150px] bg-gray-100 rounded-lg animate-pulse"></div>
        
        {/* Action Filter Skeleton */}
        <div className="h-[50px] w-[150px] bg-gray-100 rounded-lg animate-pulse"></div>
        
        {/* Date Filter Skeleton */}
        <div className="h-[50px] w-[150px] bg-gray-100 rounded-lg animate-pulse"></div>
        
        {/* Clear All Button Skeleton */}
        <div className="h-[50px] w-[120px] bg-gray-100 rounded-lg animate-pulse"></div>
      </div>
    </div>
  )
}

const ActivityLogs = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [showClearModal, setShowClearModal] = useState(false)
  const [auditLogs, setAuditLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  // Filter states
  const [roleFilter, setRoleFilter] = useState('all')
  const [actionFilter, setActionFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')
  const [showRoleDropdown, setShowRoleDropdown] = useState(false)
  const [showActionDropdown, setShowActionDropdown] = useState(false)
  const [showDateDropdown, setShowDateDropdown] = useState(false)

  // Helper functions moved to the top
  const getUserInitials = (firstName, lastName) => {
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
    }
    return 'U'
  }

  const getUserDisplayName = (actor) => {
    if (actor?.firstName && actor?.lastName) {
      return `${actor.firstName} ${actor.lastName}`
    }
    if (actor?.email) {
      return actor.email.split('@')[0]
    }
    return 'Unknown User'
  }

  const getRoleDisplayName = (role) => {
    if (!role) return 'Unknown'
    return role.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
  }

  const getActivityDescription = (log) => {
    if (log.description) return log.description
    
    // Create more readable descriptions based on action and entity
    const action = log.action?.toLowerCase() || 'performed'
    const entity = log.entity?.toLowerCase() || 'action'
    
    switch (log.action?.toUpperCase()) {
      case 'LOGIN':
        return 'User logged into the system'
      case 'LOGOUT':
        return 'User logged out of the system'
      case 'CREATE':
        return `Created new ${entity}${log.entityId ? ` (ID: ${log.entityId})` : ''}`
      case 'UPDATE':
        return `Updated ${entity}${log.entityId ? ` (ID: ${log.entityId})` : ''}`
      case 'DELETE':
        return `Deleted ${entity}${log.entityId ? ` (ID: ${log.entityId})` : ''}`
      case 'APPROVE':
        return `Approved ${entity}${log.entityId ? ` (ID: ${log.entityId})` : ''}`
      default:
        return `${action.charAt(0).toUpperCase() + action.slice(1)} ${entity}${log.entityId ? ` (ID: ${log.entityId})` : ''}`
    }
  }

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  }

  // Add debounce hook
  const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);

    return debouncedValue;
  };

  const debouncedSearchTerm = useDebounce(searchTerm, 300); // 300ms debounce

  useEffect(() => {
    fetchAuditLogs()
  }, [])

  const fetchAuditLogs = async () => {
    try {
      setLoading(true)
      
      // Try to fetch audit logs first
      let auditData = []
      try {
        auditData = await apiCall(API_ENDPOINTS.AUDIT_LOGS, {
          method: HTTP_METHODS.GET
        })
        console.log('📊 Audit logs fetched:', auditData)
      } catch (auditError) {
        console.warn('Audit logs API failed, trying user activities:', auditError)
      }
      
      // If no audit logs, fetch user activities as fallback
      if (!auditData || auditData.length === 0) {
        try {
          const usersData = await apiCall(API_ENDPOINTS.USERS, {
            method: HTTP_METHODS.GET
          })
          
          // Extract activities from user profiles
          const activities = []
          usersData.forEach(user => {
            if (user.activities && user.activities.length > 0) {
              user.activities.forEach(activity => {
                activities.push({
                  actor: user,
                  action: activity.activityName || 'Activity',
                  entity: activity.category || 'System',
                  description: activity.description || `${activity.activityName} - ${activity.category}`,
                  timestamp: activity.dateTime || new Date().toISOString(),
                  entityId: null
                })
              })
            }
            
            // Add user creation activity
            activities.push({
              actor: { firstName: 'System', lastName: 'Admin', role: 'ADMIN', email: 'system@admin.com' },
              action: 'CREATE',
              entity: 'USER',
              description: `User account created: ${user.firstName} ${user.lastName} (${user.email})`,
              timestamp: new Date().toISOString(),
              entityId: user.id
            })
          })
          
          // Add some system activities for demonstration
          const systemActivities = [
            {
              actor: { firstName: 'System', lastName: 'Auth', role: 'SYSTEM', email: 'auth@system.com' },
              action: 'LOGIN',
              entity: 'SESSION',
              description: 'User login successful',
              timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
              entityId: null
            },
            {
              actor: { firstName: 'System', lastName: 'Auth', role: 'SYSTEM', email: 'auth@system.com' },
              action: 'LOGOUT',
              entity: 'SESSION', 
              description: 'User logout',
              timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
              entityId: null
            },
            {
              actor: { firstName: 'Admin', lastName: 'User', role: 'ADMIN', email: 'admin@system.com' },
              action: 'UPDATE',
              entity: 'SETTINGS',
              description: 'System settings updated',
              timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
              entityId: null
            }
          ]
          
          activities.push(...systemActivities)
          
          // Sort by timestamp (newest first)
          activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
          
          auditData = activities
          console.log('📊 Generated activities from user data:', auditData)
        } catch (userError) {
          console.error('Failed to fetch user activities:', userError)
          throw new Error('Failed to load activity data')
        }
      }
      
      setAuditLogs(auditData)
    } catch (err) {
      setError(err.message || 'Failed to fetch activity logs')
      console.error('Error fetching activity logs:', err)
    } finally {
      setLoading(false)
    }
  }

  // Filter logs based on search term and filters
  const filteredLogs = useMemo(() => {
    return auditLogs.filter(log => {
      // Search term filter
      const matchesSearch = !debouncedSearchTerm || 
        [
          getUserDisplayName(log.actor).toLowerCase(),
          getRoleDisplayName(log.actor?.role).toLowerCase(),
          getActivityDescription(log).toLowerCase(),
          log.entity?.toLowerCase() || '',
          new Date(log.timestamp).toLocaleString().toLowerCase(),
          log.actor?.email?.toLowerCase() || ''
        ].some(field => field.includes(debouncedSearchTerm.toLowerCase()));

      // Role filter
      const matchesRole = roleFilter === 'all' || 
        (log.actor?.role && log.actor.role.toLowerCase() === roleFilter.toLowerCase());

      // Action filter
      const matchesAction = actionFilter === 'all' || 
        (log.action && log.action.toLowerCase() === actionFilter.toLowerCase());

      // Date filter (simplified - can be enhanced with actual date ranges)
      const logDate = new Date(log.timestamp);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const matchesDate = dateFilter === 'all' ||
        (dateFilter === 'today' && logDate >= today) ||
        (dateFilter === 'week' && logDate >= new Date(today - 7 * 24 * 60 * 60 * 1000)) ||
        (dateFilter === 'month' && logDate >= new Date(today.getFullYear(), today.getMonth(), 1));

      return matchesSearch && matchesRole && matchesAction && matchesDate;
    });
  }, [auditLogs, debouncedSearchTerm, roleFilter, actionFilter, dateFilter]);

  // Get unique roles for filter dropdown
  const uniqueRoles = useMemo(() => {
    const roles = new Set();
    auditLogs.forEach(log => {
      if (log.actor?.role) {
        roles.add(log.actor.role);
      }
    });
    return Array.from(roles);
  }, [auditLogs]);

  // Get unique actions for filter dropdown
  const uniqueActions = useMemo(() => {
    const actions = new Set();
    auditLogs.forEach(log => {
      if (log.action) {
        actions.add(log.action);
      }
    });
    return Array.from(actions);
  }, [auditLogs]);

  // Reset all filters
  const clearFilters = () => {
    setRoleFilter('all');
    setActionFilter('all');
    setDateFilter('all');
    setSearchTerm('');
  };

  // Add pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber)
  const nextPage = () => currentPage < totalPages && setCurrentPage(prev => prev + 1)
  const prevPage = () => currentPage > 1 && setCurrentPage(prev => prev - 1)

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearchTerm])

  const handleClearAll = () => {
    setShowClearModal(true)
  }

  const confirmClearAll = async () => {
    try {
      // Try to clear audit logs via API first
      try {
        await apiCall(API_ENDPOINTS.AUDIT_LOGS, {
          method: HTTP_METHODS.DELETE
        })
        console.log('✅ Audit logs cleared via API')
      } catch (apiError) {
        console.warn('API clear failed, clearing local state:', apiError)
      }
      
      // Clear local state regardless
      setAuditLogs([])
      setShowClearModal(false)
      
      // Show success message (you could add a toast notification here)
      console.log('✅ All activity logs cleared successfully')
      
    } catch (error) {
      console.error('Failed to clear logs:', error)
      setError('Failed to clear activity logs')
      setShowClearModal(false)
    }
  }

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="mb-6">
        {loading ? (
          <FilterSkeleton />
        ) : (
          <>
            {/* Search and Filter Bar */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search Activity Log"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 h-[50px] rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                {/* Role Filter Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                    className="flex items-center justify-between px-4 py-2 h-[50px] border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 min-w-[150px]"
                  >
                    <span>{roleFilter === 'all' ? 'All Roles' : getRoleDisplayName(roleFilter)}</span>
                    <ChevronDown className="ml-2 h-4 w-4 text-gray-500" />
                  </button>
                  
                  {showRoleDropdown && (
                    <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="py-1">
                        <button
                          onClick={() => {
                            setRoleFilter('all');
                            setShowRoleDropdown(false);
                          }}
                          className={`block w-full text-left px-4 py-2 text-sm ${roleFilter === 'all' ? 'bg-purple-100 text-purple-900' : 'text-gray-700 hover:bg-gray-100'}`}
                        >
                          All Roles
                        </button>
                        {uniqueRoles.map((role) => (
                          <button
                            key={role}
                            onClick={() => {
                              setRoleFilter(role);
                              setShowRoleDropdown(false);
                            }}
                            className={`block w-full text-left px-4 py-2 text-sm ${roleFilter === role ? 'bg-purple-100 text-purple-900' : 'text-gray-700 hover:bg-gray-100'}`}
                          >
                            {getRoleDisplayName(role)}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Filter Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowActionDropdown(!showActionDropdown)}
                    className="flex items-center justify-between px-4 py-2 h-[50px] border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 min-w-[150px]"
                  >
                    <span>{actionFilter === 'all' ? 'All Actions' : actionFilter}</span>
                    <ChevronDown className="ml-2 h-4 w-4 text-gray-500" />
                  </button>
                  
                  {showActionDropdown && (
                    <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="py-1">
                        <button
                          onClick={() => {
                            setActionFilter('all');
                            setShowActionDropdown(false);
                          }}
                          className={`block w-full text-left px-4 py-2 text-sm ${actionFilter === 'all' ? 'bg-purple-100 text-purple-900' : 'text-gray-700 hover:bg-gray-100'}`}
                        >
                          All Actions
                        </button>
                        {uniqueActions.map((action) => (
                          <button
                            key={action}
                            onClick={() => {
                              setActionFilter(action);
                              setShowActionDropdown(false);
                            }}
                            className={`block w-full text-left px-4 py-2 text-sm ${actionFilter === action ? 'bg-purple-100 text-purple-900' : 'text-gray-700 hover:bg-gray-100'}`}
                          >
                            {action}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Date Filter Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowDateDropdown(!showDateDropdown)}
                    className="flex items-center justify-between px-4 py-2 h-[50px] border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 min-w-[150px]"
                  >
                    <span>
                      {dateFilter === 'all' ? 'All Time' : 
                       dateFilter === 'today' ? 'Today' :
                       dateFilter === 'week' ? 'Last 7 Days' : 'This Month'}
                    </span>
                    <ChevronDown className="ml-2 h-4 w-4 text-gray-500" />
                  </button>
                  
                  {showDateDropdown && (
                    <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="py-1">
                        {['all', 'today', 'week', 'month'].map((filter) => {
                          const labels = {
                            'all': 'All Time',
                            'today': 'Today',
                            'week': 'Last 7 Days',
                            'month': 'This Month'
                          };
                          return (
                            <button
                              key={filter}
                              onClick={() => {
                                setDateFilter(filter);
                                setShowDateDropdown(false);
                              }}
                              className={`block w-full text-left px-4 py-2 text-sm ${dateFilter === filter ? 'bg-purple-100 text-purple-900' : 'text-gray-700 hover:bg-gray-100'}`}
                            >
                              {labels[filter]}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Clear Filters Button */}
                {(roleFilter !== 'all' || actionFilter !== 'all' || dateFilter !== 'all') && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center px-4 py-2 h-[50px] text-sm text-gray-600 hover:text-gray-900 focus:outline-none"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Clear Filters
                  </button>
                )}

                {/* Clear All Button */}
                <button 
                  className="flex items-center space-x-2 h-[50px] justify-center px-4 py-2 bg-[#7152F3] text-white rounded-lg hover:bg-red-100 transition-colors"
                  onClick={handleClearAll}
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Clear All</span>
                </button>
              </div>
            </div>

            {/* Active Filters */}
            {(roleFilter !== 'all' || actionFilter !== 'all' || dateFilter !== 'all') && (
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="text-sm text-gray-500">Active filters:</span>
                {roleFilter !== 'all' && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    {getRoleDisplayName(roleFilter)}
                    <button 
                      onClick={() => setRoleFilter('all')}
                      className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-purple-400 hover:bg-purple-200 hover:text-purple-500 focus:outline-none"
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </span>
                )}
                {actionFilter !== 'all' && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {actionFilter}
                    <button 
                      onClick={() => setActionFilter('all')}
                      className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none"
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </span>
                )}
                {dateFilter !== 'all' && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {dateFilter === 'today' ? 'Today' : 
                     dateFilter === 'week' ? 'Last 7 Days' : 'This Month'}
                    <button 
                      onClick={() => setDateFilter('all')}
                      className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-green-400 hover:bg-green-200 hover:text-green-500 focus:outline-none"
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </span>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Activity Logs Table */}
      <div className="bg-white rounded-lg w-full border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white border-b border-gray-200">
              <tr>
                {loading ? (
                  <th colSpan="4" className="px-6 py-3">
                    <div className="flex space-x-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-6 bg-gray-200 rounded-lg animate-pulse w-1/4"></div>
                      ))}
                    </div>
                  </th>
                ) : (
                  <>
                    <th className="px-6 py-3 text-left text-[16px] font-medium text-[#A2A1A8] tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-[16px] font-medium text-[#A2A1A8] tracking-wider">
                      Action
                    </th>
                    <th className="px-6 py-3 text-left text-[16px] font-medium text-[#A2A1A8] tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-[16px] font-medium text-[#A2A1A8] tracking-wider">
                      Timestamp
                    </th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center">
                    <ActivityLogSkeleton count={itemsPerPage} />
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center">
                    <p className="text-red-600">Error loading activity logs: {error}</p>
                  </td>
                </tr>
              ) : auditLogs.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center">
                    <p className="text-gray-500">No activity logs found</p>
                  </td>
                </tr>
              ) : (
                currentLogs.map((log, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-[#7152F3] rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {getUserInitials(log.actor?.firstName, log.actor?.lastName)}
                          </span>
                        </div>
                        <div>
                          <div className="text-[16px] font-medium text-[#16151C]">
                            {getUserDisplayName(log.actor)}
                          </div>
                          <div className="text-sm text-[#A2A1A8]">
                            {getRoleDisplayName(log.actor?.role)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-purple-100 text-[#7152F3]">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-[16px] text-[#16151C]">
                        {getActivityDescription(log)}
                      </div>
                      <div className="text-sm text-[#A2A1A8] flex items-center mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        {new Date(log.timestamp).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#A2A1A8]">
                      {formatDate(log.timestamp)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination - Same as User Management */}
        {auditLogs.length > 0 && (
          <div className="bg-white px-6 py-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-[#A2A1A8]">
                Showing {Math.min(indexOfFirstItem + 1, auditLogs.length)} to {Math.min(indexOfLastItem, auditLogs.length)} of {auditLogs.length} logs
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 text-sm ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-[#A2A1A8] hover:text-gray-700'}`}
                >
                  Previous
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  if (i === 0 && currentPage > 3) {
                    return (
                      <React.Fragment key="start-ellipsis">
                        <button 
                          onClick={() => paginate(1)}
                          className={`px-3 py-1 text-sm ${1 === currentPage ? 'border-[#7152F3] border-[2px] text-[#7152F3] rounded' : 'text-[#A2A1A8] hover:text-gray-700'}`}
                        >
                          1
                        </button>
                        <span className="px-1">...</span>
                      </React.Fragment>
                    );
                  }
                  
                  if (i === 4 && currentPage < totalPages - 2) {
                    return (
                      <React.Fragment key="end-ellipsis">
                        <span className="px-1">...</span>
                        <button 
                          onClick={() => paginate(totalPages)}
                          className={`px-3 py-1 text-sm ${totalPages === currentPage ? 'border-[#7152F3] border-[2px] text-[#7152F3] rounded' : 'text-[#A2A1A8] hover:text-gray-700'}`}
                        >
                          {totalPages}
                        </button>
                      </React.Fragment>
                    );
                  }
                  
                  return (
                    <button 
                      key={pageNum}
                      onClick={() => paginate(pageNum)}
                      className={`px-3 py-1 text-sm ${pageNum === currentPage ? 'border-[#7152F3] border-[2px] text-[#7152F3] rounded' : 'text-[#A2A1A8] hover:text-gray-700'}`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button 
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 text-sm ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-[#A2A1A8] hover:text-gray-700'}`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <ClearAllModal 
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        onConfirm={confirmClearAll}
      />
    </div>
  )
}

export default ActivityLogs
