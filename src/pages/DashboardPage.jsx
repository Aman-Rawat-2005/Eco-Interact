import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDarkMode } from '../App';
import {
  TrendingUp, TrendingDown, Award, Target, Brain, Clock,
  Calendar, Activity, Flame, BookOpen, BarChart3, PieChart,
  LineChart, Download, Share2, ChevronRight, Sparkles,
  CheckCircle, XCircle, AlertCircle, Zap, Leaf, Users,
  Globe, Sun, Moon, Star, Rocket, Medal, Trophy,
  ChevronLeft, ChevronRight as ChevronRightIcon,
  Crown, Lock
} from 'lucide-react';

// ==================== LOCK CARD COMPONENT ====================
const LockCard = ({ isLoginLock, message, onNavigate, dark }) => {
  const bgColor = dark ? '#0d0d0d' : '#ffffff';
  const borderColor = dark ? 'rgba(255,255,255,0.08)' : '#e5e7eb';
  const textPrimary = dark ? '#ffffff' : '#111827';
  const textSecondary = dark ? '#9ca3af' : '#6b7280';

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <div className="max-w-md w-full p-8 rounded-2xl" style={{ 
        backgroundColor: bgColor, 
        border: `1px solid ${borderColor}`, 
        boxShadow: dark ? '0 20px 60px rgba(0,0,0,0.8)' : '0 20px 60px rgba(0,0,0,0.1)' 
      }}>
        <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center`} 
          style={{ backgroundColor: isLoginLock ? (dark ? '#1e1e1e' : '#f3f4f6') : 'rgba(234,179,8,0.15)' }}>
          {isLoginLock ? (
            <Lock className="w-10 h-10" style={{ color: dark ? '#9ca3af' : '#6b7280' }} />
          ) : (
            <Crown className="w-10 h-10 text-yellow-500" />
          )}
        </div>
        <h2 className="text-3xl font-bold mb-3" style={{ color: textPrimary }}>
          {isLoginLock ? 'Login Required' : 'Premium Feature'}
        </h2>
        <p className="text-base mb-8" style={{ color: textSecondary }}>{message}</p>
        <button
          onClick={onNavigate}
          className={`w-full px-6 py-4 text-white font-bold rounded-xl transition-all text-lg ${isLoginLock ? '' : 'flex items-center justify-center gap-3'}`}
          style={isLoginLock 
            ? { backgroundColor: '#16a34a' }
            : { background: 'linear-gradient(to right, #eab308, #f59e0b)' }
          }
          onMouseEnter={e => {
            if (isLoginLock) e.currentTarget.style.backgroundColor = '#15803d';
            else e.currentTarget.style.opacity = '0.9';
          }}
          onMouseLeave={e => {
            if (isLoginLock) e.currentTarget.style.backgroundColor = '#16a34a';
            else e.currentTarget.style.opacity = '1';
          }}
        >
          {!isLoginLock && <Sparkles className="w-5 h-5" />}
          {isLoginLock ? 'Login to Continue' : 'Upgrade to Premium'}
        </button>
      </div>
    </div>
  );
};

const DashboardPage = () => {
  const { currentUser, isAuthenticated, isPremium } = useAuth();
  const { darkMode } = useDarkMode();
  const navigate = useNavigate();

  const [timeRange, setTimeRange] = useState('month');
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [quizData, setQuizData] = useState([]);
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    averageAccuracy: 0,
    bestScore: 0,
    totalQuestions: 0,
    streakDays: 0,
    longestStreak: 0,
    perfectQuizzes: 0,
    topicsMastered: 0,
    totalTimeSpent: 0,
    rank: 'Eco Learner',
    nextRank: 'Eco Explorer',
    rankProgress: 65
  });

  // ==================== AUTH CHECKS ====================
  
  // Agar user logged in nahi hai
  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-black' : 'bg-gray-50'}`}>
        <LockCard 
          isLoginLock={true}
          message="Please login to view your dashboard and track your learning progress."
          onNavigate={() => navigate("/login")}
          dark={darkMode}
        />
      </div>
    );
  }

  // Agar user logged in hai but premium nahi hai
  if (!isPremium) {
    return (
      <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-black' : 'bg-gray-50'}`}>
        <LockCard 
          isLoginLock={false}
          message="Upgrade to premium to access detailed analytics, progress tracking, and personalized insights."
          onNavigate={() => navigate("/upgrade")}
          dark={darkMode}
        />
      </div>
    );
  }

  // ✅ PREMIUM USER - अब ही data load होगा और पूरा page दिखेगा
  useEffect(() => {
    loadQuizData();
  }, []);

  const loadQuizData = () => {
    try {
      const saved = localStorage.getItem('quizHistory');
      if (saved) {
        const history = JSON.parse(saved);
        setQuizData(history);
        calculateDetailedStats(history);
      } else {
        // Generate sample data for demonstration
        const sampleData = generateSampleData();
        setQuizData(sampleData);
        calculateDetailedStats(sampleData);
      }
    } catch (e) {
      console.error('Failed to load quiz data', e);
    }
  };

  const generateSampleData = () => {
    const topics = ['Energy Flow', 'Succession', 'Food Chain', 'Biodiversity', 'Carbon Cycle', 'Ecosystems', 'Climate Change'];
    const difficulties = ['easy', 'medium', 'hard'];
    const data = [];
    
    // Create data for multiple months with varying quiz counts
    const startDate = new Date(2025, 0, 1); // Jan 1, 2025
    const endDate = new Date(2025, 2, 31); // Mar 31, 2025
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const date = new Date(d);
      const dayOfWeek = date.getDay();
      
      // Random quiz count based on day of week - ensuring some days have multiple quizzes
      let quizCount = 0;
      if (dayOfWeek === 2) { // Tuesday
        quizCount = 4 + Math.floor(Math.random() * 4); // 4-7 quizzes
      } else if (dayOfWeek === 4) { // Thursday
        quizCount = 3 + Math.floor(Math.random() * 3); // 3-5 quizzes
      } else if (dayOfWeek === 6) { // Saturday
        quizCount = 2 + Math.floor(Math.random() * 3); // 2-4 quizzes
      } else if (Math.random() > 0.6) { // Random other days
        quizCount = 1 + Math.floor(Math.random() * 2); // 1-2 quizzes
      }
      
      for (let j = 0; j < quizCount; j++) {
        const accuracy = 50 + Math.random() * 45;
        const totalQ = 10;
        const correct = Math.round((accuracy / 100) * totalQ);
        
        data.push({
          id: Date.now() - j,
          date: date.toISOString(),
          topicFocus: topics[(date.getDate() + j) % topics.length],
          difficulty: difficulties[(date.getMonth() + j) % difficulties.length],
          accuracy: accuracy,
          score: correct - Math.random() * 0.5,
          totalQuestions: totalQ,
          correctAnswers: correct,
          mode: j % 3 === 0 ? 'timed' : 'practice',
          timeSpent: Math.floor(60 + Math.random() * 240)
        });
      }
    }
    
    return data.sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const calculateDetailedStats = (data) => {
    if (!data || data.length === 0) return;

    const sorted = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
    const total = sorted.length;
    const avgAcc = sorted.reduce((s, q) => s + (q.accuracy || 0), 0) / total;
    const best = Math.max(...sorted.map(q => q.score || 0));
    const totalQ = sorted.reduce((s, q) => s + (q.totalQuestions || 0), 0);
    const totalTime = sorted.reduce((s, q) => s + (q.timeSpent || 0), 0);
    const perfect = sorted.filter(q => q.accuracy >= 90).length;

    // Calculate streak
    let currentStreak = 0;
    let longestStreak = 0;
    const uniqueDates = [...new Set(sorted.map(q => new Date(q.date).toDateString()))].sort((a, b) => new Date(b) - new Date(a));
    
    if (uniqueDates.length) {
      currentStreak = 1;
      for (let i = 0; i < uniqueDates.length - 1; i++) {
        const diff = Math.round((new Date(uniqueDates[i]) - new Date(uniqueDates[i + 1])) / 86400000);
        if (diff === 1) currentStreak++;
        else break;
      }
      
      // Calculate longest streak
      let tempStreak = 1;
      for (let i = 0; i < uniqueDates.length - 1; i++) {
        const diff = Math.round((new Date(uniqueDates[i]) - new Date(uniqueDates[i + 1])) / 86400000);
        if (diff === 1) {
          tempStreak++;
          longestStreak = Math.max(longestStreak, tempStreak);
        } else {
          tempStreak = 1;
        }
      }
    }

    // Calculate topics mastered (accuracy > 75% in a topic with at least 3 quizzes)
    const topicPerf = {};
    sorted.forEach(q => {
      if (!q.topicFocus) return;
      if (!topicPerf[q.topicFocus]) {
        topicPerf[q.topicFocus] = { count: 0, totalAcc: 0 };
      }
      topicPerf[q.topicFocus].count++;
      topicPerf[q.topicFocus].totalAcc += q.accuracy || 0;
    });

    const topicsMastered = Object.values(topicPerf).filter(t => 
      t.count >= 3 && (t.totalAcc / t.count) >= 75
    ).length;

    setStats({
      totalQuizzes: total,
      averageAccuracy: avgAcc,
      bestScore: best,
      totalQuestions: totalQ,
      streakDays: currentStreak,
      longestStreak: longestStreak,
      perfectQuizzes: perfect,
      topicsMastered: topicsMastered,
      totalTimeSpent: totalTime,
      rank: currentStreak > 20 ? 'Eco Master' : currentStreak > 10 ? 'Eco Explorer' : 'Eco Learner',
      nextRank: currentStreak > 20 ? 'Eco Legend' : currentStreak > 10 ? 'Eco Master' : 'Eco Explorer',
      rankProgress: currentStreak > 20 ? 90 : currentStreak > 10 ? 70 : 45
    });
  };

  // Format time
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  // Get last 30 days data for bar chart
  const getLast30DaysData = () => {
    const today = new Date();
    const last30Days = [];
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toDateString();
      
      const dayQuizzes = quizData.filter(q => new Date(q.date).toDateString() === dateStr);
      
      last30Days.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        count: dayQuizzes.length,
        fullDate: date
      });
    }
    
    return last30Days;
  };

  // Get monthly heatmap data for selected month - UPDATED: Removed week 6, made smaller
  const getMonthlyHeatmap = (month) => {
    const year = month.getFullYear();
    const monthIndex = month.getMonth();
    
    // Get first and last day of month
    const firstDay = new Date(year, monthIndex, 1);
    const lastDay = new Date(year, monthIndex + 1, 0);
    
    const daysInMonth = lastDay.getDate();
    const firstDayOfWeek = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Adjust to Monday as first day of week (0 = Monday, 6 = Sunday)
    const adjustedFirstDay = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
    
    // Calculate number of weeks needed (max 5 weeks instead of 6)
    const totalDays = daysInMonth + adjustedFirstDay;
    const numWeeks = Math.min(5, Math.ceil(totalDays / 7));
    
    // Create grid with only 5 weeks max
    const weeks = [];
    let currentDay = 1;
    
    for (let week = 0; week < numWeeks; week++) {
      const weekData = [];
      for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
        if (week === 0 && dayOfWeek < adjustedFirstDay) {
          // Days before month starts
          weekData.push({
            date: null,
            count: 0,
            isCurrentMonth: false
          });
        } else if (currentDay <= daysInMonth) {
          // Days in month
          const date = new Date(year, monthIndex, currentDay);
          const dateStr = date.toDateString();
          const dayQuizzes = quizData.filter(q => new Date(q.date).toDateString() === dateStr);
          
          weekData.push({
            date: new Date(date),
            count: dayQuizzes.length,
            isCurrentMonth: true,
            day: currentDay
          });
          currentDay++;
        } else {
          // Days after month ends
          weekData.push({
            date: null,
            count: 0,
            isCurrentMonth: false
          });
        }
      }
      weeks.push(weekData);
    }
    
    return weeks;
  };

  const getTopicPerformance = () => {
    const topicMap = {};
    quizData.forEach(q => {
      if (!q.topicFocus) return;
      if (!topicMap[q.topicFocus]) {
        topicMap[q.topicFocus] = { total: 0, count: 0 };
      }
      topicMap[q.topicFocus].total += q.accuracy;
      topicMap[q.topicFocus].count++;
    });
    
    return Object.entries(topicMap)
      .map(([topic, data]) => ({
        topic,
        accuracy: data.total / data.count,
        quizzes: data.count
      }))
      .sort((a, b) => b.accuracy - a.accuracy);
  };

  const getWeeklyData = () => {
    const weeks = [];
    const today = new Date();
    
    for (let w = 4; w >= 0; w--) {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - (w * 7) - 6);
      const weekEnd = new Date(today);
      weekEnd.setDate(today.getDate() - (w * 7));
      
      const weekQuizzes = quizData.filter(q => {
        const date = new Date(q.date);
        return date >= weekStart && date <= weekEnd;
      });
      
      const avgAcc = weekQuizzes.length > 0
        ? weekQuizzes.reduce((s, q) => s + q.accuracy, 0) / weekQuizzes.length
        : 0;
      
      weeks.push({
        week: `Week ${w + 1}`,
        accuracy: avgAcc,
        count: weekQuizzes.length,
        start: weekStart
      });
    }
    
    return weeks;
  };

  const getDifficultyPerformance = () => {
    const diffMap = { easy: { total: 0, count: 0 }, medium: { total: 0, count: 0 }, hard: { total: 0, count: 0 } };
    
    quizData.forEach(q => {
      if (!q.difficulty) return;
      diffMap[q.difficulty].total += q.accuracy;
      diffMap[q.difficulty].count++;
    });
    
    return Object.entries(diffMap).map(([diff, data]) => ({
      difficulty: diff,
      accuracy: data.count > 0 ? data.total / data.count : 0,
      count: data.count
    }));
  };

  const last30Days = getLast30DaysData();
  const topicPerformance = getTopicPerformance();
  const weeklyData = getWeeklyData();
  const difficultyData = getDifficultyPerformance();
  const monthlyHeatmap = getMonthlyHeatmap(selectedMonth);

  // Get accuracy color
  const getAccColor = (acc) => {
    if (acc >= 80) return { bg: darkMode ? '#4ade80' : '#22c55e', text: darkMode ? '#4ade80' : '#16a34a' };
    if (acc >= 60) return { bg: darkMode ? '#facc15' : '#eab308', text: darkMode ? '#facc15' : '#ca8a04' };
    return { bg: darkMode ? '#f87171' : '#ef4444', text: darkMode ? '#f87171' : '#dc2626' };
  };

  // Max quizzes per day for scaling (set to 20)
  const MAX_QUIZZES_PER_DAY = 20;

  // Month navigation
  const goToPreviousMonth = () => {
    setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 1));
  };

  const goToCurrentMonth = () => {
    setSelectedMonth(new Date());
  };

  // Format month for display
  const formatMonth = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
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
        <div className={`absolute top-1/2 left-1/3 w-96 h-96 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-4000 ${
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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-2 ${
                darkMode ? 'bg-gray-900 text-green-400' : 'bg-green-100 text-green-700'
              }`}>
                <Rocket className="w-3 h-3" />
                Analytics Dashboard
              </div>
              <h1 className={`text-3xl md:text-4xl font-black ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Your Learning Journey
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-300 ${
                  darkMode
                    ? 'bg-gray-900 text-white border-gray-700'
                    : 'bg-white text-gray-900 border-gray-200'
                }`}
              >
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
                <option value="year">Last Year</option>
                <option value="all">All Time</option>
              </select>

              <button
                className={`p-2 rounded-xl transition-all duration-300 ${
                  darkMode
                    ? 'bg-gray-900 text-gray-400 hover:text-white'
                    : 'bg-white text-gray-600 hover:text-gray-900'
                }`}
              >
                <Download className="w-5 h-5" />
              </button>

              <button
                className={`p-2 rounded-xl transition-all duration-300 ${
                  darkMode
                    ? 'bg-gray-900 text-gray-400 hover:text-white'
                    : 'bg-white text-gray-600 hover:text-gray-900'
                }`}
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Card */}
        <div className={`mb-8 p-6 rounded-3xl relative overflow-hidden ${
          darkMode
            ? 'bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800'
            : 'bg-gradient-to-br from-green-50 to-blue-50 border border-gray-200'
        }`}>
          <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
            <Brain className="w-full h-full text-green-500" />
          </div>
          <div className="relative z-10">
            <h2 className={`text-2xl font-bold mb-2 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Welcome back, {currentUser?.firstName || currentUser?.displayName || 'Learner'}! 👋
            </h2>
            <p className={`text-sm max-w-2xl ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              You've made incredible progress. Keep up the momentum! Your dedication to learning ecology is inspiring.
              {stats.streakDays > 0 && ` You're on a ${stats.streakDays}-day streak!`}
            </p>
            
            <div className="flex flex-wrap gap-4 mt-4">
              <div className={`px-4 py-2 rounded-xl ${
                darkMode ? 'bg-black/50' : 'bg-white/50'
              }`}>
                <span className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Current Rank</span>
                <div className="flex items-center gap-2">
                  <Medal className="w-4 h-4 text-yellow-500" />
                  <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stats.rank}</span>
                </div>
              </div>
              
              <div className={`px-4 py-2 rounded-xl ${
                darkMode ? 'bg-black/50' : 'bg-white/50'
              }`}>
                <span className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Next Rank</span>
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-purple-500" />
                  <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stats.nextRank}</span>
                </div>
              </div>
            </div>

            {/* Progress to next rank */}
            <div className="mt-4 max-w-md">
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Progress to {stats.nextRank}</span>
                <span className={`text-xs font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stats.rankProgress}%</span>
              </div>
              <div className={`w-full h-2 rounded-full ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-green-500 to-blue-500"
                  style={{ width: `${stats.rankProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid - 6 Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {[
            { icon: <Brain className="w-5 h-5" />, label: 'Total Quizzes', value: stats.totalQuizzes, color: 'blue' },
            { icon: <Target className="w-5 h-5" />, label: 'Avg Accuracy', value: `${stats.averageAccuracy.toFixed(1)}%`, color: 'green' },
            { icon: <Flame className="w-5 h-5" />, label: 'Current Streak', value: `${stats.streakDays}d`, color: 'orange' },
            { icon: <Trophy className="w-5 h-5" />, label: 'Best Score', value: stats.bestScore.toFixed(1), color: 'yellow' },
            { icon: <Clock className="w-5 h-5" />, label: 'Time Spent', value: formatTime(stats.totalTimeSpent), color: 'purple' },
            { icon: <Award className="w-5 h-5" />, label: 'Questions', value: stats.totalQuestions, color: 'blue' }
          ].map((stat, index) => {
            // Dynamic color classes
            const bgColor = darkMode ? `bg-${stat.color}-900/30` : `bg-${stat.color}-100`;
            const textColor = `${stat.color}-500`;
            
            return (
              <div
                key={index}
                className={`rounded-2xl p-4 transition-all duration-300 hover:scale-105 ${
                  darkMode
                    ? 'bg-black border border-gray-800'
                    : 'bg-white border border-gray-200'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${bgColor}`}>
                  <div className={textColor}>{stat.icon}</div>
                </div>
                <div className={`text-xl font-black ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>{stat.value}</div>
                <div className={`text-xs ${
                  darkMode ? 'text-gray-500' : 'text-gray-500'
                }`}>{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Chart 1: Daily Quiz Activity - Bar Chart */}
        <div className={`mb-8 p-6 rounded-3xl ${
          darkMode
            ? 'bg-black border border-gray-800'
            : 'bg-white border border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className={`text-lg font-bold flex items-center gap-2 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                <BarChart3 className="w-5 h-5 text-green-500" />
                Daily Quiz Activity
              </h2>
              <p className={`text-xs mt-1 ${
                darkMode ? 'text-gray-500' : 'text-gray-500'
              }`}>Number of quizzes per day (max: {MAX_QUIZZES_PER_DAY})</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>High (10-20)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Medium (5-9)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Low (1-4)</span>
              </div>
            </div>
          </div>

          <div className="relative h-80">
            {/* Y-axis with grid lines */}
            <div className="absolute left-0 right-0 h-full">
              {[20, 16, 12, 8, 4, 0].map((value) => {
                const topPosition = (1 - (value / MAX_QUIZZES_PER_DAY)) * 100;
                return (
                  <div
                    key={value}
                    className="absolute left-0 right-0 flex items-center"
                    style={{ top: `${topPosition}%` }}
                  >
                    <span className={`text-xs w-8 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                      {value}
                    </span>
                    <div className={`flex-1 h-px ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`} />
                  </div>
                );
              })}
            </div>
            
            {/* Chart Area with bars */}
            <div className="absolute inset-0 flex items-end ml-12" style={{ height: '100%' }}>
              {last30Days.map((day, index) => {
                // Calculate bar height based on count (max 20 quizzes = 100% height)
                const barHeight = (day.count / MAX_QUIZZES_PER_DAY) * 100;
                
                // Color based on count
                let barColor = darkMode ? '#ef4444' : '#dc2626'; // red for low (1-4)
                if (day.count >= 10) barColor = darkMode ? '#4ade80' : '#22c55e'; // green for high (10-20)
                else if (day.count >= 5) barColor = darkMode ? '#facc15' : '#eab308'; // yellow for medium (5-9)
                else if (day.count === 0) barColor = darkMode ? '#374151' : '#e5e7eb'; // gray for no activity
                
                return (
                  <div
                    key={index}
                    className="flex-1 flex flex-col items-center justify-end h-full group"
                    style={{ height: '100%' }}
                  >
                    {/* Bar container */}
                    <div className="relative w-full flex justify-center" style={{ height: '100%' }}>
                      {/* The actual bar */}
                      <div
                        className="absolute bottom-0 w-full max-w-[24px] rounded-t-lg transition-all duration-300 group-hover:opacity-80 cursor-pointer"
                        style={{
                          height: `${barHeight}%`,
                          backgroundColor: barColor,
                          minHeight: day.count > 0 ? '4px' : '2px'
                        }}
                      />
                      
                      {/* Tooltip */}
                      {day.count > 0 && (
                        <div className={`absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 ${
                          darkMode ? 'bg-gray-900' : 'bg-white'
                        } text-xs rounded-lg px-2 py-1 shadow-lg whitespace-nowrap border ${
                          darkMode ? 'border-gray-700' : 'border-gray-200'
                        }`}>
                          <div className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {day.count} quiz{day.count !== 1 ? 'zes' : ''}
                          </div>
                          <div className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                            {day.date}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Date label - show every 5th day */}
                    {index % 5 === 0 && (
                      <span className={`text-[8px] mt-2 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                        {day.date}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Summary */}
          <div className="mt-6 flex justify-between items-center">
            <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              Total quizzes in last 30 days: {last30Days.reduce((sum, day) => sum + day.count, 0)}
            </span>
            <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              Most active day: {Math.max(...last30Days.map(d => d.count))} quizzes
            </span>
          </div>
        </div>

        {/* Chart 2: Topic Performance & Chart 3: Difficulty Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Topic Performance */}
          <div className={`p-6 rounded-3xl ${
            darkMode
              ? 'bg-black border border-gray-800'
              : 'bg-white border border-gray-200'
          }`}>
            <h2 className={`text-lg font-bold flex items-center gap-2 mb-6 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              <PieChart className="w-5 h-5 text-green-500" />
              Topic Mastery
            </h2>

            <div className="space-y-4">
              {topicPerformance.slice(0, 5).map((topic, index) => {
                const color = getAccColor(topic.accuracy);
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-medium ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>{topic.topic.length > 15 ? topic.topic.substring(0, 12) + '...' : topic.topic}</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold`} style={{ color: color.text }}>
                          {topic.accuracy.toFixed(1)}%
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          darkMode ? 'bg-gray-900 text-gray-400' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {topic.quizzes}
                        </span>
                      </div>
                    </div>
                    <div className={`w-full h-2 rounded-full ${
                      darkMode ? 'bg-gray-900' : 'bg-gray-200'
                    }`}>
                      <div
                        className="h-2 rounded-full transition-all duration-500"
                        style={{ width: `${topic.accuracy}%`, backgroundColor: color.bg }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Difficulty Distribution */}
          <div className={`p-6 rounded-3xl ${
            darkMode
              ? 'bg-black border border-gray-800'
              : 'bg-white border border-gray-200'
          }`}>
            <h2 className={`text-lg font-bold flex items-center gap-2 mb-6 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              <BarChart3 className="w-5 h-5 text-green-500" />
              Performance by Difficulty
            </h2>

            <div className="space-y-6">
              {difficultyData.map((diff, index) => {
                const colors = {
                  easy: { bg: darkMode ? '#4ade80' : '#22c55e', light: darkMode ? '#166534' : '#dcfce7' },
                  medium: { bg: darkMode ? '#facc15' : '#eab308', light: darkMode ? '#854d0e' : '#fef9c3' },
                  hard: { bg: darkMode ? '#f87171' : '#ef4444', light: darkMode ? '#991b1b' : '#fee2e2' }
                };
                
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: colors[diff.difficulty].bg }} />
                        <span className={`text-sm font-medium capitalize ${
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>{diff.difficulty}</span>
                      </div>
                      <span className={`text-sm font-bold ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>{diff.accuracy.toFixed(1)}%</span>
                    </div>
                    
                    <div className={`w-full h-2 rounded-full ${
                      darkMode ? 'bg-gray-900' : 'bg-gray-200'
                    }`}>
                      <div
                        className="h-2 rounded-full transition-all duration-500"
                        style={{ width: `${diff.accuracy}%`, backgroundColor: colors[diff.difficulty].bg }}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className={`text-xs ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                        {diff.count} quizzes
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Chart 4: Weekly Progress & Chart 5: Monthly Heatmap (Smaller) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Weekly Progress */}
          <div className={`p-6 rounded-3xl ${
            darkMode
              ? 'bg-black border border-gray-800'
              : 'bg-white border border-gray-200'
          }`}>
            <h2 className={`text-lg font-bold flex items-center gap-2 mb-6 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              <Calendar className="w-5 h-5 text-green-500" />
              Weekly Performance
            </h2>

            <div className="space-y-4">
              {weeklyData.map((week, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>{week.week}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${
                        week.accuracy >= 80 ? 'text-green-500' : week.accuracy >= 60 ? 'text-yellow-500' : 'text-red-500'
                      }`}>
                        {week.accuracy.toFixed(1)}%
                      </span>
                      <span className={`text-xs ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                        {week.count} quizzes
                      </span>
                    </div>
                  </div>
                  
                  <div className={`w-full h-2 rounded-full ${
                    darkMode ? 'bg-gray-900' : 'bg-gray-200'
                  }`}>
                    <div
                      className="h-2 rounded-full transition-all duration-500 bg-gradient-to-r from-green-500 to-blue-500"
                      style={{ width: `${week.accuracy}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Heatmap - SMALLER (half the size, max 5 weeks) */}
          <div className={`p-6 rounded-3xl ${
            darkMode
              ? 'bg-black border border-gray-800'
              : 'bg-white border border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-lg font-bold flex items-center gap-2 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                <Activity className="w-5 h-5 text-green-500" />
                Monthly Activity
              </h2>
              
              {/* Month Navigation - Smaller */}
              <div className="flex items-center gap-1">
                <button
                  onClick={goToPreviousMonth}
                  className={`p-1 rounded-lg transition-all duration-200 ${
                    darkMode
                      ? 'bg-gray-900 text-gray-400 hover:text-white hover:bg-gray-800'
                      : 'bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  <ChevronLeft className="w-3 h-3" />
                </button>
                
                <button
                  onClick={goToCurrentMonth}
                  className={`px-2 py-0.5 text-[10px] font-medium rounded-lg transition-all duration-200 ${
                    darkMode
                      ? 'bg-gray-900 text-gray-300 hover:bg-gray-800'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Today
                </button>
                
                <span className={`text-xs font-medium min-w-[100px] text-center ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {formatMonth(selectedMonth)}
                </span>
                
                <button
                  onClick={goToNextMonth}
                  className={`p-1 rounded-lg transition-all duration-200 ${
                    darkMode
                      ? 'bg-gray-900 text-gray-400 hover:text-white hover:bg-gray-800'
                      : 'bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  <ChevronRightIcon className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="flex flex-col items-center">
              {/* Day labels - Smaller */}
              <div className="flex w-full mb-1 text-[8px] text-gray-500">
                <div className="w-6"></div>
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(day => (
                  <div key={day} className="flex-1 text-center">{day}</div>
                ))}
              </div>

              {/* Heatmap rows - Smaller cells, only 5 weeks max */}
              {monthlyHeatmap.map((week, weekIndex) => (
                <div key={weekIndex} className="flex w-full mb-0.5">
                  <div className="w-6 text-[8px] text-gray-500">
                    W{weekIndex + 1}
                  </div>
                  {week.map((cell, dayIndex) => (
                    <div key={dayIndex} className="flex-1 px-[1px]">
                      {cell.isCurrentMonth ? (
                        <div
                          className={`aspect-square rounded-[2px] transition-all duration-200 cursor-pointer group relative ${
                            cell.count === 0
                              ? darkMode ? 'bg-gray-800' : 'bg-gray-200'
                              : cell.count === 1
                              ? darkMode ? 'bg-green-900' : 'bg-green-300'
                              : cell.count === 2
                              ? darkMode ? 'bg-green-700' : 'bg-green-400'
                              : darkMode ? 'bg-green-500' : 'bg-green-500'
                          }`}
                        >
                          {/* Tooltip */}
                          <div className={`absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 ${
                            darkMode ? 'bg-gray-900' : 'bg-white'
                          } text-[8px] rounded px-1 py-0.5 shadow-lg whitespace-nowrap border ${
                            darkMode ? 'border-gray-700' : 'border-gray-200'
                          }`}>
                            <div className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {cell.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </div>
                            <div className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                              {cell.count} quiz{cell.count !== 1 ? 'zes' : ''}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="aspect-square rounded-[2px] bg-transparent" />
                      )}
                    </div>
                  ))}
                </div>
              ))}

              {/* Legend - Smaller */}
              <div className="flex items-center justify-end gap-2 mt-2 text-[6px]">
                <span className={darkMode ? 'text-gray-600' : 'text-gray-400'}>Less</span>
                <div className={`w-2 h-2 rounded-[1px] ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`} />
                <div className={`w-2 h-2 rounded-[1px] ${darkMode ? 'bg-green-900' : 'bg-green-300'}`} />
                <div className={`w-2 h-2 rounded-[1px] ${darkMode ? 'bg-green-700' : 'bg-green-400'}`} />
                <div className={`w-2 h-2 rounded-[1px] ${darkMode ? 'bg-green-500' : 'bg-green-500'}`} />
                <span className={darkMode ? 'text-gray-600' : 'text-gray-400'}>More</span>
              </div>
              
              {/* Month stats - Smaller */}
              <div className="flex justify-between w-full mt-2 text-[8px]">
                <span className={darkMode ? 'text-gray-500' : 'text-gray-500'}>
                  Total: {monthlyHeatmap.flat().filter(cell => cell.isCurrentMonth).reduce((sum, cell) => sum + cell.count, 0)}
                </span>
                <span className={darkMode ? 'text-gray-500' : 'text-gray-500'}>
                  Active: {monthlyHeatmap.flat().filter(cell => cell.isCurrentMonth && cell.count > 0).length} days
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Chart 6: Achievements & Milestones */}
        <div className={`p-6 rounded-3xl ${
          darkMode
            ? 'bg-black border border-gray-800'
            : 'bg-white border border-gray-200'
        }`}>
          <h2 className={`text-lg font-bold flex items-center gap-2 mb-6 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            <Award className="w-5 h-5 text-green-500" />
            Achievements & Milestones
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                icon: <Flame className="w-5 h-5" />,
                title: '7-Day Streak',
                achieved: stats.streakDays >= 7,
                progress: Math.min(100, (stats.streakDays / 7) * 100),
                color: 'orange'
              },
              {
                icon: <Brain className="w-5 h-5" />,
                title: 'Quiz Master',
                achieved: stats.totalQuizzes >= 25,
                progress: Math.min(100, (stats.totalQuizzes / 25) * 100),
                color: 'blue'
              },
              {
                icon: <Target className="w-5 h-5" />,
                title: '90% Accuracy',
                achieved: stats.averageAccuracy >= 90,
                progress: Math.min(100, (stats.averageAccuracy / 90) * 100),
                color: 'green'
              },
              {
                icon: <Trophy className="w-5 h-5" />,
                title: 'Perfect Week',
                achieved: weeklyData.length > 0 && weeklyData.every(w => w.accuracy >= 80),
                progress: weeklyData.length > 0 
                  ? (weeklyData.filter(w => w.accuracy >= 80).length / weeklyData.length) * 100 
                  : 0,
                color: 'yellow'
              },
              {
                icon: <Star className="w-5 h-5" />,
                title: 'Eco Champion',
                achieved: stats.rank === 'Eco Master',
                progress: stats.rankProgress,
                color: 'amber'
              },
              {
                icon: <Award className="w-5 h-5" />,
                title: '50 Quizzes',
                achieved: stats.totalQuizzes >= 50,
                progress: Math.min(100, (stats.totalQuizzes / 50) * 100),
                color: 'indigo'
              },
              {
                icon: <Sparkles className="w-5 h-5" />,
                title: 'All Topics',
                achieved: topicPerformance.length >= 5,
                progress: Math.min(100, (topicPerformance.length / 5) * 100),
                color: 'pink'
              }
            ].map((achievement, index) => {
              const progressValue = Math.min(100, Math.max(0, achievement.progress));
              
              const bgColor = achievement.achieved
                ? darkMode
                  ? 'bg-gradient-to-br from-green-900/50 to-blue-900/50 border border-green-800'
                  : 'bg-gradient-to-br from-green-50 to-blue-50 border border-green-200'
                : darkMode
                  ? 'bg-gray-900 border border-gray-800'
                  : 'bg-gray-50 border border-gray-200';
              
              return (
                <div
                  key={index}
                  className={`p-3 rounded-xl transition-all duration-300 ${bgColor}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                      achievement.achieved
                        ? `bg-${achievement.color}-500 bg-opacity-20`
                        : darkMode ? 'bg-gray-800' : 'bg-gray-200'
                    }`}>
                      <div className={
                        achievement.achieved 
                          ? `text-${achievement.color}-500` 
                          : (darkMode ? 'text-gray-600' : 'text-gray-400')
                      }>
                        {achievement.icon}
                      </div>
                    </div>
                    {achievement.achieved && (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                  
                  <h3 className={`text-xs font-bold mb-1 ${
                    achievement.achieved
                      ? (darkMode ? 'text-white' : 'text-gray-900')
                      : (darkMode ? 'text-gray-500' : 'text-gray-400')
                  }`}>
                    {achievement.title}
                  </h3>
                  
                  <div className="w-full h-1.5 rounded-full bg-gray-200 dark:bg-gray-800 mt-2">
                    <div
                      className={`h-1.5 rounded-full ${
                        achievement.achieved ? 'bg-green-500' : `bg-${achievement.color}-500`
                      }`}
                      style={{ width: `${progressValue}%` }}
                    />
                  </div>
                  
                  <p className={`text-[8px] mt-1 ${
                    achievement.achieved
                      ? 'text-green-500'
                      : darkMode ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    {achievement.achieved ? 'Achieved!' : `${Math.round(progressValue)}%`}
                  </p>
                </div>
              );
            })}
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

export default DashboardPage;