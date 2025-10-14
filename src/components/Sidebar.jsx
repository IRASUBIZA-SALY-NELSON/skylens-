import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext';
import { 
  Home, 
  Users, 
  Database, 
  BarChart3, 
  Settings, 
  FileText,
  Package,
  Activity,
  LogOut
} from 'lucide-react'

const Sidebar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: Home },
    { name: 'User Management', href: '/admin/user-management', icon: Users },
    { name: 'Activity Logs', href: '/admin/activity-logs', icon: Activity },
    { name: 'Reports', href: '/admin/reports', icon: FileText },
    // { name: 'Distributors', href: '/admin/distributors', icon: Package },
    // { name: 'Settings', href: '/admin/settings', icon: Settings },
  ]

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  return (
    <div className="bg-white w-[300px] pl-[25px] ">
      <div className="flex items-center h-16 px-6  mt-[50px]">
      <div className="flex justify-center items-center mb-8">
                <img src="/logo-label.png" alt="GGM Logo" className="h-12" />
              </div>
      </div>
      
      <nav className="mt-8">
        <div className="px-4 space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 h-[50px] w-[220px] leading-[24px] text-[16px]  rounded-r-[10px]  transition-colors ${
                  isActive
                    ? 'bg-[rgba(113,82,243,0.05)]  text-[#7152F3] border-l-4 font-semibold border-[#7152F3]'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Logout */}
      <div className="absolute bottom-0 w-[220px] p-4">
        <button 
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 h-[50px] text-[16px] text-gray-600 rounded-r-[10px] hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  )
}

export default Sidebar
