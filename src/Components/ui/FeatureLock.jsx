import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, LogIn, Sparkles, Shield, Key } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDarkMode } from '../../App';

const FeatureLock = ({ 
  children, 
  isLocked, 
  message = "Login to use this feature",
  showOverlay = true,
  className = ""
}) => {
  const { darkMode } = useDarkMode();
  const navigate = useNavigate();
  const [containerRef, setContainerRef] = useState(null);
  const [overlayTop, setOverlayTop] = useState(0);

  // Calculate position to place overlay at the TOP of the content
  useEffect(() => {
    if (!containerRef || !isLocked) return;
    
    const updatePosition = () => {
      const rect = containerRef.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      // Position overlay at the top of the container relative to viewport
      setOverlayTop(rect.top + scrollTop);
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, { passive: true });

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [containerRef, isLocked]);

  if (!isLocked) return children;

  return (
    <div 
      ref={setContainerRef}
      className="relative w-full"
      style={{ 
        minHeight: '200px', // Ensure minimum height even with little content
      }}
    >
      {/* Original content with extreme blur - completely hidden visually */}
      <div 
        className="w-full pointer-events-none select-none"
        style={{
          filter: 'blur(32px) brightness(0.1) contrast(0.2)',
          opacity: 0.05,
          userSelect: 'none',
        }}
      >
        {children}
      </div>

      {/* Lock overlay - positioned at TOP of content, not centered on screen */}
      <AnimatePresence>
        {showOverlay && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute left-0 right-0 z-20 flex justify-center px-4"
            style={{ 
              top: '40px', // Fixed offset from top of container
            }}
          >
            {/* Premium Lock Card - Fully Responsive */}
            <motion.div
              initial={{ scale: 0.9, y: -10, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              transition={{ 
                type: 'spring',
                stiffness: 350,
                damping: 25,
                delay: 0.1
              }}
              className="w-full max-w-sm mx-auto" // Responsive width
            >
              {/* Animated border gradient */}
              <motion.div
                animate={{ 
                  background: [
                    'linear-gradient(45deg, #22c55e, #3b82f6, #8b5cf6, #22c55e)',
                    'linear-gradient(225deg, #22c55e, #3b82f6, #8b5cf6, #22c55e)',
                    'linear-gradient(45deg, #22c55e, #3b82f6, #8b5cf6, #22c55e)'
                  ]
                }}
                transition={{ duration: 6, repeat: Infinity }}
                className="absolute -inset-[1.5px] rounded-2xl opacity-70 blur-md"
              />

              {/* Main card */}
              <div 
                className="relative rounded-2xl overflow-hidden"
                style={{
                  background: darkMode 
                    ? 'linear-gradient(145deg, #0a0a0a, #111111)' 
                    : 'linear-gradient(145deg, #ffffff, #fafafa)',
                  boxShadow: darkMode
                    ? '0 25px 40px -20px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.05)'
                    : '0 25px 40px -20px rgba(0,0,0,0.3), 0 0 0 1px rgba(0,0,0,0.05)'
                }}
              >
                {/* Decorative grid pattern */}
                <div className="absolute inset-0 opacity-5">
                  <svg className="w-full h-full">
                    <defs>
                      <pattern id="grid-sm" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
                        <path d="M 30 0 L 0 0 0 30" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid-sm)" />
                  </svg>
                </div>

                {/* Content - Compact for mobile */}
                <div className="relative p-6 sm:p-8 text-center">
                  {/* Icon stack - smaller on mobile */}
                  <div className="relative mb-5 flex justify-center">
                    {/* Outer glow */}
                    <motion.div
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.2, 0.4, 0.2]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: 'radial-gradient(circle, rgba(34,197,94,0.2) 0%, transparent 70%)',
                        filter: 'blur(15px)'
                      }}
                    />
                    
                    {/* Floating icons - hidden on very small screens */}
                    <motion.div
                      animate={{ y: [0, -5, 0], rotate: [0, 3, 0] }}
                      transition={{ duration: 2.5, repeat: Infinity, delay: 0.2 }}
                      className="absolute -top-3 -right-3 hidden xs:block"
                    >
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-xl flex items-center justify-center border border-white/10">
                        <Key className="w-4 h-4 text-blue-400" />
                      </div>
                    </motion.div>

                    <motion.div
                      animate={{ y: [0, 5, 0], rotate: [0, -3, 0] }}
                      transition={{ duration: 3, repeat: Infinity, delay: 0.4 }}
                      className="absolute -bottom-3 -left-3 hidden xs:block"
                    >
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-xl flex items-center justify-center border border-white/10">
                        <Shield className="w-4 h-4 text-green-400" />
                      </div>
                    </motion.div>

                    {/* Main lock - smaller on mobile */}
                    <motion.div
                      animate={{ 
                        scale: [1, 1.08, 1],
                        rotate: [0, 2, -2, 0]
                      }}
                      transition={{ 
                        duration: 3.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center relative z-10"
                      style={{
                        boxShadow: '0 15px 25px -10px rgba(34,197,94,0.4), 0 0 0 1.5px rgba(255,255,255,0.1) inset'
                      }}
                    >
                      <Lock className="w-7 h-7 sm:w-9 sm:h-9 text-white" />
                      
                      {/* Sparkle */}
                      <motion.div
                        animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.8 }}
                        className="absolute -top-1 -right-1"
                      >
                        <Sparkles className="w-3 h-3 text-yellow-300" />
                      </motion.div>
                    </motion.div>
                  </div>

                  {/* Text - smaller on mobile */}
                  <motion.h2 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl sm:text-2xl font-bold mb-2"
                    style={{ color: darkMode ? '#ffffff' : '#111827' }}
                  >
                    Premium Feature
                  </motion.h2>

                  <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="text-sm sm:text-base mb-5 px-2 leading-relaxed"
                    style={{ color: darkMode ? '#9ca3af' : '#6b7280' }}
                  >
                    {message}
                  </motion.p>

                  {/* Login button - full width on mobile */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/login')}
                    className="relative group w-full py-3 px-4 rounded-xl font-semibold text-white overflow-hidden"
                  >
                    {/* Animated gradient background */}
                    <motion.div
                      animate={{ 
                        background: [
                          'linear-gradient(90deg, #059669, #10b981, #059669)',
                          'linear-gradient(90deg, #10b981, #059669, #10b981)',
                          'linear-gradient(90deg, #059669, #10b981, #059669)'
                        ]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="absolute inset-0"
                    />
                    
                    {/* Shine effect */}
                    <motion.div
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: "linear", delay: 0.5 }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                    />
                    
                    {/* Button content */}
                    <span className="relative flex items-center justify-center gap-2 text-sm sm:text-base">
                      <LogIn className="w-4 h-4 sm:w-5 sm:h-5" />
                      Login to Continue
                    </span>
                  </motion.button>

                  {/* Hint text - hidden on very small screens */}
                  <motion.p 
                    animate={{ opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-[10px] mt-4 font-mono hidden xs:block"
                    style={{ color: darkMode ? '#6b7280' : '#9ca3af' }}
                  >
                    █▓▒░ feature preview ░▒▓█
                  </motion.p>

                  {/* Decorative dots - fewer on mobile */}
                  <div className="flex justify-center gap-1.5 mt-4">
                    {[0,1,2].map(i => (
                      <motion.div
                        key={i}
                        animate={{ 
                          scale: [1, 1.3, 1],
                          opacity: [0.2, 0.5, 0.2]
                        }}
                        transition={{ 
                          duration: 1.2, 
                          delay: i * 0.15,
                          repeat: Infinity 
                        }}
                        className="w-1 h-1 rounded-full"
                        style={{ background: darkMode ? '#22c55e' : '#059669' }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FeatureLock;