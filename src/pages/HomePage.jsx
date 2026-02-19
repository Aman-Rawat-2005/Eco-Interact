import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next'; // ✅ Import useTranslation
import { useDarkMode } from '../App';
import { 
  Sun, 
  Leaf, 
  Recycle, 
  Zap, 
  Sprout, 
  Mountain, 
  ArrowRight,
  Brain,
  Eye,
  Globe,
  Clock,
  BarChart3,
  TreePine,
  Layers,
  Target,
  RefreshCw
} from 'lucide-react';

function HomePage() {
  const { t } = useTranslation(); // ✅ Get translation function
  const { darkMode } = useDarkMode();

  // Array of key concepts based on your project synopsis
  const keyConcepts = [
    { 
      icon: <Sun className="w-6 h-6" />, 
      title: t('home.concepts.energyFlow.title'),
      description: t('home.concepts.energyFlow.description'),
      color: 'text-yellow-500'
    },
    { 
      icon: <BarChart3 className="w-6 h-6" />, 
      title: t('home.concepts.ecologicalPyramids.title'),
      description: t('home.concepts.ecologicalPyramids.description'),
      color: 'text-orange-500'
    },
    { 
      icon: <Sprout className="w-6 h-6" />, 
      title: t('home.concepts.primarySuccession.title'),
      description: t('home.concepts.primarySuccession.description'),
      color: 'text-green-500'
    },
    { 
      icon: <RefreshCw className="w-6 h-6" />, 
      title: t('home.concepts.secondarySuccession.title'),
      description: t('home.concepts.secondarySuccession.description'),
      color: 'text-red-500'
    },
    { 
      icon: <Layers className="w-6 h-6" />, 
      title: t('home.concepts.biodiversity.title'),
      description: t('home.concepts.biodiversity.description'),
      color: 'text-emerald-500'
    },
    { 
      icon: <Recycle className="w-6 h-6" />, 
      title: t('home.concepts.decomposers.title'),
      description: t('home.concepts.decomposers.description'),
      color: 'text-purple-500'
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const heroVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className={`min-h-screen pt-16 transition-colors duration-300 ${
      darkMode 
        ? 'bg-gradient-to-b from-black via-gray-900 to-black text-white' 
        : 'bg-gradient-to-b from-gray-50 to-white text-gray-900'
    }`}>
      
      {/* 1. HERO SECTION */}
      <section className={`relative min-h-[85vh] flex items-center justify-center overflow-hidden ${
        darkMode 
          ? 'bg-gradient-to-br from-gray-900 via-black to-gray-900' 
          : 'bg-gradient-to-br from-emerald-50 via-white to-teal-50'
      }`}>
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        {/* Floating Elements */}
        <motion.div 
          className={`absolute top-20 left-10 ${
            darkMode ? 'text-emerald-500/10' : 'text-emerald-500/20'
          }`}
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 10, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          <Leaf className="w-32 h-32" />
        </motion.div>

        <motion.div 
          className={`absolute bottom-20 right-10 ${
            darkMode ? 'text-green-500/10' : 'text-green-500/20'
          }`}
          animate={{ 
            y: [0, 15, 0],
            rotate: [0, -15, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        >
          <Globe className="w-40 h-40" />
        </motion.div>

        <motion.div 
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          variants={heroVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={heroVariants}>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 ${
              darkMode 
                ? 'bg-emerald-900/30 border border-emerald-700/30' 
                : 'bg-emerald-100 border border-emerald-200'
            }`}>
              <Brain className="w-4 h-4 text-emerald-500" />
              <span className={`text-sm font-medium ${
                darkMode ? 'text-emerald-300' : 'text-emerald-700'
              }`}>
                {t('home.hero.badge')}
              </span>
            </div>

            <h1 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight ${
              darkMode 
                ? 'text-white' 
                : 'bg-gradient-to-r from-emerald-700 via-green-600 to-teal-700 bg-clip-text text-transparent'
            }`}>
              {t('home.hero.title')}
              <span className="block">{t('home.hero.subtitle')}</span>
            </h1>
          </motion.div>

          <motion.p 
            variants={heroVariants}
            className={`text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto mb-10 leading-relaxed ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}
          >
            {t('home.hero.description')}
          </motion.p>

          <motion.div variants={heroVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/energy-flow"
              className={`px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${
                darkMode 
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700' 
                  : 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white hover:from-emerald-700 hover:to-teal-800'
              }`}
            >
              {t('home.buttons.beginLearning')}
            </Link>
            <Link 
              to="/visualizations"
              className={`px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${
                darkMode 
                  ? 'bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white' 
                  : 'bg-white hover:bg-gray-50 border border-gray-300 text-gray-800'
              }`}
            >
              {t('home.buttons.exploreVisualizations')}
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* 2. INTRODUCTION SECTION */}
      <section className="py-16 sm:py-20">
        <motion.div 
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-6 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {t('home.introduction.title')}
            </h2>
            <p className={`text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {t('home.introduction.description')}
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* 3. KEY CONCEPTS GRID */}
      <section className={`py-16 sm:py-20 ${
        darkMode ? 'bg-gray-900/50' : 'bg-gray-50'
      }`}>
        <motion.div 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-6 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {t('home.concepts.title')}
            </h2>
            <p className={`text-lg max-w-2xl mx-auto ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {t('home.concepts.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {keyConcepts.map((concept, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className={`rounded-xl p-6 sm:p-8 transition-all duration-300 ${
                  darkMode 
                    ? 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 hover:from-gray-800 hover:to-gray-900 border border-gray-800 hover:border-emerald-700/50' 
                    : 'bg-white hover:bg-gradient-to-br hover:from-white hover:to-emerald-50 border border-gray-200 hover:border-emerald-300 shadow-lg hover:shadow-xl'
                }`}
              >
                <div className={`p-3 rounded-lg inline-flex mb-4 ${
                  darkMode ? 'bg-gray-800' : 'bg-emerald-50'
                }`}>
                  <div className={concept.color}>
                    {concept.icon}
                  </div>
                </div>
                <h3 className={`text-xl font-bold mb-3 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {concept.title}
                </h3>
                <p className={`leading-relaxed ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {concept.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* 4. VISUAL SHOWCASE CTA */}
      <section className="py-16 sm:py-20">
        <motion.div 
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={itemVariants}>
            <Link 
              to="/succession"
              className={`block rounded-2xl overflow-hidden group relative ${
                darkMode 
                  ? 'bg-gradient-to-r from-gray-900 via-black to-gray-900' 
                  : 'bg-gradient-to-r from-emerald-50 via-white to-teal-50'
              }`}
            >
              {/* Animated gradient overlay */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                darkMode 
                  ? 'bg-gradient-to-r from-emerald-500/10 via-transparent to-teal-500/10' 
                  : 'bg-gradient-to-r from-emerald-200/30 via-transparent to-teal-200/30'
              }`}></div>
              
              <div className="relative p-8 sm:p-12 lg:p-16">
                <div className="flex flex-col lg:flex-row items-center gap-8">
                  <div className="lg:w-2/3">
                    <div className="flex items-center gap-3 mb-4">
                      <Clock className={`w-6 h-6 ${
                        darkMode ? 'text-emerald-400' : 'text-emerald-600'
                      }`} />
                      <span className={`text-sm font-semibold ${
                        darkMode ? 'text-emerald-300' : 'text-emerald-700'
                      }`}>
                        {t('home.showcase.badge')}
                      </span>
                    </div>
                    
                    <h3 className={`text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {t('home.showcase.title')}
                    </h3>
                    
                    <p className={`text-lg mb-6 leading-relaxed ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {t('home.showcase.description')}
                    </p>
                    
                    <div className="inline-flex items-center gap-2 group/link">
                      <span className={`font-semibold ${
                        darkMode ? 'text-emerald-400' : 'text-emerald-600'
                      }`}>
                        {t('home.showcase.link')}
                      </span>
                      <ArrowRight className={`w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-2 ${
                        darkMode ? 'text-emerald-400' : 'text-emerald-600'
                      }`} />
                    </div>
                  </div>
                  
                  <div className="lg:w-1/3 relative">
                    <div className={`w-48 h-48 mx-auto rounded-full ${
                      darkMode 
                        ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20' 
                        : 'bg-gradient-to-r from-emerald-200 to-teal-200'
                    } flex items-center justify-center`}>
                      <Eye className={`w-24 h-24 ${
                        darkMode ? 'text-emerald-400' : 'text-emerald-600'
                      }`} />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* 5. WHY IT MATTERS SECTION */}
      <section className={`py-16 sm:py-20 ${
        darkMode ? 'bg-black' : 'bg-gray-50'
      }`}>
        <motion.div 
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div variants={itemVariants}>
              <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-6 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {t('home.rationale.title')}
              </h2>
              <div className={`space-y-4 text-lg leading-relaxed ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                <p>{t('home.rationale.paragraph1')}</p>
                <p>{t('home.rationale.paragraph2')}</p>
              </div>
              
              <div className="mt-8 flex flex-wrap gap-4">
                <div className={`px-4 py-2 rounded-lg ${
                  darkMode ? 'bg-gray-800' : 'bg-emerald-100'
                }`}>
                  <span className={`font-semibold ${
                    darkMode ? 'text-emerald-300' : 'text-emerald-700'
                  }`}>
                    {t('home.rationale.tags.interactive')}
                  </span>
                </div>
                <div className={`px-4 py-2 rounded-lg ${
                  darkMode ? 'bg-gray-800' : 'bg-emerald-100'
                }`}>
                  <span className={`font-semibold ${
                    darkMode ? 'text-emerald-300' : 'text-emerald-700'
                  }`}>
                    {t('home.rationale.tags.academic')}
                  </span>
                </div>
                <div className={`px-4 py-2 rounded-lg ${
                  darkMode ? 'bg-gray-800' : 'bg-emerald-100'
                }`}>
                  <span className={`font-semibold ${
                    darkMode ? 'text-emerald-300' : 'text-emerald-700'
                  }`}>
                    {t('home.rationale.tags.environmental')}
                  </span>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              className={`rounded-2xl overflow-hidden ${
                darkMode 
                  ? 'bg-gradient-to-br from-gray-800 to-black border border-gray-800' 
                  : 'bg-gradient-to-br from-white to-gray-100 border border-gray-200'
              } shadow-2xl`}
            >
              <div className="p-8">
                <div className={`aspect-video rounded-xl ${
                  darkMode 
                    ? 'bg-gradient-to-r from-emerald-900/30 to-teal-900/30' 
                    : 'bg-gradient-to-r from-emerald-100 to-teal-100'
                } flex items-center justify-center`}>
                  <div className="text-center p-8">
                    <Globe className={`w-20 h-20 mx-auto mb-4 ${
                      darkMode ? 'text-emerald-400' : 'text-emerald-600'
                    }`} />
                    <h4 className={`text-xl font-bold mb-2 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {t('home.rationale.visual.title')}
                    </h4>
                    <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                      {t('home.rationale.visual.description')}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* 6. QUOTE SECTION */}
      <section className="py-16 sm:py-20">
        <motion.div 
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={itemVariants}>
            <div className={`p-8 sm:p-12 rounded-2xl ${
              darkMode 
                ? 'bg-gradient-to-r from-gray-900/50 to-black/50 border border-gray-800' 
                : 'bg-gradient-to-r from-emerald-50/50 to-teal-50/50 border border-emerald-200'
            }`}>
              <blockquote className={`text-xl sm:text-2xl md:text-3xl italic leading-relaxed mb-6 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                "{t('home.quote.text')}"
              </blockquote>
              <cite className={`not-italic font-bold text-lg ${
                darkMode ? 'text-emerald-400' : 'text-emerald-600'
              }`}>
                — {t('home.quote.author')}
              </cite>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20">
        <motion.div 
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={itemVariants}>
            <div className={`p-8 sm:p-12 rounded-2xl ${
              darkMode 
                ? 'bg-gradient-to-r from-gray-900 to-black border border-gray-800' 
                : 'bg-gradient-to-r from-white to-gray-50 border border-gray-200'
            } shadow-2xl`}>
              <h3 className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-4 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {t('home.cta.title')}
              </h3>
              <p className={`text-lg mb-8 max-w-2xl mx-auto ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {t('home.cta.description')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/energy-flow"
                  className={`px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300 ${
                    darkMode 
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white hover:from-emerald-700 hover:to-teal-800' 
                      : 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white hover:from-emerald-700 hover:to-teal-800'
                  }`}
                >
                  {t('home.buttons.startLearning')}
                </Link>
                <Link 
                  to="/visualizations"
                  className={`px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300 border ${
                    darkMode 
                      ? 'border-gray-700 text-gray-300 hover:bg-gray-800' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {t('home.buttons.viewAllModels')}
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}

export default HomePage;