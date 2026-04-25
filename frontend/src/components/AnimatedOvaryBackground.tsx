"use client";

import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export const OvaryIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <motion.path
      d="M50 25C65 25 75 35 75 50C75 65 65 75 50 75C35 75 25 65 25 50C25 35 35 25 50 25Z"
      stroke="currentColor"
      strokeWidth="2"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 2, ease: "easeInOut" }}
    />
    <motion.path
      d="M25 50C15 50 10 40 10 30C10 20 20 15 30 15C40 15 45 20 50 25"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
    />
    <motion.path
      d="M75 50C85 50 90 40 90 30C90 20 80 15 70 15C60 15 55 20 50 25"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
    />
    <motion.circle
      cx="15" cy="30" r="3"
      fill="currentColor"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1.5 }}
    />
    <motion.circle
      cx="85" cy="30" r="3"
      fill="currentColor"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1.5 }}
    />
  </svg>
);

export default function AnimatedOvaryBackground() {
  const [mounted, setMounted] = useState(false);
  const [particles, setParticles] = useState<{ x: string, y: string, duration: number, delay: number }[]>([]);
  const { scrollY } = useScroll();
  const yRange = useTransform(scrollY, [0, 500], [0, -100]);

  useEffect(() => {
    setMounted(true);
    // Generate particles on mount to avoid hydration mismatch
    const newParticles = [...Array(15)].map(() => ({
      x: Math.random() * 100 + "%",
      y: Math.random() * 100 + "%",
      duration: Math.random() * 5 + 5,
      delay: Math.random() * 5
    }));
    setParticles(newParticles);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 bg-slate-950">
      {/* Dynamic Grid */}
      <div className="absolute inset-0 opacity-10" 
           style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #334155 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      
      {/* Glowing Orbs */}
      <motion.div 
        style={{ y: yRange }}
        className="absolute top-[20%] left-[10%] w-[30vw] h-[30vw] bg-pink-600/10 rounded-full blur-[100px]" 
      />
      <motion.div 
        style={{ y: useTransform(scrollY, [0, 500], [0, 100]) }}
        className="absolute bottom-[20%] right-[10%] w-[40vw] h-[40vw] bg-purple-600/10 rounded-full blur-[120px]" 
      />

      {/* Animated Connection Lines (SVG) */}
      <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 1000 1000" preserveAspectRatio="none">
        <motion.path
          d="M 100 500 Q 300 400 500 500"
          stroke="url(#grad-pink)"
          strokeWidth="1"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
        />
        <motion.path
          d="M 900 500 Q 700 600 500 500"
          stroke="url(#grad-purple)"
          strokeWidth="1"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", delay: 1 }}
        />
        <defs>
          <linearGradient id="grad-pink" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ec4899" stopOpacity="0" />
            <stop offset="50%" stopColor="#ec4899" stopOpacity="1" />
            <stop offset="100%" stopColor="#ec4899" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="grad-purple" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0" />
            <stop offset="50%" stopColor="#8b5cf6" stopOpacity="1" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {/* Floating Particles */}
      {particles.map((particle, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-pink-400 rounded-full opacity-40"
          initial={{ 
            x: particle.x, 
            y: particle.y,
            scale: 0
          }}
          animate={{ 
            y: [null, "-20%"],
            opacity: [0, 0.4, 0],
            scale: [0, 1, 0.5]
          }}
          transition={{ 
            duration: particle.duration, 
            repeat: Infinity, 
            ease: "linear",
            delay: particle.delay
          }}
        />
      ))}
    </div>
  );
}
