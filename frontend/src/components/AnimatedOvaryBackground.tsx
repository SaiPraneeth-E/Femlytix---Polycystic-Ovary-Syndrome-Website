"use client";

import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/* ──────────────────────────────────────────────────────────
   OVARY ICON – A stylized, anatomically-inspired icon
   showing the uterus + fallopian tubes + ovaries with
   animated draw-on and subtle follicle pulsing.
   ────────────────────────────────────────────────────────── */
export const OvaryIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <radialGradient id="ovary-glow-l" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="currentColor" stopOpacity="0.4" />
        <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="ovary-glow-r" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="currentColor" stopOpacity="0.4" />
        <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* Uterus body */}
    <motion.path
      d="M52 58 C52 48, 46 42, 46 36 C46 32, 48 30, 52 30 L68 30 C72 30, 74 32, 74 36 C74 42, 68 48, 68 58 C68 72, 60 82, 60 90 C60 82, 52 72, 52 58Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="currentColor"
      fillOpacity="0.08"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 1.8, ease: "easeInOut" }}
    />

    {/* Left fallopian tube */}
    <motion.path
      d="M46 36 C40 34, 32 30, 26 32 C20 34, 16 38, 18 44 C20 48, 24 48, 26 46"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 1.2, delay: 0.8, ease: "easeInOut" }}
    />

    {/* Right fallopian tube */}
    <motion.path
      d="M74 36 C80 34, 88 30, 94 32 C100 34, 104 38, 102 44 C100 48, 96 48, 94 46"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 1.2, delay: 0.8, ease: "easeInOut" }}
    />

    {/* Left ovary – outer shape */}
    <motion.ellipse
      cx="22" cy="46" rx="12" ry="14"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="currentColor"
      fillOpacity="0.06"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.5, duration: 0.6, ease: "backOut" }}
    />
    {/* Left ovary glow */}
    <motion.ellipse
      cx="22" cy="46" rx="16" ry="18"
      fill="url(#ovary-glow-l)"
      initial={{ scale: 0 }}
      animate={{ scale: [1, 1.15, 1] }}
      transition={{ delay: 2, duration: 3, repeat: Infinity, ease: "easeInOut" }}
    />

    {/* Right ovary – outer shape */}
    <motion.ellipse
      cx="98" cy="46" rx="12" ry="14"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="currentColor"
      fillOpacity="0.06"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.5, duration: 0.6, ease: "backOut" }}
    />
    {/* Right ovary glow */}
    <motion.ellipse
      cx="98" cy="46" rx="16" ry="18"
      fill="url(#ovary-glow-r)"
      initial={{ scale: 0 }}
      animate={{ scale: [1, 1.15, 1] }}
      transition={{ delay: 2.3, duration: 3, repeat: Infinity, ease: "easeInOut" }}
    />

    {/* Left follicles */}
    {[
      { cx: 17, cy: 40, r: 2, delay: 2.0 },
      { cx: 26, cy: 42, r: 1.5, delay: 2.2 },
      { cx: 20, cy: 50, r: 2.5, delay: 2.4 },
      { cx: 28, cy: 50, r: 1.8, delay: 2.1 },
      { cx: 16, cy: 48, r: 1.2, delay: 2.6 },
    ].map((f, i) => (
      <motion.circle
        key={`lf-${i}`}
        cx={f.cx} cy={f.cy} r={f.r}
        fill="currentColor"
        fillOpacity="0.35"
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1, 0.7, 1] }}
        transition={{ delay: f.delay, duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      />
    ))}

    {/* Right follicles */}
    {[
      { cx: 93, cy: 40, r: 2, delay: 2.1 },
      { cx: 102, cy: 44, r: 1.5, delay: 2.3 },
      { cx: 96, cy: 52, r: 2.5, delay: 2.5 },
      { cx: 104, cy: 48, r: 1.8, delay: 2.0 },
      { cx: 92, cy: 50, r: 1.2, delay: 2.7 },
    ].map((f, i) => (
      <motion.circle
        key={`rf-${i}`}
        cx={f.cx} cy={f.cy} r={f.r}
        fill="currentColor"
        fillOpacity="0.35"
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1, 0.7, 1] }}
        transition={{ delay: f.delay, duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      />
    ))}
  </svg>
);

