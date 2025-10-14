import React from 'react'
import { AlertTriangle } from 'lucide-react'

const ClearAllModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 mx-4 max-w-md w-full text-center">
        {/* Warning Icon */}
        <div className="mb-4">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
        </div>

        {/* Warning Message */}
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Are you sure you want to Clear all logs?
        </h2>
        <p className="text-gray-600 mb-6">
          This logs will be deleted permanently
        </p>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  )
}

export default ClearAllModal
