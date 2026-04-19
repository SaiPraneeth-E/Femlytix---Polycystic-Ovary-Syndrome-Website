"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Activity, Brain, ShieldAlert, Cpu } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600 rounded-full blur-[120px] opacity-20 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500 rounded-full blur-[120px] opacity-20 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-4xl max-auto text-center z-10"
      >
        <div className="flex justify-center mb-6">
          <div className="bg-slate-800 p-4 rounded-full border border-cyan-500/30 glow-border">
            <Cpu className="w-12 h-12 text-cyan-400" />
          </div>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 mt-4">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 glow-text">
            Femlytix
          </span>
        </h1>

        <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          Advanced diagnostic platform for PCOS detection, metabolic risk analysis, and AI-driven personalized lifestyle recommendations.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link href="/intake">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-bold text-lg shadow-[0_0_20px_rgba(6,182,212,0.4)]"
            >
              Start AI Assessment
            </motion.button>
          </Link>
          <Link href="/login">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-slate-800 border border-slate-700 hover:border-cyan-500/50 text-slate-200 rounded-lg font-bold text-lg transition-colors"
            >
              Patient Login
            </motion.button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <FeatureCard
            icon={<Brain className="text-cyan-400 w-6 h-6" />}
            title="Advanced CNN Model"
            desc="Utilizes a dedicated Convolutional Neural Network to process ultrasound images for comprehensive assessment."
          />
          <FeatureCard
            icon={<Activity className="text-cyan-400 w-6 h-6" />}
            title="Metabolic Risk Analysis"
            desc="Analysis of primary biometric markers like BMI for assessing metabolic risk."
          />
          <FeatureCard
            icon={<ShieldAlert className="text-cyan-400 w-6 h-6" />}
            title="Image Analysis"
            desc="Automated ultrasound reading via CNN to detect ovarian cysts and anomalies with high precision."
          />
        </div>
      </motion.div>
    </main>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="glass-panel p-6 hover:bg-slate-800/80 transition-colors duration-300">
      <div className="mb-4 bg-slate-800/50 w-12 h-12 rounded-lg flex items-center justify-center border border-slate-700">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-slate-200 mb-2">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}
