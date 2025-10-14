import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const RoleBasedRedirect = () => {
  const { user } = useAuth()

  if (!user || !user.role) {
    return <Navigate to="/auth/login" replace />
  }

  const roleRoutes = {
    'SUPER_ADMIN': '/super-admin/dashboard',
    'MANAGING_DIRECTOR': '/managing-director/dashboard',
    'ADMIN': '/admin/dashboard',
    'MANAGER': '/warehouse-manager/dashboard',
    'WAREHOUSE_MANAGER': '/warehouse-manager/dashboard',
    'SALES_MANAGER': '/sales-manager/dashboard',
    'SALES_ASSISTANT': '/sales-assistant/dashboard',
    'ACCOUNTANT': '/accountant/dashboard',
    'ACCOUNTANT_AT_STORE': '/distributor-accountant/dashboard',
    'DISTRIBUTOR_ACCOUNTANT': '/distributor-accountant/dashboard',
    'STORE_MANAGER': '/store-manager/dashboard',
    'DISTRIBUTOR': '/distributor/dashboard',
    'USER': '/admin/dashboard' // Default fallback
  }

  const redirectTo = roleRoutes[user.role] || '/admin/dashboard'

  return <Navigate to={redirectTo} replace />
}

export default RoleBasedRedirect
