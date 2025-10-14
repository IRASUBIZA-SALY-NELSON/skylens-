import React, { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { Bell, Search, User, LogOut, Settings, ChevronDown, ArrowLeft, Check, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const RoleHeader = ({ title = "Dashboard" }) => {
  const getLastPathSegment = (path) => {
    // Remove any trailing slashes and split by '/'
    const segments = path.replace(/\/+$/, '').split('/');
    // Return the last segment
    return segments[segments.length - 1] || '';
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const notificationsRef = useRef(null)
  const lastPathSegment = getLastPathSegment(location.pathname);

  const handleLogout = () => {
    logout()
    navigate('/auth/login')
  }

  const getUserDisplayName = () => {
    if (user?.firstName && user?.lastName) return `${user.firstName} ${user.lastName}`
    if (user?.name) return user.name
    if (user?.email) return user.email.split('@')[0]
    return 'User'
  }

  const getUserRole = () => {
    if (user?.role) {
      return user.role.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
    }
    return 'User'
  }

  // Sample notifications data - in a real app, this would come from an API
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New order received', message: 'Order #1234 has been placed', time: '2m ago', read: false },
    { id: 2, title: 'Payment processed', message: 'Payment for order #1234 has been processed', time: '1h ago', read: true },
    { id: 3, title: 'Order shipped', message: 'Your order #1234 has been shipped', time: '3h ago', read: true },
  ])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ))
  }

  const markAllAsRead = () => {
    setShowNotifications(false)
    setNotifications(notifications.map(n => ({ ...n, read: true })))
    navigate('/notifications')
  }

  const renderHeader = () => {
    switch (lastPathSegment) {
      case 'dashboard':
        return (
          <div>
            <h1 className="text-[20px] font-bold text-gray-900">Hello {getUserDisplayName()} 👋🏻</h1>
            <p className="text-[#A2A1A8]">{getGreeting()}</p>
          </div>
        );
      case 'process-orders':
        return (
          <div>
            <h1 className="text-[20px] font-bold text-gray-900">Process Orders</h1>
            <p className="text-[#A2A1A8]">Manage and process incoming orders</p>
          </div>
        );
      case 'stock-management':
        return (
          <div>
            <h1 className="text-[20px] font-bold text-gray-900">Stock Management</h1>
            <p className="text-[#A2A1A8]">Manage inventory and stock levels</p>
          </div>
        );
      case 'stock-transfers':
        return (
          <div>
            <h1 className="text-[20px] font-bold text-gray-900">Stock Transfers</h1>
            <p className="text-[#A2A1A8]">Manage stock transfers between warehouses</p>
          </div>
        );
      default:
        return (
          <div>
            <h1 className="text-[20px] font-bold text-gray-900">{title}</h1>
            <p className="text-[#A2A1A8]">{getGreeting()}</p>
          </div>
        );
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          {renderHeader()}
        </div>

        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent w-64"
            />
          </div>

          {/* Notifications */}
          <div className="relative" ref={notificationsRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500"></span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="font-medium text-gray-900">Notifications</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-purple-600 hover:text-purple-800"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? (
                    <ul className="divide-y divide-gray-100">
                      {notifications.slice(0, 5).map((notification) => (
                        <li
                          key={notification.id}
                          className={`p-3 hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}
                        >
                          <Link
                            to="/notifications"
                            onClick={() => {
                              markAsRead(notification.id)
                              setShowNotifications(false)
                            }}
                            className="block"
                          >
                            <div className="flex items-start">
                              <div className="flex-shrink-0 pt-0.5">
                                <div className={`h-2 w-2 rounded-full ${notification.read ? 'bg-transparent' : 'bg-blue-500'}`}></div>
                              </div>
                              <div className="ml-3 flex-1">
                                <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                                <p className="text-xs text-gray-500 mt-1">{notification.message}</p>
                                <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  markAsRead(notification.id)
                                }}
                                className="ml-2 p-1 text-gray-400 hover:text-gray-600"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="p-4 text-center text-sm text-gray-500">
                      No new notifications
                    </div>
                  )}
                </div>
                <div className="p-2 border-t border-gray-200 text-center">
                  <Link
                    to="/notifications"
                    onClick={() => setShowNotifications(false)}
                    className="text-sm font-medium text-purple-600 hover:text-purple-800"
                  >
                    View all notifications
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 hover:bg-gray-50 rounded-lg p-2 transition-colors"
            >
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="text-left">
                <div className="text-sm font-medium text-gray-700">
                  {getUserDisplayName()}
                </div>
                <div className="text-xs text-gray-500">
                  {getUserRole()}
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>

            {/* User Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="py-1">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="text-sm font-medium text-gray-900">{getUserDisplayName()}</div>
                    <div className="text-xs text-gray-500">{user?.email}</div>
                  </div>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      navigate('/profile');
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <User className="w-4 h-4 mr-3" />
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      navigate('/settings');
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Settings className="w-4 h-4 mr-3" />
                    Settings
                  </button>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default RoleHeader
