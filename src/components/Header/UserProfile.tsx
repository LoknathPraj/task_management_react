import React, { useContext, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import useAxios from "../../context/useAxios";
import { showNotification } from "../Toast";
import InlineLoader from "../InlineLoader";
import { 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiCalendar, 
  FiBriefcase, 
  FiLock, 
  FiEye, 
  FiEyeOff, 
  FiSave, 
  FiX,
  FiArrowLeft,
  FiCamera,
  FiCheck,
  FiAlertCircle
} from "react-icons/fi";

import moment from "moment";

export default function UserProfile() {
  const navigate = useNavigate();
  const appState: any = useContext(AppContext);
  const axiosHandler = useAxios();
  
  // Form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    joiningDate: "",
    designation: "",
    department: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  // UI states
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Password validation states
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: ""
  });

  // Password regex
  const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,24}$/;

  const fetchUserDetails = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosHandler.get(`auth/getUserList`);
      const userList = response?.data?.data;
      const currentUser = userList?.find((user: any) => user?._id === appState?.userDetails?.userId);
      
      if (currentUser) {
        setFormData({
          name: currentUser.name || "",
          email: currentUser.email || "",
          mobile: currentUser.mobile || "",
          joiningDate: currentUser.joiningDate ? moment(currentUser.joiningDate).format("YYYY-MM-DD") : "",
          designation: currentUser.designation || "User",
          department: currentUser.department || "",
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
        
        if (currentUser.profileImage) {
          setProfileImage(currentUser.profileImage);
        }
      }
    } catch (error) {
      showNotification("error", "Failed to fetch user details");
    } finally {
      setLoading(false);
    }
  }, [axiosHandler, appState?.userDetails?.userId]);

  // Fetch user details on component mount
  useEffect(() => {
    fetchUserDetails();
  }, []);

  // Password strength checker
  const checkPasswordStrength = (password: string) => {
    let score = 0;
    let feedback = "";

    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[!@#$%^&*]/.test(password)) score++;

    if (score === 0) feedback = "Very weak";
    else if (score === 1) feedback = "Weak";
    else if (score === 2) feedback = "Fair";
    else if (score === 3) feedback = "Good";
    else if (score === 4) feedback = "Strong";
    else feedback = "Very strong";

    setPasswordStrength({ score, feedback });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev: any) => ({ ...prev, [name]: "" }));
    }
    
    // Check password strength for new password
    if (name === "newPassword") {
      checkPasswordStrength(value);
    }
  };

  const validateForm = () => {
    const newErrors: any = {};

    // Basic validations
    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = "Phone number must be 10 digits";
    }

    // Password validations (only if user is changing password)
    if (formData.newPassword || formData.confirmPassword || formData.currentPassword) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = "Current password is required";
      }
      
      if (!formData.newPassword) {
        newErrors.newPassword = "New password is required";
      } else if (!PWD_REGEX.test(formData.newPassword)) {
        newErrors.newPassword = "Password must be 8-24 characters with uppercase, lowercase, number, and special character";
      }
      
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your new password";
      } else if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const updateData: any = {
        name: formData.name,
        mobile: formData.mobile
      };

      // Only include password if user is changing it
      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      const response = await axiosHandler.post(`auth/updateUserById/${appState?.userDetails?.userId}`, updateData);
      
      if (response?.data?.success) {
        showNotification("success", "Profile updated successfully!");
        setIsEditing(false);
        // Reset password fields
        setFormData((prev: any) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        }));
        setErrors({});
      } else {
        showNotification("error", response?.data?.message || "Failed to update profile");
      }
    } catch (error: any) {
      showNotification("error", error?.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength.score <= 1) return "bg-red-500";
    if (passwordStrength.score <= 2) return "bg-orange-500";
    if (passwordStrength.score <= 3) return "bg-yellow-500";
    if (passwordStrength.score <= 4) return "bg-blue-500";
    return "bg-green-500";
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Here you would typically upload the image to your server
      // For now, we'll just create a preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading && !formData.name) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <InlineLoader text="Loading profile..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="btn btn-outline flex items-center gap-2"
            >
              <FiArrowLeft className="w-4 h-4" />
              Back
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
              <p className="text-gray-600 mt-1">Manage your account information and preferences</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="card">
              <div className="card-body text-center">
                {/* Profile Image */}
                <div className="relative inline-block mb-6">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-4xl font-bold mb-4 mx-auto overflow-hidden">
                    {profileImage ? (
                      <img 
                        src={profileImage} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      formData.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <label className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <FiCamera className="w-4 h-4 text-gray-600" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* User Info */}
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{formData.name}</h2>
                <p className="text-gray-600 mb-1">{formData.email}</p>
                <p className="text-sm text-gray-500 mb-4">{formData.designation}</p>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-primary-600">12</div>
                    <div className="text-xs text-gray-600">Tasks</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-green-600">8</div>
                    <div className="text-xs text-gray-600">Completed</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="card-header">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
                    <p className="text-sm text-gray-600 mt-1">Update your profile details</p>
                  </div>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="btn btn-outline"
                  >
                    {isEditing ? "Cancel" : "Edit Profile"}
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="card-body">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="form-group">
                    <label className="form-label flex items-center gap-2">
                      <FiUser className="w-4 h-4" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`form-input ${!isEditing ? 'bg-gray-50' : ''}`}
                      placeholder="Enter your full name"
                    />
                    {errors.name && (
                      <div className="text-sm text-red-600 mt-1 flex items-center gap-1">
                        <FiAlertCircle className="w-4 h-4" />
                        {errors.name}
                      </div>
                    )}
                  </div>

                  {/* Email */}
                  <div className="form-group">
                    <label className="form-label flex items-center gap-2">
                      <FiMail className="w-4 h-4" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      disabled={true}
                      className="form-input bg-gray-50"
                      placeholder="Enter your email"
                    />
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </div>

                  {/* Phone Number */}
                  <div className="form-group">
                    <label className="form-label flex items-center gap-2">
                      <FiPhone className="w-4 h-4" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`form-input ${!isEditing ? 'bg-gray-50' : ''}`}
                      placeholder="Enter your phone number"
                      maxLength={10}
                    />
                    {errors.mobile && (
                      <div className="text-sm text-red-600 mt-1 flex items-center gap-1">
                        <FiAlertCircle className="w-4 h-4" />
                        {errors.mobile}
                      </div>
                    )}
                  </div>

                  {/* Joining Date */}
                  <div className="form-group">
                    <label className="form-label flex items-center gap-2">
                      <FiCalendar className="w-4 h-4" />
                      Joining Date
                    </label>
                    <input
                      type="date"
                      name="joiningDate"
                      value={formData.joiningDate}
                      disabled={true}
                      className="form-input bg-gray-50"
                    />
                  </div>

                  {/* Designation */}
                  <div className="form-group">
                    <label className="form-label flex items-center gap-2">
                      <FiBriefcase className="w-4 h-4" />
                      Designation
                    </label>
                    <input
                      type="text"
                      name="designation"
                      value={formData.designation}
                      disabled={true}
                      className="form-input bg-gray-50"
                    />
                  </div>

                  {/* Department */}
                  <div className="form-group">
                    <label className="form-label flex items-center gap-2">
                      <FiBriefcase className="w-4 h-4" />
                      Department
                    </label>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      disabled={true}
                      className="form-input bg-gray-50"
                    />
                  </div>
                </div>

                {/* Password Change Section */}
                {isEditing && (
                  <div className="mt-8 pt-8 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Change Password</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Current Password */}
                      <div className="form-group">
                        <label className="form-label flex items-center gap-2">
                          <FiLock className="w-4 h-4" />
                          Current Password
                        </label>
                        <div className="relative">
                          <input
                            type={showCurrentPassword ? "text" : "password"}
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleInputChange}
                            className="form-input pr-10"
                            placeholder="Enter current password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showCurrentPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                          </button>
                        </div>
                        {errors.currentPassword && (
                          <div className="text-sm text-red-600 mt-1 flex items-center gap-1">
                            <FiAlertCircle className="w-4 h-4" />
                            {errors.currentPassword}
                          </div>
                        )}
                      </div>

                      {/* New Password */}
                      <div className="form-group">
                        <label className="form-label flex items-center gap-2">
                          <FiLock className="w-4 h-4" />
                          New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? "text" : "password"}
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleInputChange}
                            className="form-input pr-10"
                            placeholder="Enter new password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showNewPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                          </button>
                        </div>
                        
                        {/* Password Strength Indicator */}
                        {formData.newPassword && (
                          <div className="mt-2">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                                  style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                                ></div>
                              </div>
                              <span className={`text-xs font-medium ${
                                passwordStrength.score <= 1 ? 'text-red-600' :
                                passwordStrength.score <= 2 ? 'text-orange-600' :
                                passwordStrength.score <= 3 ? 'text-yellow-600' :
                                passwordStrength.score <= 4 ? 'text-blue-600' : 'text-green-600'
                              }`}>
                                {passwordStrength.feedback}
                              </span>
                            </div>
                          </div>
                        )}
                        
                        {errors.newPassword && (
                          <div className="text-sm text-red-600 mt-1 flex items-center gap-1">
                            <FiAlertCircle className="w-4 h-4" />
                            {errors.newPassword}
                          </div>
                        )}
                      </div>

                      {/* Confirm Password */}
                      <div className="form-group md:col-span-2">
                        <label className="form-label flex items-center gap-2">
                          <FiLock className="w-4 h-4" />
                          Confirm New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className={`form-input pr-10 ${
                              formData.confirmPassword && formData.newPassword !== formData.confirmPassword
                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                : formData.confirmPassword && formData.newPassword === formData.confirmPassword
                                ? 'border-green-500 focus:border-green-500 focus:ring-green-500'
                                : ''
                            }`}
                            placeholder="Confirm new password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showConfirmPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                          </button>
                        </div>
                        
                        {/* Password Match Indicator */}
                        {formData.confirmPassword && (
                          <div className="mt-2 flex items-center gap-2">
                            {formData.newPassword === formData.confirmPassword ? (
                              <>
                                <FiCheck className="w-4 h-4 text-green-500" />
                                <span className="text-xs text-green-600">Passwords match</span>
                              </>
                            ) : (
                              <>
                                <FiAlertCircle className="w-4 h-4 text-red-500" />
                                <span className="text-xs text-red-600">Passwords do not match</span>
                              </>
                            )}
                          </div>
                        )}
                        
                        {errors.confirmPassword && (
                          <div className="text-sm text-red-600 mt-1 flex items-center gap-1">
                            <FiAlertCircle className="w-4 h-4" />
                            {errors.confirmPassword}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Form Actions */}
                {isEditing && (
                  <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 mt-8">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setErrors({});
                        setFormData(prev => ({
                          ...prev,
                          currentPassword: "",
                          newPassword: "",
                          confirmPassword: ""
                        }));
                      }}
                      className="btn btn-outline flex items-center gap-2"
                    >
                      <FiX className="w-4 h-4" />
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-primary flex items-center gap-2"
                    >
                      {loading ? (
                        <InlineLoader text="Updating..." />
                      ) : (
                        <>
                          <FiSave className="w-4 h-4" />
                          Update Profile
                        </>
                      )}
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
