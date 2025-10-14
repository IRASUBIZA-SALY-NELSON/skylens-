import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { CheckCircle, Copy, User, Key, Building2 } from 'lucide-react'
import toast from 'react-hot-toast'

const UserSuccess = () => {
  const location = useLocation()
  const { userId, userName, role, tenantName } = location.state || {}

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast.success('User ID copied to clipboard!')
  }

  const getRoleDisplayName = (roleValue) => {
    const roleMap = {
      'admin': 'System Admin',
      'store-manager': 'Store Manager',
      'sales-manager': 'Sales Manager',
      'sales-assistant': 'Sales Assistant',
      'warehouse-manager': 'Warehouse Manager',
      'accountant': 'Accountant'
    }
    return roleMap[roleValue] || roleValue
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo */}
        <div className="text-center">
          <div className="flex items-center justify-center">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">GGM</span>
            </div>
            <h2 className="ml-3 text-3xl font-bold text-gray-900">GGM</h2>
          </div>
        </div>

        {/* Success Message */}
        <div className="text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
          <h2 className="mt-4 text-2xl font-bold text-gray-900">User Created Successfully!</h2>
          <p className="mt-2 text-gray-600">
            {userName} has been added to {tenantName}
          </p>
        </div>

        {/* User Details Card */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">User Details</h3>
            <User className="h-5 w-5 text-purple-600" />
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">User ID:</span>
              <div className="flex items-center space-x-2">
                <code className="text-sm font-mono text-purple-800 bg-purple-50 px-2 py-1 rounded">
                  {userId}
                </code>
                <button
                  onClick={() => copyToClipboard(userId)}
                  className="p-1 text-purple-600 hover:text-purple-700"
                  title="Copy to clipboard"
                >
                  <Copy className="h-3 w-3" />
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Name:</span>
              <span className="text-sm font-medium text-gray-900">{userName}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Role:</span>
              <span className="text-sm font-medium text-purple-600">{getRoleDisplayName(role)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Organization:</span>
              <span className="text-sm font-medium text-gray-900">{tenantName}</span>
            </div>
          </div>
        </div>

        {/* Login Instructions */}
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-2 mb-3">
            <Key className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-medium text-blue-900">Login Instructions</h3>
          </div>
          
          <div className="space-y-2 text-sm text-blue-800">
            <p><strong>1.</strong> The user can now log in using their email and password</p>
            <p><strong>2.</strong> On first login, they'll be prompted to change their password</p>
            <p><strong>3.</strong> They'll be directed to their role-specific dashboard</p>
            <p><strong>4.</strong> Profile settings allow password reset and account management</p>
          </div>
        </div>

        {/* Dashboard Access */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Dashboard Access</h4>
          <p className="text-xs text-gray-600 mb-3">
            {userName} will have access to the {getRoleDisplayName(role)} dashboard with role-specific features and permissions.
          </p>
          
          <div className="flex items-center space-x-2">
            <Building2 className="h-4 w-4 text-gray-400" />
            <span className="text-xs text-gray-500">Organization: {tenantName}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            to="/auth/register"
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            <User className="h-4 w-4 mr-2" />
            Create Another User
          </Link>
          
          <Link
            to="/auth/login"
            className="w-full flex justify-center items-center py-3 px-4 border border-purple-300 text-sm font-medium rounded-lg text-purple-600 bg-white hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            <Key className="h-4 w-4 mr-2" />
            Go to Login
          </Link>
        </div>

        {/* Support */}
        <div className="text-center text-sm text-gray-600">
          Need help? Contact our support team at{' '}
          <a href="mailto:support@ggm.com" className="text-purple-600 hover:text-purple-500">
            support@ggm.com
          </a>
        </div>
      </div>
    </div>
  )
}

export default UserSuccess
