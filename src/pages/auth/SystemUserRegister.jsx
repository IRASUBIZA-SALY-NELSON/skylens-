import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Users, Building2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { API_ENDPOINTS, apiCall, HTTP_METHODS } from '../../config/api'

const SystemUserRegister = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'USER',
    gender: '',
    tenant: {}
  })
  
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [tenants, setTenants] = useState([])
  const [selectedTenantId, setSelectedTenantId] = useState('')

  // Available user roles
  const userRoles = [
    { value: 'USER', label: 'User' },
    { value: 'DISTRIBUTOR', label: 'Distributor' },
    { value: 'SALES_MANAGER', label: 'Sales Manager' },
    { value: 'STORE_MANAGER', label: 'Store Manager' },
    { value: 'WAREHOUSE_MANAGER', label: 'Warehouse Manager' },
    { value: 'ACCOUNTANT', label: 'Accountant' },
    { value: 'SALES_ASSISTANT', label: 'Sales Assistant' }
  ]

  const genderOptions = [
    { value: 'MALE', label: 'Male' },
    { value: 'FEMALE', label: 'Female' },
    { value: 'OTHER', label: 'Other' }
  ]

  // Check if user is authenticated as tenant admin
  useEffect(() => {
    const token = localStorage.getItem('authToken')
    const userRole = localStorage.getItem('userRole')
    
    if (!token || userRole !== 'TENANT_ADMIN') {
      toast.error('You must be logged in as a tenant admin to register users')
      navigate('/auth/login')
      return
    }

    // Load tenant information from localStorage or API
    const tenantData = localStorage.getItem('tenantData')
    if (tenantData) {
      const tenant = JSON.parse(tenantData)
      setFormData(prev => ({
        ...prev,
        tenant: {
          id: tenant.id,
          companyName: tenant.companyName,
          companyCode: tenant.companyCode
        }
      }))
      setSelectedTenantId(tenant.id)
    }
  }, [navigate])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleTenantChange = (e) => {
    const tenantId = e.target.value
    setSelectedTenantId(tenantId)
    
    // Update tenant object in form data
    const selectedTenant = tenants.find(t => t.id === tenantId)
    if (selectedTenant) {
      setFormData(prev => ({
        ...prev,
        tenant: {
          id: selectedTenant.id,
          companyName: selectedTenant.companyName,
          companyCode: selectedTenant.companyCode
        }
      }))
    }
  }

  const validateForm = () => {
    const required = ['firstName', 'lastName', 'email', 'password', 'role', 'gender']
    const isValid = required.every(field => formData[field] && formData[field].trim() !== '')
    
    if (!isValid) return false
    if (!formData.tenant || !formData.tenant.id) return false
    
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('🚀 SYSTEM USER REGISTRATION STARTED')
    console.log('📝 Form Data:', formData)
    
    if (!validateForm()) {
      toast.error('Please fill in all required fields')
      return
    }

    if (formData.password.trim() !== formData.confirmPassword.trim()) {
      toast.error('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      const apiData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        role: formData.role,
        gender: formData.gender,
        tenant: formData.tenant
      }
      
      console.log('📤 Sending API Data:', apiData)
      
      const response = await fetch(API_ENDPOINTS.REGISTER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(apiData)
      })

      if (response.ok) {
        const result = await response.json()
        console.log('✅ Registration Success:', result)
        toast.success(`User registered successfully with role: ${formData.role}`)
        
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: '',
          role: 'USER',
          gender: '',
          tenant: formData.tenant // Keep tenant info
        })
      } else {
        const errorText = await response.text()
        console.log('❌ Error Response:', errorText)
        let errorMessage = 'Registration failed'
        try {
          const error = JSON.parse(errorText)
          console.log('📄 Parsed Error:', error)
          errorMessage = error.message || error.error || errorMessage
        } catch {
          errorMessage = errorText || errorMessage
        }
        console.log('🚨 Final Error:', errorMessage)
        toast.error(errorMessage)
      }
    } catch (error) {
      console.error('Network Error:', error)
      toast.error('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const renderForm = () => (
    <div className="space-y-4">
      {/* User Information */}
      <div className="grid grid-cols-2 gap-4">
        <input
          name="firstName"
          type="text"
          required
          autoComplete="given-name"
          className="appearance-none relative block w-full px-3 py-3 border border-purple-300 rounded-lg focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
          placeholder="First Name *"
          value={formData.firstName}
          onChange={handleInputChange}
        />

        <input
          name="lastName"
          type="text"
          required
          autoComplete="family-name"
          className="appearance-none relative block w-full px-3 py-3 border border-purple-300 rounded-lg focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
          placeholder="Last Name *"
          value={formData.lastName}
          onChange={handleInputChange}
        />
      </div>

      {/* Email */}
      <div>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className="appearance-none relative block w-full px-3 py-3 border border-purple-300 rounded-lg focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
          placeholder="Email Address *"
          value={formData.email}
          onChange={handleInputChange}
        />
      </div>

      {/* Role Selection */}
      <div>
        <select
          name="role"
          required
          className="appearance-none relative block w-full px-3 py-3 border border-purple-300 rounded-lg focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
          value={formData.role}
          onChange={handleInputChange}
        >
          <option value="">Select Role *</option>
          {userRoles.map(role => (
            <option key={role.value} value={role.value}>{role.label}</option>
          ))}
        </select>
      </div>

      {/* Gender */}
      <div>
        <select
          name="gender"
          required
          className="appearance-none relative block w-full px-3 py-3 border border-purple-300 rounded-lg focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
          value={formData.gender}
          onChange={handleInputChange}
        >
          <option value="">Select Gender *</option>
          {genderOptions.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>

      {/* Tenant Information Display */}
      {formData.tenant && formData.tenant.companyName && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center">
            <Building2 className="h-5 w-5 text-purple-600 mr-2" />
            <div>
              <p className="text-sm font-medium text-purple-900">
                Tenant: {formData.tenant.companyName}
              </p>
              <p className="text-xs text-purple-600">
                Code: {formData.tenant.companyCode}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Password */}
      <div className="relative">
        <input
          name="password"
          type={showPassword ? 'text' : 'password'}
          required
          autoComplete="new-password"
          className="appearance-none relative block w-full px-3 py-3 pr-10 border border-purple-300 rounded-lg focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
          placeholder="Password *"
          value={formData.password}
          onChange={handleInputChange}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
        </button>
      </div>

      {/* Confirm Password */}
      <div className="relative">
        <input
          name="confirmPassword"
          type={showConfirmPassword ? 'text' : 'password'}
          required
          autoComplete="new-password"
          className="appearance-none relative block w-full px-3 py-3 pr-10 border border-purple-300 rounded-lg focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
          placeholder="Confirm Password *"
          value={formData.confirmPassword}
          onChange={handleInputChange}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
        >
          {showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo */}
        <div className="text-center flex items-center justify-center">
          <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xl">GGM</span>
          </div>
          <h2 className="ml-3 text-3xl font-bold text-gray-900">GGM</h2>
        </div>

        {/* Title */}
        <div className="text-center">
          <Users className="mx-auto h-12 w-12 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-900">Register System User</h2>
          <p className="mt-2 text-gray-600">Add new users to your organization</p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {renderForm()}

          {/* Submit */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 text-sm font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
            >
              {loading ? 'Registering User...' : 'Register User'}
            </button>
          </div>

          {/* Navigation Links */}
          <div className="text-center space-y-2">
            <div>
              <Link to="/admin/dashboard" className="font-medium text-purple-600 hover:text-purple-500">
                ← Back to Dashboard
              </Link>
            </div>
            <div>
              <span className="text-gray-600">Need to register a tenant? </span>
              <Link to="/auth/tenant-register" className="font-medium text-purple-600 hover:text-purple-500">
                Tenant Registration
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SystemUserRegister
