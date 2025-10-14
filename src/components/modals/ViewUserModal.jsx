import React, { useState, Fragment } from 'react';
import { X, User, BriefcaseBusiness, ChevronRight, ChevronDown, MailCheck, Mail } from 'lucide-react';
import { Listbox } from '@headlessui/react';
import { API_ENDPOINTS, apiCall, HTTP_METHODS } from '../../config/api';

const ViewUserModal = ({ isOpen, onClose, user, onEdit }) => {
  const [activeTab, setActiveTab] = useState('personal');
  const [selectedLock, setSelectedLock] = useState(user?.enabled === false ? 'locked' : 'unlocked');
  const [isUpdatingLock, setIsUpdatingLock] = useState(false);

  if (!isOpen || !user) return null;

  // Format date of birth for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getRoleDisplayName = (role) => {
    const roleMap = {
      'ADMIN': 'Administrator',
      'MANAGER': 'Manager',
      'SALES_MANAGER': 'Sales Manager',
      'STORE_MANAGER': 'Store Manager',
      'ACCOUNTANT': 'Accountant',
      'DISTRIBUTOR': 'Distributor',
      'USER': 'User',
      'TENANT': 'Tenant'
    }
    return roleMap[role] || role
  }

  // Format phone number for display
  const formatPhoneNumber = (phone) => {
    if (!phone) return 'N/A';
    // Simple formatting - you might want to enhance this based on your needs
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  };

  const handleUpdateLock = async () => {
    try {
      setIsUpdatingLock(true);
      const newEnabled = selectedLock === 'unlocked';
      const updated = await apiCall(API_ENDPOINTS.USER_BY_ID(user.id), {
        method: HTTP_METHODS.PUT,
        body: JSON.stringify({ enabled: newEnabled })
      });
      const effectiveEnabled = typeof updated?.enabled === 'boolean' ? updated.enabled : newEnabled;
      setSelectedLock(effectiveEnabled ? 'unlocked' : 'locked');
      console.log('✅ Account lock status updated', { enabled: effectiveEnabled });
    } catch (e) {
      console.error('❌ Failed to update account lock status', e);
    } finally {
      setIsUpdatingLock(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-[1200px] mx-4 h-[815px] ">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-[20px] font-semibold text-[#16151C]">{(user.firstName || user.firstname || '')} {(user.lastName || user.lastname || '')} </h2>
            <div className='flex flex-row space-x-[3px] items-center justify-center'>
              <p className="text-sm text-[#16151C]">All Users</p>
              <ChevronRight className='h-[20px] w-[25px]' />
              <p className="text-sm text-[#16151C]">{(user.firstName || user.firstname || '')} {(user.lastName || user.lastname || '')}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className='flex flex-row items-start gap-[20px] justify-start p-[20px]'>
          <div className="relative">
            <div className="w-[150px] h-[150px] rounded-[10px] bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
              {(user.imageUrl || user.profileImageUrl) ? (
                <img
                  src={(user.imageUrl || user.profileImageUrl)}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-purple-100 flex items-center justify-center">
                  <span className="text-4xl font-semibold text-[#7152F3]">
                    {(user.firstName || user.firstname || user.email || 'U')?.[0]?.toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className='flex flex-col gap-[10px]'>
            <p className='text-[24px] font-bold text-[#16151C]'>{(user.firstName || user.firstname || '')} {(user.lastName || user.lastname || '')}</p>
            <p className='flex flex-row items-center gap-[10px] text-[16px] text-[#16151C]'><BriefcaseBusiness /> {getRoleDisplayName(user.role)}</p>
            <p className='flex flex-row items-center gap-[10px] text-[16px] text-[#16151C]'><Mail /> {user.email}</p>
          </div>
        </div>
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex px-6">
            <button
              onClick={() => setActiveTab('personal')}
              className={`py-4 px-1 border-b-[4px] font-semibold flex flex-row gap-[10px] justify-center items-center text-[16px] mr-8 ${activeTab === 'personal'
                ? 'border-[#7152F3] text-[#7152F3]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
            >
              <User className='' /> Personal Information
            </button>
            <button
              onClick={() => setActiveTab('professional')}
              className={`py-4 px-1 border-b-[4px] font-semibold flex flex-row gap-[10px] justify-center items-center text-[16px] mr-8 ${activeTab === 'professional'
                ? 'border-[#7152F3] text-[#7152F3]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
            >
              <BriefcaseBusiness /> Professional Information
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'personal' && (
            <div className="space-y-6 overflow-y-auto h-[300px]">
              {/* Profile Picture */}
              <div className="flex flex-col items-center">

              </div>

              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    First Name
                  </label>
                  <div className="px-3 py-2 bg-gray-50 rounded-[10px] h-[56px] flex items-center">
                    <p className="text-gray-900">{(user.firstName || user.firstname || 'N/A')}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Last Name
                  </label>
                  <div className="px-3 py-2 bg-gray-50 rounded-[10px] h-[56px] flex items-center">
                    <p className="text-gray-900">{(user.lastName || user.lastname || 'N/A')}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Phone
                  </label>
                  <div className="px-3 py-2 bg-gray-50 rounded-[10px] h-[56px] flex items-center">
                    <p className="text-gray-900">{user.phone || 'N/A'}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Email Address
                  </label>
                  <div className="px-3 py-2 bg-gray-50 rounded-[10px] h-[56px] flex items-center">
                    <p className="text-gray-900">{user.email || 'N/A'}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Gender
                  </label>
                  <div className="px-3 py-2 bg-gray-50 rounded-[10px] h-[56px] flex items-center">
                    <p className="text-gray-900 capitalize">
                      {(user.gender || '').toLowerCase()}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Nationality
                  </label>
                  <div className="px-3 py-2 bg-gray-50 rounded-[10px] h-[56px] flex items-center">
                    <p className="text-gray-900">{user.nationality || 'N/A'}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Date of Birth
                  </label>
                  <div className="px-3 py-2 bg-gray-50 rounded-[10px] h-[56px] flex items-center">
                    <p className="text-gray-900">{formatDate(user.birthDate || user.dateOfBirth)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'professional' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Role
                  </label>
                  <div className="px-3 py-2 bg-gray-50 rounded-[10px] h-[56px] flex items-center">
                    <p className="text-gray-900">{getRoleDisplayName(user.role) || 'N/A'}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Status
                  </label>
                  <div className="px-3 py-2">
                    {(() => {
                      const isActive = (user.enabled === true) || ((user.userStatus || '').toUpperCase() === 'ACTIVE');
                      const statusLabel = isActive ? 'Active' : 'Inactive';
                      const cls = isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
                      return (
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${cls}`}>
                          {statusLabel}
                        </span>
                      );
                    })()}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">Username</label>
                  <div className="px-3 py-2 bg-gray-50 rounded-[10px] h-[56px] flex items-center">
                    <p className="text-gray-900">{user.username || user.email || 'N/A'}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">User ID</label>
                  <div className="px-3 py-2 bg-gray-50 rounded-[10px] h-[56px] flex items-center">
                    <p className="text-gray-900">{user.id ?? 'N/A'}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Date Joined
                  </label>
                  <div className="px-3 py-2 bg-gray-50 rounded-[10px] h-[56px] flex items-center">
                    <p className="text-gray-900">{formatDate(user.createdAt)}</p>
                  </div>
                </div>
              </div>

              {/* Account Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">Account Non Expired</label>
                  <div className="px-3 py-2 bg-gray-50 rounded-[10px] h-[56px] flex items-center">
                    <p className="text-gray-900">{String(user.accountNonExpired ?? 'N/A')}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">Account Lock</label>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Listbox value={selectedLock} onChange={setSelectedLock}>
                        {({ open }) => (
                          <div className="relative">
                            <Listbox.Button className="flex items-center justify-between min-w-[180px] border border-gray-300 h-[40px] px-3 rounded-md">
                              <span className="text-sm text-[#16151C] capitalize">{selectedLock}</span>
                              <ChevronDown className={`h-4 w-4 text-gray-600 ${open ? 'transform rotate-180' : ''}`} />
                            </Listbox.Button>
                            <Listbox.Options className="absolute z-10 w-full mt-1 bg-white shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none">
                              {['locked', 'unlocked'].map((opt) => (
                                <Listbox.Option
                                  key={opt}
                                  value={opt}
                                  className={({ active }) => `${active ? 'bg-purple-100 text-purple-900' : 'text-gray-900'} cursor-pointer select-none py-2 pl-3 pr-9`}
                                >
                                  <span className="block truncate capitalize">{opt}</span>
                                </Listbox.Option>
                              ))}
                            </Listbox.Options>
                          </div>
                        )}
                      </Listbox>
                    </div>
                    <button
                      type="button"
                      onClick={handleUpdateLock}
                      disabled={isUpdatingLock}
                      className={`px-4 py-2 text-sm font-medium text-white rounded-md ${isUpdatingLock ? 'bg-gray-400' : 'bg-[#7152F3] hover:bg-purple-700'}`}
                    >
                      {isUpdatingLock ? 'Updating...' : 'Change Status'}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Current: {selectedLock === 'unlocked' ? 'Unlocked' : 'Locked'}</p>
                </div>
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
            Close
          </button>
          <button
            type="button"
            onClick={onEdit}
            className="px-[20px] py-2 text-[16px] font-medium text-white bg-[#7152F3] h-[50px] border border-transparent rounded-[10px] hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            Edit User
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewUserModal;
