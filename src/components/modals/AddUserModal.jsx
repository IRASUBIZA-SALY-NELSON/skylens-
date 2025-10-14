import React, { useState, Fragment, useEffect } from 'react'
import { X, Upload, ChevronRight, User, BriefcaseBusiness, EyeOff, Eye, ChevronDown, Calendar } from 'lucide-react'
import { API_ENDPOINTS, apiCall, HTTP_METHODS } from '../../config/api'
import { Listbox } from '@headlessui/react'

const AddUserModal = ({ isOpen, onClose, onSuccess }) => {
  const [activeTab, setActiveTab] = useState('personal')
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: '',
    gender: '',
    nationality: '',
    dateOfBirth: '',
    role: 'SALES_MANAGER',
    password: '',
    confirmPassword: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingTenantId, setIsLoadingTenantId] = useState(false)
  const [error, setError] = useState('')
  const [profileImage, setProfileImage] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [currentTenantId, setCurrentTenantId] = useState(null)

  // Fetch current user's tenantId when modal opens
  useEffect(() => {
    if (isOpen && !currentTenantId) {
      fetchCurrentUserTenantId()
    }
  }, [isOpen, currentTenantId])

  // Reset tenantId when modal closes
  useEffect(() => {
    if (!isOpen) {
      setCurrentTenantId(null)
      setError('')
    }
  }, [isOpen])

  const fetchCurrentUserTenantId = async () => {
    setIsLoadingTenantId(true)
    setError('')
    
    try {
      console.log('🔍 Fetching current user tenantId from /api/users/me')
      const userData = await apiCall(API_ENDPOINTS.USER_ME, {
        method: HTTP_METHODS.GET
      })
      
      console.log('✅ Current user data:', userData)
      
      if (userData.tenantId) {
        setCurrentTenantId(userData.tenantId)
        console.log('✅ TenantId fetched:', userData.tenantId)
      } else {
        throw new Error('No tenantId found in user data')
      }
    } catch (error) {
      console.error('❌ Error fetching tenantId:', error)
      setError('Failed to load user information. Please refresh and try again.')
    } finally {
      setIsLoadingTenantId(false)
    }
  }

  const roles = [
    { id: 1, name: 'Sales Manager', value: 'SALES_MANAGER' },
    { id: 2, name: 'Warehouse Manager', value: 'WAREHOUSE_MANAGER' },
    { id: 3, name: 'Distributor', value: 'DISTRIBUTOR' },
    { id: 4, name: 'Accountant', value: 'ACCOUNTANT' },
  ]

  const [selectedRole, setSelectedRole] = useState(roles[0])

  const genders = [
    { id: 1, name: 'Male', value: 'MALE' },
    { id: 2, name: 'Female', value: 'FEMALE' },

  ]

  const nationalities = [
    { id: 1, name: 'Rwanda', value: 'RW' },
    { id: 2, name: 'China', value: 'CN' },
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for phone number
    if (name === 'mobileNumber') {
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
      [name]: value
    }));
  }

  const handleRoleChange = (roleValue) => {
    const role = roles.find(r => r.value === roleValue) || roles[0]
    setSelectedRole(role)
    setFormData(prev => ({
      ...prev,
      role: roleValue
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (!currentTenantId) {
      setError('Unable to determine tenant information. Please refresh and try again.')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      let response;
      
      // Try using /api/auth/register first (known to work)
      const nationalityDisplay = formData.nationality
        ? (nationalities.find(n => n.value === formData.nationality)?.name || formData.nationality)
        : null

      const registerData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        role: formData.role,
        gender: formData.gender,
        phone: formData.mobileNumber || undefined,
        nationality: nationalityDisplay || undefined,
        tenantId: currentTenantId, // Use the fetched tenantId
        birthDate: formData.dateOfBirth || null,
        imageUrl: ''
      }

      // Validate password length
      if (formData.password.length < 6) {
        throw new Error('Password must be at least 6 characters long')
      }

      console.log('Trying register endpoint with data:', registerData)
      console.log('Using tenantId from /api/users/me:', currentTenantId)

      // If there's an image, use FormData, otherwise use JSON
      if (profileImage) {
        const formDataWithImage = new FormData()
        
        // Append all form fields
        Object.keys(registerData).forEach(key => {
          if (registerData[key] !== undefined && registerData[key] !== null) {
            formDataWithImage.append(key, registerData[key])
          }
        })
        
        // Append the image file
        formDataWithImage.append('profileImage', profileImage)
        
        console.log('Sending request with image upload')
        response = await apiCall(API_ENDPOINTS.REGISTER, {
          method: HTTP_METHODS.POST,
          body: formDataWithImage,
          // Don't set Content-Type header - let browser set it with boundary for FormData
          headers: {}
        })
      } else {
        // No image, send as JSON
        console.log('Sending request without image')
        response = await apiCall(API_ENDPOINTS.REGISTER, {
          method: HTTP_METHODS.POST,
          body: JSON.stringify(registerData)
        })
      }
      
      console.log('Register endpoint success:', response)
      
      onSuccess(response)
      onClose()
    } catch (error) {
      console.error('Error adding user:', error)
      console.error('Error details:', {
        message: error.message,
        status: error.status,
        response: error.response
      })
      
      // More specific error message
      let errorMessage = error.message || 'Failed to add user. Please try again.'
      if (error.status === 500) {
        errorMessage = 'Server error: Please check the console for details and try again.'
      } else if (error.status === 400) {
        errorMessage = 'Invalid data: Please check all fields and try again.'
      } else if (error.status === 409) {
        errorMessage = 'User already exists with this email address.'
      }
      
      setError(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setProfileImage(file)
      // Create a preview URL for the image
      const fileReader = new FileReader()
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result)
      }
      fileReader.readAsDataURL(file)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-[1200px] mx-4 h-[815px] ">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-[20px] font-semibold text-[#16151C]">Add New User</h2>
            <div className='flex flex-row space-x-[3px] items-center justify-center'>
              <p className='className="text-sm text-[#16151C]' >All Users </p> <ChevronRight className='h-[20px] w-[25px]'/> <p className='className="text-sm text-[#16151C]'> Add New User</p>
              </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex px-6">
            <button
              onClick={() => setActiveTab('personal')}
              className={`py-4 px-1 border-b-[4px] font-semibold flex flex-row gap-[10px] justify-center items-center text-[16px] mr-8 ${
                activeTab === 'personal'
                  ? 'border-[#7152F3] text-[#7152F3]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <User className=''/> Personal Information
            </button>
            <button
              onClick={() => setActiveTab('professional')}
              className={`py-4 px-1 border-b-[4px] font-semibold flex flex-row gap-[10px] justify-center items-center text-[16px] mr-8 ${
                activeTab === 'professional'
                  ? 'border-[#7152F3] text-[#7152F3]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <BriefcaseBusiness/> Professional Information
            </button>
          </nav>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6">
            {/* Loading state for tenantId */}
            {isLoadingTenantId && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-600">Loading user information...</p>
              </div>
            )}
            
            {activeTab === 'personal' && (
              <div className="space-y-6 overflow-y-auto h-[500px]">
                {/* Profile Picture Upload */}
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <div className="w-[150px] h-[150px] rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                      {previewUrl ? (
                        <img 
                          src={previewUrl} 
                          alt="Profile preview" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Upload className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <label 
                      htmlFor="profile-upload"
                      className="absolute -bottom-1 -right-1 bg-[#7152F3] text-white rounded-full p-2 cursor-pointer hover:bg-purple-700 transition-colors"
                      title="Upload photo"
                    >
                      <Upload className="w-[20px] h-[20px]" />
                      <input 
                        id="profile-upload"
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                  <p className="mt-2 text-[14px] text-gray-500">
                    Click to upload a profile photo
                  </p>
                </div>

                {/* Personal Information Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-[10px] h-[56px] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="First Name"
                      autoComplete="given-name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-[10px] h-[56px] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Last Name"
                      autoComplete="family-name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address 
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-[10px] h-[56px] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Email Address"
                      autoComplete="email"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-purple-600 mb-2">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      name="mobileNumber"
                      value={formData.mobileNumber}
                      onChange={handleInputChange}
                      maxLength={14}
                      className="w-full px-3 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="+1234567890"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Format: + followed by up to 13 digits (e.g., +250700000000)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password 
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-[10px] h-[56px] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        style={{ top: '55%', transform: 'translateY(-50%)' }}
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password 
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 pr-10 border h-[56px] border-gray-300 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Confirm Password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        style={{ top: '55%', transform: 'translateY(-50%)' }}
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender
                    </label>
                    <Listbox value={formData.gender} onChange={(value) => handleInputChange({ target: { name: 'gender', value } })}>
                      <div className="relative">
                        <Listbox.Button className="relative w-full cursor-default rounded-[10px] bg-white py-3 pl-4 pr-10 text-left border border-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 h-[56px]">
                          <span className="block truncate text-gray-700">
                            {formData.gender ? genders.find(g => g.value === formData.gender)?.name || formData.gender : 'Select gender'}
                          </span>
                          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronDown className="h-5 w-5 text-gray-700" aria-hidden="true" />
                          </span>
                        </Listbox.Button>
                        <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none z-10">
                          {genders.map((gender) => (
                            <Listbox.Option
                              key={gender.id}
                              value={gender.value}
                              className={({ active, selected }) =>
                                `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                  active ? 'bg-purple-100 text-[#7152F3]' : 'text-gray-900'
                                } ${selected ? 'bg-purple-50' : ''}`
                              }
                            >
                              {({ selected }) => (
                                <>
                                  <span className={`block truncate ${selected ? 'font-medium text-[#7152F3]' : 'font-normal'}`}>
                                    {gender.name}
                                  </span>
                                  {selected && (
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#7152F3]">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    </span>
                                  )}
                                </>
                              )}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </div>
                    </Listbox>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nationality
                    </label>
                    <Listbox value={formData.nationality} onChange={(value) => handleInputChange({ target: { name: 'nationality', value } })}>
                      <div className="relative">
                        <Listbox.Button className="relative w-full cursor-default rounded-[10px] bg-white py-3 pl-4 pr-10 text-left border border-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 h-[56px]">
                          <span className="block truncate text-gray-700">
                            {formData.nationality ? nationalities.find(n => n.value === formData.nationality)?.name || formData.nationality : 'Select nationality'}
                          </span>
                          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronDown className="h-5 w-5 text-gray-700" aria-hidden="true" />
                          </span>
                        </Listbox.Button>
                        <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none z-10">
                          {nationalities.map((nationality) => (
                            <Listbox.Option
                              key={nationality.id}
                              value={nationality.value}
                              className={({ active, selected }) =>
                                `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                  active ? 'bg-purple-100 text-[#7152F3]' : 'text-gray-900'
                                } ${selected ? 'bg-purple-50' : ''}`
                              }
                            >
                              {({ selected }) => (
                                <>
                                  <span className={`block truncate ${selected ? 'font-medium text-[#7152F3]' : 'font-normal'}`}>
                                    {nationality.name}
                                  </span>
                                  {selected && (
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#7152F3]">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    </span>
                                  )}
                                </>
                              )}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </div>
                    </Listbox>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-[10px] h-[56px] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        max={new Date().toISOString().split('T')[0]}
                      />
                      {/* <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-gray-400" />
                      </div> */}
                    </div>
                  </div>

                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'professional' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select User Role
                  </label>
                  <Listbox value={selectedRole.value} onChange={handleRoleChange}>
                    <div className="relative">
                      <Listbox.Button className="relative w-full cursor-default rounded-[10px] bg-white py-3 pl-4 pr-10 text-left border border-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500">
                        <span className="block truncate text-gray-700">
                          {selectedRole.name}
                        </span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                          <ChevronDown className="h-5 w-5 text-gray-700" aria-hidden="true" />
                        </span>
                      </Listbox.Button>
                      <Listbox.Options className="absolute mt-1 max-h-[300px] w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none z-10">
                        {roles.map((role) => (
                          <Listbox.Option
                            key={role.id}
                            value={role.value}
                            className={({ active, selected }) =>
                              `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                active ? 'bg-purple-100 text-[#7152F3]' : 'text-gray-900'
                              } ${selected ? 'bg-purple-50' : ''}`
                            }
                          >
                            {({ selected }) => (
                              <>
                                <span className={`block truncate ${selected ? 'font-medium text-[#7152F3]' : 'font-normal'}`}>
                                  {role.name}
                                </span>
                                {selected && (
                                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#7152F3]">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-5 w-5"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </span>
                                )}
                              </>
                            )}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </div>
                  </Listbox>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-[20px] py-2 text-[16px] font-medium text-gray-700 bg-white border border-gray-300 rounded-[10px] hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#7152F3]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isLoadingTenantId || !currentTenantId || !selectedRole}
              className={`px-[20px] py-2 text-[16px] font-medium text-white border border-transparent rounded-[10px] h-[50px] focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors duration-200 ${
                isSubmitting || isLoadingTenantId || !currentTenantId || !selectedRole
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed hover:bg-gray-300'
                  : 'bg-[#7152F3] hover:bg-purple-700'
              }`}
            >
              {isSubmitting 
                ? 'Adding User...' 
                : isLoadingTenantId 
                  ? 'Loading...' 
                  : !currentTenantId 
                    ? 'Initializing...' 
                    : !selectedRole
                      ? 'Select a role'
                      : 'Add User'
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddUserModal
