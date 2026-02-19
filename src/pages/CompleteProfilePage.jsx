import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDarkMode } from '../App';
import { 
  ArrowLeft, Camera, Save, User, Mail, Phone, 
  Calendar, Globe, X, Loader2,
  CheckCircle, Lock, Shield, MapPin, Cake, Users
} from 'lucide-react';
import { toast } from 'react-toastify';

const CompleteProfilePage = () => {
  const navigate = useNavigate();
  const { currentUser, updateUserProfile } = useAuth();
  const { darkMode } = useDarkMode();
  const fileInputRef = useRef(null);
  const dateInputRef = useRef(null);
  
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  
  // Profile form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: '',
    dateOfBirth: '',
    country: '',
    photoURL: ''
  });
  
  // Preview image state
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [focusedField, setFocusedField] = useState(null);

  // Load user data on mount
  useEffect(() => {
    if (currentUser) {
      setFormData({
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        gender: currentUser.gender || '',
        dateOfBirth: currentUser.dateOfBirth ? new Date(currentUser.dateOfBirth).toISOString().split('T')[0] : '',
        country: currentUser.country || '',
        photoURL: currentUser.photoURL || ''
      });
      if (currentUser.photoURL) {
        setPreviewImage(currentUser.photoURL);
      }
    }
  }, [currentUser]);

  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!formData.firstName?.trim()) {
      errors.firstName = 'First name is required';
    }
    
    if (!formData.lastName?.trim()) {
      errors.lastName = 'Last name is required';
    }
    
    if (formData.phone && !/^[+]?[0-9]{1,4}[0-9]{10,}$/.test(formData.phone.replace(/[\s-]/g, ''))) {
      errors.phone = 'Please enter a valid phone number with country code';
    }
    
    if (formData.dateOfBirth) {
      const dob = new Date(formData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      if (age < 5 || age > 120) {
        errors.dateOfBirth = 'Please enter a valid date of birth';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle file selection for profile image
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setSelectedFile(file);
    setUploadProgress(0);
    
    const reader = new FileReader();
    reader.onloadstart = () => setUploadProgress(30);
    reader.onprogress = (e) => {
      if (e.lengthComputable) {
        setUploadProgress(30 + (e.loaded / e.total) * 40);
      }
    };
    reader.onloadend = () => {
      setUploadProgress(100);
      setPreviewImage(reader.result);
      setTimeout(() => setUploadProgress(0), 500);
    };
    reader.readAsDataURL(file);
  };

  // Upload image - Base64
  const uploadImage = async (file) => {
    setUploading(true);
    try {
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      
      await new Promise(resolve => setTimeout(resolve, 500));
      return base64;
    } catch (error) {
      console.error('Upload error:', error);
      throw new Error('Failed to process image');
    } finally {
      setUploading(false);
    }
  };

  // Open date picker
  const openDatePicker = () => {
    if (dateInputRef.current) {
      dateInputRef.current.showPicker();
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);
    try {
      let photoURL = formData.photoURL;
      
      if (selectedFile) {
        photoURL = await uploadImage(selectedFile);
      }

      const updateData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        fullName: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
        phone: formData.phone?.trim() || '',
        gender: formData.gender || '',
        dateOfBirth: formData.dateOfBirth || null,
        country: formData.country || '',
        photoURL: photoURL,
        profileCompleted: true
      };

      const updated = await updateUserProfile(updateData);
      
      toast.success('✨ Profile completed successfully!');
      
      // Redirect to home page after 1.5 seconds
      setTimeout(() => navigate('/'), 1500);
      
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Countries list
  const countries = [
    'India', 'United States', 'Canada', 'United Kingdom', 'Australia',
    'Germany', 'France', 'Japan', 'China', 'Brazil', 'Mexico', 'Spain',
    'Italy', 'Netherlands', 'Sweden', 'Norway', 'Denmark', 'Finland',
    'Switzerland', 'Austria', 'Belgium', 'Ireland', 'Portugal', 'Greece',
    'New Zealand', 'Singapore', 'South Korea', 'UAE', 'Saudi Arabia'
  ];

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      darkMode 
        ? 'bg-black' 
        : 'bg-gradient-to-br from-gray-50 to-gray-100'
    }`}>
      {/* Animated Background Elements - Subtle for dark mode */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob ${
          darkMode ? 'bg-green-900/20' : 'bg-green-200'
        }`}></div>
        <div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000 ${
          darkMode ? 'bg-blue-900/20' : 'bg-blue-200'
        }`}></div>
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000 ${
          darkMode ? 'bg-purple-900/20' : 'bg-purple-200'
        }`}></div>
      </div>

      {/* Simple Navigation Bar */}
      <div className={`sticky top-0 z-40 backdrop-blur-xl border-b transition-all duration-300 ${
        darkMode 
          ? 'bg-black/80 border-gray-800' 
          : 'bg-white/80 border-gray-200/50'
      }`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className={`group flex items-center gap-2 transition-all duration-300 hover:-translate-x-1 ${
                darkMode 
                  ? 'text-gray-400 hover:text-green-400' 
                  : 'text-gray-600 hover:text-green-600'
              }`}
            >
              <ArrowLeft className="w-5 h-5 group-hover:animate-pulse" />
              <span className="font-medium">Back</span>
            </button>
            
            <h1 className={`text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent`}>
              Complete Your Profile
            </h1>
            
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 pb-12">
        <div className="max-w-3xl mx-auto">
          {/* Main Content Card */}
          <div className={`rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 ${
            darkMode 
              ? 'bg-black border border-gray-800' 
              : 'bg-white/80 backdrop-blur-xl border border-gray-200/50'
          }`}>
            {/* Profile Image Upload Section - Enhanced */}
            <div className="p-8 md:p-10">
              <div className="flex flex-col items-center mb-10">
                <div className="relative group">
                  {/* Animated rings */}
                  <div className={`absolute -inset-0.5 rounded-full opacity-75 group-hover:opacity-100 blur transition-all duration-500 ${
                    darkMode 
                      ? 'bg-gradient-to-r from-green-500/50 to-blue-500/50' 
                      : 'bg-gradient-to-r from-green-500 to-blue-500'
                  }`}></div>
                  <div className={`absolute -inset-1 rounded-full opacity-0 group-hover:opacity-75 blur-xl transition-opacity duration-500 ${
                    darkMode 
                      ? 'bg-gradient-to-r from-green-500/30 to-blue-500/30' 
                      : 'bg-gradient-to-r from-green-500 to-blue-500'
                  }`}></div>
                  
                  {/* Image container */}
                  <div className={`relative w-36 h-36 rounded-full overflow-hidden border-4 shadow-2xl group-hover:shadow-green-500/30 transition-all duration-500 ${
                    darkMode 
                      ? 'border-gray-800' 
                      : 'border-white'
                  }`}>
                    {previewImage ? (
                      <img
                        src={previewImage}
                        alt="Profile"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        referrerPolicy="no-referrer"
                        crossOrigin="anonymous"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-green-400 via-green-500 to-blue-500 flex items-center justify-center">
                        <User className="w-16 h-16 text-white" />
                      </div>
                    )}
                    
                    {uploadProgress > 0 && uploadProgress < 100 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full border-4 border-white/30 border-t-white animate-spin"></div>
                      </div>
                    )}
                  </div>
                  
                  {/* Upload button */}
                  <button
                    onClick={() => fileInputRef.current.click()}
                    disabled={uploading}
                    className={`absolute -bottom-2 -right-2 w-12 h-12 rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group/btn ${
                      darkMode
                        ? 'bg-gradient-to-r from-green-600 to-green-700 text-white'
                        : 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                    }`}
                  >
                    {uploading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Camera className="w-5 h-5 group-hover/btn:animate-pulse" />
                    )}
                  </button>
                  
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
                
                {/* User info */}
                <div className="mt-6 text-center">
                  <h3 className={`text-2xl font-bold ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {formData.firstName || formData.lastName 
                      ? `${formData.firstName} ${formData.lastName}`.trim()
                      : 'Welcome to EcoInteract!'}
                  </h3>
                  <div className={`flex items-center justify-center gap-2 mt-2 ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{formData.email}</span>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                      darkMode
                        ? 'bg-green-900/30 text-green-400'
                        : 'bg-green-100 text-green-600'
                    }`}>
                      {currentUser?.authProvider === 'google.com' ? 'Google' : 'Email'}
                    </span>
                  </div>
                </div>

                {selectedFile && (
                  <div className={`mt-4 flex items-center gap-2 text-sm px-4 py-2 rounded-full animate-fade-in ${
                    darkMode
                      ? 'bg-green-900/30 text-green-400'
                      : 'bg-green-50 text-green-600'
                  }`}>
                    <CheckCircle className="w-4 h-4" />
                    Image ready for upload
                  </div>
                )}
              </div>

              {/* Account Settings Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* First Name */}
                  <div className="group">
                    <label className={`block text-sm font-medium mb-2 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        onFocus={() => setFocusedField('firstName')}
                        onBlur={() => setFocusedField(null)}
                        className={`w-full px-4 py-3 pl-11 rounded-xl transition-all duration-300 ${
                          darkMode
                            ? `bg-gray-900 text-white border-2 ${
                                formErrors.firstName 
                                  ? 'border-red-500' 
                                  : focusedField === 'firstName'
                                    ? 'border-green-500 ring-4 ring-green-500/20'
                                    : 'border-gray-700'
                              }`
                            : `bg-white/50 backdrop-blur-sm text-gray-900 border-2 ${
                                formErrors.firstName 
                                  ? 'border-red-500' 
                                  : focusedField === 'firstName'
                                    ? 'border-green-500 ring-4 ring-green-500/20'
                                    : 'border-gray-200'
                              }`
                        }`}
                        placeholder="John"
                      />
                      <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors ${
                        focusedField === 'firstName' 
                          ? 'text-green-500' 
                          : darkMode ? 'text-gray-600' : 'text-gray-400'
                        }`}
                      />
                    </div>
                    {formErrors.firstName && (
                      <p className="mt-1 text-sm text-red-500 animate-shake">{formErrors.firstName}</p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div className="group">
                    <label className={`block text-sm font-medium mb-2 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        onFocus={() => setFocusedField('lastName')}
                        onBlur={() => setFocusedField(null)}
                        className={`w-full px-4 py-3 pl-11 rounded-xl transition-all duration-300 ${
                          darkMode
                            ? `bg-gray-900 text-white border-2 ${
                                formErrors.lastName 
                                  ? 'border-red-500' 
                                  : focusedField === 'lastName'
                                    ? 'border-green-500 ring-4 ring-green-500/20'
                                    : 'border-gray-700'
                              }`
                            : `bg-white/50 backdrop-blur-sm text-gray-900 border-2 ${
                                formErrors.lastName 
                                  ? 'border-red-500' 
                                  : focusedField === 'lastName'
                                    ? 'border-green-500 ring-4 ring-green-500/20'
                                    : 'border-gray-200'
                              }`
                        }`}
                        placeholder="Doe"
                      />
                      <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors ${
                        focusedField === 'lastName' 
                          ? 'text-green-500' 
                          : darkMode ? 'text-gray-600' : 'text-gray-400'
                        }`}
                      />
                    </div>
                    {formErrors.lastName && (
                      <p className="mt-1 text-sm text-red-500 animate-shake">{formErrors.lastName}</p>
                    )}
                  </div>

                  {/* Email (Read-only) */}
                  <div className="md:col-span-2 group">
                    <label className={`block text-sm font-medium mb-2 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={formData.email}
                        readOnly
                        className={`w-full px-4 py-3 pl-11 rounded-xl border-2 cursor-not-allowed ${
                          darkMode
                            ? 'bg-gray-900/50 text-gray-400 border-gray-700'
                            : 'bg-gray-100/50 text-gray-500 border-gray-200'
                        }`}
                      />
                      <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                        darkMode ? 'text-gray-600' : 'text-gray-400'
                      }`} />
                      <Lock className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                        darkMode ? 'text-gray-600' : 'text-gray-400'
                      }`} />
                    </div>
                    <p className={`text-xs mt-2 flex items-center gap-1 ${
                      darkMode ? 'text-gray-500' : 'text-gray-500'
                    }`}>
                      <Shield className="w-3 h-3" />
                      Email is verified and cannot be changed
                    </p>
                  </div>

                  {/* Phone Number - Updated with +91 example */}
                  <div className="group">
                    <label className={`block text-sm font-medium mb-2 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Phone Number
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        onFocus={() => setFocusedField('phone')}
                        onBlur={() => setFocusedField(null)}
                        className={`w-full px-4 py-3 pl-11 rounded-xl transition-all duration-300 ${
                          darkMode
                            ? `bg-gray-900 text-white border-2 ${
                                formErrors.phone 
                                  ? 'border-red-500' 
                                  : focusedField === 'phone'
                                    ? 'border-green-500 ring-4 ring-green-500/20'
                                    : 'border-gray-700'
                              }`
                            : `bg-white/50 backdrop-blur-sm text-gray-900 border-2 ${
                                formErrors.phone 
                                  ? 'border-red-500' 
                                  : focusedField === 'phone'
                                    ? 'border-green-500 ring-4 ring-green-500/20'
                                    : 'border-gray-200'
                              }`
                        }`}
                        placeholder="+91 98765 43210"
                      />
                      <Phone className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors ${
                        focusedField === 'phone' 
                          ? 'text-green-500' 
                          : darkMode ? 'text-gray-600' : 'text-gray-400'
                        }`}
                      />
                    </div>
                    {formErrors.phone && (
                      <p className="mt-1 text-sm text-red-500 animate-shake">{formErrors.phone}</p>
                    )}
                  </div>

                  {/* Gender - Redesigned */}
                  <div className="group">
                    <label className={`block text-sm font-medium mb-2 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Gender
                    </label>
                    <div className="relative">
                      <select
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        onFocus={() => setFocusedField('gender')}
                        onBlur={() => setFocusedField(null)}
                        className={`w-full px-4 py-3 pl-11 rounded-xl transition-all duration-300 appearance-none ${
                          darkMode
                            ? `bg-gray-900 text-white border-2 ${
                                focusedField === 'gender'
                                  ? 'border-green-500 ring-4 ring-green-500/20'
                                  : 'border-gray-700'
                              }`
                            : `bg-white/50 backdrop-blur-sm text-gray-900 border-2 ${
                                focusedField === 'gender'
                                  ? 'border-green-500 ring-4 ring-green-500/20'
                                  : 'border-gray-200'
                              }`
                        }`}
                      >
                        <option value="" className={darkMode ? 'bg-gray-900' : ''}>Select gender</option>
                        <option value="male" className={darkMode ? 'bg-gray-900' : ''}>Male</option>
                        <option value="female" className={darkMode ? 'bg-gray-900' : ''}>Female</option>
                        <option value="other" className={darkMode ? 'bg-gray-900' : ''}>Other</option>
                        <option value="prefer-not-to-say" className={darkMode ? 'bg-gray-900' : ''}>Prefer not to say</option>
                      </select>
                      <Users className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors ${
                        focusedField === 'gender' 
                          ? 'text-green-500' 
                          : darkMode ? 'text-gray-600' : 'text-gray-400'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Date of Birth - Redesigned */}
                  <div className="group">
                    <label className={`block text-sm font-medium mb-2 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Date of Birth
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        ref={dateInputRef}
                        value={formData.dateOfBirth}
                        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                        onFocus={() => setFocusedField('dob')}
                        onBlur={() => setFocusedField(null)}
                        className={`w-full px-4 py-3 pl-11 rounded-xl transition-all duration-300 [color-scheme:${darkMode ? 'dark' : 'light'}] ${
                          darkMode
                            ? `bg-gray-900 text-white border-2 ${
                                formErrors.dateOfBirth 
                                  ? 'border-red-500' 
                                  : focusedField === 'dob'
                                    ? 'border-green-500 ring-4 ring-green-500/20'
                                    : 'border-gray-700'
                              }`
                            : `bg-white/50 backdrop-blur-sm text-gray-900 border-2 ${
                                formErrors.dateOfBirth 
                                  ? 'border-red-500' 
                                  : focusedField === 'dob'
                                    ? 'border-green-500 ring-4 ring-green-500/20'
                                    : 'border-gray-200'
                              }`
                        }`}
                      />
                      <Cake className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors ${
                        focusedField === 'dob' 
                          ? 'text-green-500' 
                          : darkMode ? 'text-gray-600' : 'text-gray-400'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={openDatePicker}
                        className={`absolute right-3 top-1/2 transform -translate-y-1/2 px-3 py-1 text-sm rounded-lg transition-colors ${
                          darkMode
                            ? 'bg-gray-800 text-green-400 hover:bg-gray-700'
                            : 'bg-green-100 text-green-600 hover:bg-green-200'
                        }`}
                      >
                        Select
                      </button>
                    </div>
                    {formErrors.dateOfBirth && (
                      <p className="mt-1 text-sm text-red-500 animate-shake">{formErrors.dateOfBirth}</p>
                    )}
                  </div>

                  {/* Country - Redesigned */}
                  <div className="md:col-span-2 group">
                    <label className={`block text-sm font-medium mb-2 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Country
                    </label>
                    <div className="relative">
                      <select
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        onFocus={() => setFocusedField('country')}
                        onBlur={() => setFocusedField(null)}
                        className={`w-full px-4 py-3 pl-11 rounded-xl transition-all duration-300 appearance-none ${
                          darkMode
                            ? `bg-gray-900 text-white border-2 ${
                                focusedField === 'country'
                                  ? 'border-green-500 ring-4 ring-green-500/20'
                                  : 'border-gray-700'
                              }`
                            : `bg-white/50 backdrop-blur-sm text-gray-900 border-2 ${
                                focusedField === 'country'
                                  ? 'border-green-500 ring-4 ring-green-500/20'
                                  : 'border-gray-200'
                              }`
                        }`}
                      >
                        <option value="" className={darkMode ? 'bg-gray-900' : ''}>Select country</option>
                        {countries.map((country) => (
                          <option key={country} value={country} className={darkMode ? 'bg-gray-900' : ''}>
                            {country}
                          </option>
                        ))}
                      </select>
                      <MapPin className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors ${
                        focusedField === 'country' 
                          ? 'text-green-500' 
                          : darkMode ? 'text-gray-600' : 'text-gray-400'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-200/50 dark:border-gray-800">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className={`group relative px-6 py-3 border-2 rounded-xl font-medium transition-all duration-300 overflow-hidden ${
                      darkMode
                        ? 'border-gray-700 text-gray-300 hover:bg-gray-900'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <X className="w-4 h-4" />
                      Cancel
                    </span>
                  </button>
                  
                  <button
                    type="submit"
                    disabled={loading || uploading}
                    className={`group relative flex-1 px-6 py-3 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden ${
                      darkMode
                        ? 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800'
                        : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
                    }`}
                  >
                    <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5 group-hover:animate-bounce" />
                          Complete Profile
                        </>
                      )}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        @keyframes bounce-x {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(5px); }
        }
        .animate-bounce-x {
          animation: bounce-x 1s infinite;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default CompleteProfilePage;