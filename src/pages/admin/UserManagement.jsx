import React, { useState, useEffect, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import { Search, Filter, ChevronDown, MoreHorizontal, Plus, Eye, Edit, Trash2, PlusCircle } from 'lucide-react'
import { API_ENDPOINTS, apiCall, HTTP_METHODS } from '../../config/api'
import AddUserModal from '../../components/modals/AddUserModal'
import UserSuccessModal from '../../components/modals/UserSuccessModal'
import DeleteUserModal from '../../components/modals/DeleteUserModal'
import ViewUserModal from '../../components/modals/ViewUserModal'
import toast from '../../utils/toast'
import EditAdminUserModal from '../../components/modals/EditAdminUserModal'

// Skeleton component for table rows
const TableRowSkeleton = () => (
  <tr className="animate-pulse">
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
        <div className="h-4 bg-gray-200 rounded w-32"></div>
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-4 bg-gray-200 rounded w-24"></div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-4 bg-gray-200 rounded w-24"></div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-4 bg-gray-200 rounded w-32"></div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-10 w-24 bg-gray-200 rounded-md"></div>
    </td>
  </tr>
);

// Skeleton for search and filter bar
const SearchBarSkeleton = () => (
  <div className="flex items-center justify-between mb-6">
    <div className="relative flex-1 max-w-md">
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 bg-gray-200 rounded"></div>
      <div className="h-[50px] bg-gray-100 rounded-lg w-full"></div>
    </div>
    <div className="flex items-center space-x-3">
      <div className="h-[50px] w-[150px] bg-gray-200 rounded-lg"></div>
      <div className="h-[50px] w-[100px] bg-gray-200 rounded-lg"></div>
    </div>
  </div>
);

// Skeleton for pagination
const PaginationSkeleton = () => (
  <div className="bg-white px-6 py-3 border-t border-gray-200">
    <div className="flex items-center justify-between">
      <div className="h-4 bg-gray-200 rounded w-48"></div>
      <div className="flex items-center space-x-2">
        <div className="h-8 w-16 bg-gray-200 rounded"></div>
        <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
        <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
        <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
        <div className="h-8 w-16 bg-gray-200 rounded"></div>
      </div>
    </div>
  </div>
);

// Skeleton for table header
const TableHeaderSkeleton = () => (
  <thead className="bg-white border-b border-gray-200">
    <tr>
      {[1, 2, 3, 4, 5].map((i) => (
        <th key={i} className="px-6 py-3 text-left">
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </th>
      ))}
    </tr>
  </thead>
);

const UserManagement = () => {
  const location = useLocation()
  const [searchTerm, setSearchTerm] = useState('')
  const [showActionsDropdown, setShowActionsDropdown] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [userToDelete, setUserToDelete] = useState(null)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [showRoleFilter, setShowRoleFilter] = useState(false)
  const [selectedRoles, setSelectedRoles] = useState({
    ADMIN: false,
    MANAGER: false,
    SALES_MANAGER: false,
    STORE_MANAGER: false,
    ACCOUNTANT: false,
    DISTRIBUTOR: false,
    USER: false,
    TENANT: false
  })
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  })

  const fetchUsers = React.useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const userData = await apiCall(API_ENDPOINTS.USERS)
      setUsers(userData || [])
      console.log('📊 Users fetched for User Management:', userData)
    } catch (error) {
      console.error('❌ Error fetching users:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUsers()
    
    // Check if we should open Add User modal from navigation state
    if (location.state?.openAddModal) {
      setShowAddModal(true)
    }
  }, [fetchUsers, location.state])

  const handleAddUser = async (userData) => {
    try {
      // User was already created successfully via /api/auth/register in the modal
      // Just refresh the users list to show the new user
      console.log('✅ User was created successfully via register endpoint, refreshing users list')
      await fetchUsers() // Refresh the users list
      setShowAddModal(false)
      setShowSuccessModal(true)
      
      // Reload the page to clear any cached form data and ensure clean state
      setTimeout(() => {
        window.location.reload()
      }, 2000) // Give time for success modal to be seen
    } catch (error) {
      console.error('❌ Error refreshing users list:', error)
      toast.error('User was created but failed to refresh the list: ' + error.message)
    }
  }

  const handleEditUser = async (userId, userData) => {
    try {
      const updatedUser = await apiCall(API_ENDPOINTS.USER_BY_ID(userId), {
        method: HTTP_METHODS.PUT,
        body: JSON.stringify(userData)
      })
      setUsers(prev => prev.map(user => user.id === userId ? updatedUser : user))
      setShowEditModal(false)
      setShowSuccessModal(true)
      console.log('✅ User updated successfully:', updatedUser)
    } catch (error) {
      console.error('❌ Error updating user:', error)
      toast.error('Failed to update user: ' + error.message)
    }
  }

  const handleDeleteUser = async (userId) => {
    try {
      await apiCall(API_ENDPOINTS.USER_BY_ID(userId), {
        method: HTTP_METHODS.DELETE
      })
      setUsers(prev => prev.filter(user => user.id !== userId))
      setShowDeleteModal(false)
      setUserToDelete(null)
      console.log('✅ User deleted successfully')
    } catch (error) {
      console.error('❌ Error deleting user:', error)
      toast.error('Failed to delete user: ' + error.message)
    }
  }

  const getRoleDisplayName = (role) => {
    const roleMap = {
      'ADMIN': 'Administrator',
      'MANAGER': 'Manager',
      'SALES_MANAGER': 'Sales Manager',
      'STORE_MANAGER': 'Store Manager',
      'ACCOUNTANT': 'Accountant',
      'DISTRIBUTOR': 'Distributor',
      'USER': 'User',
      'TENANT':'Tenant',
      'MANAGING_DIRECTOR': "Managing Director",
      
'SUPER_ADMIN' : "Super Administrator"
    }
    return roleMap[role] || role
  }

  const getUserInitials = (firstName, lastName) => {
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
    }
    if (firstName) {
      return firstName.charAt(0).toUpperCase()
    }
    return 'U'
  }

  const getUserDisplayName = (user) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`
    }
    return user.email || 'Unknown User'
  }

  const filteredUsers = users.filter(user => {
    const displayName = getUserDisplayName(user).toLowerCase()
    const email = (user.email || '').toLowerCase()
    const role = getRoleDisplayName(user.role).toLowerCase()
    const searchLower = searchTerm.toLowerCase()
    
    // Check if any roles are selected, if not, show all users
    const hasSelectedRoles = Object.values(selectedRoles).some(role => role)
    const roleMatches = !hasSelectedRoles || selectedRoles[user.role]
    
    // Check date range filter
    let dateMatches = true
    if (dateRange.startDate || dateRange.endDate) {
      const userDate = user.createdAt ? new Date(user.createdAt) : null
      if (userDate) {
        if (dateRange.startDate && new Date(dateRange.startDate) > userDate) {
          dateMatches = false
        }
        if (dateRange.endDate) {
          const endOfDay = new Date(dateRange.endDate)
          endOfDay.setHours(23, 59, 59, 999)
          if (userDate > endOfDay) {
            dateMatches = false
          }
        }
      } else {
        // If user has no creation date, only include if no date filter is set
        dateMatches = !dateRange.startDate && !dateRange.endDate
      }
    }
    
    return (displayName.includes(searchLower) || 
           email.includes(searchLower) || 
           role.includes(searchLower)) && roleMatches && dateMatches
  })

  // Get current users
  const indexOfLastUser = currentPage * itemsPerPage
  const indexOfFirstUser = indexOfLastUser - itemsPerPage
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)

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

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  const handleActionsClick = (userId) => {
    setShowActionsDropdown(showActionsDropdown === userId ? null : userId)
  }

  const handleAddUserModal = () => {
    setShowAddModal(true)
  }

  const handleUserSuccess = () => {
    setShowAddModal(false)
    setShowSuccessModal(true)
    // Refresh users list after successful addition
    fetchUsers()
  }

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowViewModal(true);
    setShowActionsDropdown(null); // Close the actions dropdown
  }

  const handleEditUserModal = (user) => {
    setSelectedUser(user)
    setShowEditModal(true)
    setShowActionsDropdown(null)
  }

  const handleDeleteUserModal = (user) => {
    setUserToDelete(user)
    setShowDeleteModal(true)
    setShowActionsDropdown(null)
  }

  const confirmDeleteUser = () => {
    if (userToDelete) {
      handleDeleteUser(userToDelete.id)
    }
  }

  const toggleRoleFilter = (role) => {
    setSelectedRoles(prev => ({
      ...prev,
      [role]: !prev[role]
    }))
  }

  const getSelectedRolesCount = () => {
    return Object.values(selectedRoles).filter(Boolean).length
  }

  const handleDateChange = (e, type) => {
    setDateRange(prev => ({
      ...prev,
      [type]: e.target.value
    }))
  }

  const clearDateFilter = () => {
    setDateRange({
      startDate: '',
      endDate: ''
    })
  }

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="mb-6">
        {loading ? (
          <SearchBarSkeleton />
        ) : (
          <>
            {/* Search and Filter Bar */}
            <div className="flex items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 h-[50px] rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <button 
                    className="flex items-center space-x-2 h-[50px] justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors relative"
                    onClick={() => setShowRoleFilter(!showRoleFilter)}
                  >
                    <Filter className="h-4 w-4" />
                    <span>Filter</span>
                    {getSelectedRolesCount() > 0 && (
                      <span className="absolute -top-1 -right-1 bg-[#7152F3] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {getSelectedRolesCount()}
                      </span>
                    )}
                  </button>
                  
                  {showRoleFilter && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                      <div className="p-4 space-y-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-700 mb-2">Filter by Role</h3>
                          <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-1">
                            {Object.keys(selectedRoles).map((role) => (
                              <label key={role} className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={selectedRoles[role]}
                                  onChange={() => toggleRoleFilter(role)}
                                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                                />
                                <span className="ml-2 text-sm text-gray-700">{getRoleDisplayName(role)}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        <div className="border-t border-gray-200 pt-3">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="text-sm font-medium text-gray-700">Date Range</h3>
                            {(dateRange.startDate || dateRange.endDate) && (
                              <button 
                                onClick={clearDateFilter}
                                className="text-xs text-purple-600 hover:text-purple-800"
                              >
                                Clear
                              </button>
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">From</label>
                              <input
                                type="date"
                                value={dateRange.startDate}
                                onChange={(e) => handleDateChange(e, 'startDate')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">To</label>
                              <input
                                type="date"
                                value={dateRange.endDate}
                                onChange={(e) => handleDateChange(e, 'endDate')}
                                min={dateRange.startDate}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <button 
                  className="flex items-center space-x-[10px] h-[50px] justify-center px-[20px] py-[10px] bg-[#7152F3] text-white rounded-lg hover:bg-purple-700 transition-colors"
                  onClick={handleAddUserModal}
                >
                  <PlusCircle className="h-[24px] w-[24px]" />
                  <span className='text-[16px]'>Add New User</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg w-full border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full ">
            <thead className="bg-white border-b border-gray-200">
              {loading ? (
                <tr>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <th key={i} className="px-6 py-3 text-left">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </th>
                  ))}
                </tr>
              ) : (
                <tr>
                  <th className="px-6 py-3 text-left text-[16px] font-medium text-[#A2A1A8] tracking-wider">
                    User Name
                  </th>
                  <th className="px-6 py-3 text-left text-[16px] font-medium text-[#A2A1A8] tracking-wider">
                    Phone Number
                  </th>
                  <th className="px-6 py-3 text-left text-[16px] font-medium text-[#A2A1A8] tracking-wider">
                    User Role
                  </th>
                  <th className="px-6 py-3 text-left text-[16px] font-medium text-[#A2A1A8] tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-[16px] font-medium text-[#A2A1A8] tracking-wider">
                    Status
                  </th>
                </tr>
              )}
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 ">
              {loading ? (
                // Show skeleton rows while loading
                Array(5).fill(0).map((_, index) => (
                  <TableRowSkeleton key={`skeleton-${index}`} />
                ))
              ) : error ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center">
                    <p className="text-red-600">Error loading users: {error}</p>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center">
                    <p className="text-gray-500">No users found</p>
                  </td>
                </tr>
              ) : (
                currentUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-[#7152F3] rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {getUserInitials(user.firstName, user.lastName)}
                          </span>
                        </div>
                        <span className="text-[16px] font-medium text-[#16151C]">
                          {getUserDisplayName(user)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-[16px] text-[#16151C]">
                      {user.phone || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-[16px] text-[#16151C]">
                      {getRoleDisplayName(user.role)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-[16px] text-[#16151C]">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-[16px] text-[#16151C]">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewUser(user)}
                          className="p-2 text-gray-500 hover:text-[#7152F3] rounded-full hover:bg-gray-100 transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEditUserModal(user)}
                          className="p-2 text-gray-500 hover:text-[#7152F3] rounded-full hover:bg-gray-100 transition-colors"
                          title="Edit User"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUserModal(user)}
                          className="p-2 text-gray-500 hover:text-red-500 rounded-full hover:bg-gray-100 transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {loading ? (
          <PaginationSkeleton />
        ) : (
          <div className="bg-white px-6 py-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-[#A2A1A8]">
                Showing {Math.min(indexOfFirstUser + 1, filteredUsers.length)} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} users
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
                  // Show page numbers with ellipsis for large numbers of pages
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
                          className={`${
                            1 === currentPage ? 'border-[#7152F3] border-[1px] text-[#7152F3] rounded' : 'text-[#A2A1A8] hover:text-gray-700'
                          }`}
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
                          className={`${
                            totalPages === currentPage ? 'border-[#7152F3] border-[2px] text-[#7152F3] rounded' : 'text-[#A2A1A8] hover:text-gray-700'
                          }`}
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
                      className={`px-3 py-1 text-sm ${
                        pageNum === currentPage ? 'border-[#7152F3] border-[2px] text-[#7152F3] rounded' : 'text-[#A2A1A8] hover:text-gray-700'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button 
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 text-sm ${
                    currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-[#A2A1A8] hover:text-gray-700'
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <AddUserModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)} 
        onSuccess={handleAddUser}
      />
      
      <UserSuccessModal 
        isOpen={showSuccessModal} 
        onClose={() => setShowSuccessModal(false)}
      />
      
      <DeleteUserModal 
        isOpen={showDeleteModal} 
        onClose={() => setShowDeleteModal(false)} 
        onConfirm={confirmDeleteUser}
        userName={userToDelete?.firstName + ' ' + userToDelete?.lastName}
      />
      
      <ViewUserModal 
        isOpen={showViewModal} 
        onClose={() => setShowViewModal(false)} 
        user={selectedUser}
        onEdit={() => {
          setShowViewModal(false)
          setShowEditModal(true)
        }}
      />
      
      <EditAdminUserModal 
        isOpen={showEditModal} 
        onClose={() => setShowEditModal(false)} 
        user={selectedUser}
        onSave={(userData) => handleEditUser(selectedUser.id, userData)}
      />
    </div>
  )
}

export default UserManagement
