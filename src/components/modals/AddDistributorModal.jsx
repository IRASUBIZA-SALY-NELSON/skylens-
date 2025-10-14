import React, { useState } from 'react'
import { X, ArrowLeft } from 'lucide-react'

const AddDistributorModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    legalCompanyName: 'AMACO CLOTHES LTD',
    companyType: 'LLC',
    streetAddress: 'KK 120 KIMIHURURA',
    city: 'KIGALI',
    postalCode: '1029',
    country: 'RWANDA',
    companyEmail: 'Company@gmail.com',
    phoneNumber: '+2507 234 567 89',
    assignedSalesAssistant: 'John Liam',
    createLogin: true,
    storeManagerEmail: 'Company@gmail.com'
  })

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Special handling for phone number
    if (name === 'phoneNumber') {
      // Allow only numbers and plus sign at the beginning
      const cleanedValue = value.replace(/[^0-9+]/g, '');
      // Ensure plus sign is only at the beginning
      const validValue = cleanedValue.startsWith('+') 
        ? '+' + cleanedValue.replace(/[^0-9]/g, '').slice(0, 13) // 1 for + and 13 for numbers
        : '+' + cleanedValue.replace(/[^0-9]/g, '').slice(0, 14);
      
      setFormData(prev => ({
        ...prev,
        [name]: validValue
      }));
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Creating distributor:', formData)
    onClose()
  }

  const handleSendInvitation = () => {
    console.log('Sending invitation to:', formData.storeManagerEmail)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Onboard New Distributor</h2>
              <p className="text-sm text-gray-500">Enter the company details to create a new distributor account.</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">New Distributor Form</h3>
            
            <div className="space-y-4">
              {/* Legal Company Name */}
              <div>
                <label className="block text-sm font-medium text-purple-600 mb-2">
                  Legal Company Name
                </label>
                <input
                  type="text"
                  name="legalCompanyName"
                  value={formData.legalCompanyName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="AMACO CLOTHES LTD"
                />
              </div>

              {/* Company Type */}
              <div>
                <label className="block text-sm font-medium text-purple-600 mb-2">
                  Choose Company Type
                </label>
                <select
                  name="companyType"
                  value={formData.companyType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="LLC">LLC</option>
                  <option value="Corporation">Corporation</option>
                  <option value="Partnership">Partnership</option>
                  <option value="Sole Proprietorship">Sole Proprietorship</option>
                </select>
              </div>

              {/* Street Address */}
              <div>
                <label className="block text-sm font-medium text-purple-600 mb-2">
                  Street Address
                </label>
                <input
                  type="text"
                  name="streetAddress"
                  value={formData.streetAddress}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="KK 120 KIMIHURURA"
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-purple-600 mb-2">
                  Choose City
                </label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="KIGALI">KIGALI</option>
                  <option value="BUTARE">BUTARE</option>
                  <option value="GITARAMA">GITARAMA</option>
                  <option value="RUHENGERI">RUHENGERI</option>
                </select>
              </div>

              {/* Postal Code */}
              <div>
                <label className="block text-sm font-medium text-purple-600 mb-2">
                  Postal Code
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="1029"
                />
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm font-medium text-purple-600 mb-2">
                  Choose Country
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="RWANDA">RWANDA</option>
                  <option value="UGANDA">UGANDA</option>
                  <option value="KENYA">KENYA</option>
                  <option value="TANZANIA">TANZANIA</option>
                </select>
              </div>

              {/* Company Email */}
              <div>
                <label className="block text-sm font-medium text-purple-600 mb-2">
                  Company Email
                </label>
                <input
                  type="email"
                  name="companyEmail"
                  value={formData.companyEmail}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Company@gmail.com"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-purple-600 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  maxLength={14}
                  className="w-full px-3 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="+1234567890"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Format: + followed by up to 13 digits (e.g., +250700000000)
                </p>
              </div>

              {/* Assigned Sales Assistant */}
              <div>
                <label className="block text-sm font-medium text-purple-600 mb-2">
                  Assigned Sales Assistant
                </label>
                <select
                  name="assignedSalesAssistant"
                  value={formData.assignedSalesAssistant}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="John Liam">John Liam</option>
                  <option value="Sarah Johnson">Sarah Johnson</option>
                  <option value="Mike Wilson">Mike Wilson</option>
                  <option value="Emily Davis">Emily Davis</option>
                </select>
              </div>

              {/* Create Login Checkbox */}
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="createLogin"
                  name="createLogin"
                  checked={formData.createLogin}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <label htmlFor="createLogin" className="text-sm font-medium text-gray-700">
                  Create Login for Store Manager ?
                </label>
              </div>

              {/* Store Manager Email */}
              {formData.createLogin && (
                <div>
                  <label className="block text-sm font-medium text-purple-600 mb-2">
                    Store Manager Email
                  </label>
                  <input
                    type="email"
                    name="storeManagerEmail"
                    value={formData.storeManagerEmail}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Company@gmail.com"
                  />
                </div>
              )}
            </div>

            {/* Send Invitation Button */}
            {formData.createLogin && (
              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleSendInvitation}
                  className="w-full bg-purple-600 text-white py-3 px-4 rounded-md font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  Send Invitation
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-purple-600 bg-white border border-purple-300 rounded-md hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              Save Distributor
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddDistributorModal
