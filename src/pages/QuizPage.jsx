import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useDarkMode } from '../App';
import { useAuthStatus } from '../hooks/useAuthStatus';
import FeatureLock from '../components/ui/FeatureLock';
import { toast } from 'react-toastify';
import {
  Brain, Clock, Target, TrendingUp, Award, Zap, AlertCircle,
  CheckCircle, XCircle, BarChart3, Download, ChevronRight,
  RotateCcw, Sparkles, Trophy, BookOpen, Star
} from 'lucide-react';
import { quizQuestions } from '../data/quizData';
import jsPDF from 'jspdf';

const QuizPage = () => {
  const { currentUser } = useAuth();
  const { darkMode } = useDarkMode();
  const { isAuthenticated } = useAuthStatus();

  const [quizState, setQuizState] = useState('config');
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [quizMode, setQuizMode] = useState('practice');
  const [negativeMarking, setNegativeMarking] = useState(false);
  const [difficulty, setDifficulty] = useState('medium');
  const [topicFocus, setTopicFocus] = useState('all');
  const [quizHistory, setQuizHistory] = useState([]);
  const [topicPerformance, setTopicPerformance] = useState({});
  const [recommendations, setRecommendations] = useState({ difficulty: 'medium', focusTopic: 'Energy Flow', trend: 'stable' });
  const [canGenerateCertificate, setCanGenerateCertificate] = useState(false);

  // Prevent duplicate saves
  const hasSavedRef = useRef(false);
  const timerRef = useRef(null);

  // Load history only once on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('quizHistory');
      if (saved) {
        const parsed = JSON.parse(saved);
        setQuizHistory(parsed);
        calculateTopicPerformance(parsed);
        generateRecommendations(parsed);
        checkCertificateEligibility(parsed);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Timer effect
  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft(p => p - 1), 1000);
    } else if (timeLeft === 0 && timerActive) {
      handleQuizComplete();
    }
    return () => clearTimeout(timerRef.current);
  }, [timeLeft, timerActive]);

  const calculateTopicPerformance = (history) => {
    const s = {};
    history.forEach(a => {
      if (!a.topicFocus) return;
      if (!s[a.topicFocus]) s[a.topicFocus] = { total: 0, accuracy: 0, attempts: 0 };
      s[a.topicFocus].accuracy = (s[a.topicFocus].accuracy * s[a.topicFocus].attempts + a.accuracy) / (s[a.topicFocus].attempts + 1);
      s[a.topicFocus].attempts++;
    });
    setTopicPerformance(s);
  };

  const generateRecommendations = (history) => {
    if (!history.length) return;
    const recent = history.slice(-3);
    const avg = recent.reduce((s, c) => s + c.accuracy, 0) / recent.length;
    let diff = 'medium';
    if (avg < 40) diff = 'easy';
    else if (avg > 75) diff = 'hard';

    let weakTopic = 'Energy Flow', low = 100;
    Object.keys(topicPerformance).forEach(t => {
      if (topicPerformance[t].accuracy < low) {
        low = topicPerformance[t].accuracy;
        weakTopic = t;
      }
    });

    let trend = 'stable';
    if (history.length >= 3) {
      const d = history[history.length - 1].accuracy - history[history.length - 3].accuracy;
      if (d > 10) trend = 'improving';
      else if (d < -10) trend = 'declining';
    }
    setRecommendations({ difficulty: diff, focusTopic: weakTopic, trend });
  };

  const checkCertificateEligibility = (history) => {
    if (history.length < 3) {
      setCanGenerateCertificate(false);
      return;
    }
    setCanGenerateCertificate(history.slice(-3).every(a => a.accuracy >= 80));
  };

  const generateQuiz = () => {
    let pool = [...quizQuestions];
    if (topicFocus !== 'all') pool = pool.filter(q => q.topic === topicFocus);
    pool = pool.filter(q => q.difficulty === difficulty);
    if (pool.length < 10) pool = topicFocus !== 'all' ? quizQuestions.filter(q => q.topic === topicFocus) : [...quizQuestions];
    const selected = pool.sort(() => 0.5 - Math.random()).slice(0, 10);
    setCurrentQuestions(selected);
    setCurrentIndex(0);
    setSelectedOption(null);
    setScore(0);
    setAnswers([]);
    setQuizState('active');
    if (quizMode === 'timed') {
      setTimeLeft(300);
      setTimerActive(true);
    }
  };

  const handleAnswer = (idx) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    const correct = idx === currentQuestions[currentIndex].correct;
    if (correct) setScore(p => p + 1);
    else if (negativeMarking) setScore(p => p - 0.25);
    setAnswers(p => [...p, {
      questionId: currentQuestions[currentIndex].id,
      selected: idx,
      correct,
      points: correct ? 1 : negativeMarking ? -0.25 : 0
    }]);
  };

  const handleNext = () => {
    if (currentIndex < currentQuestions.length - 1) {
      setCurrentIndex(p => p + 1);
      setSelectedOption(null);
    }
    else handleQuizComplete();
  };

  // Save only once with unique IDs
  const handleQuizComplete = () => {
    // Guard against duplicate calls
    if (hasSavedRef.current) return;
    hasSavedRef.current = true;

    setTimerActive(false);
    clearTimeout(timerRef.current);

    const total = currentQuestions.length;
    const correct = answers.filter(a => a.correct).length;

    // Use crypto.randomUUID() for truly unique IDs
    const newAttempt = {
      id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      date: new Date().toISOString(),
      score,
      totalQuestions: total,
      correctAnswers: correct,
      accuracy: (correct / total) * 100,
      difficulty,
      topicFocus,
      mode: quizMode,
      negativeMarking,
      timeSpent: quizMode === 'timed' ? (300 - timeLeft) : null
    };

    // Manual save to localStorage
    try {
      const old = JSON.parse(localStorage.getItem('quizHistory')) || [];
      const updated = [newAttempt, ...old];
      localStorage.setItem('quizHistory', JSON.stringify(updated));

      // Update state and recalculate
      setQuizHistory(updated);
      calculateTopicPerformance(updated);
      generateRecommendations(updated);
      checkCertificateEligibility(updated);
    } catch (e) {
      console.error('Failed to save quiz history:', e);
      toast.error('Failed to save quiz results');
    }

    setQuizState('results');
  };

  const restartQuiz = () => {
    // Reset the save guard
    hasSavedRef.current = false;
    setQuizState('config');
    setCurrentQuestions([]);
    setCurrentIndex(0);
    setSelectedOption(null);
    setScore(0);
    setAnswers([]);
    setTimerActive(false);
  };

  const generateCertificate = () => {
    if (!currentUser || !canGenerateCertificate) {
      toast.error('Complete 3 quizzes with 80%+ accuracy');
      return;
    }
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const W = doc.internal.pageSize.getWidth(), H = doc.internal.pageSize.getHeight();
    doc.setFillColor(248, 255, 248); doc.rect(0, 0, W, H, 'F');
    doc.setDrawColor(39, 174, 96); doc.setLineWidth(3); doc.rect(8, 8, W - 16, H - 16);
    doc.setFontSize(40); doc.setTextColor(39, 174, 96);
    doc.text('Certificate of Achievement', W / 2, 52, { align: 'center' });
    doc.setFontSize(18); doc.setTextColor(80, 80, 80);
    doc.text('This is proudly presented to', W / 2, 78, { align: 'center' });
    const name = currentUser?.fullName || currentUser?.displayName || currentUser?.name || 'Student';
    doc.setFontSize(30); doc.setTextColor(20, 20, 20);
    doc.text(name, W / 2, 108, { align: 'center' });
    doc.setFontSize(16); doc.setTextColor(100, 100, 100);
    doc.text('for demonstrating exceptional knowledge in Ecology', W / 2, 128, { align: 'center' });
    const last3 = quizHistory.slice(-3);
    const avg = Math.round(last3.reduce((s, c) => s + c.accuracy, 0) / 3);
    doc.setFontSize(14); doc.setTextColor(39, 174, 96);
    doc.text(`Average Accuracy: ${avg}%`, W / 2, 148, { align: 'center' });
    doc.setFontSize(12); doc.setTextColor(100, 100, 100);
    doc.text(`Awarded on: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`, W / 2, 165, { align: 'center' });
    doc.setFontSize(10);
    doc.text('EcoInteract Education', W - 55, H - 28);
    doc.text('Authorized Signature', W - 55, H - 22);
    doc.save(`EcoInteract_Certificate_${name.replace(/\s+/g, '_')}.pdf`);
    toast.success('Certificate downloaded!');
  };

  // Dark mode helpers
  const D = darkMode;
  const pageSt = D ? { backgroundColor: '#000000', color: '#f3f4f6' } : {};
  const cardSt = D ? { backgroundColor: '#0d0d0d', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 4px 40px rgba(0,0,0,0.95)' } : {};
  const panelSt = D ? { backgroundColor: '#111111' } : {};
  const inputSt = D ? { backgroundColor: '#0a0a0a', borderColor: 'rgba(255,255,255,0.12)', color: '#fff' } : {};
  const optionSt = D ? { backgroundColor: '#0d0d0d', borderColor: 'rgba(255,255,255,0.10)', color: '#e5e7eb' } : {};
  const pageC = D ? 'text-gray-100' : 'bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 text-gray-900';
  const cardC = D ? 'rounded-2xl' : 'bg-white rounded-2xl shadow-xl shadow-green-100/60 border border-gray-100';
  const HT = D ? 'text-white' : 'text-gray-900';
  const ST = D ? 'text-gray-400' : 'text-gray-500';
  const LT = D ? 'text-gray-300' : 'text-gray-600';

  // ─── Render Config ─────────────────────────────────────────────────
  const renderConfig = () => (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* AI Recommendations */}
      {quizHistory.length > 0 && (
        <div className={`rounded-2xl p-6`}
          style={D ? { backgroundColor: '#0a150a', border: '1px solid rgba(74,222,128,0.15)' } : { background: 'linear-gradient(to right, #f0fdf4, #ecfdf5)', border: '1px solid #bbf7d0' }}>
          <div className="flex items-center gap-2 mb-5">
            <Sparkles className={`w-5 h-5 ${D ? 'text-green-400' : 'text-green-600'}`} />
            <h3 className={`text-lg font-bold ${HT}`}>AI Recommendations</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: <Target className="w-5 h-5 text-blue-400" />, label: 'Focus Topic', value: recommendations.focusTopic },
              { icon: <Brain className="w-5 h-5 text-purple-400" />, label: 'Recommended Difficulty', value: recommendations.difficulty },
              { icon: <TrendingUp className="w-5 h-5 text-orange-400" />, label: 'Performance Trend', value: recommendations.trend },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-4 rounded-xl" style={D ? { backgroundColor: '#151515' } : { backgroundColor: 'rgba(255,255,255,0.7)' }}>
                <div className="p-2 rounded-lg" style={D ? { backgroundColor: '#1e1e1e' } : { backgroundColor: '#f9fafb' }}>
                  {item.icon}
                </div>
                <div>
                  <p className={`text-xs ${ST}`}>{item.label}</p>
                  <p className={`font-semibold capitalize ${HT}`}>{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Progress Chart */}
      {quizHistory.length > 1 && (
        <div className={`${cardC} p-6`} style={cardSt}>
          <div className="flex items-center gap-2 mb-5">
            <BarChart3 className={`w-5 h-5 ${D ? 'text-green-400' : 'text-green-600'}`} />
            <h3 className={`text-lg font-bold ${HT}`}>Your Recent Progress</h3>
          </div>
          <div className="flex items-end gap-2 h-32">
            {quizHistory.slice(-8).map((a, index) => {
              const color = a.accuracy >= 80 ? '#22c55e' : a.accuracy >= 60 ? '#eab308' : '#ef4444';
              return (
                <div key={a.id} className="flex-1 flex flex-col items-center gap-1 group">
                  <span className={`text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity ${HT}`}>
                    {Math.round(a.accuracy)}%
                  </span>
                  <div className="w-full rounded-t-lg overflow-hidden relative" style={{ height: 96, backgroundColor: D ? '#1a1a1a' : '#f3f4f6' }}>
                    <div className="absolute bottom-0 left-0 w-full rounded-t-lg transition-all duration-700"
                      style={{ height: `${a.accuracy}%`, backgroundColor: color }} />
                  </div>
                  <span className={`text-xs ${ST}`}>#{quizHistory.length - 7 + index}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Settings Card */}
      <div className={`${cardC} p-8`} style={cardSt}>
        <div className="flex items-center gap-3 mb-7">
          <div className="p-2 rounded-xl" style={D ? { backgroundColor: '#0a2010' } : { backgroundColor: '#dcfce7' }}>
            <BookOpen className={`w-5 h-5 ${D ? 'text-green-400' : 'text-green-600'}`} />
          </div>
          <h2 className={`text-2xl font-bold ${HT}`}>Quiz Configuration</h2>
        </div>

        <div className="space-y-7">
          {/* Mode */}
          <div>
            <label className={`block text-sm font-semibold mb-3 ${LT}`}>Quiz Mode</label>
            <div className="grid grid-cols-2 gap-4">
              {[
                { id: 'practice', icon: <Clock className="w-6 h-6" />, label: 'Practice Mode', desc: 'No time limit' },
                { id: 'timed', icon: <Zap className="w-6 h-6" />, label: 'Timed Mode', desc: '5 minutes' }
              ].map(m => {
                const active = quizMode === m.id;
                return (
                  <button key={m.id} onClick={() => setQuizMode(m.id)}
                    className="p-5 rounded-xl text-left transition-all"
                    style={active
                      ? { border: '2px solid #22c55e', backgroundColor: D ? '#0a1f0a' : '#f0fdf4' }
                      : { ...(D ? { border: '2px solid rgba(255,255,255,0.08)', backgroundColor: '#111111' } : { border: '2px solid #e5e7eb', backgroundColor: '#fff' }) }}>
                    <div className={`mb-2 ${active ? (D ? 'text-green-400' : 'text-green-600') : ST}`}>{m.icon}</div>
                    <span className={`font-semibold block ${active ? (D ? 'text-green-400' : 'text-green-600') : HT}`}>{m.label}</span>
                    <span className={`text-xs mt-1 block ${ST}`}>{m.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <label className={`block text-sm font-semibold mb-3 ${LT}`}>Difficulty Level</label>
            <div className="grid grid-cols-3 gap-3">
              {[{ id: 'easy', emoji: '🌱' }, { id: 'medium', emoji: '🌿' }, { id: 'hard', emoji: '🔥' }].map(d => {
                const active = difficulty === d.id;
                return (
                  <button key={d.id} onClick={() => setDifficulty(d.id)}
                    className="p-4 rounded-xl capitalize font-semibold transition-all"
                    style={active
                      ? { border: '2px solid #22c55e', backgroundColor: D ? '#0a1f0a' : '#f0fdf4', color: D ? '#4ade80' : '#16a34a' }
                      : { ...(D ? { border: '2px solid rgba(255,255,255,0.08)', backgroundColor: '#111111', color: '#9ca3af' } : { border: '2px solid #e5e7eb', backgroundColor: '#fff', color: '#6b7280' }) }}>
                    <div className="text-2xl mb-1">{d.emoji}</div>
                    {d.id}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Topic */}
          <div>
            <label className={`block text-sm font-semibold mb-3 ${LT}`}>Topic Focus</label>
            <select value={topicFocus} onChange={e => setTopicFocus(e.target.value)}
              className="w-full p-3 border-2 rounded-xl focus:outline-none transition-colors"
              style={{ ...inputSt, ...(D ? {} : { backgroundColor: '#fff', borderColor: '#d1d5db', color: '#111827' }) }}>
              <option value="all">🌍 All Topics</option>
              <option value="Energy Flow">⚡ Energy Flow</option>
              <option value="Succession">🌱 Succession</option>
              <option value="Food Chain">🦁 Food Chain</option>
              <option value="Biodiversity">🦋 Biodiversity</option>
              <option value="Carbon Cycle">♻️ Carbon Cycle</option>
            </select>
          </div>

          {/* Negative Marking Toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl" style={D ? panelSt : { backgroundColor: '#f9fafb' }}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg" style={D ? { backgroundColor: '#1e1e1e' } : { backgroundColor: '#e5e7eb' }}>
                <AlertCircle className={`w-4 h-4 ${D ? 'text-orange-400' : 'text-orange-500'}`} />
              </div>
              <div>
                <span className={`font-semibold ${HT}`}>Negative Marking</span>
                <p className={`text-xs mt-0.5 ${ST}`}>-0.25 for wrong answers</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={negativeMarking} onChange={e => setNegativeMarking(e.target.checked)} className="sr-only peer" />
              <div className={`w-12 h-6 rounded-full transition-colors after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-6
                ${negativeMarking ? 'bg-green-500' : D ? 'bg-gray-700' : 'bg-gray-300'}`}
                style={!negativeMarking && D ? { backgroundColor: '#2a2a2a' } : {}} />
            </label>
          </div>

          {/* Certificate */}
          {canGenerateCertificate && (
            <div className="p-5 rounded-xl" style={D ? { backgroundColor: '#1a1200', border: '1px solid rgba(234,179,8,0.3)' } : { background: 'linear-gradient(to right, #fefce8, #fffbeb)', border: '1px solid #fde68a' }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl" style={D ? { backgroundColor: '#2a1f00' } : { backgroundColor: '#fef3c7' }}>
                    <Trophy className={`w-5 h-5 ${D ? 'text-yellow-400' : 'text-yellow-600'}`} />
                  </div>
                  <div>
                    <h4 className={`font-bold ${HT}`}>🎉 Certificate Eligible!</h4>
                    <p className={`text-xs mt-0.5 ${ST}`}>Scored 80%+ in last 3 quizzes</p>
                  </div>
                </div>
                <button onClick={generateCertificate}
                  className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl font-semibold text-sm transition-colors">
                  <Download className="w-4 h-4" /> Download
                </button>
              </div>
            </div>
          )}

          {/* Start Button */}
          <button onClick={generateQuiz}
            className="w-full py-4 text-white font-bold rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 text-lg"
            style={{ background: 'linear-gradient(to right, #16a34a, #10b981)', boxShadow: '0 8px 24px rgba(16,185,129,0.3)' }}>
            <Star className="w-5 h-5" />
            Start Quiz
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );

  // ─── Render Active Quiz ────────────────────────────────────────────
  const renderQuiz = () => {
    if (!currentQuestions.length) return null;
    const q = currentQuestions[currentIndex];
    const progress = ((currentIndex + 1) / currentQuestions.length) * 100;

    return (
      <div className="max-w-3xl mx-auto space-y-5">
        {/* Header */}
        <div className={`${cardC} p-5`} style={cardSt}>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              {[
                { label: `Q ${currentIndex + 1}/${currentQuestions.length}`, color: D ? { backgroundColor: '#0a2010', color: '#4ade80' } : { backgroundColor: '#dcfce7', color: '#15803d' } },
                { label: q.difficulty, color: D ? { backgroundColor: '#0a0f1e', color: '#60a5fa' } : { backgroundColor: '#dbeafe', color: '#1d4ed8' } },
                { label: q.topic, color: D ? { backgroundColor: '#130a2a', color: '#c084fc' } : { backgroundColor: '#f3e8ff', color: '#7e22ce' } },
              ].map((tag, i) => (
                <span key={i} className="px-3 py-1.5 rounded-full text-sm font-semibold capitalize" style={tag.color}>
                  {tag.label}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-4">
              {quizMode === 'timed' && (
                <span className={`font-mono font-bold text-lg flex items-center gap-1.5 ${timeLeft < 60 ? 'text-red-500 animate-pulse' : D ? 'text-orange-400' : 'text-orange-600'}`}>
                  <Clock className="w-5 h-5" />
                  {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </span>
              )}
              <span className={`flex items-center gap-1.5 font-bold ${D ? 'text-green-400' : 'text-green-700'}`}>
                <Target className="w-5 h-5" /> {score.toFixed(1)} pts
              </span>
            </div>
          </div>
          {/* Progress */}
          <div className="h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: D ? '#1a1a1a' : '#f3f4f6' }}>
            <div className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, background: 'linear-gradient(to right, #22c55e, #10b981)' }} />
          </div>
        </div>

        {/* Question */}
        <div className={`${cardC} p-8`} style={cardSt}>
          <h2 className={`text-xl font-bold mb-6 leading-relaxed ${HT}`}>{q.question}</h2>
          <div className="space-y-3">
            {q.options.map((opt, idx) => {
              let st = { ...optionSt, border: '2px solid rgba(255,255,255,0.10)', borderRadius: '0.75rem', padding: '1rem', width: '100%', textAlign: 'left', transition: 'all 0.2s', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' };
              if (!D) st = { backgroundColor: '#fff', border: '2px solid #e5e7eb', borderRadius: '0.75rem', padding: '1rem', width: '100%', textAlign: 'left', transition: 'all 0.2s', cursor: selectedOption !== null ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#111827' };

              if (selectedOption !== null) {
                if (idx === q.correct) {
                  st.border = '2px solid #22c55e';
                  st.backgroundColor = D ? '#0a1a0a' : '#f0fdf4';
                  st.color = D ? '#4ade80' : '#15803d';
                } else if (idx === selectedOption) {
                  st.border = '2px solid #ef4444';
                  st.backgroundColor = D ? '#1a0505' : '#fef2f2';
                  st.color = D ? '#f87171' : '#991b1b';
                } else {
                  st.opacity = 0.4;
                }
              }

              const letter = String.fromCharCode(65 + idx);
              let letterSt = { width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0, marginRight: 12, backgroundColor: D ? '#1e1e1e' : '#f3f4f6', color: D ? '#9ca3af' : '#6b7280' };
              if (selectedOption !== null && idx === q.correct) { letterSt.backgroundColor = '#22c55e'; letterSt.color = '#fff'; }
              else if (selectedOption !== null && idx === selectedOption) { letterSt.backgroundColor = '#ef4444'; letterSt.color = '#fff'; }

              return (
                <button key={idx} onClick={() => handleAnswer(idx)} disabled={selectedOption !== null} style={st}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={letterSt}>{letter}</span>
                    <span style={{ fontWeight: 500 }}>{opt}</span>
                  </div>
                  {selectedOption !== null && (
                    idx === q.correct ? <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      : idx === selectedOption ? <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" /> : null
                  )}
                </button>
              );
            })}
          </div>

          {selectedOption !== null && (
            <div className="mt-5 p-4 rounded-xl" style={D ? { backgroundColor: '#0a0f1e', border: '1px solid rgba(96,165,250,0.2)', color: '#93c5fd' } : { backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', color: '#1e40af' }}>
              <p className="text-sm leading-relaxed">
                <span className="font-bold">💡 Explanation: </span>{q.explanation}
              </p>
            </div>
          )}
        </div>

        {selectedOption !== null && (
          <button onClick={handleNext}
            className="w-full py-4 text-white font-bold rounded-xl transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(to right, #16a34a, #10b981)', boxShadow: '0 8px 24px rgba(16,185,129,0.3)' }}>
            {currentIndex < currentQuestions.length - 1 ? 'Next Question' : '🏁 Finish Quiz'}
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>
    );
  };

  // ─── Render Results ────────────────────────────────────────────────
  const renderResults = () => {
    const correct = answers.filter(a => a.correct).length;
    const acc = currentQuestions.length > 0 ? (correct / currentQuestions.length) * 100 : 0;
    const grade = acc >= 90 ? { label: 'Excellent!', emoji: '🏆', color: 'text-yellow-500' }
      : acc >= 75 ? { label: 'Great Job!', emoji: '⭐', color: 'text-green-500' }
        : acc >= 50 ? { label: 'Good Effort!', emoji: '👍', color: 'text-blue-500' }
          : { label: 'Keep Practicing!', emoji: '💪', color: 'text-orange-500' };

    return (
      <div className="max-w-2xl mx-auto">
        <div className={`${cardC} p-8`} style={cardSt}>
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">{grade.emoji}</div>
            <h2 className={`text-3xl font-black ${HT}`}>Quiz Complete!</h2>
            <p className={`text-lg font-semibold mt-1 ${grade.color}`}>{grade.label}</p>
          </div>
          <div className="relative w-44 h-44 mx-auto mb-8">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke={D ? '#1a1a1a' : '#f0fdf4'} strokeWidth="10" />
              <circle cx="50" cy="50" r="42" fill="none"
                stroke={acc >= 80 ? '#10b981' : acc >= 60 ? '#f59e0b' : '#ef4444'}
                strokeWidth="10" strokeLinecap="round"
                strokeDasharray={`${(acc / 100) * 263.9} 263.9`} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-3xl font-black ${HT}`}>{Math.round(acc)}%</span>
              <span className={`text-xs font-medium ${ST}`}>accuracy</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-8">
            {[
              { label: 'Score', value: `${score.toFixed(1)} / ${currentQuestions.length}`, color: HT },
              { label: 'Correct', value: correct, color: 'text-green-500' },
              { label: 'Incorrect', value: answers.filter(a => !a.correct).length, color: 'text-red-500' },
              { label: 'Mode', value: quizMode === 'timed' ? '⏱️ Timed' : '📝 Practice', color: HT },
            ].map((s, i) => (
              <div key={i} className="p-4 rounded-2xl text-center" style={D ? panelSt : { backgroundColor: '#f9fafb' }}>
                <p className={`text-xs font-medium mb-1 ${ST}`}>{s.label}</p>
                <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>
          <div className="space-y-3">
            <button onClick={restartQuiz}
              className="w-full py-4 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(to right, #16a34a, #10b981)', boxShadow: '0 8px 24px rgba(16,185,129,0.3)' }}>
              <RotateCcw className="w-5 h-5" /> Try Again
            </button>
            <button onClick={() => setQuizState('config')}
              className={`w-full py-4 border-2 font-bold rounded-xl transition-all ${D ? 'text-gray-300 hover:text-green-400' : 'text-gray-700 hover:text-green-600'}`}
              style={D ? { borderColor: 'rgba(255,255,255,0.12)' } : { borderColor: '#d1d5db' }}>
              ⚙️ Change Settings
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <FeatureLock
      isLocked={!isAuthenticated}
      message="Login to attempt quiz and earn certificates"
    >
      <div className={`min-h-screen py-12 px-4 transition-colors duration-300 ${pageC}`} style={pageSt}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 text-sm font-semibold"
              style={D ? { backgroundColor: '#0a1a0a', color: '#4ade80' } : { backgroundColor: '#dcfce7', color: '#15803d' }}>
              <Brain className="w-4 h-4" /> Ecology Quiz Lab
            </div>
            <h1 className={`text-4xl md:text-5xl font-black mb-4 ${HT}`}>Test Your Knowledge</h1>
            <p className={`text-lg max-w-2xl mx-auto ${ST}`}>
              Adaptive quiz system with AI recommendations, performance tracking, and achievement certificates.
            </p>
          </div>
          {quizState === 'config' && renderConfig()}
          {quizState === 'active' && renderQuiz()}
          {quizState === 'results' && renderResults()}
        </div>
      </div>
    </FeatureLock>
  );
};

export default QuizPage;