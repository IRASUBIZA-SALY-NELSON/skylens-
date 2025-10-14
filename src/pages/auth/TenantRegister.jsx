import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Building2 } from "lucide-react";
import toast from "react-hot-toast";
import { Listbox } from "@headlessui/react";
import { Check, ChevronDown } from "lucide-react";

const TenantRegister = () => {
  const navigate = useNavigate();
  const genderOptions = [
    { id: 1, name: "Select your gender", value: "", disabled: true },
    { id: 2, name: "Male", value: "MALE" },
    { id: 3, name: "Female", value: "FEMALE" },
    { id: 4, name: "Other", value: "OTHER" },
  ];
  const [formData, setFormData] = useState({
    companyName: "",
    companyCode: "",
    companyDescription: "",
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
    gender: "",
    agreeToTerms: false,
    phone: "",
    tenantPhone: "",
    tenantEmail: "",
    address: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    const required = [
      "companyName",
      "companyCode",
      "companyDescription",
      "email",
      "firstName",
      "lastName",
      "password",
      "phone",
      "tenantPhone",
      "tenantEmail",
      "address",
    ];
    return required.every(
      (field) => formData[field] && formData[field].trim() !== ""
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🚀 TENANT REGISTRATION STARTED");
    console.log("📝 Form Data:", formData);

    if (!validateForm()) {
      console.log("Please fill in all required fields");
      toast.error("Please fill in all required fields");
      return;
    }

    console.log("Password:", JSON.stringify(formData.password));
    console.log("Confirm:", JSON.stringify(formData.confirmPassword));

    if (formData.password.trim() !== formData.confirmPassword.trim()) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (!formData.agreeToTerms) {
      toast.error("Please agree to the terms and conditions");
      return;
    }

    setLoading(true);

    try {
      const apiData = {
        companyName: formData.companyName,
        companyCode: formData.companyCode,
        companyDescription: formData.companyDescription,
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        gender: formData.gender || "",
        phone: formData.phone || formData.tenantPhone || "",
        tenantPhone: formData.tenantPhone || formData.phone || "",
        tenantEmail: formData.tenantEmail || formData.email || "",
        address: formData.address || "",
      };

      const response = await fetch("https://stockscout-yqt4.onrender.com/api/tenants/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiData),
      });

      if (response.ok) {
        const result = await response.json();
        toast.success("Tenant registration successful!");
        navigate("/auth/tenant-success", {
          state: {
            tenantId: result.id || "Generated",
            companyName: formData.companyName,
          },
        });
      } else {
        const errorText = await response.text();
        console.log("❌ Error Response:", errorText);
        let errorMessage = "Registration failed";
        try {
          const error = JSON.parse(errorText);
          console.log("📄 Parsed Error:", error);
          errorMessage = error.message || error.error || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
        console.log("🚨 Final Error:", errorMessage);
        toast.error(errorMessage);
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    } finally {
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
          <div className="border-0 shadow rounded-[10px] p-6 flex-1 flex flex-col overflow-hidden">
            <div className="flex-shrink-0">
              <div className="flex flex-col items-start w-full mb-8">
                <div className="flex justify-start w-full mb-8">
                  <img src="/logo-label.png" alt="GGM Logo" className="h-12" />
                </div>
                <h2 className="text-[30px] font-bold text-gray-900 mb-[3px] inline-flex">
                  Tenant Registration
                </h2>
                <p className="text-[#A2A1A8] text-[16px] inline-flex">
                  Register your company and create admin account
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-4 px-4">
                  {/* Company Name */}
                  <div className="space-y-2">
                    <label
                      htmlFor="companyName"
                      className="text-[16px] text-gray-700"
                    >
                      Company Name
                    </label>
                    <input
                      id="companyName"
                      name="companyName"
                      type="text"
                      required
                      className="appearance-none relative block w-full px-3 py-3 border border-purple-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent sm:text-sm"
                      placeholder="Enter company name"
                      value={formData.companyName}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Company Code */}
                  <div className="space-y-2">
                    <label
                      htmlFor="companyCode"
                      className="text-[16px] text-gray-700"
                    >
                      Company Code
                    </label>
                    <input
                      id="companyCode"
                      name="companyCode"
                      type="text"
                      required
                      className="appearance-none relative block w-full px-3 py-3 border border-purple-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent sm:text-sm"
                      placeholder="Enter company code"
                      value={formData.companyCode}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Company Description */}
                  <div className="space-y-2">
                    <label
                      htmlFor="companyDescription"
                      className="text-[16px] text-gray-700"
                    >
                      Company Description
                    </label>
                    <textarea
                      id="companyDescription"
                      name="companyDescription"
                      rows="3"
                      required
                      className="appearance-none relative block w-full px-3 py-3 border border-purple-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent sm:text-sm"
                      placeholder="Brief description of your company"
                      value={formData.companyDescription}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Tenant Contact Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="tenantEmail" className="text-[16px] text-gray-700">
                        Tenant Email
                      </label>
                      <input
                        id="tenantEmail"
                        name="tenantEmail"
                        type="email"
                        className="appearance-none relative block w-full px-3 py-3 border border-purple-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent sm:text-sm"
                        placeholder="tenant@company.com"
                        value={formData.tenantEmail}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="tenantPhone" className="text-[16px] text-gray-700">
                        Tenant Phone
                      </label>
                      <input
                        id="tenantPhone"
                        name="tenantPhone"
                        type="tel"
                        className="appearance-none relative block w-full px-3 py-3 border border-purple-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent sm:text-sm"
                        placeholder="+2507XXXXXXXX"
                        value={formData.tenantPhone}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  {/* Tenant Address */}
                  <div className="space-y-2">
                    <label htmlFor="address" className="text-[16px] text-gray-700">
                      Company Address
                    </label>
                    <input
                      id="address"
                      name="address"
                      type="text"
                      className="appearance-none relative block w-full px-3 py-3 border border-purple-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent sm:text-sm"
                      placeholder="Street, City, Country"
                      value={formData.address}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Admin User Info */}
                  <div className="grid grid-cols-2 gap-4">
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
                        className="appearance-none relative block w-full px-3 py-3 border border-purple-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent sm:text-sm"
                        placeholder="Enter first name"
                        value={formData.firstName}
                        onChange={handleInputChange}
                      />
                    </div>

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
                        className="appearance-none relative block w-full px-3 py-3 border border-purple-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent sm:text-sm"
                        placeholder="Enter last name"
                        value={formData.lastName}
                        onChange={handleInputChange}
                      />
                    </div>
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
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Admin Phone */}
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-[16px] text-gray-700">
                      Admin Phone
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      className="appearance-none relative block w-full px-3 py-3 border border-purple-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent sm:text-sm"
                      placeholder="+2507XXXXXXXX"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
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

                  {/* Terms and Conditions */}
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="agreeToTerms"
                        name="agreeToTerms"
                        type="checkbox"
                        required
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        checked={formData.agreeToTerms}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor="agreeToTerms"
                        className="font-medium text-gray-700"
                      >
                        I agree to the{" "}
                        <a
                          href="#"
                          className="text-purple-600 hover:text-purple-500"
                        >
                          Terms and Conditions
                        </a>
                      </label>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full h-[56px] bg-[#7152F3] hover:bg-purple-700 text-white font-medium rounded-[10px] text-[16px] transition-colors duration-200"
                    >
                      {loading ? "Creating Account..." : "Create Account"}
                    </button>
                  </div>
                  <div className="text-center text-sm text-gray-600">
                    Already have a tenant account?{" "}
                    <Link
                      to="/auth/login"
                      className="text-purple-600 hover:underline font-medium"
                    >
                      Login
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

export default TenantRegister;
