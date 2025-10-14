import React, { useState } from 'react'
import { X, Search, Calendar } from 'lucide-react'

const FilterModal = ({ isOpen, onClose, onApply }) => {
  const [searchUser, setSearchUser] = useState('')
  const [selectedRoles, setSelectedRoles] = useState({
    Administrator: true,
    Accountant: false,
    'Sales Manager': false,
    'Sales Assistant': false,
    'Store Manager': false
  })
  const [selectedDate, setSelectedDate] = useState('10/12/2025')

  const handleRoleChange = (role) => {
    setSelectedRoles(prev => ({
      ...prev,
      [role]: !prev[role]
    }))
  }

  const handleApply = () => {
    const filterData = {
      searchUser,
      selectedRoles,
      selectedDate
    }
    onApply(filterData)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Filter</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Search User */}
          <div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search User"
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>

          {/* Role Filter */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Role</h3>
            <div className="space-y-2">
              {Object.entries(selectedRoles).map(([role, isSelected]) => (
                <label key={role} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleRoleChange(role)}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{role}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Date Filter */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Date</h3>
            <div className="relative">
              <input
                type="text"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="10/12/2025"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <span className="text-[#7152F3] text-sm"><Calendar/></span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="px-6 py-2 text-sm font-medium text-white bg-[#7152F3] border border-transparent rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  )
}

export default FilterModal
