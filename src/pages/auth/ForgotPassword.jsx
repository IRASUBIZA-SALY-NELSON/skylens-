import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronLeft } from "lucide-react";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Basic email validation
    if (!email || !email.includes('@')) {
      toast.error("Please enter a valid email address");
      setLoading(false);
      return;
    }

    try {
      console.log("Attempting password reset for email:", email);

      // Try primary endpoint first
      let response = await fetch(
        "https://stockscout-yqt4.onrender.com/api/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      console.log("Primary endpoint response status:", response.status);

      // Fallback to request-password-reset if needed
      if (!response.ok) {
        console.log("Primary endpoint failed, trying fallback...");
        console.log("Request payload:", JSON.stringify({ email }));

        response = await fetch(
          "https://stockscout-yqt4.onrender.com/api/auth/request-password-reset",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
          }
        );

        console.log("Fallback endpoint response status:", response.status);
        console.log("Response headers:", Object.fromEntries(response.headers.entries()));
      }

      if (response.ok) {
        // Some backends may return the token in the body; capture if present
        let resetToken = "";
        try {
          const text = await response.text();
          console.log("Success response body:", text);
          // If body is JSON or plain token, try to parse
          try {
            const data = JSON.parse(text);
            resetToken = data?.resetToken || data?.token || "";
          } catch {
            // If plain text token is returned
            resetToken = text && text.length < 512 ? text : "";
          }
        } catch (_) {
          // ignore parse errors
        }

        toast.success("Password reset instructions sent to your email.");
        // Navigate to reset page; pass token if the API returned it
        // Note: The email will contain a link that redirects to our reset form
        navigate("/auth/reset-password", { state: { resetToken, fromEmail: false } });
      } else {
        let errorMessage = "Failed to initiate password reset";
        try {
          const errText = await response.text();
          console.log("Error response body:", errText);
          console.log("Error response status:", response.status);

          try {
            const errJson = JSON.parse(errText);
            errorMessage = errJson.message || errJson.error || errJson.details || errorMessage;
            console.log("Parsed error:", errJson);
          } catch {
            // if plain text error
            errorMessage = errText || errorMessage;
          }
        } catch (parseError) {
          console.log("Failed to parse error response:", parseError);
        }

        // Show more specific error message
        if (response.status === 400 && errText.includes('Mail server connection failed')) {
          toast.error("Email service is temporarily unavailable. Please try again later or contact support.");
        } else if (response.status === 400 && errText.includes('MailConnectException')) {
          toast.error("Unable to send email at this time. Please contact support for password reset assistance.");
        } else {
          toast.error(`${errorMessage} (Status: ${response.status})`);
        }
      }
    } catch (error) {
      console.error("Network error details:", error);
      toast.error(`Network error: ${error.message}. Please check your connection and try again.`);
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
      <div className="w-[40%] flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          {/* Back Button */}
          <div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ChevronLeft className="h-5 w-5 mr-2" />
              Back
            </button>
          </div>

          {/* Header */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Forgot Password
            </h2>
            <p className="mt-2 text-[#A2A1A8]">
              Enter your registered email address; we'll send reset instructions.
            </p>
            {/* Temporary notice for email service issues */}
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <span className="font-medium">Notice:</span> If you experience issues receiving the reset email, 
                please contact support directly for assistance.
              </p>
            </div>
          </div>

          {/* Form */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="email" className="text-[16px] text-gray-700">
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full h-[56px] bg-[#7152F3] hover:bg-purple-700 text-white font-medium rounded-[10px] text-[16px] transition-colors duration-200"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Reset Instructions"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
