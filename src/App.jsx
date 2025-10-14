import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import Dashboard from './pages/admin/Dashboard'
import Profile from './pages/Profile'
import UserManagement from './pages/admin/UserManagement'
import ActivityLogs from './pages/admin/ActivityLogs'
import Reports from './pages/admin/Reports'
import AdminDistributors from './pages/admin/Distributors'
import Settings from './pages/admin/Settings'
import NotFound from './pages/NotFound'
import Landing from './pages/Landing'
import Notifications from './pages/Notifications'
import PlanSelection from './pages/PlanSelection'
import RoleBasedRedirect from './components/RoleBasedRedirect'
import PrivacyPolicy from './pages/legal/PrivacyPolicy'
import TermsOfService from './pages/legal/TermsOfService'
import CookiePolicy from './pages/legal/CookiePolicy'

// Auth Pages
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import TenantRegister from './pages/auth/TenantRegister'
import SystemUserRegister from './pages/auth/SystemUserRegister'
import TenantSuccess from './pages/auth/TenantSuccess'
import UserSuccess from './pages/auth/UserSuccess'
import ForgotPassword from './pages/auth/ForgotPassword'
import VerifyOTP from './pages/auth/VerifyOTP'
import ResetPassword from './pages/auth/ResetPassword'
import Success from './pages/auth/Success'

function App() {
  const user = JSON.parse(localStorage.getItem('user'));
  console.log("user in the main app", user);
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/plans" element={<PlanSelection />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
            <Route path="/auth/tenant-register" element={<TenantRegister />} />
            <Route path="/auth/system-user-register" element={<SystemUserRegister />} />
            <Route path="/auth/tenant-success" element={<TenantSuccess />} />
            <Route path="/auth/user-success" element={<UserSuccess />} />
            <Route path="/auth/forgot-password" element={<ForgotPassword />} />
            <Route path="/auth/verify-otp" element={<VerifyOTP />} />
            <Route path="/auth/reset-password" element={<ResetPassword />} />
            <Route path="/auth/success" element={<Success />} />

            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />

            {/* App entry for authenticated users */}
            <Route path="/app" element={<ProtectedRoute><RoleBasedRedirect /></ProtectedRoute>} />

            {/* Notifications Route - Accessible to all authenticated users */}
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />
            <Route
              path="/admin/user-management"
              element={
                <ProtectedRoute>
                  <Layout>
                    <UserManagement />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/activity-logs"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ActivityLogs />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/reports"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Reports />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/distributors"
              element={
                <ProtectedRoute>
                  <Layout>
                    <AdminDistributors />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Settings />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Profile Route */}
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />

            {/* Catch all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                padding: '12px 16px',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                borderLeft: '5px solid',
                background: '#ffffff',
              },
              success: {
                style: {
                  color: '#7152F3',
                  borderLeftColor: '#7152F3',
                },
                iconTheme: {
                  primary: '#7152F3',
                  secondary: '#ffffff',
                },
                duration: 10000,
              },
              error: {
                style: {
                  color: '#B91C1C',
                  borderLeftColor: '#B91C1C',
                },
                iconTheme: {
                  primary: '#B91C1C',
                  secondary: '#ffffff',
                },
                duration: 10000,
              },
            }}
          />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
