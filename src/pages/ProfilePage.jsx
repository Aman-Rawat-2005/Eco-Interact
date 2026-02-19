import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDarkMode } from '../App';
import { 
  User, Mail, Phone, Calendar, MapPin, 
  Edit2, Shield, CheckCircle, Award, 
  Clock, Globe, Heart, BookOpen,
  Users, Briefcase, GraduationCap,
  ChevronRight, Sparkles, Target,
  TrendingUp, TrendingDown, Activity,
  Flame, Brain, BarChart3
} from 'lucide-react';

const ProfilePage = () => {
  const { currentUser } = useAuth();
  const { darkMode } = useDarkMode();
  const [activeTab, setActiveTab] = useState('personal');
  const [quizStats, setQuizStats] = useState({
    totalQuizzes: 0,
    averageAccuracy: 0,
    bestScore: 0,
    streakDays: 0,
    topicPerformance: {},
    lastVsSecondLast: null,
    latestAccuracy: null,
    previousAccuracy: null,
    recentActivity: []
  });

  // Load quiz statistics from localStorage
  useEffect(() => {
    loadQuizStats();
  }, []);

  const loadQuizStats = () => {
    try {
      const saved = localStorage.getItem('quizHistory');
      if (saved) {
        const history = JSON.parse(saved);
        calculateStats(history);
      } else {
        // If no history, set default values
        setQuizStats({
          totalQuizzes: 0,
          averageAccuracy: 0,
          bestScore: 0,
          streakDays: 0,
          topicPerformance: {},
          lastVsSecondLast: null,
          latestAccuracy: null,
          previousAccuracy: null,
          recentActivity: []
        });
      }
    } catch (e) {
      console.error('Failed to load quiz stats', e);
    }
  };

  const calculateStats = (history) => {
    if (!history || history.length === 0) return;

    // Sort by date (newest first)
    const sorted = [...history].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Basic stats
    const total = sorted.length;
    const avgAcc = sorted.reduce((s, q) => s + (q.accuracy || 0), 0) / total;
    const best = Math.max(...sorted.map(q => q.score || 0));

    // Calculate streak
    let streakDays = 0;
    const uniqueDates = [...new Set(sorted.map(q => new Date(q.date).toDateString()))].sort((a, b) => new Date(b) - new Date(a));
    if (uniqueDates.length) {
      streakDays = 1;
      for (let i = 0; i < uniqueDates.length - 1; i++) {
        const diff = Math.round((new Date(uniqueDates[i]) - new Date(uniqueDates[i + 1])) / 86400000);
        if (diff === 1) streakDays++;
        else break;
      }
    }

    // Topic performance
    const topicPerf = {};
    sorted.forEach(q => {
      if (!q.topicFocus) return;
      if (!topicPerf[q.topicFocus]) {
        topicPerf[q.topicFocus] = { count: 0, totalAcc: 0 };
      }
      topicPerf[q.topicFocus].count++;
      topicPerf[q.topicFocus].totalAcc += q.accuracy || 0;
    });
    
    // Calculate averages for topics
    Object.keys(topicPerf).forEach(t => {
      topicPerf[t].averageAccuracy = topicPerf[t].totalAcc / topicPerf[t].count;
    });

    // Last vs second last comparison
    const byDateAsc = [...sorted].sort((a, b) => new Date(a.date) - new Date(b.date));
    let lastVsSecondLast = null;
    let latestAccuracy = null;
    let previousAccuracy = null;
    
    if (byDateAsc.length >= 2) {
      latestAccuracy = byDateAsc[byDateAsc.length - 1].accuracy;
      previousAccuracy = byDateAsc[byDateAsc.length - 2].accuracy;
      lastVsSecondLast = latestAccuracy - previousAccuracy;
    }

    // Recent activity (last 3 quizzes)
    const recentActivity = sorted.slice(0, 3).map(q => ({
      topic: q.topicFocus || 'Quiz',
      accuracy: q.accuracy || 0,
      date: q.date,
      score: q.score || 0,
      totalQuestions: q.totalQuestions || 10
    }));

    setQuizStats({
      totalQuizzes: total,
      averageAccuracy: avgAcc,
      bestScore: best,
      streakDays,
      topicPerformance: topicPerf,
      lastVsSecondLast,
      latestAccuracy,
      previousAccuracy,
      recentActivity
    });
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format relative time
  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.round((now - date) / 86400000);
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
  };

  // Get user's full name
  const getFullName = () => {
    if (currentUser?.fullName) return currentUser.fullName;
    if (currentUser?.firstName && currentUser?.lastName) {
      return `${currentUser.firstName} ${currentUser.lastName}`;
    }
    if (currentUser?.displayName) return currentUser.displayName;
    return 'User';
  };

  // Get initials for avatar
  const getInitials = () => {
    const name = getFullName();
    if (name === 'User') return 'U';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Get avatar URL
  const getAvatarUrl = () => {
    if (!currentUser) return null;
    const photoUrl = currentUser.photoURL || currentUser.profilePicture || currentUser.avatar;
    if (photoUrl && photoUrl.includes('googleusercontent.com')) {
      return photoUrl.replace(/=s\d+-c/, '=s400-c');
    }
    return photoUrl;
  };

  const avatarUrl = getAvatarUrl();
  const fullName = getFullName();
  const initials = getInitials();

  // Get accuracy color
  const getAccColor = (acc) => {
    return acc >= 80 ? '#22c55e' : acc >= 60 ? '#eab308' : '#ef4444';
  };

  // Information sections
  const personalInfo = [
    { 
      label: 'Full Name', 
      value: fullName, 
      icon: <User className="w-5 h-5" />,
      editable: true 
    },
    { 
      label: 'Email Address', 
      value: currentUser?.email || 'Not provided', 
      icon: <Mail className="w-5 h-5" />,
      verified: true 
    },
    { 
      label: 'Phone Number', 
      value: currentUser?.phone || '+91 98765 43210', 
      icon: <Phone className="w-5 h-5" />,
      editable: true 
    },
    { 
      label: 'Date of Birth', 
      value: formatDate(currentUser?.dateOfBirth), 
      icon: <Calendar className="w-5 h-5" />,
      editable: true 
    },
    { 
      label: 'Gender', 
      value: currentUser?.gender ? currentUser.gender.charAt(0).toUpperCase() + currentUser.gender.slice(1) : 'Not specified', 
      icon: <Users className="w-5 h-5" />,
      editable: true 
    },
    { 
      label: 'Country', 
      value: currentUser?.country || 'India', 
      icon: <MapPin className="w-5 h-5" />,
      editable: true 
    }
  ];

  const accountInfo = [
    { 
      label: 'Member Since', 
      value: currentUser?.createdAt ? formatDate(currentUser.createdAt) : 'January 2025', 
      icon: <Clock className="w-5 h-5" /> 
    },
    { 
      label: 'Account Type', 
      value: currentUser?.isPremium ? 'Premium Member' : 'Free Account', 
      icon: <Award className="w-5 h-5" />,
      badge: !currentUser?.isPremium && 'Upgrade'
    },
    { 
      label: 'Auth Provider', 
      value: currentUser?.authProvider === 'google.com' ? 'Google' : 'Email', 
      icon: <Shield className="w-5 h-5" /> 
    },
    { 
      label: 'Last Login', 
      value: currentUser?.lastLogin ? formatDate(currentUser.lastLogin) : 'Today', 
      icon: <Clock className="w-5 h-5" /> 
    }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-black' : 'bg-gray-50'
    }`}>
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full filter blur-3xl opacity-20 animate-blob ${
          darkMode ? 'bg-green-900/30' : 'bg-green-300'
        }`}></div>
        <div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-2000 ${
          darkMode ? 'bg-blue-900/30' : 'bg-blue-300'
        }`}></div>
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-4000 ${
          darkMode ? 'bg-purple-900/30' : 'bg-purple-300'
        }`}></div>
      </div>

      {/* Header */}
      <div className={`sticky top-0 z-40 backdrop-blur-xl border-b transition-all duration-300 ${
        darkMode 
          ? 'bg-black/80 border-gray-800' 
          : 'bg-white/80 border-gray-200'
      }`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className={`text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent`}>
              My Profile
            </h1>
            
            <Link
              to="/complete-profile"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                darkMode
                  ? 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800'
                  : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
              }`}
            >
              <Edit2 className="w-4 h-4" />
              Edit Profile
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header Card */}
          <div className={`rounded-3xl shadow-2xl overflow-hidden mb-8 transition-all duration-300 ${
            darkMode 
              ? 'bg-black border border-gray-800' 
              : 'bg-white border border-gray-200'
          }`}>
            <div className={`h-32 bg-gradient-to-r from-green-500 to-blue-500 relative`}>
              <div className="absolute inset-0 bg-black/20"></div>
            </div>
            
            <div className="px-8 pb-8">
              <div className="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-16">
                {/* Avatar */}
                <div className="relative">
                  <div className={`absolute -inset-0.5 bg-gradient-to-r from-green-500 to-blue-500 rounded-full opacity-75 blur`}></div>
                  <div className={`relative w-32 h-32 rounded-full overflow-hidden border-4 ${
                    darkMode ? 'border-black' : 'border-white'
                  }`}>
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={fullName}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                        crossOrigin="anonymous"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center">
                        <span className="text-3xl font-bold text-white">{initials}</span>
                      </div>
                    )}
                  </div>
                  
                  {currentUser?.isPremium && (
                    <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 flex items-center justify-center border-2 ${
                      darkMode ? 'border-black' : 'border-white'
                    }`}>
                      <Award className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                
                {/* User Info */}
                <div className="flex-1">
                  <h2 className={`text-3xl font-bold mb-1 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {fullName}
                  </h2>
                  <div className={`flex items-center gap-2 ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    <Mail className="w-4 h-4" />
                    <span>{currentUser?.email}</span>
                    {currentUser?.emailVerified && (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards - From Quiz History */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Total Quizzes */}
            <div className={`rounded-2xl p-5 transition-all duration-300 ${
              darkMode 
                ? 'bg-black border border-gray-800' 
                : 'bg-white border border-gray-200'
            }`}>
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${
                darkMode ? 'bg-gray-900' : 'bg-blue-100'
              }`}>
                <Brain className="w-6 h-6 text-blue-500" />
              </div>
              <div className={`text-3xl font-black mb-1 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>{quizStats.totalQuizzes}</div>
              <div className={`text-sm font-semibold ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>Total Quizzes</div>
            </div>

            {/* Avg Accuracy */}
            <div className={`rounded-2xl p-5 transition-all duration-300 ${
              darkMode 
                ? 'bg-black border border-gray-800' 
                : 'bg-white border border-gray-200'
            }`}>
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${
                darkMode ? 'bg-gray-900' : 'bg-green-100'
              }`}>
                <Target className="w-6 h-6 text-green-500" />
              </div>
              <div className={`text-3xl font-black mb-1 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>{quizStats.averageAccuracy.toFixed(1)}<span className="text-xl">%</span></div>
              <div className={`text-sm font-semibold ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>Avg Accuracy</div>
            </div>

            {/* Streak */}
            <div className={`rounded-2xl p-5 transition-all duration-300 ${
              darkMode 
                ? 'bg-black border border-gray-800' 
                : 'bg-white border border-gray-200'
            }`}>
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${
                darkMode ? 'bg-gray-900' : 'bg-orange-100'
              }`}>
                <Flame className="w-6 h-6 text-orange-500" />
              </div>
              <div className={`text-3xl font-black mb-1 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>{quizStats.streakDays}<span className="text-xl">d</span></div>
              <div className={`text-sm font-semibold ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>Study Streak</div>
            </div>

            {/* Improvement */}
            <div className={`rounded-2xl p-5 transition-all duration-300 ${
              darkMode 
                ? 'bg-black border border-gray-800' 
                : 'bg-white border border-gray-200'
            }`}>
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${
                darkMode ? 'bg-gray-900' : 'bg-purple-100'
              }`}>
                {quizStats.lastVsSecondLast === null ? (
                  <Activity className="w-6 h-6 text-purple-500" />
                ) : quizStats.lastVsSecondLast >= 0 ? (
                  <TrendingUp className="w-6 h-6 text-green-500" />
                ) : (
                  <TrendingDown className="w-6 h-6 text-red-500" />
                )}
              </div>
              {quizStats.lastVsSecondLast === null ? (
                <>
                  <div className={`text-2xl font-black mb-1 ${
                    darkMode ? 'text-gray-500' : 'text-gray-400'
                  }`}>—</div>
                  <div className={`text-sm font-semibold ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>Improvement</div>
                </>
              ) : (
                <>
                  <div className="text-3xl font-black mb-1"
                    style={{ color: quizStats.lastVsSecondLast >= 0 ? (darkMode ? '#4ade80' : '#16a34a') : (darkMode ? '#f87171' : '#dc2626') }}>
                    {quizStats.lastVsSecondLast >= 0 ? '+' : ''}{quizStats.lastVsSecondLast.toFixed(1)}<span className="text-xl">%</span>
                  </div>
                  <div className={`text-sm font-semibold ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>vs Last Quiz</div>
                </>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className={`flex gap-2 mb-6 p-1 rounded-2xl ${
            darkMode ? 'bg-gray-900' : 'bg-gray-100'
          }`}>
            {['personal', 'account', 'learning'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-6 py-3 rounded-xl font-medium capitalize transition-all duration-300 ${
                  activeTab === tab
                    ? darkMode
                      ? 'bg-green-600 text-white shadow-lg'
                      : 'bg-white text-green-600 shadow-lg'
                    : darkMode
                      ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                {tab} Information
              </button>
            ))}
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Info Cards */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information */}
              {activeTab === 'personal' && (
                <div className={`rounded-2xl p-6 transition-all duration-300 ${
                  darkMode 
                    ? 'bg-black border border-gray-800' 
                    : 'bg-white border border-gray-200'
                }`}>
                  <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    <User className="w-5 h-5 text-green-500" />
                    Personal Information
                  </h3>
                  
                  <div className="space-y-4">
                    {personalInfo.map((item, index) => (
                      <div key={index} className={`flex items-start gap-3 p-3 rounded-xl transition-all duration-300 ${
                        darkMode 
                          ? 'hover:bg-gray-900' 
                          : 'hover:bg-gray-50'
                      }`}>
                        <div className={`p-2 rounded-lg ${
                          darkMode ? 'bg-gray-900' : 'bg-gray-100'
                        }`}>
                          <div className={darkMode ? 'text-green-500' : 'text-green-600'}>
                            {item.icon}
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <p className={`text-xs ${
                            darkMode ? 'text-gray-500' : 'text-gray-500'
                          }`}>
                            {item.label}
                          </p>
                          <div className="flex items-center gap-2">
                            <p className={`font-medium ${
                              darkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                              {item.value}
                            </p>
                            {item.verified && (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            )}
                          </div>
                        </div>
                        
                        {item.editable && (
                          <Link
                            to="/complete-profile"
                            className={`p-2 rounded-lg transition-colors ${
                              darkMode 
                                ? 'hover:bg-gray-800 text-gray-500 hover:text-green-500' 
                                : 'hover:bg-gray-200 text-gray-400 hover:text-green-600'
                            }`}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Account Information */}
              {activeTab === 'account' && (
                <div className={`rounded-2xl p-6 transition-all duration-300 ${
                  darkMode 
                    ? 'bg-black border border-gray-800' 
                    : 'bg-white border border-gray-200'
                }`}>
                  <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    <Shield className="w-5 h-5 text-green-500" />
                    Account Information
                  </h3>
                  
                  <div className="space-y-4">
                    {accountInfo.map((item, index) => (
                      <div key={index} className={`flex items-start gap-3 p-3 rounded-xl transition-all duration-300 ${
                        darkMode 
                          ? 'hover:bg-gray-900' 
                          : 'hover:bg-gray-50'
                      }`}>
                        <div className={`p-2 rounded-lg ${
                          darkMode ? 'bg-gray-900' : 'bg-gray-100'
                        }`}>
                          <div className={darkMode ? 'text-green-500' : 'text-green-600'}>
                            {item.icon}
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <p className={`text-xs ${
                            darkMode ? 'text-gray-500' : 'text-gray-500'
                          }`}>
                            {item.label}
                          </p>
                          <div className="flex items-center gap-2">
                            <p className={`font-medium ${
                              darkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                              {item.value}
                            </p>
                            {item.badge && (
                              <Link
                                to="/upgrade"
                                className={`px-2 py-0.5 text-xs rounded-full ${
                                  darkMode
                                    ? 'bg-green-900/30 text-green-400 hover:bg-green-900/50'
                                    : 'bg-green-100 text-green-600 hover:bg-green-200'
                                }`}
                              >
                                {item.badge}
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Learning Statistics */}
              {activeTab === 'learning' && (
                <div className={`rounded-2xl p-6 transition-all duration-300 ${
                  darkMode 
                    ? 'bg-black border border-gray-800' 
                    : 'bg-white border border-gray-200'
                }`}>
                  <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    <BookOpen className="w-5 h-5 text-green-500" />
                    Learning Statistics
                  </h3>
                  
                  {/* Topic Performance */}
                  {Object.keys(quizStats.topicPerformance).length > 0 ? (
                    <div className="space-y-4 mb-6">
                      <h4 className={`text-sm font-medium ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>Topic Performance</h4>
                      {Object.entries(quizStats.topicPerformance).map(([topic, data]) => {
                        const avgAcc = data.averageAccuracy || 0;
                        const color = getAccColor(avgAcc);
                        return (
                          <div key={topic} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className={`text-sm font-medium ${
                                darkMode ? 'text-gray-300' : 'text-gray-700'
                              }`}>{topic}</span>
                              <span className="text-sm font-bold" style={{ color }}>
                                {avgAcc.toFixed(1)}%
                              </span>
                            </div>
                            <div className={`w-full h-2 rounded-full ${
                              darkMode ? 'bg-gray-900' : 'bg-gray-200'
                            }`}>
                              <div 
                                className="h-2 rounded-full transition-all duration-500"
                                style={{ width: `${avgAcc}%`, backgroundColor: color }}
                              />
                            </div>
                            <p className={`text-xs ${
                              darkMode ? 'text-gray-500' : 'text-gray-500'
                            }`}>{data.count} quiz{data.count > 1 ? 'zes' : ''} taken</p>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-6 mb-4">
                      <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                        No quiz data yet. Take your first quiz to see statistics!
                      </p>
                      <Link
                        to="/quiz"
                        className={`inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl text-sm font-medium ${
                          darkMode
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : 'bg-green-500 text-white hover:bg-green-600'
                        }`}
                      >
                        <Brain className="w-4 h-4" />
                        Take a Quiz
                      </Link>
                    </div>
                  )}

                  {/* Recent Activity */}
                  {quizStats.recentActivity.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
                      <h4 className={`text-sm font-medium mb-3 ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>Recent Activity</h4>
                      <div className="space-y-3">
                        {quizStats.recentActivity.map((activity, i) => {
                          const color = getAccColor(activity.accuracy);
                          return (
                            <div key={i} className={`flex items-center gap-3 p-3 rounded-xl ${
                              darkMode ? 'bg-gray-900' : 'bg-gray-50'
                            }`}>
                              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }}></div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <p className={`text-sm font-medium ${
                                    darkMode ? 'text-white' : 'text-gray-900'
                                  }`}>
                                    {activity.topic}
                                  </p>
                                  <span className="text-sm font-bold" style={{ color }}>
                                    {activity.accuracy.toFixed(1)}%
                                  </span>
                                </div>
                                <p className={`text-xs ${
                                  darkMode ? 'text-gray-500' : 'text-gray-500'
                                }`}>
                                  {formatRelativeTime(activity.date)} · {activity.score.toFixed(1)}/{activity.totalQuestions} pts
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      
                      <Link
                        to="/quiz-history"
                        className={`flex items-center justify-between w-full mt-4 p-3 rounded-xl transition-all duration-300 ${
                          darkMode 
                            ? 'hover:bg-gray-900 text-gray-300 hover:text-white' 
                            : 'hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <BarChart3 className="w-4 h-4" />
                          <span className="text-sm">View Full History</span>
                        </div>
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Sidebar - Quick Actions */}
            <div className="space-y-6">
              {/* Profile Completion */}
              <div className={`rounded-2xl p-6 transition-all duration-300 ${
                darkMode 
                  ? 'bg-black border border-gray-800' 
                  : 'bg-white border border-gray-200'
              }`}>
                <h3 className={`text-sm font-medium mb-4 ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>Profile Completion</h3>
                
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs ${
                      darkMode ? 'text-gray-500' : 'text-gray-500'
                    }`}>Overall</span>
                    <span className={`text-xs font-medium ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>75%</span>
                  </div>
                  <div className={`w-full h-2 rounded-full ${
                    darkMode ? 'bg-gray-900' : 'bg-gray-200'
                  }`}>
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-green-500 to-blue-500"
                      style={{ width: '75%' }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-2">
                  {[
                    { label: 'Personal Info', completed: true },
                    { label: 'Profile Photo', completed: !!avatarUrl },
                    { label: 'Phone Number', completed: !!currentUser?.phone },
                    { label: 'Date of Birth', completed: !!currentUser?.dateOfBirth }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      {item.completed ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          darkMode ? 'border-gray-700' : 'border-gray-300'
                        }`}></div>
                      )}
                      <span className={`text-sm ${
                        item.completed 
                          ? darkMode ? 'text-white' : 'text-gray-900'
                          : darkMode ? 'text-gray-600' : 'text-gray-400'
                      }`}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className={`rounded-2xl p-6 transition-all duration-300 ${
                darkMode 
                  ? 'bg-black border border-gray-800' 
                  : 'bg-white border border-gray-200'
              }`}>
                <h3 className={`text-sm font-medium mb-4 ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>Quick Actions</h3>
                
                <div className="space-y-2">
                  <Link
                    to="/complete-profile"
                    className={`flex items-center justify-between w-full p-3 rounded-xl transition-all duration-300 ${
                      darkMode 
                        ? 'hover:bg-gray-900 text-gray-300 hover:text-white' 
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Edit2 className="w-4 h-4" />
                      <span className="text-sm">Edit Profile</span>
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                  
                  <Link
                    to="/dashboard"
                    className={`flex items-center justify-between w-full p-3 rounded-xl transition-all duration-300 ${
                      darkMode 
                        ? 'hover:bg-gray-900 text-gray-300 hover:text-white' 
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <BarChart3 className="w-4 h-4" />
                      <span className="text-sm">Dashboard</span>
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                  
                  <Link
                    to="/quiz-history"
                    className={`flex items-center justify-between w-full p-3 rounded-xl transition-all duration-300 ${
                      darkMode 
                        ? 'hover:bg-gray-900 text-gray-300 hover:text-white' 
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Activity className="w-4 h-4" />
                      <span className="text-sm">Quiz History</span>
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                  
                  <Link
                    to="/quiz"
                    className={`flex items-center justify-between w-full p-3 rounded-xl transition-all duration-300 ${
                      darkMode 
                        ? 'hover:bg-gray-900 text-gray-300 hover:text-white' 
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Brain className="w-4 h-4" />
                      <span className="text-sm">Take a Quiz</span>
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Premium Card */}
              {!currentUser?.isPremium && (
                <div className={`rounded-2xl p-6 bg-gradient-to-br from-green-500 to-blue-500 text-white relative overflow-hidden group`}>
                  <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <div className="relative z-10">
                    <Award className="w-8 h-8 mb-3" />
                    <h4 className="font-bold text-lg mb-1">Go Premium</h4>
                    <p className="text-sm text-white/80 mb-4">Unlock all features and achievements</p>
                    <Link
                      to="/upgrade"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white text-green-600 rounded-xl font-medium text-sm hover:bg-white/90 transition-colors"
                    >
                      Upgrade Now
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              )}
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
      `}</style>
    </div>
  );
};

export default ProfilePage;