import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ChevronLeft } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { API_ENDPOINTS } from "../../config/api";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      console.log("📥 Login response status:", response.status);

      if (response.ok) {
        const result = await response.json();
        console.log("✅ Login successful:", result);

        // Store tokens
        const accessToken = result.access_token;
        const refreshToken = result.refresh_token;

        if (!accessToken) {
          console.error("❌ No access token received");
          toast.error("Authentication failed - no token received");
          return;
        }

        console.log("💾 Storing tokens and user info");

        // Decode user info from JWT token
        const tokenPayload = decodeUserFromToken(accessToken);

        if (tokenPayload) {
          // Extract user info from token payload
          const extractUserRole = (payload) => {
            // Check if there's a direct role field
            if (payload.role) return payload.role.toUpperCase();

            // Extract from authorities array - look for ROLE_ prefix first
            if (payload.authorities && payload.authorities.length > 0) {
              // Find the authority that starts with ROLE_
              const roleAuthority = payload.authorities.find((auth) =>
                auth.startsWith("ROLE_")
              );
              if (roleAuthority) {
                return roleAuthority.replace("ROLE_", "").toUpperCase();
              }

              // Fallback: if no ROLE_ found, use the first authority
              const authority = payload.authorities[0];
              if (authority && authority.includes(":")) {
                return authority.split(":")[0].toUpperCase(); // admin:read -> ADMIN
              }
              return authority ? authority.toUpperCase() : "USER";
            }

            return "USER";
          };

          // Try to fetch the current user's profile to get firstName/lastName
          let profile = null;
          try {
            const meRes = await fetch(API_ENDPOINTS.USER_ME, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Accept': 'application/json',
              },
            });
            if (meRes.ok) {
              profile = await meRes.json();
              console.log('👤 /api/users/me profile:', profile);
            } else {
              const errText = await meRes.text();
              console.warn('⚠️ Failed to fetch /api/users/me:', meRes.status, errText);
            }
          } catch (e) {
            console.warn('⚠️ Error fetching /api/users/me:', e);
          }

          const role = extractUserRole(tokenPayload);
          const email = tokenPayload.sub;
          const firstName = profile?.firstName || null;
          const lastName = profile?.lastName || null;
          const displayName = (firstName && lastName)
            ? `${firstName} ${lastName}`
            : (tokenPayload.name || (formData.email.split('@')[0]));

          const userInfo = {
            email,
            role,
            name: displayName,
            firstName: firstName || undefined,
            lastName: lastName || undefined,
            id: profile?.id || undefined,
            phoneNumber: profile?.phoneNumber || undefined,
            gender: profile?.gender || undefined,
            nationality: profile?.nationality || undefined,
            tenantId: profile?.tenantId || tokenPayload?.tenantId || undefined,
          };

          console.log("👤 User info extracted:", userInfo);

          // Use AuthContext login method to properly set state
          login(userInfo, accessToken, refreshToken);

          toast.success(`Welcome back, ${userInfo.name}!`);

          // Navigate based on role
          const roleRoutes = {
            ADMIN: "/admin/dashboard",
            STORE_MANAGER: "/store-manager/dashboard",
            SALES_MANAGER: "/sales-manager/dashboard",
            MANAGING_DIRECTOR: "/managing-director/dashboard",
            MANAGIND_DIRECTOR: "/managing-director/dashboard",
            MANAGER: "/warehouse-manager/dashboard",
            WAREHOUSE_MANAGER: "/warehouse-manager/dashboard",
            ACCOUNTANT: "/accountant/dashboard",
            ACCOUNTANT_AT_STORE: "/distributor-accountant/dashboard",
            DISTRIBUTOR: "/distributor/dashboard",
            SUPER_ADMIN: "/super-admin/dashboard",
            RETAILER: "/retailer/dashboard",
          };
          console.log("roleRoutes", roleRoutes[role]);
          const redirectTo = roleRoutes[role] || "/dashboard";
          console.log("🏠 Redirecting to:", redirectTo);

          navigate(redirectTo, { replace: true });
        } else {
          console.error("❌ Failed to decode user info from token");
          toast.error("Failed to load user information");
        }
      } else {
        // Robust error parsing (JSON or text)
        let error = {};
        try {
          error = await response.json();
        } catch (_) {
          try {
            const text = await response.text();
            error = text ? { message: text } : {};
          } catch (_) {
            error = {};
          }
        }
        const status = response.status;
        console.warn("⚠️ Login failed (status)", status, "details:", error);
        if (status === 401) {
          // Friendly, non-error toast for invalid credentials
          toast("Invalid email or password. Please try again.");
        } else if (status === 403) {
          toast("You don’t have permission to access this resource with these credentials.");
        } else {
          toast.error(error.message || "Login failed. Please try again.");
        }
      }
    } catch (error) {
      console.error("💥 Login error:", error);
      toast.error("Network error. Please try again.");
    } finally {
      console.log("🏁 Login process completed");
      setLoading(false);
    }
  };

  const decodeUserFromToken = (token) => {
    try {
      console.log("🔍 Decoding user info from token");
      // JWT tokens have 3 parts separated by dots
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );

      const payload = JSON.parse(jsonPayload);
      console.log("👤 Token payload:", payload);
      return payload;
    } catch (error) {
      console.error("💥 Error decoding token:", error);
      return null;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white">
      {/* Left Side - Image */}
      <div className="lg:flex-col h-auto hidden [@media(min-width:1280px)]:block lg:h-screen w-full lg:w-auto">
        <div className="w-full lg:w-[800px] h-[300px] sm:h-[400px] lg:h-[750px] bg-[rgba(113,82,243,0.05)] rounded-none lg:rounded-[30px] m-0 lg:m-[30px] lg:mb-[20px] lg:my-[60px] flex items-center justify-center lg:justify-end">
          <img
            src="https://images.pexels.com/photos/3471463/pexels-photo-3471463.jpeg?auto=compress&cs=tinysrgb&w=1200&dpr=1"
            alt="Skylens drone in flight"
            className="w-full h-full lg:w-[685px] lg:h-[600px] object-cover lg:rounded-l-[30px] border-r border-grey"
            loading="lazy"
            decoding="async"
            onError={(e) => { e.currentTarget.src = 'https://images.pexels.com/photos/116145/pexels-photo-116145.jpeg?auto=compress&cs=tinysrgb&w=1200&dpr=1'; }}
          />
        </div>
        <div className="hidden lg:block">
          <p className="text-xs text-center text-gray-400">
            Powered by <span className="font-medium text-gray-500">FMS Team</span>
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-[40%] flex items-center justify-center p-6 lg:p-4">
        <div className="w-full">
          <div className="border-0 rounded-[10px] p-4 sm:p-6">
            {/* Back Button */}
            <div className="mb-6">
              <button
                onClick={() => navigate('/')}
                type="button"
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ChevronLeft className="h-5 w-5 mr-2" />
                Back
              </button>
            </div>

            <div className="text-center flex flex-col justify-start mb-6 sm:mb-8">
              <div className="flex justify-center lg:justify-start items-start mb-6">
                <img src="/logo-label.png" alt="GGM Logo" className="h-10 sm:h-12" />
              </div>
              <h2 className="text-2xl sm:text-[30px] lg:mb-[14px] font-bold text-gray-900 mb-1 sm:mb-[3px] inline-flex">
                Welcome 👋
              </h2>
              <p className="text-[#A2A1A8] text-sm sm:text-[16px] inline-flex">
                Please login here
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label htmlFor="email" className="text-[16px] text-gray-700 ">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="appearance-none relative block w-full px-3 py-3 border border-purple-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                  placeholder="Enter your email"
                  required
                  autoComplete="username"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-[16px] text-gray-700 "
                  >
                    Password
                  </label>
                  <Link
                    to="/auth/forgot-password"
                    className="text-sm text-purple-600 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    className="appearance-none relative block w-full px-3 py-3 pr-10 border border-purple-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center z-20"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowPassword(!showPassword);
                    }}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-700 hover:text-gray-900" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-700 hover:text-gray-900" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-[56px] bg-[#7152F3] hover:bg-purple-700 text-white rounded-[10px] text-[16px]"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>

              {/* Footer links removed as requested */}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
