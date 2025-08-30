import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { showNotification } from "../components/Toast";
import Loader from "../components/Loader";
import InlineLoader from "../components/InlineLoader";
import { 
  FiMail, 
  FiLock, 
  FiEye, 
  FiEyeOff, 
  FiArrowLeft,
  FiCheck,
  FiKey,
  FiShield
} from "react-icons/fi";
import { BASE_URL, Endpoint } from "../constant";

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: email, 2: otp, 3: new password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();

  // Countdown timer for OTP resend
  React.useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      showNotification("error", "Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const url = `${BASE_URL}${Endpoint.FORGOT_PASSWORD}`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        showNotification("success", "OTP sent to your email address");
        setStep(2);
        setCountdown(60); // 60 seconds countdown
      } else {
        const errorData = await response.json();
        showNotification("error", errorData?.message || "Failed to send OTP");
      }
    } catch (error) {
      showNotification("error", "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      showNotification("error", "Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const url = `${BASE_URL}${Endpoint.VERIFY_OTP}`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      if (response.ok) {
        showNotification("success", "OTP verified successfully");
        setStep(3);
      } else {
        const errorData = await response.json();
        showNotification("error", errorData?.message || "Invalid OTP");
      }
    } catch (error) {
      showNotification("error", "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPassword || !confirmPassword) {
      showNotification("error", "Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      showNotification("error", "Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      showNotification("error", "Password must be at least 8 characters long");
      return;
    }

    setLoading(true);
    try {
      const url = `${BASE_URL}${Endpoint.RESET_PASSWORD}`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email, 
          otp, 
          newPassword 
        }),
      });

      if (response.ok) {
        showNotification("success", "Password reset successfully! Please log in with your new password.");
        navigate("/login");
      } else {
        const errorData = await response.json();
        showNotification("error", errorData?.message || "Failed to reset password");
      }
    } catch (error) {
      showNotification("error", "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;
    
    setLoading(true);
    try {
      const url = `${BASE_URL}${Endpoint.FORGOT_PASSWORD}`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        showNotification("success", "OTP resent to your email address");
        setCountdown(60);
      } else {
        const errorData = await response.json();
        showNotification("error", errorData?.message || "Failed to resend OTP");
      }
    } catch (error) {
      showNotification("error", "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center space-x-4">
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
          step >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'
        }`}>
          <FiMail className="w-4 h-4" />
        </div>
        <div className={`w-12 h-0.5 ${step >= 2 ? 'bg-primary-600' : 'bg-gray-200'}`}></div>
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
          step >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'
        }`}>
          <FiKey className="w-4 h-4" />
        </div>
        <div className={`w-12 h-0.5 ${step >= 3 ? 'bg-primary-600' : 'bg-gray-200'}`}></div>
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
          step >= 3 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'
        }`}>
          <FiShield className="w-4 h-4" />
        </div>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <form onSubmit={handleSendOTP} className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Forgot Password?</h2>
              <p className="text-gray-600">Enter your email address and we'll send you a verification code</p>
            </div>
            
            <div className="form-group">
              <label className="form-label flex items-center gap-2">
                <FiMail className="w-4 h-4" />
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="form-input pl-10"
                  disabled={loading}
                />
                <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
            </div>

             <button
               type="submit"
               disabled={loading}
               className="btn btn-primary w-full flex items-center justify-center gap-2"
             >
               {loading ? (
                 <InlineLoader text="Sending OTP..." />
               ) : (
                 <>
                   <FiMail className="w-4 h-4" />
                   Send Verification Code
                 </>
               )}
             </button>
          </form>
        );

      case 2:
        return (
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Enter Verification Code</h2>
              <p className="text-gray-600">We've sent a 6-digit code to {email}</p>
            </div>
            
            <div className="form-group">
              <label className="form-label flex items-center gap-2">
                <FiKey className="w-4 h-4" />
                Verification Code
              </label>
              <input
                type="text"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter 6-digit code"
                className="form-input text-center text-lg tracking-widest"
                disabled={loading}
                maxLength={6}
              />
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">
                Didn't receive the code?{" "}
                {countdown > 0 ? (
                  <span className="text-gray-500">Resend in {countdown}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    className="text-primary-600 hover:text-primary-700 font-medium"
                    disabled={loading}
                  >
                    Resend Code
                  </button>
                )}
              </p>
            </div>

             <button
               type="submit"
               disabled={loading}
               className="btn btn-primary w-full flex items-center justify-center gap-2"
             >
               {loading ? (
                 <InlineLoader text="Verifying..." />
               ) : (
                 <>
                   <FiCheck className="w-4 h-4" />
                   Verify Code
                 </>
               )}
             </button>
          </form>
        );

      case 3:
        return (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Create New Password</h2>
              <p className="text-gray-600">Enter your new password below</p>
            </div>
            
            <div className="form-group">
              <label className="form-label flex items-center gap-2">
                <FiLock className="w-4 h-4" />
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="form-input pl-10 pr-10"
                  disabled={loading}
                />
                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={loading}
                >
                  {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label flex items-center gap-2">
                <FiLock className="w-4 h-4" />
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className={`form-input pl-10 pr-10 ${
                    confirmPassword && newPassword !== confirmPassword
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : confirmPassword && newPassword === confirmPassword
                      ? 'border-green-500 focus:border-green-500 focus:ring-green-500'
                      : ''
                  }`}
                  disabled={loading}
                />
                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={loading}
                >
                  {showConfirmPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
              
              {/* Password Match Indicator */}
              {confirmPassword && (
                <div className="mt-2 flex items-center gap-2">
                  {newPassword === confirmPassword ? (
                    <>
                      <FiCheck className="w-4 h-4 text-green-500" />
                      <span className="text-xs text-green-600">Passwords match</span>
                    </>
                  ) : (
                    <>
                      <FiCheck className="w-4 h-4 text-red-500" />
                      <span className="text-xs text-red-600">Passwords do not match</span>
                    </>
                  )}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full flex items-center justify-center gap-2"
            >
              {loading ? (
                <InlineLoader text="Resetting Password..." />
              ) : (
                <>
                  <FiShield className="w-4 h-4" />
                  Reset Password
                </>
              )}
            </button>
          </form>
        );

      default:
        return null;
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 p-4">
      <div className="w-full max-w-md">
        {/* Forgot Password Card */}
        <div className="card shadow-2xl">
          <div className="card-body p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FiKey className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h1>
              <p className="text-gray-600">Follow the steps to reset your password</p>
            </div>

            {/* Step Indicator */}
            {renderStepIndicator()}

            {/* Step Content */}
            {renderStepContent()}

            {/* Back to Login */}
            <div className="text-center mt-6">
              <p className="text-gray-600">
                Remember your password?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Sign in here
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Back to Login Button */}
        <div className="text-center mt-6">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="inline-flex items-center gap-2 text-white hover:text-gray-200 transition-colors"
          >
            <FiArrowLeft className="w-4 h-4" />
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}