/* ──────────────────────────────────────────────────────────
   ANIMATED OVARY BACKGROUND – Large, ghostly ovary shapes
   float in the background with parallax, orbital follicles,
   and flowing fallopian-tube curves.
   ────────────────────────────────────────────────────────── */

/* ──────────────────────────────────────────────────────────
   ANIMATED OVARY BACKGROUND – Precisely matching the reference image
   with central vertical oval, side nodes, and connecting hormonal lines.
   ────────────────────────────────────────────────────────── */

const BiologicalNode = ({ side, delay }: { side: "left" | "right"; delay: number }) => {
  const isLeft = side === "left";
  return (
    <motion.div
      className={`absolute top-[45%] ${isLeft ? "left-[10%]" : "right-[10%]"} -translate-y-1/2`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.5, delay, ease: "easeOut" }}
    >
      <div className="relative">
        {/* Outer Glow Ring */}
        <div className={`absolute inset-0 rounded-full blur-[40px] opacity-20 ${isLeft ? "bg-pink-500" : "bg-purple-500"}`} />
        
        <svg width="180" height="180" viewBox="0 0 100 100" className="opacity-40">
          <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="0.5" fill="none" className="text-slate-700" />
          <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="0.3" strokeDasharray="2 4" fill="none" className="text-pink-500/30" />
          
          {/* Internal follicles */}
          {[...Array(8)].map((_, i) => (
            <motion.circle
              key={i}
              cx={40 + Math.random() * 20}
              cy={40 + Math.random() * 20}
              r={1.5 + Math.random() * 2.5}
              fill={isLeft ? "#ec4899" : "#a855f7"}
              fillOpacity="0.4"
              animate={{ 
                opacity: [0.2, 0.6, 0.2],
                scale: [0.8, 1.2, 0.8]
              }}
              transition={{ 
                duration: 3 + Math.random() * 2, 
                repeat: Infinity, 
                delay: Math.random() * 2 
              }}
            />
          ))}
        </svg>
      </div>
    </motion.div>
  );
};

export default function AnimatedOvaryBackground() {
  const [mounted, setMounted] = useState(false);
  const [particles, setParticles] = useState<{ x: number; y: number; size: number; duration: number; delay: number; color: string }[]>([]);
  const { scrollY } = useScroll();
  const yRange = useTransform(scrollY, [0, 500], [0, -50]);

  useEffect(() => {
    setMounted(true);
    const colors = ["#ec4899", "#a855f7", "#6366f1"];
    const newParticles = [...Array(30)].map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    setParticles(newParticles);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 bg-[#020617]">
      {/* Central Large Vertical Ellipse */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[800px] border border-slate-800/40 rounded-[50%] opacity-40" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[750px] border border-pink-500/10 rounded-[50%] opacity-20" />

      {/* Horizontal Hormonal Connection Lines */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ec4899" stopOpacity="0" />
            <stop offset="20%" stopColor="#ec4899" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#a855f7" stopOpacity="0.4" />
            <stop offset="80%" stopColor="#6366f1" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Wavy lines connecting side nodes to center */}
        <motion.path
          d="M 150 400 C 300 380, 450 420, 600 400 S 900 380, 1050 400"
          stroke="url(#line-grad)"
          strokeWidth="1.5"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3, ease: "easeInOut" }}
        />
        <motion.path
          d="M 150 420 C 300 440, 450 380, 600 420 S 900 440, 1050 420"
          stroke="url(#line-grad)"
          strokeWidth="1"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3.5, delay: 0.5, ease: "easeInOut" }}
          className="opacity-40"
        />
      </svg>

      {/* Side Biological Nodes */}
      <BiologicalNode side="left" delay={0.5} />
      <BiologicalNode side="right" delay={0.8} />

      {/* Ambient Glows */}
      <div className="absolute top-[20%] left-[15%] w-[400px] h-[400px] bg-pink-600/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[20%] right-[15%] w-[450px] h-[450px] bg-purple-600/5 rounded-full blur-[140px]" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-pink-500/10 rounded-full blur-[100px]" />

      {/* Floating small particles */}
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
          }}
          animate={{
            y: [0, -40, 0],
            opacity: [0, 0.4, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
          }}
        />
      ))}
    </div>
  );
}
