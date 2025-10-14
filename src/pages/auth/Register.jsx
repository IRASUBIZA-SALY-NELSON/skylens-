import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Users,
  Building2,
  UserPlus,
  ChevronLeft,
  ChevronDown,
  Check,
} from "lucide-react";
import toast from "react-hot-toast";
import { Listbox } from "@headlessui/react";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    gender: "",
    tenant: {},
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tenantInfo, setTenantInfo] = useState(null);

  const roles = [
    { id: 1, name: "Select a role", value: "", disabled: true },
    {
      id: 2,
      name: "Administrator",
      value: "ADMIN",
      description: "Full system access and user management",
    },
    {
      id: 3,
      name: "Store Manager",
      value: "STORE_MANAGER",
      description: "Store operations and inventory management",
    },
    {
      id: 4,
      name: "Sales Manager",
      value: "SALES_MANAGER",
      description: "Sales team and customer management",
    },
    {
      id: 5,
      name: "Warehouse Manager",
      value: "MANAGER",
      description: "Inventory and warehouse operations",
    },
    {
      id: 6,
      name: "Accountant",
      value: "ACCOUNTANT",
      description: "Financial management and reporting",
    },
    {
      id: 7,
      name: "Distributor",
      value: "DISTRIBUTOR",
      description: "Product distribution and supply chain",
    },
    {
      id: 8,
      name: "Managing Director",
      value: "MANAGING_DIRECTOR",
      description: "Overall management of the organization",
    },
    {
      id: 9,
      name: "Retailer",
      value: "RETAILER",
      description: "Retail operations and sales",
    },
  ];

  const genderOptions = [
    { id: 1, name: "Select your gender", value: "", disabled: true },
    { id: 2, name: "Male", value: "male" },
    { id: 3, name: "Female", value: "female" },
    { id: 4, name: "Other", value: "other" },
    { id: 5, name: "Prefer not to say", value: "prefer-not-to-say" },
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🚀 Form submission started");
    console.log("📝 Form Data:", formData);

    // Basic field validation
    if (!formData.firstName.trim()) {
      toast.error("First name is required");
      return;
    }

    if (!formData.lastName.trim()) {
      toast.error("Last name is required");
      return;
    }

    if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    }

    if (!formData.password) {
      toast.error("Password is required");
      return;
    }

    if (!formData.gender) {
      toast.error("Please select a gender");
      return;
    }

    if (!formData.role) {
      toast.error("Please select a role");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      console.log("Password:", formData.password);
      console.log("Confirm:", formData.confirmPassword);
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    console.log("✅ All validations passed, making API call");
    setLoading(true);

    try {
      // Prepare data for API call
      const apiData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        role: formData.role,
        gender: formData.gender,
      };

      // Only include tenant if it has valid data
      if (
        formData.tenant &&
        Object.keys(formData.tenant).length > 0 &&
        formData.tenant.id
      ) {
        apiData.tenant = formData.tenant;
      }

      console.log("📤 Sending API request:", apiData);

      const response = await fetch("https://stockscout-yqt4.onrender.com/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiData),
      });

      console.log("📥 API Response status:", response.status);

      if (response.ok) {
        const result = await response.json();
        console.log("✅ Registration successful:", result);
        toast.success("User created successfully!");

        // Navigate to dashboard based on role
        const dashboardRoutes = {
          ADMIN: "/admin/dashboard",
          STORE_MANAGER: "/store-manager/dashboard",
          SALES_MANAGER: "/sales-manager/dashboard",
          MANAGER: "/warehouse-manager/dashboard",
          ACCOUNTANT: "/accountant/dashboard",
          DISTRIBUTOR: "/distributor/dashboard",
        };

        const dashboardRoute = dashboardRoutes[formData.role] || "/dashboard";
        console.log("🏠 Navigating to:", dashboardRoute);

        // Store user info in localStorage for persistence
        localStorage.setItem(
          "userInfo",
          JSON.stringify({
            userId: result.id || result.userId,
            userName: `${formData.firstName} ${formData.lastName}`,
            role: formData.role,
            email: formData.email,
          })
        );

        navigate(dashboardRoute, {
          state: {
            userId: result.id || result.userId,
            userName: `${formData.firstName} ${formData.lastName}`,
            role: formData.role,
            userInfo: result,
          },
          replace: true,
        });
      } else {
        const error = await response.json();
        console.error("❌ Registration failed:", error);
        toast.error(error.message || "Registration failed");
      }
    } catch (error) {
      console.error("💥 Registration error:", error);
      toast.error("Network error. Please try again.");
    } finally {
      console.log("🏁 Form submission completed");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left side with dashboard image */}
      <div className="w-[800px] bg-[rgba(113,82,243,0.05)] shadow-sm rounded-[30px] m-[30px] my-[60px] flex items-center justify-end">
        <img
          src="/dashboard-image.png"
          alt="Factory Management System Dashboard"
          className="w-[685px] h-[600px] object-cover rounded-l-[30px] border-r border-grey"
        />
      </div>

      {/* Right side with form */}
      <div className="w-[45%] flex flex-col h-screen py-8 px-4">
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="border-0  rounded-[10px] p-6 flex-1 flex flex-col overflow-hidden">
            <div className="flex-shrink-0">
              <div className="flex flex-col gap-[40px] items-start mb-6">
                <button
                  onClick={() => navigate(-1)}
                  className="flex items-center text-gray-600 hover:text-gray-900 font-medium"
                >
                  <ChevronLeft className="h-5 w-5 mr-1" />
                  <span>Back</span>
                </button>
                {/* <div className="text-center  flex-1"> */}
                {/* <div className="flex w-100% mb-6"> */}
                <div className="flex items-start w-100% mb-8 flex-col justify-start">
                  <div className="flex justify-start w-full mb-8">
                    <img
                      src="/logo-label.png"
                      alt="GGM Logo"
                      className="h-12"
                    />
                  </div>
                  <h2 className="text-[30px] font-bold text-gray-900 mb-[3px]">
                    Create User's Account
                  </h2>
                  <p className="text-[#A2A1A8] text-[16px]">
                    Add a new user to your organization
                  </p>
                </div>
                {/* </div> */}
                {/* </div> */}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-4 px-4">
                  {/* First Name */}
                  <div className="space-y-2">
                    <label
                      htmlFor="firstName"
                      className="text-[16px] text-gray-700"
                    >
                      First Name
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      autoComplete="given-name"
                      className="appearance-none relative block w-full px-3 py-3 border border-purple-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent sm:text-sm"
                      placeholder="Enter first name"
                      value={formData.firstName}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Last Name */}
                  <div className="space-y-2">
                    <label
                      htmlFor="lastName"
                      className="text-[16px] text-gray-700"
                    >
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      autoComplete="family-name"
                      className="appearance-none relative block w-full px-3 py-3 border border-purple-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent sm:text-sm"
                      placeholder="Enter last name"
                      value={formData.lastName}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="text-[16px] text-gray-700"
                    >
                      Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      className="appearance-none relative block w-full px-3 py-3 border border-purple-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent sm:text-sm"
                      placeholder="Enter email address"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Role Selection */}
                  <div className="space-y-2">
                    <label htmlFor="role" className="text-[16px] text-gray-700">
                      Role
                    </label>
                    <Listbox
                      value={formData.role}
                      onChange={(value) =>
                        handleInputChange({ target: { name: "role", value } })
                      }
                    >
                      <div className="relative">
                        <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-3 pl-4 pr-10 text-left border border-purple-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500">
                          <span
                            className={`block truncate ${!formData.role ? "text-gray-400" : "text-gray-700"
                              }`}
                          >
                            {roles.find((r) => r.value === formData.role)
                              ?.name || "Select a role"}
                          </span>
                          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronDown
                              className="h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                          </span>
                        </Listbox.Button>
                        <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none z-10">
                          {roles.map((role) => (
                            <Listbox.Option
                              key={role.id}
                              value={role.value}
                              disabled={role.disabled}
                              className={({ active, selected }) =>
                                `relative cursor-default select-none py-2 pl-10 pr-4 ${active
                                  ? "bg-purple-100 text-purple-900"
                                  : "text-gray-900"
                                } ${role.disabled
                                  ? "text-gray-400 cursor-not-allowed"
                                  : "cursor-pointer"
                                } ${selected ? "bg-purple-50" : ""}`
                              }
                            >
                              {({ selected }) => (
                                <>
                                  <span
                                    className={`block truncate ${selected
                                        ? "font-medium text-purple-700"
                                        : "font-normal"
                                      }`}
                                  >
                                    {role.name}
                                  </span>
                                  {selected && (
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-purple-600">
                                      <Check className="h-5 w-5" />
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

                  {/* Gender */}
                  <div className="space-y-2">
                    <label
                      htmlFor="gender"
                      className="text-[16px] text-gray-700"
                    >
                      Gender
                    </label>
                    <Listbox
                      value={formData.gender}
                      onChange={(value) =>
                        handleInputChange({ target: { name: "gender", value } })
                      }
                    >
                      <div className="relative">
                        <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-3 pl-4 pr-10 text-left border border-purple-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500">
                          <span
                            className={`block truncate ${!formData.gender
                                ? "text-gray-400"
                                : "text-gray-700"
                              }`}
                          >
                            {genderOptions.find(
                              (g) => g.value === formData.gender
                            )?.name || "Select your gender"}
                          </span>
                          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronDown
                              className="h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                          </span>
                        </Listbox.Button>
                        <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none z-10">
                          {genderOptions.map((option) => (
                            <Listbox.Option
                              key={option.id}
                              value={option.value}
                              disabled={option.disabled}
                              className={({ active, selected }) =>
                                `relative cursor-default select-none py-2 pl-10 pr-4 ${active
                                  ? "bg-purple-100 text-purple-900"
                                  : "text-gray-900"
                                } ${option.disabled
                                  ? "text-gray-400 cursor-not-allowed"
                                  : "cursor-pointer"
                                } ${selected ? "bg-purple-50" : ""}`
                              }
                            >
                              {({ selected }) => (
                                <>
                                  <span
                                    className={`block truncate ${selected
                                        ? "font-medium text-purple-700"
                                        : "font-normal"
                                      }`}
                                  >
                                    {option.name}
                                  </span>
                                  {selected && (
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-purple-600">
                                      <Check className="h-5 w-5" />
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

                  {/* Password */}
                  <div className="space-y-2">
                    <label
                      htmlFor="password"
                      className="text-[16px] text-gray-700"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        autoComplete="new-password"
                        className="appearance-none relative block w-full px-3 py-3 pr-10 border border-purple-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent sm:text-sm"
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={handleInputChange}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <label
                      htmlFor="confirmPassword"
                      className="text-[16px] text-gray-700"
                    >
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        autoComplete="new-password"
                        className="appearance-none relative block w-full px-3 py-3 pr-10 border border-purple-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent sm:text-sm"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center">
                      <input
                        id="terms"
                        name="terms"
                        type="checkbox"
                        required
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="terms"
                        className="ml-2 block text-sm text-gray-700"
                      >
                        I agree to the{" "}
                        <a href="#" className="text-purple-600 hover:underline">
                          Terms
                        </a>{" "}
                        and{" "}
                        <a href="#" className="text-purple-600 hover:underline">
                          Privacy Policy
                        </a>
                      </label>
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="w-full h-[56px] bg-[#7152F3] hover:bg-purple-700 text-white font-medium rounded-[10px] text-[16px]"
                      disabled={loading}
                    >
                      {loading ? "Creating Account..." : "Create Account"}
                    </button>
                  </div>

                  <div className="text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link
                      to="/auth/login"
                      className="text-purple-600 hover:underline font-medium"
                    >
                      Sign in
                    </Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
