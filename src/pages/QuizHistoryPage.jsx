import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDarkMode } from '../App';
import {
  Calendar, TrendingUp, TrendingDown, Award, Target, Brain, Clock,
  ChevronDown, Download, Filter, Activity, Trash2, BookOpen,
  BarChart3, CheckCircle, XCircle, Flame, ArrowUpRight, ArrowDownRight, Minus,
  Crown, Sparkles, Lock
} from 'lucide-react';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

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

const QuizHistoryPage = () => {
  const { currentUser, isAuthenticated, isPremium } = useAuth();
  const { darkMode } = useDarkMode();
  const navigate = useNavigate();

  const [quizHistory, setQuizHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [hoveredBar, setHoveredBar] = useState(null);
  const [stats, setStats] = useState({
    totalQuizzes: 0, averageAccuracy: 0, bestScore: 0, totalQuestions: 0,
    topicPerformance: {}, streakDays: 0,
    lastVsSecondLast: null, latestAccuracy: null, previousAccuracy: null,
  });

  // ==================== AUTH CHECKS ====================
  
  // Agar user logged in nahi hai
  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-black' : 'bg-gray-50'}`}>
        <LockCard 
          isLoginLock={true}
          message="Please login to view your quiz history and track your progress."
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
          message="Upgrade to premium to access detailed quiz history, analytics, and performance tracking."
          onNavigate={() => navigate("/upgrade")}
          dark={darkMode}
        />
      </div>
    );
  }

  // ✅ PREMIUM USER - अब ही data load होगा और page दिखेगा
  useEffect(() => { loadHistory(); }, []);
  useEffect(() => { applyFiltersAndSort(); }, [quizHistory, selectedPeriod, selectedTopic, sortBy, sortOrder]);
  useEffect(() => { if (filteredHistory.length > 0) calculateStats(); }, [filteredHistory]);

  const loadHistory = () => {
    try {
      const saved = localStorage.getItem('quizHistory');
      if (saved) { 
        setQuizHistory(JSON.parse(saved)); 
      } else { 
        setQuizHistory([]); 
      }
    } catch (e) { 
      toast.error('Failed to load quiz history'); 
    }
  };

  const applyFiltersAndSort = () => {
    let f = [...quizHistory];
    if (selectedPeriod !== 'all') {
      const days = { week: 7, month: 30, year: 365 }[selectedPeriod];
      const cut = new Date(); cut.setDate(cut.getDate() - days);
      f = f.filter(q => new Date(q.date) >= cut);
    }
    if (selectedTopic !== 'all') f = f.filter(q => q.topicFocus === selectedTopic);
    f.sort((a, b) => {
      const aV = sortBy === 'date' ? new Date(a.date).getTime() : sortBy === 'accuracy' ? a.accuracy : a.score;
      const bV = sortBy === 'date' ? new Date(b.date).getTime() : sortBy === 'accuracy' ? b.accuracy : b.score;
      return sortOrder === 'desc' ? bV - aV : aV - bV;
    });
    setFilteredHistory(f);
  };

  const calculateStats = () => {
    if (!filteredHistory.length) return;
    const total = filteredHistory.length;
    const avgAcc = filteredHistory.reduce((s, q) => s + q.accuracy, 0) / total;
    const best = Math.max(...filteredHistory.map(q => q.score || 0));
    const totalQ = filteredHistory.reduce((s, q) => s + (q.totalQuestions || 0), 0);

    const topicPerf = {};
    filteredHistory.forEach(q => {
      if (!q.topicFocus) return;
      if (!topicPerf[q.topicFocus]) topicPerf[q.topicFocus] = { count: 0, totalAcc: 0, best: 0 };
      topicPerf[q.topicFocus].count++;
      topicPerf[q.topicFocus].totalAcc += q.accuracy;
      topicPerf[q.topicFocus].best = Math.max(topicPerf[q.topicFocus].best, q.score || 0);
    });
    Object.keys(topicPerf).forEach(t => { topicPerf[t].averageAccuracy = topicPerf[t].totalAcc / topicPerf[t].count; });

    let streakDays = 0;
    const uDates = [...new Set(filteredHistory.map(q => new Date(q.date).toDateString()))].sort((a, b) => new Date(b) - new Date(a));
    if (uDates.length) { streakDays = 1; for (let i = 0; i < uDates.length - 1; i++) { if (Math.round((new Date(uDates[i]) - new Date(uDates[i + 1])) / 86400000) === 1) streakDays++; else break; } }

    const byDate = [...filteredHistory].sort((a, b) => new Date(a.date) - new Date(b.date));
    let lastVsSecondLast = null, latestAccuracy = null, previousAccuracy = null;
    if (byDate.length >= 2) {
      latestAccuracy = byDate[byDate.length - 1].accuracy;
      previousAccuracy = byDate[byDate.length - 2].accuracy;
      lastVsSecondLast = latestAccuracy - previousAccuracy;
    }

    setStats({ totalQuizzes: total, averageAccuracy: avgAcc, bestScore: best, totalQuestions: totalQ, topicPerformance: topicPerf, streakDays, lastVsSecondLast, latestAccuracy, previousAccuracy });
  };

  const clearHistory = () => {
    if (window.confirm('Clear all quiz history? This cannot be undone.')) {
      localStorage.removeItem('quizHistory'); 
      setQuizHistory([]); 
      setFilteredHistory([]);
      toast.success('History cleared');
    }
  };

  const exportToPDF = () => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(22); doc.setTextColor(39, 174, 96); doc.text('Quiz History Report', 20, 22);
      doc.setFontSize(11); doc.setTextColor(100, 100, 100);
      const name = currentUser?.fullName || currentUser?.displayName || currentUser?.name || 'Student';
      doc.text(`Student: ${name}`, 20, 35); doc.text(`Email: ${currentUser?.email || 'N/A'}`, 20, 42);
      doc.text(`Generated: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`, 20, 49);
      doc.setFontSize(14); doc.setTextColor(0); doc.text('Performance Summary', 20, 63);
      doc.setFontSize(11); doc.setTextColor(80);
      doc.text(`Total Quizzes: ${stats.totalQuizzes}`, 25, 73);
      doc.text(`Average Accuracy: ${stats.averageAccuracy.toFixed(1)}%`, 25, 80);
      doc.text(`Best Score: ${stats.bestScore.toFixed(1)}`, 25, 87);
      doc.text(`Streak: ${stats.streakDays} days`, 25, 94);
      if (stats.lastVsSecondLast !== null) doc.text(`Last Change: ${stats.lastVsSecondLast >= 0 ? '+' : ''}${stats.lastVsSecondLast.toFixed(1)}% (${stats.previousAccuracy?.toFixed(1)}% → ${stats.latestAccuracy?.toFixed(1)}%)`, 25, 101);
      const rows = filteredHistory.slice(0, 25).map(q => [new Date(q.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }), new Date(q.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }), q.topicFocus || 'Mixed', q.difficulty || '-', `${q.accuracy.toFixed(1)}%`, `${(q.score || 0).toFixed(1)}/${q.totalQuestions || 10}`, q.mode === 'timed' ? 'Timed' : 'Practice']);
      doc.autoTable({ startY: 115, head: [['Date', 'Time', 'Topic', 'Difficulty', 'Accuracy', 'Score', 'Mode']], body: rows, theme: 'striped', headStyles: { fillColor: [39, 174, 96], fontSize: 10 }, bodyStyles: { fontSize: 9 } });
      doc.save(`EcoInteract_Quiz_History_${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success('PDF exported!');
    } catch (e) { toast.error('Failed to export PDF'); }
  };

  const fmtDate = d => { const date = new Date(d), diff = Math.round((new Date() - date) / 86400000); if (diff === 0) return 'Today'; if (diff === 1) return 'Yesterday'; if (diff < 7) return `${diff} days ago`; return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); };
  const fmtDT = d => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) + ' · ' + new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  const getUniqueTopics = () => ['all', ...new Set(quizHistory.map(q => q.topicFocus).filter(Boolean))];
  const getAccColor = acc => acc >= 80 ? '#22c55e' : acc >= 60 ? '#eab308' : '#ef4444';
  const getAccTextColor = acc => acc >= 80 ? (D ? '#4ade80' : '#16a34a') : acc >= 60 ? (D ? '#facc15' : '#ca8a04') : (D ? '#f87171' : '#dc2626');

  const D = darkMode;
  const pageSt = D ? { backgroundColor: '#000000', color: '#f3f4f6', minHeight: '100vh' } : {};
  const cardSt = D ? { backgroundColor: '#0d0d0d', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 4px 40px rgba(0,0,0,1)' } : {};
  const panelSt = D ? { backgroundColor: '#111111' } : { backgroundColor: '#f9fafb' };
  const inputSt = D ? { backgroundColor: '#0a0a0a', borderColor: 'rgba(255,255,255,0.10)', color: '#fff' } : {};
  const pageC = D ? 'text-gray-100' : 'bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 text-gray-900';
  const cardC = D ? 'rounded-2xl' : 'bg-white rounded-2xl shadow-xl shadow-green-100/50 border border-gray-100';
  const HT = D ? 'text-white' : 'text-gray-900';
  const ST = D ? 'text-gray-400' : 'text-gray-500';
  const LT = D ? 'text-gray-300' : 'text-gray-600';

  // Chart data
  const chartData = [...filteredHistory].sort((a, b) => new Date(a.date) - new Date(b.date)).slice(-12);

  return (
    <div className={`py-12 px-4 transition-colors duration-300 ${pageC}`} style={pageSt}>
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-3 text-sm font-semibold"
              style={D ? { backgroundColor: '#0a1a0a', color: '#4ade80' } : { backgroundColor: '#dcfce7', color: '#15803d' }}>
              <BarChart3 className="w-4 h-4" /> Analytics Dashboard
            </div>
            <h1 className={`text-3xl md:text-4xl font-black mb-2 ${HT}`}>Quiz History & Analytics</h1>
            <p className={ST}>Track your progress, identify weaknesses, and celebrate growth</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={exportToPDF}
              className="flex items-center gap-2 px-4 py-2.5 text-white rounded-xl font-semibold text-sm transition-colors"
              style={{ backgroundColor: '#16a34a', boxShadow: '0 4px 16px rgba(22,163,74,0.3)' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#15803d'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#16a34a'}>
              <Download className="w-4 h-4" /> Export PDF
            </button>
            <button onClick={clearHistory}
              className="flex items-center gap-2 px-4 py-2.5 text-white rounded-xl font-semibold text-sm"
              style={{ backgroundColor: '#dc2626' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#b91c1c'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#dc2626'}>
              <Trash2 className="w-4 h-4" /> Clear All
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total */}
          <div className={`${cardC} p-5`} style={cardSt}>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
              style={D ? { backgroundColor: '#0a0f1e' } : { backgroundColor: '#dbeafe' }}>
              <Brain className="w-6 h-6 text-blue-500" />
            </div>
            <div className={`text-3xl font-black mb-1 ${HT}`}>{stats.totalQuizzes}</div>
            <div className={`text-sm font-semibold ${LT}`}>Total Quizzes</div>
            <div className={`text-xs mt-0.5 ${ST}`}>quizzes taken</div>
          </div>

          {/* Avg Accuracy */}
          <div className={`${cardC} p-5`} style={cardSt}>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
              style={D ? { backgroundColor: '#0a1a0a' } : { backgroundColor: '#dcfce7' }}>
              <Target className="w-6 h-6 text-green-500" />
            </div>
            <div className={`text-3xl font-black mb-1 ${HT}`}>{stats.averageAccuracy.toFixed(1)}<span className="text-xl">%</span></div>
            <div className={`text-sm font-semibold ${LT}`}>Avg Accuracy</div>
            <div className={`text-xs mt-0.5 ${ST}`}>across all quizzes</div>
          </div>

          {/* Streak */}
          <div className={`${cardC} p-5`} style={cardSt}>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
              style={D ? { backgroundColor: '#1a0a00' } : { backgroundColor: '#ffedd5' }}>
              <Flame className="w-6 h-6 text-orange-500" />
            </div>
            <div className={`text-3xl font-black mb-1 ${HT}`}>{stats.streakDays}<span className="text-xl">d</span></div>
            <div className={`text-sm font-semibold ${LT}`}>Study Streak</div>
            <div className={`text-xs mt-0.5 ${ST}`}>consecutive days</div>
          </div>

          {/* Improvement (last vs second-last) */}
          <div className={`${cardC} p-5`} style={cardSt}>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
              style={D ? { backgroundColor: '#130a2a' } : { backgroundColor: '#f3e8ff' }}>
              {stats.lastVsSecondLast === null ? <Activity className="w-6 h-6 text-purple-500" />
                : stats.lastVsSecondLast >= 0 ? <TrendingUp className="w-6 h-6 text-green-500" />
                  : <TrendingDown className="w-6 h-6 text-red-500" />}
            </div>
            {stats.lastVsSecondLast === null ? (
              <>
                <div className={`text-2xl font-black mb-1 ${ST}`}>—</div>
                <div className={`text-sm font-semibold ${LT}`}>Improvement</div>
                <div className={`text-xs mt-0.5 ${ST}`}>need 2+ quizzes</div>
              </>
            ) : (
              <>
                <div className="text-3xl font-black mb-1"
                  style={{ color: stats.lastVsSecondLast >= 0 ? (D ? '#4ade80' : '#16a34a') : (D ? '#f87171' : '#dc2626') }}>
                  {stats.lastVsSecondLast >= 0 ? '+' : ''}{stats.lastVsSecondLast.toFixed(1)}<span className="text-xl">%</span>
                </div>
                <div className={`text-sm font-semibold ${LT}`}>vs Last Quiz</div>
                <div className={`text-xs mt-0.5 ${ST}`}>
                  {stats.previousAccuracy?.toFixed(1)}% → {stats.latestAccuracy?.toFixed(1)}%
                </div>
              </>
            )}
          </div>
        </div>

        {/* Success Progress Graph */}
        {chartData.length > 1 && (
          <div className={`${cardC} p-6 mb-8`} style={cardSt}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
              <div>
                <h2 className={`text-xl font-bold ${HT}`}>📈 Success Progress Graph</h2>
                <p className={`text-sm mt-1 ${ST}`}>Accuracy per quiz in chronological order — hover bars for details</p>
              </div>
              <div className="flex items-center gap-4 text-xs flex-wrap">
                {[['#22c55e', '≥80% Great'], ['#eab308', '60-79% Good'], ['#ef4444', '<60% Practice']].map(([col, lbl]) => (
                  <span key={lbl} className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: col }} />
                    <span className={ST}>{lbl}</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-3 items-stretch">
              {/* Y-axis */}
              <div className="flex flex-col justify-between items-end flex-shrink-0 w-10" style={{ paddingBottom: 36 }}>
                {[100, 75, 50, 25, 0].map(v => (
                  <span key={v} className={`text-xs font-semibold tabular-nums leading-none ${ST}`}>{v}%</span>
                ))}
              </div>

              {/* Chart */}
              <div className="flex-1 flex flex-col" style={{ minHeight: 260 }}>
                <div className="relative flex-1">
                  {/* Grid lines */}
                  {[0, 25, 50, 75, 100].map(v => (
                    <div key={v} className="absolute left-0 right-0"
                      style={{ bottom: `${v}%`, borderTop: v === 80 ? 'none' : `1px solid ${D ? 'rgba(255,255,255,0.06)' : '#f3f4f6'}` }} />
                  ))}

                  {/* 80% target dashed line */}
                  <div className="absolute left-0 right-0 pointer-events-none" style={{ bottom: '80%' }}>
                    <div style={{ borderTop: `2px dashed rgba(34,197,94,0.5)` }} />
                    <span className="absolute right-0 text-xs font-bold"
                      style={{ top: -20, color: D ? '#4ade80' : '#16a34a' }}>80% target</span>
                  </div>

                  {/* Bars */}
                  <div className="absolute inset-0 flex items-end gap-1.5 px-0.5">
                    {chartData.map((quiz, index) => {
                      const acc = quiz.accuracy;
                      const col = getAccColor(acc);
                      const isH = hoveredBar === quiz.id;
                      const prevAcc = index > 0 ? chartData[index - 1].accuracy : null;
                      const diff = prevAcc !== null ? acc - prevAcc : null;

                      return (
                        <div key={quiz.id} className="flex-1 relative flex flex-col items-center justify-end h-full cursor-pointer"
                          onMouseEnter={() => setHoveredBar(quiz.id)}
                          onMouseLeave={() => setHoveredBar(null)}>

                          {/* Tooltip */}
                          {isH && (
                            <div className="absolute z-30 bottom-full mb-2 left-1/2 -translate-x-1/2 rounded-xl px-3 py-2.5 text-xs pointer-events-none"
                              style={{ minWidth: 170, backgroundColor: '#000000', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 8px 32px rgba(0,0,0,1)', color: '#f3f4f6' }}>
                              <div className="text-base font-black" style={{ color: getAccTextColor(acc) }}>{acc.toFixed(1)}%</div>
                              <div className="font-semibold mt-0.5" style={{ color: '#d1d5db' }}>{quiz.topicFocus}</div>
                              <div className="text-xs mt-0.5" style={{ color: '#6b7280' }}>{fmtDT(quiz.date)}</div>
                              <div className="flex items-center gap-1 mt-1.5 pt-1.5" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                                <CheckCircle className="w-3 h-3 text-green-400" />
                                <span style={{ color: '#9ca3af' }}>{quiz.correctAnswers}/{quiz.totalQuestions} correct</span>
                              </div>
                              {diff !== null && (
                                <div className="mt-1 font-bold" style={{ color: diff >= 0 ? '#4ade80' : '#f87171' }}>
                                  {diff >= 0 ? '▲ +' : '▼ '}{diff.toFixed(1)}% vs prev
                                </div>
                              )}
                            </div>
                          )}

                          {/* Bar */}
                          <div className="w-full rounded-t-md transition-all duration-300"
                            style={{
                              height: `${Math.max(2, acc)}%`,
                              backgroundColor: col,
                              opacity: isH ? 1 : 0.82,
                              transform: isH ? 'scaleX(1.05)' : 'scaleX(1)',
                              boxShadow: isH ? `0 0 16px ${col}80` : 'none',
                            }} />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* X-axis dates */}
                <div className="flex gap-1.5 px-0.5 mt-2" style={{ height: 32 }}>
                  {chartData.map((quiz) => (
                    <div key={quiz.id} className="flex-1 flex items-start justify-center">
                      <span className={`text-center leading-tight ${ST}`} style={{ fontSize: 10 }}>
                        {new Date(quiz.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Trend summary */}
            {chartData.length >= 3 && (() => {
              const first = chartData[0].accuracy, last = chartData[chartData.length - 1].accuracy, d = last - first;
              return (
                <div className="mt-5 flex items-start gap-3 p-4 rounded-xl" style={panelSt}>
                  {d > 5 ? <ArrowUpRight className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    : d < -5 ? <ArrowDownRight className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                      : <Minus className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />}
                  <p className={`text-sm ${LT}`}>
                    <span className="font-bold">Overall Trend: </span>
                    {d > 5 ? `Improving! ${first.toFixed(1)}% → ${last.toFixed(1)}% (+${d.toFixed(1)}pp).`
                      : d < -5 ? `Accuracy dropped by ${Math.abs(d).toFixed(1)}pp. Keep practicing!`
                        : `Steady around ${((first + last) / 2).toFixed(1)}%. Push for more!`}
                  </p>
                </div>
              );
            })()}
          </div>
        )}

        {/* Topic Performance */}
        {Object.keys(stats.topicPerformance).length > 0 && (
          <div className={`${cardC} p-6 mb-8`} style={cardSt}>
            <div className="flex items-center gap-2 mb-6">
              <BookOpen className={`w-5 h-5 ${D ? 'text-green-400' : 'text-green-600'}`} />
              <h2 className={`text-xl font-bold ${HT}`}>Topic Performance</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(stats.topicPerformance).sort((a, b) => b[1].averageAccuracy - a[1].averageAccuracy).map(([topic, data]) => {
                const col = getAccColor(data.averageAccuracy);
                return (
                  <div key={`topic-${topic}`} className="p-5 rounded-xl"
                    style={D ? { backgroundColor: '#111111', border: '1px solid rgba(255,255,255,0.07)' } : { backgroundColor: '#f9fafb', border: '1px solid #f3f4f6' }}>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className={`font-bold text-sm ${HT}`}>{topic}</h3>
                      <span className="text-xs px-2 py-1 rounded-full font-semibold"
                        style={D ? { backgroundColor: '#1e1e1e', color: '#9ca3af' } : { backgroundColor: '#e5e7eb', color: '#6b7280' }}>
                        {data.count} quiz{data.count > 1 ? 'zes' : ''}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs ${ST}`}>Avg Accuracy</span>
                      <span className="text-xl font-black" style={{ color: getAccTextColor(data.averageAccuracy) }}>
                        {data.averageAccuracy.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full h-2.5 rounded-full mb-3" style={{ backgroundColor: D ? '#1e1e1e' : '#e5e7eb' }}>
                      <div className="h-2.5 rounded-full transition-all duration-700"
                        style={{ width: `${data.averageAccuracy}%`, backgroundColor: col }} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs ${ST}`}>Best Score</span>
                      <span className={`text-sm font-bold ${HT}`}>{data.best.toFixed(1)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className={`${cardC} p-6 mb-6`} style={cardSt}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className={`w-5 h-5 ${D ? 'text-green-400' : 'text-green-600'}`} />
              <h2 className={`text-xl font-bold ${HT}`}>Quiz History</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold"
                style={D ? { backgroundColor: '#0a1a0a', color: '#4ade80' } : { backgroundColor: '#dcfce7', color: '#15803d' }}>
                {filteredHistory.length}
              </span>
            </div>
            <button onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${LT}`}
              style={D ? { backgroundColor: '#111111' } : { backgroundColor: '#f3f4f6' }}>
              <Filter className="w-4 h-4" />
              Filters
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-5 pt-5"
              style={{ borderTop: `1px solid ${D ? 'rgba(255,255,255,0.08)' : '#e5e7eb'}` }}>
              {[
                { label: 'Time Period', val: selectedPeriod, set: setSelectedPeriod, opts: [{ v: 'all', l: 'All Time' }, { v: 'week', l: 'Last 7 Days' }, { v: 'month', l: 'Last 30 Days' }, { v: 'year', l: 'Last Year' }] },
                { label: 'Topic', val: selectedTopic, set: setSelectedTopic, opts: getUniqueTopics().map(t => ({ v: t, l: t === 'all' ? 'All Topics' : t })) },
                { label: 'Sort By', val: sortBy, set: setSortBy, opts: [{ v: 'date', l: 'Date' }, { v: 'accuracy', l: 'Accuracy' }, { v: 'score', l: 'Score' }] },
                { label: 'Order', val: sortOrder, set: setSortOrder, opts: [{ v: 'desc', l: 'Newest First' }, { v: 'asc', l: 'Oldest First' }] },
              ].map((f, i) => (
                <div key={i}>
                  <label className={`block text-xs font-semibold mb-2 ${ST}`}>{f.label}</label>
                  <select value={f.val} onChange={e => f.set(e.target.value)}
                    className="w-full p-2.5 border rounded-xl text-sm focus:outline-none"
                    style={{ ...inputSt, ...(D ? {} : { backgroundColor: '#fff', borderColor: '#d1d5db', color: '#111827' }) }}>
                    {f.opts.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                  </select>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* History Cards */}
        {filteredHistory.length > 0 ? (
          <div className="space-y-3">
            {filteredHistory.map((quiz) => {
              const col = getAccColor(quiz.accuracy);
              const byDate = [...filteredHistory].sort((a, b) => new Date(a.date) - new Date(b.date));
              const cardIdx = byDate.findIndex(q => q.id === quiz.id);
              const prevQ = cardIdx > 0 ? byDate[cardIdx - 1] : null;
              const cardDiff = prevQ ? quiz.accuracy - prevQ.accuracy : null;

              return (
                <div key={quiz.id} className={`${cardC} p-5 transition-all duration-200`}
                  style={{ ...cardSt, ...(D ? {} : {}) }}>
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                    {/* Left */}
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${col}20` }}>
                        {quiz.accuracy >= 80
                          ? <CheckCircle className="w-6 h-6" style={{ color: col }} />
                          : quiz.accuracy >= 60
                            ? <Activity className="w-6 h-6" style={{ color: col }} />
                            : <XCircle className="w-6 h-6" style={{ color: col }} />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <Calendar className={`w-3.5 h-3.5 ${ST}`} />
                          <span className={`text-xs font-semibold ${LT}`}>{fmtDT(quiz.date)}</span>

                          {/* Difficulty badge */}
                          <span className="px-2 py-0.5 rounded-full text-xs font-bold capitalize"
                            style={quiz.difficulty === 'easy'
                              ? { backgroundColor: D ? '#0a1a0a' : '#dcfce7', color: D ? '#4ade80' : '#15803d' }
                              : quiz.difficulty === 'hard'
                                ? { backgroundColor: D ? '#1a0505' : '#fee2e2', color: D ? '#f87171' : '#dc2626' }
                                : { backgroundColor: D ? '#1a1200' : '#fef9c3', color: D ? '#facc15' : '#ca8a04' }}>
                            {quiz.difficulty}
                          </span>

                          {/* Progress badge vs previous quiz */}
                          {cardDiff !== null && (
                            <span className="px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-0.5"
                              style={cardDiff >= 0
                                ? { backgroundColor: D ? '#0a1a0a' : '#dcfce7', color: D ? '#4ade80' : '#15803d' }
                                : { backgroundColor: D ? '#1a0505' : '#fee2e2', color: D ? '#f87171' : '#dc2626' }}>
                              {cardDiff >= 0 ? '▲ +' : '▼ '}{cardDiff.toFixed(1)}%
                            </span>
                          )}
                        </div>
                        <h3 className={`font-bold ${HT}`}>{quiz.topicFocus || 'Mixed Topics'}</h3>
                        <p className={`text-xs mt-0.5 ${ST}`}>{fmtDate(quiz.date)}</p>
                      </div>
                    </div>

                    {/* Middle — accuracy bar */}
                    <div className="flex-1 max-w-xs">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`text-xs ${ST}`}>Accuracy</span>
                        <span className="text-sm font-black" style={{ color: getAccTextColor(quiz.accuracy) }}>
                          {quiz.accuracy.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full" style={{ backgroundColor: D ? '#1a1a1a' : '#f3f4f6' }}>
                        <div className="h-2 rounded-full transition-all duration-500"
                          style={{ width: `${quiz.accuracy}%`, backgroundColor: col }} />
                      </div>
                      <div className="flex items-center gap-1 mt-1.5">
                        <span className={`text-xs ${ST}`}>
                          <span className="font-bold" style={{ color: '#22c55e' }}>{quiz.correctAnswers}</span> correct /&nbsp;
                          <span className="font-bold" style={{ color: '#ef4444' }}>{(quiz.totalQuestions || 10) - (quiz.correctAnswers || 0)}</span> wrong
                        </span>
                      </div>
                    </div>

                    {/* Right */}
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm"
                        style={D ? { backgroundColor: '#111111' } : { backgroundColor: '#f3f4f6' }}>
                        <Award className="w-4 h-4 text-amber-500" />
                        <span className={`font-bold ${HT}`}>{(quiz.score || 0).toFixed(1)}</span>
                        <span className={`text-xs ${ST}`}>pts</span>
                      </div>

                      {quiz.timeSpent != null && (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm"
                          style={D ? { backgroundColor: '#111111' } : { backgroundColor: '#f3f4f6' }}>
                          <Clock className="w-4 h-4 text-blue-400" />
                          <span className={`font-bold ${HT}`}>
                            {Math.floor(quiz.timeSpent / 60)}:{(quiz.timeSpent % 60).toString().padStart(2, '0')}
                          </span>
                        </div>
                      )}

                      <span className="px-3 py-1.5 rounded-xl text-xs font-semibold"
                        style={quiz.mode === 'timed'
                          ? { backgroundColor: D ? '#130a2a' : '#f3e8ff', color: D ? '#c084fc' : '#7e22ce' }
                          : { backgroundColor: D ? '#0a0f1e' : '#dbeafe', color: D ? '#60a5fa' : '#1d4ed8' }}>
                        {quiz.mode === 'timed' ? '⏱️ Timed' : '📝 Practice'}
                      </span>

                      {quiz.negativeMarking && (
                        <span className="px-2 py-1 rounded-xl text-xs font-semibold"
                          style={{ backgroundColor: D ? '#1a0e00' : '#ffedd5', color: D ? '#fb923c' : '#c2410c' }}>
                          −0.25
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className={`${cardC} p-16 text-center`} style={cardSt}>
            <div className="text-6xl mb-4">📊</div>
            <h3 className={`text-2xl font-black mb-3 ${HT}`}>No History Yet</h3>
            <p className={`max-w-sm mx-auto mb-8 ${ST}`}>Start taking quizzes to see your history and progress graph!</p>
            <a href="/quiz" className="inline-flex items-center gap-2 px-6 py-3 text-white font-bold rounded-xl transition-all transform hover:scale-105"
              style={{ background: 'linear-gradient(to right, #16a34a, #10b981)', boxShadow: '0 8px 24px rgba(16,185,129,0.3)' }}>
              <Brain className="w-5 h-5" /> Take Your First Quiz
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizHistoryPage;