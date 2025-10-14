import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, BriefcaseBusiness, Mail, ChevronRight, ArrowLeft, Edit, Building2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import EditUserModal from '../components/modals/EditUserModal';
import { apiCall, API_ENDPOINTS } from '../config/api';

// Import generic layout only
import Layout from '../components/Layout';

// Skeleton Loader Component
const SkeletonLoader = () => (
  <div className="animate-pulse space-y-6">
    {/* Profile Header Skeleton */}
    <div className='flex flex-row items-center justify-between p-6'>
      <div className='flex flex-row items-start gap-6'>
        <div className="w-[150px] h-[150px] rounded-[10px] bg-gray-200"></div>
        <div className='flex flex-col gap-4 mt 2'>
          <div className="h-6 w-48 bg-gray-200 rounded"></div>
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
          <div className="h-4 w-40 bg-gray-200 rounded"></div>
        </div>
      </div>
      <div className="w-32 h-10 bg-gray-200 rounded-[10px]"></div>
    </div>

    {/* Tabs Skeleton */}
    <div className="border-b border-gray-200 px-6">
      <div className="flex gap-8">
        <div className="h-12 w-48 bg-gray-200 rounded-t"></div>
        <div className="h-12 w-48 bg-gray-200 rounded-t"></div>
      </div>
    </div>

    {/* Content Skeleton */}
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
            <div className="h-12 w-full bg-gray-100 rounded-[10px]"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const ProfileContent = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [showEditModal, setShowEditModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getRoleDisplayName = (role) => {
    const roleMap = {
      'ADMIN': 'Administrator',
      'MANAGER': 'Manager',
      'SALES_MANAGER': 'Sales Manager',
      'STORE_MANAGER': 'Store Manager',
      'WAREHOUSE_MANAGER': 'Warehouse Manager',
      'SALES_ASSISTANT': 'Sales Assistant',
      'ACCOUNTANT': 'Accountant',
      'DISTRIBUTOR': 'Distributor',
      'RETAILER': 'Retailer',
      'SUPER_ADMIN': 'Super Admin',
      'MANAGING_DIRECTOR': 'Managing Director'
    };
    return roleMap[role] || role;
  };

  const formatPhoneNumber = (phone) => {
    if (!phone) return '-';
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  };

  const handleUpdateSuccess = (updatedUser) => {
    updateUser(updatedUser);
    setShowEditModal(false);
  };

  const fetchUserData = async () => {
    try {
      const raw = await apiCall(API_ENDPOINTS.USER_ME, { method: 'GET' });

      // Normalize to fields the UI expects
      const normalized = {
        id: raw?.id,
        role: raw?.role,
        email: raw?.email,
        firstName: raw?.firstName,
        lastName: raw?.lastName,
        name: [raw?.firstName, raw?.lastName].filter(Boolean).join(' ') || raw?.username || raw?.email?.split('@')[0] || '-',
        phoneNumber: raw?.phoneNumber || raw?.phone,
        gender: raw?.gender || raw?.sex,
        nationality: raw?.nationality || raw?.country,
        dateOfBirth: raw?.birthDate || raw?.dateOfBirth || null,
        department: raw?.department || null,
        joinDate: raw?.joinDate || raw?.createdAt || null,
        status: raw?.userStatus || raw?.status || 'ACTIVE',
        tenantId: raw?.tenantId || raw?.tenantID,
        profileImageUrl: raw?.imageUrl || raw?.avatarUrl || null,
      };

      updateUser(normalized);

      if (normalized.tenantId) {
        await fetchTenantData(normalized.tenantId, normalized);
      }
    } catch (_) {
      // Swallow logs per global logging gate; keep UI stable
    }
  };

  const fetchTenantData = async (tenantId, baseUser) => {
    try {
      const tenantData = await apiCall(API_ENDPOINTS.TENANT_BY_ID(tenantId), { method: 'GET' });
      updateUser({ ...(baseUser || user), tenant: tenantData });
    } catch (_) {
      // no-op
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []); // Empty dependency array - only run once on mount

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg w-full h-full overflow-y-auto">
        <SkeletonLoader />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="bg-white rounded-lg w-full h-full overflow-y-auto">


      {/* Profile Header */}
      <div className='flex flex-row items-center justify-between'>
        <div className='flex flex-row items-start gap-6 p-6'>
          <div className="relative">
            <div className="w-[150px] h-[150px] rounded-[10px] bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
              {user.profileImageUrl ? (
                <img
                  src={user.profileImageUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-purple-100 flex items-center justify-center">
                  <span className="text-4xl font-semibold text-[#7152F3]">
                    {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className='flex flex-col gap-2'>
            <p className='text-[24px] font-bold text-[#16151C]'>{user.name || '-'}</p>
            <p className='flex flex-row items-center gap-2 text-[16px] text-[#16151C]'>
              <BriefcaseBusiness size={18} /> {getRoleDisplayName(user.role)}
            </p>
            <p className='flex flex-row items-center gap-2 text-[16px] text-[#16151C]'>
              <Mail size={18} /> {user.email || '-'}
            </p>
          </div>

        </div>
        <button
          onClick={() => setShowEditModal(true)}
          className="flex items-center space-x-2 px-[20px] py-[12px] bg-[#7152F3] text-white rounded-[10px] hover:bg-[#5E43D8] transition-colors"
        >
          <Edit size={16} />
          <span>Edit Profile</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex px-6">
          <button
            onClick={() => setActiveTab('personal')}
            className={`py-4 px-1 border-b-[4px] font-semibold flex flex-row gap-2 justify-center items-center text-[16px] mr-8 ${activeTab === 'personal'
              ? 'border-[#7152F3] text-[#7152F3]'
              : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
          >
            <User size={18} /> Personal Information
          </button>
          <button
            onClick={() => setActiveTab('professional')}
            className={`py-4 px-1 border-b-[4px] font-semibold flex flex-row gap-2 justify-center items-center text-[16px] mr-8 ${activeTab === 'professional'
              ? 'border-[#7152F3] text-[#7152F3]'
              : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
          >
            <BriefcaseBusiness size={18} /> Professional Information
          </button>
          <button
            onClick={() => setActiveTab('company')}
            className={`py-4 px-1 border-b-[4px] font-semibold flex flex-row gap-2 justify-center items-center text-[16px] mr-8 ${activeTab === 'company'
              ? 'border-[#7152F3] text-[#7152F3]'
              : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
          >
            <Building2 size={18} /> Company Information
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'personal' ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  Full Name
                </label>
                <div className="px-3 py-2 bg-gray-50 rounded-[10px] h-[56px] flex items-center">
                  <p className="text-gray-900">{user.name || '-'}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  Email Address
                </label>
                <div className="px-3 py-2 bg-gray-50 rounded-[10px] h-[56px] flex items-center">
                  <p className="text-gray-900">{user.email || '-'}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  Phone Number
                </label>
                <div className="px-3 py-2 bg-gray-50 rounded-[10px] h-[56px] flex items-center">
                  <p className="text-gray-900">
                    {user.mobileCountryCode ? `${user.mobileCountryCode} ` : ''}
                    {formatPhoneNumber(user.phoneNumber) || '-'}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  Date of Birth
                </label>
                <div className="px-3 py-2 bg-gray-50 rounded-[10px] h-[56px] flex items-center">
                  <p className="text-gray-900">{formatDate(user.dateOfBirth) || '-'}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  Gender
                </label>
                <div className="px-3 py-2 bg-gray-50 rounded-[10px] h-[56px] flex items-center">
                  <p className="text-gray-900 capitalize">
                    {user.gender ? user.gender.toLowerCase() : '-'}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  Nationality
                </label>
                <div className="px-3 py-2 bg-gray-50 rounded-[10px] h-[56px] flex items-center">
                  <p className="text-gray-900">{user.nationality || '-'}</p>
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === 'professional' ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  Role
                </label>
                <div className="px-3 py-2 bg-gray-50 rounded-[10px] h-[56px] flex items-center">
                  <p className="text-gray-900">{getRoleDisplayName(user.role) || '-'}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  Department
                </label>
                <div className="px-3 py-2 bg-gray-50 rounded-[10px] h-[56px] flex items-center">
                  <p className="text-gray-900">
                    {user.department || '-'}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  Join Date
                </label>
                <div className="px-3 py-2 bg-gray-50 rounded-[10px] h-[56px] flex items-center">
                  <p className="text-gray-900">
                    {formatDate(user.joinDate) || '-'}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  Status
                </label>
                <div className="px-3 py-2 bg-gray-50 rounded-[10px] h-[56px] flex items-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.status === 'ACTIVE'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                    }`}>
                    {user.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  Company Name
                </label>
                <div className="px-3 py-2 bg-gray-50 rounded-[10px] h-[56px] flex items-center">
                  <p className="text-gray-900">{user.tenant?.name || '-'}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  Company Email
                </label>
                <div className="px-3 py-2 bg-gray-50 rounded-[10px] h-[56px] flex items-center">
                  <p className="text-gray-900">{user.tenant?.email || '-'}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  Company Phone Number
                </label>
                <div className="px-3 py-2 bg-gray-50 rounded-[10px] h-[56px] flex items-center">
                  <p className="text-gray-900">
                    {user.tenant?.mobileCountryCode ? `${user.tenant?.mobileCountryCode} ` : ''}
                    {formatPhoneNumber(user.tenant?.phoneNumber) || '-'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit User Modal */}
      {showEditModal && (
        <EditUserModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          user={user}
          onSuccess={handleUpdateSuccess}
          context="profile"
        />
      )}
    </div>
  );
};

// Role to layout mapping
const getLayoutComponent = (role) => {
  // Always use the generic Layout to avoid importing missing role-based layouts
  return Layout;
};

const Profile = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  const LayoutComponent = getLayoutComponent(user.role);

  return (
    <LayoutComponent>
      <ProfileContent />
    </LayoutComponent>
  );
};

export default Profile;
