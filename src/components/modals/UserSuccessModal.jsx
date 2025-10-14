import React from 'react'

const UserSuccessModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 mx-4 max-w-md w-full text-center">
        {/* Success Icon */}
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">🎉</span>
          </div>
        </div>

        {/* Success Message */}
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          User Created Successfully
        </h2>
        <p className="text-gray-600 mb-8">
          A new user has been created successfully
        </p>

        {/* Back to All Users Button */}
        <button
          onClick={onClose}
          className="w-full bg-purple-600 text-white py-3 px-4 rounded-md font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          Back To All Users
        </button>
      </div>
    </div>
  )
}

export default UserSuccessModal
