import React, { useState, useEffect } from 'react';
import { X, Upload, ChevronRight, User, BriefcaseBusiness, EyeOff, Eye, ChevronDown, Calendar } from 'lucide-react';
import { API_ENDPOINTS, apiCall, HTTP_METHODS } from '../../config/api';
import { Listbox } from '@headlessui/react';

const EditAdminUserModal = ({ isOpen, onClose, user, onSuccess, context = 'admin' }) => {
  const [activeTab, setActiveTab] = useState('personal');
  const [userRole,setUserRole] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: '',
    gender: '',
    nationality: '',
    dateOfBirth: '',
    role: 'USER',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const roles = [
    { id: 1, name: 'Sales Manager', value: 'SALES_MANAGER' },
    { id: 2, name: 'Warehouse Manager', value: 'WAREHOUSE_MANAGER' },
    { id: 3, name: 'Distributor', value: 'DISTRIBUTOR' },
    { id: 4, name: 'Accountant', value: 'ACCOUNTANT' },
  ]

  const [selectedRole, setSelectedRole] = useState(roles[0]);

  const genders = [
    { id: 1, name: 'Male', value: 'MALE' },
    { id: 2, name: 'Female', value: 'FEMALE' },
  ];

  const nationalities = [
    { id: 1, name: 'Rwanda', value: 'RW' },
    { id: 2, name: 'China', value: 'CN' },
  ];

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        mobileNumber: user.mobileNumber || '',
        gender: user.gender || '',
        nationality: user.nationality || '',
        dateOfBirth: user.dateOfBirth || '',
        role: user.role || 'USER',
      });
      setUserRole(user.role);
      
      // Set selected role
      const role = roles.find(r => r.value === user.role) || roles[0];
      setSelectedRole(role);
      
      // Set profile image preview if exists
      if (user.profileImageUrl) {
        setPreviewUrl(user.profileImageUrl);
      }
    }
  }, [user]);

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
  };

  const handleRoleChange = (roleValue) => {
    const role = roles.find(r => r.value === roleValue) || roles[0];
    setSelectedRole(role);
    setFormData(prev => ({
      ...prev,
      role: roleValue
    }));
  };

  console.log("user : ", user)

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Prepare user data according to API structure
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        role: formData.role,
        gender: formData.gender,
        nationality: formData.nationality,
        phone: formData.mobileNumber,
        birthDate: formData.dateOfBirth || null,
        // Add required fields for the API
        firstname: formData.firstName,
        lastname: formData.lastName,
        username: formData.email,
        userStatus: "ACTIVE",
        enabled: true,
        accountNonExpired: true,
        accountNonLocked: true,
        credentialsNonExpired: true,
        imageUrl: user.profileImageUrl || "",
        activities: user.activities || []
      };
      
      console.log('Updating user with data:', userData);

      const response = await apiCall(API_ENDPOINTS.USER_BY_ID(user.id), {
        method: HTTP_METHODS.PUT,
        body: JSON.stringify(userData),
      });
      
      onSuccess(response);
      onClose();
    } catch (error) {
      console.error('Error updating user:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.status,
        response: error.response
      });
      
      // More specific error message
      let errorMessage = error.message || 'Failed to update user. Please try again.';
      if (error.status === 500) {
        errorMessage = 'Server error: Please check the console for details and try again.';
      } else if (error.status === 400) {
        errorMessage = 'Invalid data: Please check all fields and try again.';
      } else if (error.status === 404) {
        errorMessage = 'User not found.';
      }
      
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      // Create a preview URL for the image
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const getHeaderContent = () => {
    if (context === 'profile') {
      return (
        <div>
          <h2 className="text-[20px] font-semibold text-[#16151C]">Edit Profile</h2>
          <div className='flex flex-row space-x-[3px] items-center justify-center'>
            <p className="text-sm text-[#16151C]">My Profile</p>
            <ChevronRight className='h-[20px] w-[25px]'/> 
            <p className="text-sm text-[#16151C]">Edit Profile</p>
          </div>
        </div>
      );
    }
    // Default admin context
    return (
      <div>
        <h2 className="text-[20px] font-semibold text-[#16151C]">Edit User</h2>
        <div className='flex flex-row space-x-[3px] items-center justify-center'>
          <p className="text-sm text-[#16151C]">All Users</p> 
          <ChevronRight className='h-[20px] w-[25px]'/> 
          <p className="text-sm text-[#16151C]">Edit User</p>
        </div>
      </div>
    );
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-[1200px] mx-4 h-[815px]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          {getHeaderContent()}
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
              type="button"
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
                type="button"
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
                        <div className="w-full h-full bg-purple-600 flex items-center justify-center text-white text-4xl font-semibold">
                          {user.firstName?.charAt(0).toUpperCase()}{user.lastName?.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <label 
                      htmlFor="profile-upload"
                      className="absolute -bottom-1 -right-1 bg-[#7152F3] text-white rounded-full p-2 cursor-pointer hover:bg-purple-700 transition-colors"
                    >
                      <Upload className="w-5 h-5" />
                      <input
                        id="profile-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                </div>

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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7152F3] focus:border-transparent"
                      required
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7152F3] focus:border-transparent"
                      required
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7152F3] focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="mb-4">
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
                      Gender
                    </label>
                    <Listbox value={formData.gender} onChange={(value) => {
                      setFormData(prev => ({
                        ...prev,
                        gender: value
                      }));
                    }}>
                      <div className="relative">
                        <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-2 pl-3 pr-10 text-left border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#7152F3] focus:border-transparent sm:text-sm">
                          <span className="block truncate">
                            {genders.find(g => g.value === formData.gender)?.name || 'Select Gender'}
                          </span>
                          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
                          </span>
                        </Listbox.Button>
                        <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                          {genders.map((gender) => (
                            <Listbox.Option
                              key={gender.id}
                              value={gender.value}
                              className={({ active }) =>
                                `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                  active ? 'bg-[#7152F3] text-white' : 'text-gray-900'
                                }`
                              }
                            >
                              {({ selected, active }) => (
                                <>
                                  <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                    {gender.name}
                                  </span>
                                  {selected ? (
                                    <span className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                      active ? 'text-white' : 'text-[#7152F3]'
                                    }`}>
                                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                      </svg>
                                    </span>
                                  ) : null}
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
                    <Listbox value={formData.nationality} onChange={(value) => {
                      setFormData(prev => ({
                        ...prev,
                        nationality: value
                      }));
                    }}>
                      <div className="relative">
                        <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-2 pl-3 pr-10 text-left border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#7152F3] focus:border-transparent sm:text-sm">
                          <span className="block truncate">
                            {nationalities.find(n => n.value === formData.nationality)?.name || 'Select Nationality'}
                          </span>
                          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
                          </span>
                        </Listbox.Button>
                        <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                          {nationalities.map((country) => (
                            <Listbox.Option
                              key={country.id}
                              value={country.value}
                              className={({ active }) =>
                                `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                  active ? 'bg-[#7152F3] text-white' : 'text-gray-900'
                                }`
                              }
                            >
                              {({ selected, active }) => (
                                <>
                                  <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                    {country.name}
                                  </span>
                                  {selected ? (
                                    <span className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                      active ? 'text-white' : 'text-[#7152F3]'
                                    }`}>
                                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                      </svg>
                                    </span>
                                  ) : null}
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7152F3] focus:border-transparent"
                      />
                      {/* <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" /> */}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'professional' && (
              <div className="space-y-6 overflow-y-auto h-[500px]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role
                    </label>
                    <Listbox value={selectedRole} onChange={(role) => handleRoleChange(role.value)}>
                      <div className="relative">
                        <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-2 pl-3 pr-10 text-left border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#7152F3] focus:border-transparent sm:text-sm">
                          <span className="block truncate">{selectedRole?.name}</span>
                          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
                          </span>
                        </Listbox.Button>
                        <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                          {roles.map((role) => (
                            <Listbox.Option
                              key={role.id}
                              className={({ active }) =>
                                `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                  active ? 'bg-[#7152F3] text-white' : 'text-gray-900'
                                }`
                              }
                              value={role}
                            >
                              {({ selected }) => (
                                <>
                                  <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                    {role.name}
                                  </span>
                                  {selected ? (
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white">
                                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                      </svg>
                                    </span>
                                  ) : null}
                                </>
                              )}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </div>
                    </Listbox>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end p-6 border-t border-gray-200">
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7152F3]"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#7152F3] hover:bg-[#5a3fd9] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7152F3]"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAdminUserModal;
