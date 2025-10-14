import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Bell, Search, User, LogOut, Settings, ChevronDown, ArrowLeft } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const Header = () => {
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
  console.log('Current path:', location.pathname) // This will log the current path (e.g., "/dashboard")
  console.log('Full URL:', window.location.href) // This will log the full URL including domain

  const { user, logout } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const getProfilePath = (role) => {
    switch (role) {
      case 'DISTRIBUTOR': return '/distributor/profile';
      case 'DISTRIBUTOR_ACCOUNTANT':
      case 'ACCOUNTANT_AT_STORE': return '/distributor-accountant/profile';
      case 'SALES_MANAGER': return '/sales-manager/profile';
      case 'MANAGING_DIRECTOR': return '/managing-director/profile';
      case 'ACCOUNTANT': return '/accountant/profile';
      case 'RETAILER': return '/retailer/profile';
      case 'WAREHOUSE_MANAGER': return '/warehouse-manager/profile';
      case 'STORE_MANAGER': return '/store-manager/profile';
      case 'SUPER_ADMIN': return '/super-admin/profile';
      case 'ADMIN': return '/admin/profile';
      default: return '/profile';
    }
  };
  const handleLogout = () => {
    logout()
    navigate('/auth/login')
  }

  const lastPathSegment = getLastPathSegment(location.pathname);
  console.log("lastPathSegment", lastPathSegment);

  // Prefer full name from profile, then stored name, then email username
  const getUserDisplayName = () => {
    if (user?.firstName && user?.lastName) return `${user.firstName} ${user.lastName}`
    if (user?.name) return user.name
    if (user?.email) {
      const base = user.email.split('@')[0] || ''
      return base
        .split(/[._-]/)
        .filter(Boolean)
        .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
        .join(' ') || user.email
    }
    return 'User'
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
      case 'user-management':
        return (
          <div>
            <h1 className="text-[20px] font-bold text-gray-900">All Users</h1>
            <p className="text-[#A2A1A8]">All users information</p>
          </div>
        );
      case 'activity-logs':
        return (
          <div>
            <h1 className="text-[20px] font-bold text-gray-900">Activity logs</h1>
            <p className="text-[#A2A1A8]">Track all activity logs</p>
          </div>
        );
      case 'reports':
        return (
          <div>
            <h1 className="text-[20px] font-bold text-gray-900">Reports</h1>
            <p className="text-[#A2A1A8]">Tract Reports for the overall system</p>
          </div>
        );
      case 'distributors':
        return (
          <div>
            <h1 className="text-[20px] font-bold text-gray-900">Distributor Management</h1>
            <p className="text-[#A2A1A8]"> Keep Track of All Distributors</p>
          </div>
        );
      case 'settings':
        return (
          <div>
            <h1 className="text-[20px] font-bold text-gray-900">Settings</h1>
            <p className="text-[#A2A1A8]">Settings for the overall system</p>
          </div>
        );
      case 'companies':
        return (
          <div>
            <h1 className="text-[20px] font-bold text-gray-900">Companies</h1>
            <p className="text-[#A2A1A8]">Registered factory companies</p>
          </div>
        );
      case 'companies-create':
        return (
          <div>
            <h1 className="text-[20px] font-bold text-gray-900">Create Company & Primary Users</h1>
            <p className="text-[#A2A1A8]">Follow the steps to register a factory company and its key accounts.</p>
          </div>
        );
      case 'product-management':
        return (
          <div>
            <h1 className="text-[20px] font-bold text-gray-900">Product Management</h1>
            <p className="text-[#A2A1A8]">Manage products and their details</p>
          </div>
        );
      case 'price-management':
        return (
          <div>
            <h1 className="text-[20px] font-bold text-gray-900">Price Management</h1>
            <p className="text-[#A2A1A8]">Manage product prices and price lists</p>
          </div>
        );
      case 'add-new':
        return (
          <div className="flex items-center  space-x-[20px] flex-row">
            <div className="flex items-center  space-x-2 text-sm text-gray-500 mb-2">
              <button
                onClick={() => navigate('/sales-manager/product-management')}
                className="flex items-center space-x-1 text-sm text-[#A2A1A8] hover:text-gray-700"
              >
                <ArrowLeft className="w-[24px] h-[24px] text-gray-500 border-[1px] border-gray-300 rounded-[8px] p-[5px]" />
                <span>Go back</span>
              </button>
            </div>
            <div className="flex flex-col">
              <h1 className="text-[20px] font-bold text-gray-900">Add New Product</h1>
              <p className="text-[#A2A1A8]">Enter the details below to add a new product to the catalog.</p>
            </div>
          </div>
        );
      case 'details':
        return (
          <div className="flex items-center  space-x-[20px] flex-row">
            <div className="flex items-center  space-x-2 text-sm text-gray-500 mb-2">
              <button
                onClick={() => navigate('/sales-manager/product-management')}
                className="flex items-center space-x-1 text-sm text-[#A2A1A8] hover:text-gray-700"
              >
                <ArrowLeft className="w-[24px] h-[24px] text-gray-500 border-[1px] border-gray-300 rounded-[8px] p-[5px]" />
                <span>Go back</span>
              </button>
            </div>
            <div className="flex flex-col">
              <h1 className="text-[20px] font-bold text-gray-900">Product details</h1>
              <p className="text-[#A2A1A8]">View details of a product</p>
            </div>
          </div>);
      case 'edit-details':
        return (
          <div className="flex items-center  space-x-[20px] flex-row">
            <div className="flex items-center  space-x-2 text-sm text-gray-500 mb-2">
              <button
                onClick={() => navigate('/sales-manager/product-management')}
                className="flex items-center space-x-1 text-sm text-[#A2A1A8] hover:text-gray-700"
              >
                <ArrowLeft className="w-[24px] h-[24px] text-gray-500 border-[1px] border-gray-300 rounded-[8px] p-[5px]" />
                <span>Go back</span>
              </button>
            </div>
            <div className="flex flex-col">
              <h1 className="text-[20px] font-bold text-gray-900">Product details</h1>
              <p className="text-[#A2A1A8]">Edit details of a product</p>
            </div>
          </div>
        );
      case 'company-details':
        return (
          <div className="flex items-center  space-x-[20px] flex-row">
            <div className="flex items-center  space-x-2 text-sm text-gray-500 mb-2">
              <button
                onClick={() => navigate('/super-admin/companies')}
                className="flex items-center space-x-1 text-sm text-[#A2A1A8] hover:text-gray-700"
              >
                <ArrowLeft className="w-[24px] h-[24px] text-gray-500 border-[1px] border-gray-300 rounded-[8px] p-[5px]" />
                <span>Go back</span>
              </button>
            </div>
            <div className="flex flex-col">
              <h1 className="text-[20px] font-bold text-gray-900">Company details</h1>
              <p className="text-[#A2A1A8]">View details of a company</p>
            </div>
          </div>);
      case 'edit':
        return (
          <div className="flex items-center  space-x-[20px] flex-row">
            <div className="flex items-center  space-x-2 text-sm text-gray-500 mb-2">
              <button
                onClick={() => navigate('/super-admin/companies')}
                className="flex items-center space-x-1 text-sm text-[#A2A1A8] hover:text-gray-700"
              >
                <ArrowLeft className="w-[24px] h-[24px] text-gray-500 border-[1px] border-gray-300 rounded-[8px] p-[5px]" />
                <span>Go back</span>
              </button>
            </div>
            <div className="flex flex-col">
              <h1 className="text-[20px] font-bold text-gray-900">Company details</h1>
              <p className="text-[#A2A1A8]">Edit details of a company</p>
            </div>
          </div>
        );
      case 'profile':
        return (
          <div className="flex items-center  space-x-[20px] flex-row">
            {/* <div className="flex items-center  space-x-2 text-sm text-gray-500 mb-2">
              <button 
                onClick={() => navigate(-1)}
                  className="flex items-center space-x-1 text-sm text-[#A2A1A8] hover:text-gray-700"
                >
                  <ArrowLeft className="w-[24px] h-[24px] text-gray-500 border-[1px] border-gray-300 rounded-[8px] p-[5px]" />
                  <span>Go back</span>
                </button>
              </div> */}
            <div className="flex flex-col">
              <h1 className="text-[20px] font-bold text-gray-900">Profile details</h1>
              <p className="text-[#A2A1A8]">Personal Information</p>
            </div>
          </div>
        );
      case 'notifications':
        return (
          <div className="flex items-center  space-x-[20px] flex-row">
            {/* <div className="flex items-center  space-x-2 text-sm text-gray-500 mb-2">
              <button 
                onClick={() => navigate(-1)}
                  className="flex items-center space-x-1 text-sm text-[#A2A1A8] hover:text-gray-700"
                >
                  <ArrowLeft className="w-[24px] h-[24px] text-gray-500 border-[1px] border-gray-300 rounded-[8px] p-[5px]" />
                  <span>Go back</span>
                </button>
              </div> */}
            <div className="flex flex-col">
              <h1 className="text-[20px] font-bold text-gray-900">Notifications</h1>
              <p className="text-[#A2A1A8]">Manage your notifications</p>
            </div>
          </div>
        );
      case 'sales-analytics':
        return (
          <div>
            <h1 className="text-[20px] font-bold text-gray-900">Sales Analytics</h1>
            <p className="text-[#A2A1A8]">Keep Track of sales analytics</p>
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
            <h1 className="text-[20px] font-bold text-gray-900">Completed Stock Transfers</h1>
            <p className="text-[#A2A1A8]">View and manage completed inventory transfers between locations</p>
          </div>
        );
      case 'orders':
        return (
          <div className="flex items-center  space-x-[20px] flex-row">
            <div className="flex items-center  space-x-2 text-sm text-gray-500 mb-2">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center space-x-1 text-sm text-[#A2A1A8] hover:text-gray-700"
              >
                <ArrowLeft className="w-[24px] h-[24px] text-gray-500 border-[1px] border-gray-300 rounded-[8px] p-[5px]" />
                <span>Go back</span>
              </button>
            </div>
            <div className="flex flex-col">
              <h1 className="text-[20px] font-bold text-gray-900">Order details</h1>
              <p className="text-[#A2A1A8]">View order details </p>
            </div>
          </div>
        );
      case 'order-details':
        return (
          <div>
            <h1 className="text-[20px] font-bold text-gray-900">Order details</h1>
            <p className="text-[#A2A1A8]">View and manage order details </p>
          </div>
        );
      case 'payments':
        return (
          <div>
            <h1 className="text-[20px] font-bold text-gray-900">Payments</h1>
            <p className="text-[#A2A1A8]">Manage payments and view payment details</p>
          </div>
        );
      case 'invoices':
        return (
          <div>
            <h1 className="text-[20px] font-bold text-gray-900">Invoices</h1>
            <p className="text-[#A2A1A8]">Manage invoices and view invoice details</p>
          </div>
        );
      case 'invoice-details':
        return (
          <div className="flex items-center  space-x-[20px] flex-row">
            <div className="flex items-center  space-x-2 text-sm text-gray-500 mb-2">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center space-x-1 text-sm text-[#A2A1A8] hover:text-gray-700"
              >
                <ArrowLeft className="w-[24px] h-[24px] text-gray-500 border-[1px] border-gray-300 rounded-[8px] p-[5px]" />
                <span>Go back</span>
              </button>
            </div>
            <div className="flex flex-col">
              <h1 className="text-[20px] font-bold text-gray-900">Invoice details</h1>
              <p className="text-[#A2A1A8]">View and manage invoice details </p>
            </div>
          </div>
        );
      case 'orders-accountant':
        return (
          <div>
            <h1 className="text-[20px] font-bold text-gray-900">Orders for Financial Approval</h1>
            <p className="text-[#A2A1A8]">All orders that require your financial approval

            </p>
          </div>
        );
      case 'factory-reports':
        return (
          <div>
            <h1 className="text-[20px] font-bold text-gray-900">Factory Reports</h1>
            <p className="text-[#A2A1A8]">View and manage factory reports</p>
          </div>
        );
      case 'financial-reports':
        return (
          <div>
            <h1 className="text-[20px] font-bold text-gray-900">Financial Reports</h1>
            <p className="text-[#A2A1A8]">View and manage financial reports</p>
          </div>
        );
      case 'operations':
        return (
          <div>
            <h1 className="text-[20px] font-bold text-gray-900">Operations</h1>
            <p className="text-[#A2A1A8]">View and manage operations</p>
          </div>
        );
      case 'analytics':
        return (
          <div>
            <h1 className="text-[20px] font-bold text-gray-900">Performance Analytics</h1>
            <p className="text-[#A2A1A8]">View and manage performance analytics</p>
          </div>
        );
      case 'stock':
        return (
          <div>
            <h1 className="text-[20px] font-bold text-gray-900">Stock Management</h1>
            <p className="text-[#A2A1A8]">View and manage stock</p>
          </div>
        );
      case 'inventory':
        return (
          <div>
            <h1 className="text-[20px] font-bold text-gray-900">Inventory Management</h1>
            <p className="text-[#A2A1A8]">View and manage inventory</p>
          </div>
        );
      case 'company':
        return (
          <div>
            <h1 className="text-[20px] font-bold text-gray-900">Company Overview</h1>
            <p className="text-[#A2A1A8]">View and manage company overview</p>
          </div>
        );
      case 'place-order':
        return (
          <div>
            <h1 className="text-[20px] font-bold text-gray-900">Place Order</h1>
            <p className="text-[#A2A1A8]">Place a new order</p>
          </div>
        );
      case 'order-management':
        return (
          <div>
            <h1 className="text-[20px] font-bold text-gray-900">Order Management</h1>
            <p className="text-[#A2A1A8]">Manage orders details</p>
          </div>
        );
      case 'record':
        return (
          <div className="flex items-center  space-x-[20px] flex-row">
            <div className="flex items-center  space-x-2 text-sm text-gray-500 mb-2">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center space-x-1 text-sm text-[#A2A1A8] hover:text-gray-700"
              >
                <ArrowLeft className="w-[24px] h-[24px] text-gray-500 border-[1px] border-gray-300 rounded-[8px] p-[5px]" />
                <span>Go back</span>
              </button>
            </div>
            <div className="flex flex-col">
              <h1 className="text-[20px] font-bold text-gray-900">Record a Payment</h1>
              <p className="text-[#A2A1A8]">Add a distributor and other details to record a new payment</p>
            </div>
          </div>
        );
      default:
        return (
          <h1 className="text-2xl font-bold text-gray-900">
            GGM {lastPathSegment.charAt(0).toUpperCase() + lastPathSegment.slice(1)}
          </h1>
        );
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
      RETAILER: 'Retailer',
      SALES_ASSISTANT: 'Sales Assistant',
      MANAGING_DIRECTOR: 'Managing Director',
      SUPER_ADMIN: 'Super Admin',
    };
    return roleMap[role] || role;
  };
  console.log("user in header", user);
  return (
    <header className="bg-white h-[110px] flex items-center">
      <div className="flex items-center flex-1 justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          {renderHeader()}
        </div>

        <div className="flex items-center space-x-4">
          {/* Search */}
          {/* <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700 w-4 h-4" />
            <input
              type="text"
              placeholder="Search"
              className="pl-10 pr-4 py-2 border-[1px] h-[50px] border-gray-300 rounded-lg focus:ring-2 placeholder-text-[#16151C] placeholder:font-light focus:ring-purple-500 focus:border-transparent w-64"
            />
          </div> */}

          {/* Notifications */}
          {user?.role === 'DISTRIBUTOR' &&

            <button
              onClick={() => navigate('/notifications')}
              className="relative p-2 h-[50px] flex justify-center items-center w-[50px] rounded-[10px] text-[#16151C] bg-[rgba(162,161,168,0.1)] hover:text-gray-600 transition-colors"
            >
              <Bell className="w-[24px] h-[24px]" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400"></span>
            </button>
          }
          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3  h-[50px] hover:bg-gray-50 rounded-lg p-1 border-[1px] border-[rgba(162,161,168,0.2)] transition-colors"
            >
              <div className="w-[40px] h-[40px] bg-[#7152F3] rounded-[8px] flex items-center justify-center">
                <User className="w-[30px] h-[30px] text-white " />
              </div>
              <div className='flex flex-col items-start'>
                <span className="text-[16px] font-medium text-gray-700">
                  {getUserDisplayName()}
                </span>
                <span className="text-[12px] text-[#A2A1A8]">
                  {getRoleDisplayName(user?.role || 'USER')}
                </span>
              </div>
              <ChevronDown />
            </button>

            {/* User Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="py-1">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      navigate(getProfilePath(user?.role));
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <User className="w-4 h-4 mr-3" />
                    Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-gray-100"
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

export default Header
