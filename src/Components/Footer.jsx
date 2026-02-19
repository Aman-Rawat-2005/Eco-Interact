// Components/Footer.js

import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, TreePine, Sprout, Mail, Phone, MapPin, Heart } from 'lucide-react';
import { useDarkMode } from '../App';

function Footer() {
  const { darkMode } = useDarkMode();
  const currentYear = new Date().getFullYear();

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <footer className={`relative overflow-hidden transition-colors duration-300 max-h-[20vh] min-h-[10vh] ${
      darkMode 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 text-white' 
        : 'bg-gradient-to-br from-gray-50 via-white to-emerald-50 text-gray-900'
    }`}>
      {/* Background Pattern - Lightened for compact design */}
      <div className={`absolute inset-0 ${
        darkMode ? 'opacity-3' : 'opacity-5'
      }`}>
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }}></div>
      </div>

      {/* Floating Background Elements - Smaller and fewer */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className={`absolute top-4 left-4 ${
            darkMode ? 'text-emerald-500/5' : 'text-emerald-500/10'
          }`}
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          <Leaf className="w-8 h-8" />
        </motion.div>
        <motion.div 
          className={`absolute top-2 right-4 ${
            darkMode ? 'text-green-500/5' : 'text-green-500/10'
          }`}
          animate={{ 
            y: [0, 8, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        >
          <Sprout className="w-6 h-6" />
        </motion.div>
      </div>

      <div className="relative z-10 h-full">
        {/* Main Footer Content - Compact */}
        <motion.div 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-3 h-full"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="flex flex-col justify-between h-full">
            {/* Compact Brand and Contact Row */}
            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4 mb-1 sm:mb-2"
              variants={itemVariants}
            >
              {/* Left: Brand */}
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                  darkMode 
                    ? 'bg-gradient-to-br from-emerald-400 to-teal-500' 
                    : 'bg-gradient-to-br from-emerald-500 to-teal-600'
                }`}>
                  <Leaf className="w-3 h-3 text-white" />
                </div>
                <div className="flex items-baseline gap-2">
                  <h3 className={`text-sm font-bold ${
                    darkMode 
                      ? 'text-emerald-400' 
                      : 'text-emerald-700'
                  }`}>
                    EcoInteract
                  </h3>
                  <span className={`text-xs ${
                    darkMode ? 'text-slate-400' : 'text-gray-600'
                  }`}>
                    • Educational Ecology Project
                  </span>
                </div>
              </div>

              {/* Right: Contact Info in single line */}
              <div className={`flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs ${
                darkMode ? 'text-slate-300' : 'text-gray-700'
              }`}>
                <div className="flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  <span>amanrawat1935@gmail.com</span>
                </div>
                <div className="hidden sm:flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  <span>+91 70426 09701</span>
                </div>
                <div className="hidden md:flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span className="truncate max-w-[150px]">TIAS</span>
                </div>
              </div>
            </motion.div>

            {/* Divider */}
            <div className={`h-px w-full my-1 ${
              darkMode ? 'bg-slate-700/50' : 'bg-gray-300/50'
            }`}></div>

            {/* Bottom: Copyright */}
            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-between gap-1"
              variants={itemVariants}
            >
              <div className="text-center sm:text-left">
                <p className={`text-xs flex items-center justify-center sm:justify-start gap-1 ${
                  darkMode ? 'text-slate-400' : 'text-gray-600'
                }`}>
                  © {currentYear} EcoInteract 
                  <Heart className="w-2 h-2 text-red-400 animate-pulse" />
                </p>
              </div>

              {/* Compact Educational Note */}
              <div className={`text-[10px] sm:text-xs text-center ${
                darkMode ? 'text-slate-500' : 'text-gray-500'
              }`}>
                An interactive educational platform for ecology studies
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Compact Wave Decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg 
          className="w-full h-2" 
          viewBox="0 0 1200 40" 
          preserveAspectRatio="none"
        >
          <path 
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
            opacity={darkMode ? "0.2" : "0.05"}
            fill={darkMode ? "#10b981" : "#059669"}
          />
        </svg>
      </div>
    </footer>
  );
}

export default Footer;