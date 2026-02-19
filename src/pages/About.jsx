// pages/About.js

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { ArrowDown, CheckCircle, XCircle, ArrowRight, Leaf } from "lucide-react";
import { useDarkMode } from "../App";
import aboutData from "../data/aboutData";

/* ─────────────────────────────────────────────
   UTILITY: Scroll-triggered fade-in wrapper
───────────────────────────────────────────── */
const Reveal = ({ children, delay = 0, className = "" }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/* ─────────────────────────────────────────────
   SECTION LABEL BADGE
───────────────────────────────────────────── */
const SectionLabel = ({ text, darkMode }) => (
  <span
    className="inline-block px-3 py-1 text-xs font-semibold tracking-widest uppercase rounded-full mb-4 border"
    style={{
      backgroundColor: darkMode ? "rgba(52,211,153,0.08)" : "rgba(22,163,74,0.08)",
      color: darkMode ? "#34d399" : "#16a34a",
      borderColor: darkMode ? "rgba(52,211,153,0.2)" : "rgba(22,163,74,0.2)",
    }}
  >
    {text}
  </span>
);

/* ─────────────────────────────────────────────
   ENERGY PYRAMID VISUAL
───────────────────────────────────────────── */
const EnergyVisual = ({ darkMode }) => {
  const levels = [
    { label: "Sun",                color: darkMode ? "#fde68a" : "#d97706", energy: "100%", w: "100%" },
    { label: "Producers",          color: darkMode ? "#6ee7b7" : "#16a34a", energy: "10%",  w: "80%"  },
    { label: "Primary Consumers",  color: darkMode ? "#34d399" : "#15803d", energy: "1%",   w: "60%"  },
    { label: "Secondary Consumers",color: darkMode ? "#059669" : "#166534", energy: "0.1%", w: "40%"  },
    { label: "Apex Predators",     color: darkMode ? "#065f46" : "#14532d", energy: "0.01%",w: "25%"  },
  ];
  return (
    <div className="w-full flex flex-col gap-2 py-4">
      {levels.map((l, i) => (
        <motion.div key={l.label} className="flex items-center gap-3"
          initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }} transition={{ delay: i * 0.12 }}>
          <div
            className="h-9 rounded-lg flex items-center px-3"
            style={{ width: l.w, backgroundColor: l.color + (darkMode ? "33" : "22"), border: `1px solid ${l.color}${darkMode ? "55" : "66"}` }}
          >
            <span className="text-xs font-semibold" style={{ color: l.color }}>{l.label}</span>
          </div>
          <span className="text-xs shrink-0 font-medium" style={{ color: darkMode ? "#64748b" : "#9ca3af" }}>
            {l.energy}
          </span>
        </motion.div>
      ))}
    </div>
  );
};

/* ─────────────────────────────────────────────
   FOOD WEB SVG VISUAL
───────────────────────────────────────────── */
const FoodWebVisual = ({ darkMode }) => {
  const nodes = [
    { x: 50, y: 10, label: "Eagle"  },
    { x: 20, y: 35, label: "Snake"  },
    { x: 80, y: 35, label: "Fox"    },
    { x: 10, y: 65, label: "Mouse"  },
    { x: 50, y: 65, label: "Rabbit" },
    { x: 85, y: 65, label: "Deer"   },
    { x: 50, y: 90, label: "Grass"  },
  ];
  const edges = [[0,1],[0,2],[1,3],[1,4],[2,4],[2,5],[3,6],[4,6],[5,6]];
  const nodeFill   = darkMode ? "#065f46"  : "#dcfce7";
  const nodeStroke = darkMode ? "#34d399"  : "#16a34a";
  const textFill   = darkMode ? "#6ee7b7"  : "#14532d";
  const edgeColor  = darkMode ? "#34d39940": "#16a34a30";

  return (
    <svg viewBox="0 0 100 100" className="w-full h-56">
      {edges.map(([a, b], i) => (
        <motion.line key={i}
          x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y}
          stroke={edgeColor} strokeWidth="0.8"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.5 }} />
      ))}
      {nodes.map((n, i) => (
        <motion.g key={i}
          initial={{ scale: 0, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }} transition={{ delay: i * 0.1 + 0.3 }}>
          <circle cx={n.x} cy={n.y} r={9} fill={nodeFill} stroke={nodeStroke} strokeWidth="0.6" />
          <text x={n.x} y={n.y + 0.4} textAnchor="middle" dominantBaseline="middle"
            fontSize="3.2" fill={textFill} fontWeight="700">{n.label}</text>
        </motion.g>
      ))}
    </svg>
  );
};

