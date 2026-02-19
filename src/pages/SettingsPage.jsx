import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useDarkMode } from '../App';
import { 
  Settings, Bell, Shield, Globe, Moon, Sun, User,
  Mail, Lock, Eye, EyeOff, Volume2, Vibrate,
  Wifi, Battery, Download, Upload, Trash2,
  Save, Check, X, AlertTriangle, RefreshCw,
  CreditCard, Gift, HelpCircle, LogOut,
  ChevronRight, Palette, Type, Monitor,
  Smartphone, Tablet, Languages, Clock,
  Calendar, DollarSign, Percent, Star,
  Crown, Sparkles
} from 'lucide-react';
import { toast } from 'react-toastify';

const SettingsPage = () => {
  const { t, i18n } = useTranslation();
  const { currentUser, logout, isPremium } = useAuth();
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [activeTab, setActiveTab] = useState('general');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Form states
  const [profileSettings, setProfileSettings] = useState({
    displayName: currentUser?.displayName || currentUser?.fullName || 'User',
    email: currentUser?.email || '',
    bio: t('settings.profile.defaultBio'),
    location: 'India',
    website: '',
    twitter: '',
    github: ''
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    quizReminders: true,
    achievementAlerts: true,
    newsletter: false,
    marketingEmails: false,
    soundEffects: true,
    vibration: false
  });

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    showActivity: true,
    showAchievements: true,
    allowMessages: 'friends',
    showEmail: false,
    twoFactorAuth: false,
    loginAlerts: true
  });

  const [appSettings, setAppSettings] = useState({
    language: i18n.language || 'en',
    theme: darkMode ? 'dark' : 'light',
    fontSize: 'medium',
    reduceAnimations: false,
    compactMode: false,
    autoPlayMedia: true,
    downloadOverWifi: true,
    offlineMode: false
  });

  const [premiumSettings, setPremiumSettings] = useState({
    isPremium: currentUser?.isPremium || false,
    subscriptionPlan: 'free',
    nextBilling: '2025-04-15',
    autoRenew: true
  });

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // All 22 Indian languages
  const languages = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
    { code: 'bn', name: 'Bengali', native: 'বাংলা' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు' },
    { code: 'mr', name: 'Marathi', native: 'मराठी' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
    { code: 'ur', name: 'Urdu', native: 'اردو' },
    { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
    { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
    { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
    { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ' },
    { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
    { code: 'as', name: 'Assamese', native: 'অসমীয়া' },
    { code: 'mai', name: 'Maithili', native: 'मैथिली' },
    { code: 'sat', name: 'Santali', native: 'ᱥᱟᱱᱛᱟᱲᱤ' },
    { code: 'ks', name: 'Kashmiri', native: 'कॉशुर' },
    { code: 'ne', name: 'Nepali', native: 'नेपाली' },
    { code: 'sd', name: 'Sindhi', native: 'سنڌي' },
    { code: 'kok', name: 'Konkani', native: 'कोंकणी' },
    { code: 'doi', name: 'Dogri', native: 'डोगरी' },
    { code: 'mni', name: 'Manipuri', native: 'মৈতৈলোন্' },
    { code: 'bodo', name: 'Bodo', native: 'बर' }
  ];

  const fontSizeOptions = [
    { value: 'small', label: t('settings.appearance.fontSize.small'), preview: 'text-sm' },
    { value: 'medium', label: t('settings.appearance.fontSize.medium'), preview: 'text-base' },
    { value: 'large', label: t('settings.appearance.fontSize.large'), preview: 'text-lg' },
    { value: 'xlarge', label: t('settings.appearance.fontSize.xlarge'), preview: 'text-xl' }
  ];

  const tabs = [
    { id: 'general', label: t('settings.tabs.general'), icon: <Settings className="w-4 h-4" /> },
    { id: 'profile', label: t('settings.tabs.profile'), icon: <User className="w-4 h-4" /> },
    { id: 'notifications', label: t('settings.tabs.notifications'), icon: <Bell className="w-4 h-4" /> },
    { id: 'privacy', label: t('settings.tabs.privacy'), icon: <Shield className="w-4 h-4" /> },
    { id: 'appearance', label: t('settings.tabs.appearance'), icon: <Palette className="w-4 h-4" /> },
    { id: 'language', label: t('settings.tabs.language'), icon: <Languages className="w-4 h-4" /> },
    { id: 'premium', label: t('settings.tabs.premium'), icon: <Star className="w-4 h-4" /> },
    { id: 'account', label: t('settings.tabs.account'), icon: <Lock className="w-4 h-4" /> }
  ];

  // Language change handler
  const changeLanguage = (langCode) => {
    i18n.changeLanguage(langCode);
    setAppSettings({ ...appSettings, language: langCode });
    localStorage.setItem('appLanguage', langCode);
    toast.success(t('settings.language.changed', { language: languages.find(l => l.code === langCode)?.name }));
  };

  const handleSaveProfile = () => {
    toast.success(t('settings.messages.profileSaved'));
  };

  const handleSaveNotifications = () => {
    toast.success(t('settings.messages.notificationsSaved'));
  };

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error(t('settings.messages.passwordMismatch'));
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error(t('settings.messages.passwordTooShort'));
      return;
    }
    toast.success(t('settings.messages.passwordChanged'));
    setShowPasswordModal(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleDeleteAccount = () => {
    toast.error(t('settings.messages.deleteDemo'));
    setShowDeleteConfirm(false);
  };

  const handleLogout = async () => {
    await logout();
    toast.success(t('settings.messages.logoutSuccess'));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-black' : 'bg-gray-50'
    }`}>
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -right-40 w-96 h-96 rounded-full filter blur-3xl opacity-20 animate-blob ${
          darkMode ? 'bg-green-900/30' : 'bg-green-300'
        }`}></div>
        <div className={`absolute -bottom-40 -left-40 w-96 h-96 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-2000 ${
          darkMode ? 'bg-blue-900/30' : 'bg-blue-300'
        }`}></div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className={`mb-8 p-6 rounded-3xl relative overflow-hidden ${
          darkMode
            ? 'bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800'
            : 'bg-gradient-to-br from-green-50 to-blue-50 border border-gray-200'
        }`}>
          <div className="relative z-10">
            <h1 className={`text-3xl md:text-4xl font-black mb-2 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {t('settings.title')}
            </h1>
            <p className={`text-sm max-w-2xl ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {t('settings.subtitle')}
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Tabs */}
          <div className="lg:w-64 flex-shrink-0">
            <div className={`sticky top-24 rounded-2xl p-4 ${
              darkMode
                ? 'bg-black border border-gray-800'
                : 'bg-white border border-gray-200'
            }`}>
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      activeTab === tab.id
                        ? darkMode
                          ? 'bg-green-600/20 text-green-400 border border-green-800'
                          : 'bg-green-50 text-green-700 border border-green-200'
                        : darkMode
                          ? 'text-gray-400 hover:bg-gray-900 hover:text-white'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <span className={activeTab === tab.id ? 'text-green-500' : ''}>
                      {tab.icon}
                    </span>
                    <span className="flex-1 text-left text-sm font-medium">{tab.label}</span>
                    <ChevronRight className="w-4 h-4 opacity-50" />
                  </button>
                ))}
              </nav>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 mt-4 ${
                  darkMode
                    ? 'text-red-400 hover:bg-red-950/30 hover:text-red-300'
                    : 'text-red-600 hover:bg-red-50 hover:text-red-700'
                }`}
              >
                <LogOut className="w-4 h-4" />
                <span className="flex-1 text-left text-sm font-medium">{t('settings.buttons.logout')}</span>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            <div className={`rounded-3xl p-6 md:p-8 ${
              darkMode
                ? 'bg-black border border-gray-800'
                : 'bg-white border border-gray-200'
            }`}>
              {/* General Settings */}
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <h2 className={`text-xl font-bold mb-6 flex items-center gap-2 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    <Settings className="w-5 h-5 text-green-500" />
                    {t('settings.general.title')}
                  </h2>

                  <div className="space-y-4">
                    {/* Language Selection */}
                    <div className={`p-5 rounded-xl border transition-all duration-200 ${
                      darkMode ? 'border-gray-800 hover:border-gray-700' : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl ${
                          darkMode ? 'bg-green-900/30' : 'bg-green-100'
                        }`}>
                          <Languages className={`w-5 h-5 ${
                            darkMode ? 'text-green-400' : 'text-green-600'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <h3 className={`font-medium mb-1 ${
                            darkMode ? 'text-white' : 'text-gray-900'
                          }`}>{t('settings.general.language')}</h3>
                          <p className={`text-sm mb-3 ${
                            darkMode ? 'text-gray-500' : 'text-gray-500'
                          }`}>{t('settings.general.languageDesc')}</p>
                          <select
                            value={appSettings.language}
                            onChange={(e) => changeLanguage(e.target.value)}
                            className={`w-full md:w-64 px-4 py-2 rounded-xl text-sm ${
                              darkMode
                                ? 'bg-gray-900 text-white border-gray-700'
                                : 'bg-gray-50 text-gray-900 border-gray-200'
                            } border focus:outline-none focus:ring-2 focus:ring-green-500/50`}
                          >
                            {languages.map(lang => (
                              <option key={lang.code} value={lang.code}>
                                {lang.native} ({lang.name})
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Time Zone */}
                    <div className={`p-5 rounded-xl border transition-all duration-200 ${
                      darkMode ? 'border-gray-800 hover:border-gray-700' : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl ${
                          darkMode ? 'bg-blue-900/30' : 'bg-blue-100'
                        }`}>
                          <Clock className={`w-5 h-5 ${
                            darkMode ? 'text-blue-400' : 'text-blue-600'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <h3 className={`font-medium mb-1 ${
                            darkMode ? 'text-white' : 'text-gray-900'
                          }`}>{t('settings.general.timezone')}</h3>
                          <p className={`text-sm mb-3 ${
                            darkMode ? 'text-gray-500' : 'text-gray-500'
                          }`}>{t('settings.general.timezoneDesc')}</p>
                          <select
                            className={`w-full md:w-64 px-4 py-2 rounded-xl text-sm ${
                              darkMode
                                ? 'bg-gray-900 text-white border-gray-700'
                                : 'bg-gray-50 text-gray-900 border-gray-200'
                            } border focus:outline-none focus:ring-2 focus:ring-green-500/50`}
                          >
                            <option>{t('settings.general.timezones.ist')}</option>
                            <option>{t('settings.general.timezones.est')}</option>
                            <option>{t('settings.general.timezones.pst')}</option>
                            <option>{t('settings.general.timezones.gmt')}</option>
                            <option>{t('settings.general.timezones.aest')}</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Date Format */}
                    <div className={`p-5 rounded-xl border transition-all duration-200 ${
                      darkMode ? 'border-gray-800 hover:border-gray-700' : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl ${
                          darkMode ? 'bg-purple-900/30' : 'bg-purple-100'
                        }`}>
                          <Calendar className={`w-5 h-5 ${
                            darkMode ? 'text-purple-400' : 'text-purple-600'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <h3 className={`font-medium mb-1 ${
                            darkMode ? 'text-white' : 'text-gray-900'
                          }`}>{t('settings.general.dateFormat')}</h3>
                          <p className={`text-sm mb-3 ${
                            darkMode ? 'text-gray-500' : 'text-gray-500'
                          }`}>{t('settings.general.dateFormatDesc')}</p>
                          <select
                            className={`w-full md:w-64 px-4 py-2 rounded-xl text-sm ${
                              darkMode
                                ? 'bg-gray-900 text-white border-gray-700'
                                : 'bg-gray-50 text-gray-900 border-gray-200'
                            } border focus:outline-none focus:ring-2 focus:ring-green-500/50`}
                          >
                            <option>DD/MM/YYYY</option>
                            <option>MM/DD/YYYY</option>
                            <option>YYYY-MM-DD</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end pt-4">
                      <button
                        onClick={handleSaveProfile}
                        className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                          darkMode
                            ? 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800'
                            : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
                        }`}
                      >
                        <Save className="w-4 h-4" />
                        {t('settings.buttons.save')}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Profile Settings */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <h2 className={`text-xl font-bold mb-6 flex items-center gap-2 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    <User className="w-5 h-5 text-green-500" />
                    {t('settings.profile.title')}
                  </h2>

                  <div className="space-y-4">
                    {/* Display Name */}
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>{t('settings.profile.displayName')}</label>
                      <input
                        type="text"
                        value={profileSettings.displayName}
                        onChange={(e) => setProfileSettings({ ...profileSettings, displayName: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${
                          darkMode
                            ? 'bg-gray-900 text-white border-gray-700 focus:border-green-500 focus:ring-1 focus:ring-green-500'
                            : 'bg-gray-50 text-gray-900 border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500'
                        }`}
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>{t('settings.profile.email')}</label>
                      <input
                        type="email"
                        value={profileSettings.email}
                        readOnly
                        className={`w-full px-4 py-3 rounded-xl border cursor-not-allowed ${
                          darkMode
                            ? 'bg-gray-900/50 text-gray-400 border-gray-700'
                            : 'bg-gray-100 text-gray-500 border-gray-200'
                        }`}
                      />
                      <p className={`text-xs mt-1 ${
                        darkMode ? 'text-gray-600' : 'text-gray-500'
                      }`}>{t('settings.profile.emailReadOnly')}</p>
                    </div>

                    {/* Bio */}
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>{t('settings.profile.bio')}</label>
                      <textarea
                        value={profileSettings.bio}
                        onChange={(e) => setProfileSettings({ ...profileSettings, bio: e.target.value })}
                        rows="3"
                        className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${
                          darkMode
                            ? 'bg-gray-900 text-white border-gray-700 focus:border-green-500 focus:ring-1 focus:ring-green-500'
                            : 'bg-gray-50 text-gray-900 border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500'
                        }`}
                      />
                    </div>

                    {/* Location */}
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>{t('settings.profile.location')}</label>
                      <input
                        type="text"
                        value={profileSettings.location}
                        onChange={(e) => setProfileSettings({ ...profileSettings, location: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${
                          darkMode
                            ? 'bg-gray-900 text-white border-gray-700 focus:border-green-500 focus:ring-1 focus:ring-green-500'
                            : 'bg-gray-50 text-gray-900 border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500'
                        }`}
                      />
                    </div>

                    {/* Social Links */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>{t('settings.profile.website')}</label>
                        <input
                          type="url"
                          value={profileSettings.website}
                          onChange={(e) => setProfileSettings({ ...profileSettings, website: e.target.value })}
                          placeholder="https://"
                          className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${
                            darkMode
                              ? 'bg-gray-900 text-white border-gray-700 focus:border-green-500 focus:ring-1 focus:ring-green-500'
                              : 'bg-gray-50 text-gray-900 border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500'
                          }`}
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>{t('settings.profile.twitter')}</label>
                        <input
                          type="text"
                          value={profileSettings.twitter}
                          onChange={(e) => setProfileSettings({ ...profileSettings, twitter: e.target.value })}
                          placeholder="@username"
                          className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${
                            darkMode
                              ? 'bg-gray-900 text-white border-gray-700 focus:border-green-500 focus:ring-1 focus:ring-green-500'
                              : 'bg-gray-50 text-gray-900 border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end pt-4">
                      <button
                        onClick={handleSaveProfile}
                        className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                          darkMode
                            ? 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800'
                            : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
                        }`}
                      >
                        <Save className="w-4 h-4" />
                        {t('settings.buttons.updateProfile')}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Settings */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h2 className={`text-xl font-bold mb-6 flex items-center gap-2 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    <Bell className="w-5 h-5 text-green-500" />
                    {t('settings.notifications.title')}
                  </h2>

                  <div className="space-y-4">
                    {[
                      { key: 'emailNotifications', label: t('settings.notifications.email'), desc: t('settings.notifications.emailDesc') },
                      { key: 'pushNotifications', label: t('settings.notifications.push'), desc: t('settings.notifications.pushDesc') },
                      { key: 'quizReminders', label: t('settings.notifications.quizReminders'), desc: t('settings.notifications.quizRemindersDesc') },
                      { key: 'achievementAlerts', label: t('settings.notifications.achievements'), desc: t('settings.notifications.achievementsDesc') },
                      { key: 'newsletter', label: t('settings.notifications.newsletter'), desc: t('settings.notifications.newsletterDesc') },
                      { key: 'marketingEmails', label: t('settings.notifications.marketing'), desc: t('settings.notifications.marketingDesc') },
                      { key: 'soundEffects', label: t('settings.notifications.sound'), desc: t('settings.notifications.soundDesc') },
                      { key: 'vibration', label: t('settings.notifications.vibration'), desc: t('settings.notifications.vibrationDesc') }
                    ].map((item) => (
                      <div
                        key={item.key}
                        className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
                          darkMode ? 'border-gray-800 hover:border-gray-700' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            darkMode ? 'bg-gray-900' : 'bg-gray-100'
                          }`}>
                            {item.key.includes('email') && <Mail className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />}
                            {item.key.includes('quiz') && <Calendar className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />}
                            {item.key.includes('achievement') && <Star className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />}
                            {item.key.includes('sound') && <Volume2 className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />}
                            {item.key.includes('vibration') && <Vibrate className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />}
                            {!item.key.match(/(email|quiz|achievement|sound|vibration)/) && <Bell className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />}
                          </div>
                          <div>
                            <h3 className={`font-medium ${
                              darkMode ? 'text-white' : 'text-gray-900'
                            }`}>{item.label}</h3>
                            <p className={`text-xs ${
                              darkMode ? 'text-gray-500' : 'text-gray-500'
                            }`}>{item.desc}</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notificationSettings[item.key]}
                            onChange={(e) => setNotificationSettings({ ...notificationSettings, [item.key]: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className={`w-11 h-6 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${
                            darkMode
                              ? 'bg-gray-700 peer-checked:bg-green-600'
                              : 'bg-gray-300 peer-checked:bg-green-500'
                          }`}></div>
                        </label>
                      </div>
                    ))}

                    {/* Save Button */}
                    <div className="flex justify-end pt-4">
                      <button
                        onClick={handleSaveNotifications}
                        className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                          darkMode
                            ? 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800'
                            : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
                        }`}
                      >
                        <Save className="w-4 h-4" />
                        {t('settings.buttons.savePreferences')}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Privacy Settings */}
              {activeTab === 'privacy' && (
                <div className="space-y-6">
                  <h2 className={`text-xl font-bold mb-6 flex items-center gap-2 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    <Shield className="w-5 h-5 text-green-500" />
                    {t('settings.privacy.title')}
                  </h2>

                  <div className="space-y-4">
                    {/* Profile Visibility */}
                    <div className={`p-5 rounded-xl border ${
                      darkMode ? 'border-gray-800' : 'border-gray-200'
                    }`}>
                      <h3 className={`font-medium mb-3 ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>{t('settings.privacy.profileVisibility')}</h3>
                      <select
                        value={privacySettings.profileVisibility}
                        onChange={(e) => setPrivacySettings({ ...privacySettings, profileVisibility: e.target.value })}
                        className={`w-full md:w-64 px-4 py-2 rounded-xl text-sm ${
                          darkMode
                            ? 'bg-gray-900 text-white border-gray-700'
                            : 'bg-gray-50 text-gray-900 border-gray-200'
                        } border focus:outline-none focus:ring-2 focus:ring-green-500/50`}
                      >
                        <option value="public">{t('settings.privacy.visibility.public')}</option>
                        <option value="friends">{t('settings.privacy.visibility.friends')}</option>
                        <option value="private">{t('settings.privacy.visibility.private')}</option>
                      </select>
                    </div>

                    {/* Toggle Options */}
                    {[
                      { key: 'showActivity', label: t('settings.privacy.showActivity'), desc: t('settings.privacy.showActivityDesc') },
                      { key: 'showAchievements', label: t('settings.privacy.showAchievements'), desc: t('settings.privacy.showAchievementsDesc') },
                      { key: 'showEmail', label: t('settings.privacy.showEmail'), desc: t('settings.privacy.showEmailDesc') },
                      { key: 'twoFactorAuth', label: t('settings.privacy.twoFactor'), desc: t('settings.privacy.twoFactorDesc') },
                      { key: 'loginAlerts', label: t('settings.privacy.loginAlerts'), desc: t('settings.privacy.loginAlertsDesc') }
                    ].map((item) => (
                      <div
                        key={item.key}
                        className={`flex items-center justify-between p-4 rounded-xl border ${
                          darkMode ? 'border-gray-800' : 'border-gray-200'
                        }`}
                      >
                        <div>
                          <h3 className={`font-medium ${
                            darkMode ? 'text-white' : 'text-gray-900'
                          }`}>{item.label}</h3>
                          <p className={`text-xs ${
                            darkMode ? 'text-gray-500' : 'text-gray-500'
                          }`}>{item.desc}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={privacySettings[item.key]}
                            onChange={(e) => setPrivacySettings({ ...privacySettings, [item.key]: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className={`w-11 h-6 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${
                            darkMode
                              ? 'bg-gray-700 peer-checked:bg-green-600'
                              : 'bg-gray-300 peer-checked:bg-green-500'
                          }`}></div>
                        </label>
                      </div>
                    ))}

                    {/* Change Password Button */}
                    <div className={`p-5 rounded-xl border ${
                      darkMode ? 'border-gray-800' : 'border-gray-200'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className={`font-medium ${
                            darkMode ? 'text-white' : 'text-gray-900'
                          }`}>{t('settings.privacy.password')}</h3>
                          <p className={`text-xs ${
                            darkMode ? 'text-gray-500' : 'text-gray-500'
                          }`}>{t('settings.privacy.passwordDesc')}</p>
                        </div>
                        <button
                          onClick={() => setShowPasswordModal(true)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            darkMode
                              ? 'bg-gray-900 text-gray-300 hover:bg-gray-800'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {t('settings.buttons.changePassword')}
                        </button>
                      </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end pt-4">
                      <button
                        onClick={() => toast.success(t('settings.messages.privacySaved'))}
                        className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                          darkMode
                            ? 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800'
                            : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
                        }`}
                      >
                        <Save className="w-4 h-4" />
                        {t('settings.buttons.savePrivacy')}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Appearance Settings */}
              {activeTab === 'appearance' && (
                <div className="space-y-6">
                  <h2 className={`text-xl font-bold mb-6 flex items-center gap-2 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    <Palette className="w-5 h-5 text-green-500" />
                    {t('settings.appearance.title')}
                  </h2>

                  <div className="space-y-4">
                    {/* Dark Mode Toggle */}
                    <div className={`p-5 rounded-xl border ${
                      darkMode ? 'border-gray-800' : 'border-gray-200'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            darkMode ? 'bg-gray-900' : 'bg-gray-100'
                          }`}>
                            {darkMode ? (
                              <Moon className={`w-5 h-5 ${darkMode ? 'text-yellow-400' : 'text-gray-600'}`} />
                            ) : (
                              <Sun className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-yellow-500'}`} />
                            )}
                          </div>
                          <div>
                            <h3 className={`font-medium ${
                              darkMode ? 'text-white' : 'text-gray-900'
                            }`}>{t('settings.appearance.darkMode')}</h3>
                            <p className={`text-xs ${
                              darkMode ? 'text-gray-500' : 'text-gray-500'
                            }`}>{t('settings.appearance.darkModeDesc')}</p>
                          </div>
                        </div>
                        <button
                          onClick={toggleDarkMode}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            darkMode
                              ? 'bg-gray-900 text-gray-300 hover:bg-gray-800'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {darkMode ? t('settings.appearance.switchToLight') : t('settings.appearance.switchToDark')}
                        </button>
                      </div>
                    </div>

                    {/* Font Size */}
                    <div className={`p-5 rounded-xl border ${
                      darkMode ? 'border-gray-800' : 'border-gray-200'
                    }`}>
                      <h3 className={`font-medium mb-3 ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>{t('settings.appearance.fontSize.title')}</h3>
                      <div className="flex gap-2">
                        {fontSizeOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => setAppSettings({ ...appSettings, fontSize: option.value })}
                            className={`flex-1 px-4 py-3 rounded-xl border transition-all duration-200 ${
                              appSettings.fontSize === option.value
                                ? darkMode
                                  ? 'border-green-500 bg-green-500/10 text-green-400'
                                  : 'border-green-500 bg-green-50 text-green-700'
                                : darkMode
                                  ? 'border-gray-700 text-gray-400 hover:border-gray-600'
                                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
                            }`}
                          >
                            <span className={option.preview}>Aa</span>
                            <span className="block text-xs mt-1">{option.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Additional Options */}
                    {[
                      { key: 'reduceAnimations', label: t('settings.appearance.reduceAnimations'), desc: t('settings.appearance.reduceAnimationsDesc') },
                      { key: 'compactMode', label: t('settings.appearance.compactMode'), desc: t('settings.appearance.compactModeDesc') },
                      { key: 'autoPlayMedia', label: t('settings.appearance.autoPlay'), desc: t('settings.appearance.autoPlayDesc') },
                      { key: 'downloadOverWifi', label: t('settings.appearance.downloadWifi'), desc: t('settings.appearance.downloadWifiDesc') },
                      { key: 'offlineMode', label: t('settings.appearance.offlineMode'), desc: t('settings.appearance.offlineModeDesc') }
                    ].map((item) => (
                      <div
                        key={item.key}
                        className={`flex items-center justify-between p-4 rounded-xl border ${
                          darkMode ? 'border-gray-800' : 'border-gray-200'
                        }`}
                      >
                        <div>
                          <h3 className={`font-medium ${
                            darkMode ? 'text-white' : 'text-gray-900'
                          }`}>{item.label}</h3>
                          <p className={`text-xs ${
                            darkMode ? 'text-gray-500' : 'text-gray-500'
                          }`}>{item.desc}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={appSettings[item.key]}
                            onChange={(e) => setAppSettings({ ...appSettings, [item.key]: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className={`w-11 h-6 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${
                            darkMode
                              ? 'bg-gray-700 peer-checked:bg-green-600'
                              : 'bg-gray-300 peer-checked:bg-green-500'
                          }`}></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Language Settings - Dedicated Tab */}
              {activeTab === 'language' && (
                <div className="space-y-6">
                  <h2 className={`text-xl font-bold mb-6 flex items-center gap-2 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    <Languages className="w-5 h-5 text-green-500" />
                    {t('settings.language.title')}
                  </h2>

                  <div className="space-y-4">
                    <p className={`text-sm ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {t('settings.language.description')}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-2">
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => changeLanguage(lang.code)}
                          className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
                            appSettings.language === lang.code
                              ? darkMode
                                ? 'border-green-500 bg-green-500/10'
                                : 'border-green-500 bg-green-50'
                              : darkMode
                                ? 'border-gray-800 hover:border-gray-700'
                                : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="text-left">
                            <div className={`font-medium ${
                              darkMode ? 'text-white' : 'text-gray-900'
                            }`}>{lang.native}</div>
                            <div className={`text-xs ${
                              darkMode ? 'text-gray-500' : 'text-gray-500'
                            }`}>{lang.name}</div>
                          </div>
                          {appSettings.language === lang.code && (
                            <Check className="w-5 h-5 text-green-500" />
                          )}
                        </button>
                      ))}
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end pt-4">
                      <button
                        onClick={() => toast.success(t('settings.messages.languageSaved'))}
                        className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                          darkMode
                            ? 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800'
                            : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
                        }`}
                      >
                        <Save className="w-4 h-4" />
                        {t('settings.buttons.saveLanguage')}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Premium Settings */}
              {activeTab === 'premium' && (
                <div className="space-y-6">
                  <h2 className={`text-xl font-bold mb-6 flex items-center gap-2 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    <Star className="w-5 h-5 text-green-500" />
                    {t('settings.premium.title')}
                  </h2>

                  {isPremium ? (
                    <div className="space-y-4">
                      <div className={`p-6 rounded-xl border ${
                        darkMode ? 'border-green-800 bg-green-900/20' : 'border-green-200 bg-green-50'
                      }`}>
                        <div className="flex items-center gap-3 mb-4">
                          <div className={`p-3 rounded-full ${
                            darkMode ? 'bg-green-900/50' : 'bg-green-100'
                          }`}>
                            <Crown className={`w-6 h-6 ${
                              darkMode ? 'text-green-400' : 'text-green-600'
                            }`} />
                          </div>
                          <div>
                            <h3 className={`text-lg font-bold ${
                              darkMode ? 'text-white' : 'text-gray-900'
                            }`}>{t('settings.premium.active')}</h3>
                            <p className={`text-sm ${
                              darkMode ? 'text-gray-400' : 'text-gray-600'
                            }`}>{t('settings.premium.activeDesc')}</p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className={`flex justify-between py-2 border-b ${
                            darkMode ? 'border-gray-800' : 'border-gray-200'
                          }`}>
                            <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{t('settings.premium.plan')}</span>
                            <span className={`font-medium ${
                              darkMode ? 'text-white' : 'text-gray-900'
                            }`}>{t('settings.premium.annualPlan')}</span>
                          </div>
                          <div className={`flex justify-between py-2 border-b ${
                            darkMode ? 'border-gray-800' : 'border-gray-200'
                          }`}>
                            <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{t('settings.premium.nextBilling')}</span>
                            <span className={`font-medium ${
                              darkMode ? 'text-white' : 'text-gray-900'
                            }`}>{premiumSettings.nextBilling}</span>
                          </div>
                          <div className="flex justify-between py-2">
                            <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{t('settings.premium.autoRenew')}</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={premiumSettings.autoRenew}
                                onChange={(e) => setPremiumSettings({ ...premiumSettings, autoRenew: e.target.checked })}
                                className="sr-only peer"
                              />
                              <div className={`w-11 h-6 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${
                                darkMode
                                  ? 'bg-gray-700 peer-checked:bg-green-600'
                                  : 'bg-gray-300 peer-checked:bg-green-500'
                              }`}></div>
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                            darkMode
                              ? 'bg-gray-900 text-gray-300 hover:bg-gray-800'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {t('settings.premium.manageSubscription')}
                        </button>
                        <button
                          className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                            darkMode
                              ? 'bg-gray-900 text-gray-300 hover:bg-gray-800'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {t('settings.premium.viewBenefits')}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className={`p-6 rounded-xl border ${
                        darkMode ? 'border-gray-800' : 'border-gray-200'
                      } text-center`}>
                        <Crown className={`w-12 h-12 mx-auto mb-4 ${
                          darkMode ? 'text-gray-600' : 'text-gray-400'
                        }`} />
                        <h3 className={`text-lg font-bold mb-2 ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>{t('settings.premium.goPremium')}</h3>
                        <p className={`text-sm mb-6 max-w-md mx-auto ${
                          darkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {t('settings.premium.benefits')}
                        </p>
                        <Link
                          to="/upgrade"
                          className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                            darkMode
                              ? 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800'
                              : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
                          }`}
                        >
                          <Sparkles className="w-4 h-4" />
                          {t('settings.premium.upgrade')}
                        </Link>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        {[
                          t('settings.premium.features.unlimitedQuizzes'),
                          t('settings.premium.features.detailedAnalytics'),
                          t('settings.premium.features.achievements'),
                          t('settings.premium.features.prioritySupport'),
                          t('settings.premium.features.noAds'),
                          t('settings.premium.features.exportData')
                        ].map((feature) => (
                          <div
                            key={feature}
                            className={`flex items-center gap-2 p-3 rounded-xl border ${
                              darkMode ? 'border-gray-800' : 'border-gray-200'
                            }`}
                          >
                            <Check className="w-4 h-4 text-green-500" />
                            <span className={`text-sm ${
                              darkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Account Settings */}
              {activeTab === 'account' && (
                <div className="space-y-6">
                  <h2 className={`text-xl font-bold mb-6 flex items-center gap-2 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    <Lock className="w-5 h-5 text-green-500" />
                    {t('settings.account.title')}
                  </h2>

                  <div className="space-y-4">
                    {/* Danger Zone */}
                    <div className={`p-5 rounded-xl border ${
                      darkMode ? 'border-red-900/50 bg-red-950/20' : 'border-red-200 bg-red-50'
                    }`}>
                      <h3 className={`font-bold mb-3 flex items-center gap-2 ${
                        darkMode ? 'text-red-400' : 'text-red-600'
                      }`}>
                        <AlertTriangle className="w-5 h-5" />
                        {t('settings.account.dangerZone')}
                      </h3>

                      <div className="space-y-3">
                        {/* Export Data */}
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className={`font-medium ${
                              darkMode ? 'text-white' : 'text-gray-900'
                            }`}>{t('settings.account.exportData')}</h4>
                            <p className={`text-xs ${
                              darkMode ? 'text-gray-500' : 'text-gray-500'
                            }`}>{t('settings.account.exportDataDesc')}</p>
                          </div>
                          <button
                            onClick={() => toast.info(t('settings.messages.exportStarted'))}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                              darkMode
                                ? 'bg-gray-900 text-gray-300 hover:bg-gray-800'
                                : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            <Download className="w-4 h-4" />
                            {t('settings.buttons.export')}
                          </button>
                        </div>

                        {/* Delete Account */}
                        <div className="flex items-center justify-between pt-3 border-t border-red-200 dark:border-red-900">
                          <div>
                            <h4 className={`font-medium ${
                              darkMode ? 'text-white' : 'text-gray-900'
                            }`}>{t('settings.account.deleteAccount')}</h4>
                            <p className={`text-xs ${
                              darkMode ? 'text-gray-500' : 'text-gray-500'
                            }`}>{t('settings.account.deleteAccountDesc')}</p>
                          </div>
                          <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 bg-red-500 text-white hover:bg-red-600 flex items-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            {t('settings.buttons.delete')}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Session Management */}
                    <div className={`p-5 rounded-xl border ${
                      darkMode ? 'border-gray-800' : 'border-gray-200'
                    }`}>
                      <h3 className={`font-medium mb-3 ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>{t('settings.account.activeSessions')}</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Monitor className={`w-4 h-4 ${
                              darkMode ? 'text-gray-500' : 'text-gray-400'
                            }`} />
                            <div>
                              <p className={`text-sm font-medium ${
                                darkMode ? 'text-white' : 'text-gray-900'
                              }`}>{t('settings.account.currentDevice')}</p>
                              <p className={`text-xs ${
                                darkMode ? 'text-gray-500' : 'text-gray-500'
                              }`}>{t('settings.account.deviceInfo')}</p>
                            </div>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            darkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-600'
                          }`}>{t('settings.account.active')}</span>
                        </div>
                        <button
                          className={`text-sm flex items-center gap-2 ${
                            darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          <RefreshCw className="w-3 h-3" />
                          {t('settings.account.signOutOthers')}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className={`max-w-md w-full rounded-2xl p-6 ${
            darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'
          }`}>
            <h3 className={`text-lg font-bold mb-4 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>{t('settings.password.title')}</h3>

            <div className="space-y-4">
              {/* Current Password */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>{t('settings.password.current')}</label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? 'text' : 'password'}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border pr-10 ${
                      darkMode
                        ? 'bg-gray-800 text-white border-gray-700 focus:border-green-500'
                        : 'bg-gray-50 text-gray-900 border-gray-200 focus:border-green-500'
                    }`}
                  />
                  <button
                    onClick={() => togglePasswordVisibility('current')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPasswords.current ? (
                      <EyeOff className={`w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    ) : (
                      <Eye className={`w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    )}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>{t('settings.password.new')}</label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border pr-10 ${
                      darkMode
                        ? 'bg-gray-800 text-white border-gray-700 focus:border-green-500'
                        : 'bg-gray-50 text-gray-900 border-gray-200 focus:border-green-500'
                    }`}
                  />
                  <button
                    onClick={() => togglePasswordVisibility('new')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPasswords.new ? (
                      <EyeOff className={`w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    ) : (
                      <Eye className={`w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>{t('settings.password.confirm')}</label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border pr-10 ${
                      darkMode
                        ? 'bg-gray-800 text-white border-gray-700 focus:border-green-500'
                        : 'bg-gray-50 text-gray-900 border-gray-200 focus:border-green-500'
                    }`}
                  />
                  <button
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPasswords.confirm ? (
                      <EyeOff className={`w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    ) : (
                      <Eye className={`w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowPasswordModal(false)}
                className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  darkMode
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t('settings.buttons.cancel')}
              </button>
              <button
                onClick={handleChangePassword}
                className="flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-200 bg-green-500 text-white hover:bg-green-600"
              >
                {t('settings.buttons.updatePassword')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className={`max-w-md w-full rounded-2xl p-6 ${
            darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'
          }`}>
            <div className="text-center">
              <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
                darkMode ? 'bg-red-900/30' : 'bg-red-100'
              }`}>
                <AlertTriangle className={`w-8 h-8 ${
                  darkMode ? 'text-red-400' : 'text-red-600'
                }`} />
              </div>
              <h3 className={`text-lg font-bold mb-2 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>{t('settings.delete.title')}</h3>
              <p className={`text-sm mb-6 ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {t('settings.delete.confirmation')}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    darkMode
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {t('settings.buttons.cancel')}
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-200 bg-red-500 text-white hover:bg-red-600"
                >
                  {t('settings.buttons.delete')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
      `}</style>
    </div>
  );
};

export default SettingsPage;