/* ─────────────────────────────────────────────
   SUCCESSION BAR CHART VISUAL
───────────────────────────────────────────── */
const SuccessionVisual = ({ darkMode }) => {
  const stages = [
    { label: "Bare Rock",     icon: "🪨", color: darkMode ? "#78716c" : "#a8a29e" },
    { label: "Lichens",       icon: "🍄", color: darkMode ? "#a8a29e" : "#78716c" },
    { label: "Mosses",        icon: "🌿", color: darkMode ? "#84cc16" : "#4d7c0f" },
    { label: "Shrubs",        icon: "🌱", color: darkMode ? "#22c55e" : "#16a34a" },
    { label: "Young Forest",  icon: "🌲", color: darkMode ? "#16a34a" : "#15803d" },
    { label: "Climax",        icon: "🌳", color: darkMode ? "#166534" : "#14532d" },
  ];
  return (
    <div className="flex items-end justify-between gap-1 w-full h-40 py-2">
      {stages.map((s, i) => (
        <motion.div key={s.label} className="flex flex-col items-center gap-1 flex-1"
          initial={{ opacity: 0, scaleY: 0 }} whileInView={{ opacity: 1, scaleY: 1 }}
          viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5, ease: "backOut" }}
          style={{ transformOrigin: "bottom" }}>
          <span className="text-base">{s.icon}</span>
          <div className="w-full rounded-t-lg"
            style={{ height: `${20 + i * 16}px`, backgroundColor: s.color + (darkMode ? "66" : "44"), border: `1px solid ${s.color}${darkMode ? "99" : "aa"}` }} />
          <span className="text-[8px] text-center leading-tight" style={{ color: darkMode ? "#64748b" : "#9ca3af" }}>
            {s.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   MAIN ABOUT PAGE
═══════════════════════════════════════════════════════ */
export default function About() {
  const { darkMode } = useDarkMode();
  const { hero, problem, features, experiences, philosophy, project, developer, vision, closing } = aboutData;

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY       = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  /* ── Design Tokens: all colors driven by darkMode flag ── */
  const bg            = darkMode ? "#000000"  : "#ffffff";
  const bgCard        = darkMode ? "#0f0f0f"  : "#f1f5f9";
  const bgCardHover   = darkMode ? "#141414"  : "#e2e8f0";
  const border        = darkMode ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)";
  const borderHover   = darkMode ? "rgba(52,211,153,0.35)"  : "rgba(22,163,74,0.35)";
  const textPrimary   = darkMode ? "#f1f5f9"  : "#0f172a";
  const textSecondary = darkMode ? "#64748b"  : "#64748b";
  const textBody      = darkMode ? "#94a3b8"  : "#374151";
  const textMuted     = darkMode ? "#1e293b"  : "#e2e8f0";
  const accent        = darkMode ? "#34d399"  : "#16a34a";
  const accentDim     = darkMode ? "rgba(52,211,153,0.10)"  : "rgba(22,163,74,0.09)";

  const visualMap = {
    energy:     () => <EnergyVisual    darkMode={darkMode} />,
    foodweb:    () => <FoodWebVisual   darkMode={darkMode} />,
    succession: () => <SuccessionVisual darkMode={darkMode} />,
  };

  /* ── Reusable gradient builder ── */
  const grad = (via) => darkMode
    ? `linear-gradient(180deg, #000000 0%, ${via} 50%, #000000 100%)`
    : `linear-gradient(180deg, #ffffff 0%, ${via} 50%, #ffffff 100%)`;

  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{ backgroundColor: bg, color: textPrimary, fontFamily: "'Nunito Sans', sans-serif",
               transition: "background-color 0.3s ease, color 0.3s ease" }}
    >

      {/* ══════════════════════════════
          1. HERO
      ══════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative h-screen flex items-center justify-center overflow-hidden"
        style={{ background: darkMode
          ? "linear-gradient(135deg, #000000 0%, #020e07 50%, #000000 100%)"
          : "linear-gradient(135deg, #ffffff 0%, #f0fdf4 50%, #ffffff 100%)" }}
      >
        {/* Ambient blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute top-[18%] left-[18%] w-[580px] h-[580px] rounded-full blur-[140px]"
            style={{ background: darkMode
              ? "radial-gradient(circle, rgba(6,95,70,0.55), transparent 70%)"
              : "radial-gradient(circle, rgba(187,247,208,0.85), transparent 70%)" }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.65, 1, 0.65] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-[12%] right-[12%] w-[360px] h-[360px] rounded-full blur-[110px]"
            style={{ background: darkMode
              ? "radial-gradient(circle, rgba(52,211,153,0.18), transparent 70%)"
              : "radial-gradient(circle, rgba(220,252,231,0.9), transparent 70%)" }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.85, 0.5] }}
            transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
          />
          {/* Dot grid overlay */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle, ${darkMode ? "rgba(52,211,153,0.13)" : "rgba(22,163,74,0.11)"} 1px, transparent 1px)`,
              backgroundSize: "42px 42px",
            }}
          />
        </div>

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative text-center px-4 max-w-4xl mx-auto">
          <motion.p className="text-[10px] tracking-[0.45em] font-bold uppercase mb-7"
            style={{ color: accent }}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            {hero.tagline}
          </motion.p>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.92] tracking-tight mb-6"
            style={{ fontFamily: "'Georgia', 'Times New Roman', serif", color: textPrimary }}>
            {hero.headline.split(" ").map((word, i) => (
              <motion.span key={i} className="inline-block mr-[0.2em]"
                initial={{ opacity: 0, y: 42 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.18 + i * 0.07 }}>
                {word}
              </motion.span>
            ))}
          </h1>

          <motion.p className="text-xl md:text-2xl font-light italic mb-5"
            style={{ fontFamily: "'Georgia', serif", color: darkMode ? "#6ee7b7" : "#16a34a" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85 }}>
            {hero.subheadline}
          </motion.p>

          <motion.p className="text-base md:text-lg max-w-xl mx-auto"
            style={{ color: textSecondary }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.05 }}>
            {hero.philosophy}
          </motion.p>
        </motion.div>
      </section>

      {/* ══════════════════════════════
          2. PROBLEM
      ══════════════════════════════ */}
      <section className="py-24 md:py-36 px-4"
        style={{ background: darkMode
          ? "linear-gradient(180deg, #000000 0%, #030303 100%)"
          : "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)" }}>
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-16">
            <SectionLabel text={problem.sectionLabel} darkMode={darkMode} />
            <h2 className="text-3xl md:text-5xl font-black tracking-tight" style={{ color: textPrimary }}>
              {problem.heading}
            </h2>
          </Reveal>
          <div className="grid md:grid-cols-2 gap-6 md:gap-10">
            {/* LEFT — Traditional */}
            <Reveal delay={0.1}>
              <div className="rounded-2xl p-8 h-full"
                style={{ backgroundColor: darkMode ? "#0d0000" : "#fff5f5",
                         border: `1px solid ${darkMode ? "rgba(239,68,68,0.12)" : "rgba(239,68,68,0.18)"}` }}>
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "rgba(239,68,68,0.1)" }}>
                    <XCircle size={16} className="text-red-400" />
                  </span>
                  <span className="text-xs uppercase tracking-widest text-red-400 font-semibold">{problem.left.label}</span>
                </div>
                <h3 className="text-xl font-bold mb-6" style={{ color: textPrimary }}>{problem.left.title}</h3>
                <ul className="space-y-4">
                  {problem.left.points.map((p, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm leading-relaxed" style={{ color: textSecondary }}>
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            {/* RIGHT — Interactive */}
            <Reveal delay={0.2}>
              <div className="rounded-2xl p-8 h-full"
                style={{ backgroundColor: darkMode ? "#00100a" : "#f0fdf4",
                         border: `1px solid ${darkMode ? "rgba(52,211,153,0.13)" : "rgba(22,163,74,0.18)"}` }}>
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: accentDim }}>
                    <CheckCircle size={16} style={{ color: accent }} />
                  </span>
                  <span className="text-xs uppercase tracking-widest font-semibold" style={{ color: accent }}>{problem.right.label}</span>
                </div>
                <h3 className="text-xl font-bold mb-6" style={{ color: textPrimary }}>{problem.right.title}</h3>
                <ul className="space-y-4">
                  {problem.right.points.map((p, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm leading-relaxed" style={{ color: darkMode ? "#cbd5e1" : "#374151" }}>
                      <span className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ backgroundColor: accent }} />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          3. FEATURES GRID
      ══════════════════════════════ */}
      <section className="py-24 md:py-36 px-4"
        style={{ background: darkMode
          ? "linear-gradient(180deg, #030303 0%, #060606 50%, #030303 100%)"
          : "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 50%, #f8fafc 100%)" }}>
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-16">
            <SectionLabel text={features.sectionLabel} darkMode={darkMode} />
            <h2 className="text-3xl md:text-5xl font-black tracking-tight" style={{ color: textPrimary }}>
              {features.heading}
            </h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.cards.map((card, i) => {
              const Icon = card.icon;
              return (
                <Reveal key={card.title} delay={i * 0.07}>
                  <motion.div
                    className="group relative rounded-2xl p-6 overflow-hidden cursor-default"
                    style={{ backgroundColor: bgCard, border: `1px solid ${border}`,
                             transition: "all 0.2s ease" }}
                    whileHover={{ borderColor: borderHover, backgroundColor: bgCardHover, y: -5 }}>
                    {/* Hover radial glow */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                      style={{ background: darkMode
                        ? "radial-gradient(280px at 50% 50%, rgba(6,95,70,0.2), transparent 80%)"
                        : "radial-gradient(280px at 50% 50%, rgba(187,247,208,0.55), transparent 80%)" }} />
                    <div className="relative">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                        style={{ backgroundColor: accentDim, border: `1px solid ${darkMode ? "rgba(52,211,153,0.2)" : "rgba(22,163,74,0.2)"}` }}>
                        <Icon size={18} style={{ color: accent }} />
                      </div>
                      <h3 className="text-base font-bold mb-2" style={{ color: textPrimary }}>{card.title}</h3>
                      <p className="text-sm leading-relaxed" style={{ color: textSecondary }}>{card.description}</p>
                    </div>
                  </motion.div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          4. INTERACTIVE EXPERIENCES
      ══════════════════════════════ */}
      <section className="py-24 md:py-36 px-4"
        style={{ background: darkMode
          ? "linear-gradient(180deg, #060606 0%, #000000 100%)"
          : "linear-gradient(180deg, #f1f5f9 0%, #ffffff 100%)" }}>
        <div className="max-w-6xl mx-auto space-y-28">
          {experiences.map((exp, i) => {
            const Visual = visualMap[exp.visual];
            const isEven = i % 2 === 0;
            return (
              <Reveal key={exp.id}>
                <div className={`flex flex-col ${isEven ? "md:flex-row" : "md:flex-row-reverse"} gap-12 md:gap-20 items-center`}>
                  <div className="flex-1 space-y-5">
                    <span className="text-xs tracking-widest font-bold uppercase" style={{ color: accent }}>{exp.label}</span>
                    <h3 className="text-3xl md:text-4xl font-black leading-tight tracking-tight"
                      style={{ color: textPrimary, fontFamily: "'Georgia', serif" }}>
                      {exp.title}
                    </h3>
                    <p className="leading-relaxed text-base" style={{ color: textSecondary }}>{exp.description}</p>
                    <div className="flex items-baseline gap-2 pt-2">
                      <span className="text-4xl font-black" style={{ color: accent }}>{exp.stat}</span>
                      <span className="text-sm" style={{ color: textSecondary }}>{exp.statLabel}</span>
                    </div>
                  </div>
                  <div className="flex-1 rounded-2xl p-6 w-full"
                    style={{ backgroundColor: darkMode ? "#0a0a0a" : "#f8fafc", border: `1px solid ${border}` }}>
                    {Visual && <Visual />}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ══════════════════════════════
          5. PHILOSOPHY QUOTE
      ══════════════════════════════ */}
      <section className="py-28 md:py-44 px-4 relative overflow-hidden"
        style={{ background: darkMode
          ? "linear-gradient(180deg, #000000 0%, #03100a 50%, #000000 100%)"
          : "linear-gradient(180deg, #ffffff 0%, #f0fdf4 50%, #ffffff 100%)" }}>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[700px] h-[700px] rounded-full blur-[160px]"
            style={{ background: darkMode
              ? "radial-gradient(circle, rgba(6,95,70,0.35), transparent)"
              : "radial-gradient(circle, rgba(187,247,208,0.85), transparent)" }} />
        </div>
        <div className="relative max-w-3xl mx-auto text-center">
          <Reveal>
            <p className="text-[10px] tracking-[0.4em] font-bold uppercase mb-8" style={{ color: accent }}>
              {philosophy.preQuote}
            </p>
            <blockquote className="text-2xl md:text-4xl font-black leading-tight mb-8"
              style={{ fontFamily: "'Georgia', serif", color: textPrimary }}>
              "{philosophy.quote}"
            </blockquote>
            <p className="text-sm tracking-wide mb-10" style={{ color: accent }}>{philosophy.attribution}</p>
            <p className="text-base leading-relaxed max-w-2xl mx-auto" style={{ color: textSecondary }}>{philosophy.body}</p>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════
          6. ABOUT PROJECT
      ══════════════════════════════ */}
      <section className="py-24 md:py-36 px-4"
        style={{ background: darkMode
          ? "linear-gradient(180deg, #000000 0%, #050505 50%, #000000 100%)"
          : "linear-gradient(180deg, #ffffff 0%, #f8fafc 50%, #ffffff 100%)" }}>
        <div className="max-w-4xl mx-auto">
          <Reveal className="mb-10">
            <SectionLabel text={project.sectionLabel} darkMode={darkMode} />
            <h2 className="text-3xl md:text-5xl font-black tracking-tight" style={{ color: textPrimary }}>
              {project.heading}
            </h2>
          </Reveal>
          <div className="space-y-6">
            {[project.purpose, project.approach, project.value].map((para, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <p className="leading-relaxed text-base md:text-lg" style={{ color: textBody }}>{para}</p>
              </Reveal>
            ))}
            <Reveal delay={0.3}>
              <div className="mt-10 pt-8 flex flex-col sm:flex-row gap-2 text-sm"
                style={{ borderTop: `1px solid ${border}`, color: textSecondary }}>
                <span>{project.submitted}</span>
                <span className="hidden sm:inline" style={{ color: textMuted }}>·</span>
                <span>{project.institution}</span>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          7. DEVELOPER
      ══════════════════════════════ */}
      <section className="py-24 md:py-36 px-4"
        style={{ background: darkMode
          ? "linear-gradient(180deg, #000000 0%, #030d07 100%)"
          : "linear-gradient(180deg, #f8fafc 0%, #f0fdf4 100%)" }}>
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <div className="rounded-2xl p-8 md:p-12 flex flex-col md:flex-row gap-10 items-start"
              style={{
                backgroundColor: darkMode ? "#0a0a0a" : "#ffffff",
                border: `1px solid ${border}`,
                boxShadow: darkMode ? "0 0 50px rgba(6,95,70,0.07)" : "0 4px 40px rgba(0,0,0,0.05)",
              }}>
              {/* Avatar */}
              <div className="shrink-0">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden"
                  style={{ border: `2px solid ${darkMode ? "rgba(52,211,153,0.3)" : "rgba(22,163,74,0.3)"}`,
                           backgroundColor: darkMode ? "#032218" : "#dcfce7" }}>
                  <img src={developer.avatar} alt={developer.name} className="w-full h-full object-cover" />
                </div>
              </div>
              {/* Text */}
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Leaf size={14} style={{ color: accent }} />
                    <span className="text-xs tracking-widest uppercase font-semibold" style={{ color: accent }}>Developer</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black" style={{ color: textPrimary }}>{developer.name}</h3>
                  <p className="text-sm mt-1" style={{ color: textSecondary }}>{developer.role} · {developer.institution}</p>
                </div>
                <p className="leading-relaxed text-sm md:text-base" style={{ color: textBody }}>{developer.bio}</p>
                <p className="leading-relaxed text-sm italic" style={{ color: textSecondary }}>{developer.motivation}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════
          8. VISION
      ══════════════════════════════ */}
      <section className="py-24 md:py-36 px-4"
        style={{ background: darkMode
          ? "linear-gradient(180deg, #030d07 0%, #000000 100%)"
          : "linear-gradient(180deg, #f0fdf4 0%, #f8fafc 100%)" }}>
        <div className="max-w-5xl mx-auto">
          <Reveal className="text-center mb-16">
            <SectionLabel text={vision.sectionLabel} darkMode={darkMode} />
            <h2 className="text-3xl md:text-5xl font-black tracking-tight" style={{ color: textPrimary }}>
              {vision.heading}
            </h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 gap-5">
            {vision.items.map((item, i) => (
              <Reveal key={item.number} delay={i * 0.1}>
                <motion.div
                  className="rounded-2xl p-6 flex gap-5 cursor-default"
                  style={{ backgroundColor: bgCard, border: `1px solid ${border}`,
                           transition: "all 0.2s ease" }}
                  whileHover={{ borderColor: borderHover, backgroundColor: bgCardHover }}>
                  <span className="text-4xl font-black leading-none"
                    style={{ color: darkMode ? "#14532d" : "#16a34a" }}>
                    {item.number}
                  </span>
                  <div>
                    <h4 className="text-base font-bold mb-2" style={{ color: textPrimary }}>{item.title}</h4>
                    <p className="text-sm leading-relaxed" style={{ color: textSecondary }}>{item.description}</p>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          9. CLOSING
      ══════════════════════════════ */}
      <section className="py-32 md:py-52 px-4 relative overflow-hidden"
        style={{ background: darkMode
          ? "linear-gradient(180deg, #000000 0%, #020c06 50%, #000000 100%)"
          : "linear-gradient(180deg, #f8fafc 0%, #f0fdf4 50%, #ffffff 100%)" }}>
        {/* Ambient bottom glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[420px] rounded-full blur-[130px]"
            style={{ background: darkMode
              ? "radial-gradient(ellipse, rgba(6,95,70,0.42), transparent)"
              : "radial-gradient(ellipse, rgba(187,247,208,0.9), transparent)" }}
            animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 6, repeat: Infinity }} />
        </div>

        <div className="relative max-w-3xl mx-auto text-center">
          <Reveal>
            <p className="text-3xl md:text-5xl lg:text-6xl font-black leading-tight mb-3"
              style={{ fontFamily: "'Georgia', serif", color: textPrimary }}>
              {closing.line1}
            </p>
            <p className="text-3xl md:text-5xl lg:text-6xl font-black leading-tight mb-3"
              style={{ fontFamily: "'Georgia', serif", color: darkMode ? "#475569" : "#6b7280" }}>
              {closing.line2}
            </p>
            <p className="text-3xl md:text-5xl lg:text-6xl font-black leading-tight mb-14"
              style={{ fontFamily: "'Georgia', serif", color: accent }}>
              {closing.line3}
            </p>
            <motion.a
              href={closing.ctaLink}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-base tracking-wide"
              style={{ backgroundColor: accent, color: darkMode ? "#000000" : "#ffffff",
                       transition: "background-color 0.2s ease" }}
              whileHover={{ scale: 1.05, backgroundColor: darkMode ? "#6ee7b7" : "#15803d" }}
              whileTap={{ scale: 0.97 }}>
              {closing.cta}
              <ArrowRight size={16} />
            </motion.a>
          </Reveal>
        </div>
      </section>
    </div>
  );
}