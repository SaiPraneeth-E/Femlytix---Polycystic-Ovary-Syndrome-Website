"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown, Mail, Linkedin, Github, Activity, ShieldAlert, Brain, FileText, Database, CheckCircle } from "lucide-react";
import AnimatedOvaryBackground, { OvaryIcon } from "@/components/AnimatedOvaryBackground";

export default function Home() {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 200], [1, 0]);
  const scale = useTransform(scrollY, [0, 200], [1, 0.9]);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 overflow-x-hidden selection:bg-pink-500/30">
      
      {/* GLOBAL NAVIGATION */}
      <header className="fixed top-0 left-0 w-full z-50 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <OvaryIcon className="w-8 h-8 text-pink-500 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-xl text-white tracking-tight">Femlytix<span className="text-pink-500">.AI</span></span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-10 text-sm font-medium absolute left-1/2 -translate-x-1/2">
            <Link href="/" className="text-pink-400 hover:text-pink-300 transition-colors">Home</Link>
            <Link href="#how-it-works" className="text-slate-400 hover:text-white transition-colors">How It Works</Link>
            <Link href="/intake" className="text-slate-400 hover:text-white transition-colors">AI Diagnostics</Link>
            <Link href="/login" className="text-slate-400 hover:text-white transition-colors">Patient Web</Link>
          </nav>

          <Link href="/admin">
            <button className="px-6 py-2 text-xs font-bold text-pink-400 border border-pink-500/30 rounded-full hover:bg-pink-500/10 transition-all duration-300 backdrop-blur-sm">
              Staff Portal
            </button>
          </Link>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex flex-col items-center justify-center p-6 text-center pt-20">
        <AnimatedOvaryBackground />

        <motion.div
          style={{ opacity, scale }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="z-10 max-w-4xl"
        >
          {/* Central Glowing Icon */}
          <div className="relative mb-12 inline-block">
            <div className="absolute inset-0 bg-pink-500 rounded-full blur-[40px] opacity-20 animate-pulse" />
            <div className="relative bg-slate-900/50 border border-pink-500/20 p-6 rounded-full backdrop-blur-xl shadow-[0_0_50px_rgba(236,72,153,0.15)]">
              <OvaryIcon className="w-16 h-16 text-pink-500" />
            </div>
          </div>

          <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-8 leading-none">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 drop-shadow-2xl">
              Femlytix
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
            Pioneering women&apos;s health with multimodal diagnostics for Polycystic Ovary Syndrome. 
            Early detection, AI risk analysis, and personalized metabolic tracking.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href="/intake">
              <button className="px-10 py-4 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white rounded-2xl font-bold text-lg shadow-[0_0_30px_rgba(236,72,153,0.3)] hover:shadow-[0_0_40px_rgba(236,72,153,0.5)] transition-all hover:-translate-y-1">
                Start Risk Assessment
              </button>
            </Link>
            
            <Link href="/login">
              <button className="px-10 py-4 bg-slate-900/60 backdrop-blur-xl border border-slate-800 hover:border-pink-500/50 text-slate-200 rounded-2xl font-bold text-lg transition-all hover:bg-slate-800/80 hover:-translate-y-1">
                Patient Login
              </button>
            </Link>

            <Link href="/login">
              <button className="px-10 py-4 bg-slate-900/40 backdrop-blur-md border border-purple-900/30 hover:border-purple-500/50 text-slate-400 hover:text-white rounded-2xl font-bold text-lg transition-all hover:-translate-y-1 shadow-[0_0_20px_rgba(139,92,246,0.1)]">
                Admin Login
              </button>
            </Link>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }} 
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-pink-500/60">Discover Health</span>
          <ChevronDown className="w-5 h-5 text-pink-500" />
        </motion.div>
      </section>

      {/* ADDITIONAL SECTIONS (Keeping them but updating theme to match) */}
      <section id="how-it-works" className="py-32 relative bg-slate-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-sm font-bold text-pink-500 tracking-widest uppercase mb-3">Diagnostic Pipeline</h2>
            <h3 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">How Femlytix Works</h3>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Our platform orchestrates a powerful multi-stage Machine Learning approach combining tabular clinical records with computer-vision ultrasound scans.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <StepCard number="01" icon={<FileText />} title="Intake Form" desc="Submit age, BMI, and hormonal assays (FSH/LH levels) via our secure patient portal." />
            <StepCard number="02" icon={<Database />} title="Image Upload" desc="Attach sonographic ultrasound imaging of the ovaries for neural network routing." />
            <StepCard number="03" icon={<CpuIcon />} title="AI Analysis" desc="Our PyTorch Ensemble Models cross-verify tabular risk data against vision-based follicle patterns." />
            <StepCard number="04" icon={<CheckCircle />} title="Prescription" desc="The LLM Orchestrator generates a fully synthesized PDF risk report and lifestyle modification plan." />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 border-t border-slate-900 pt-20 pb-10 relative">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="text-center md:text-left">
            <h4 className="text-3xl font-bold text-white mb-4">Femlytix<span className="text-pink-500">.AI</span></h4>
            <p className="text-slate-500 text-sm max-w-md leading-relaxed">
              Democratizing advanced healthcare diagnostics by pairing high-performance Machine Learning infrastructure with intuitive clinical dashboards.
            </p>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-xl p-8 rounded-3xl border border-slate-800 max-w-xl w-full">
            <h5 className="text-xs uppercase tracking-widest font-bold text-pink-500/60 mb-6">Project Architects</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="flex flex-col gap-4">
                <h6 className="text-xl font-bold text-white">Edupulapati Sai Praneeth</h6>
                <div className="flex flex-col gap-3">
                  <a href="mailto:saipraneeth080805@gmail.com" className="flex items-center gap-3 text-sm text-slate-400 hover:text-pink-400 transition-colors">
                    <Mail className="w-4 h-4" /> saipraneeth080805@gmail.com
                  </a>
                  <a href="https://www.linkedin.com/in/edupulapatisaipraneeth/" target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm text-slate-400 hover:text-pink-400 transition-colors">
                    <Linkedin className="w-4 h-4" /> LinkedIn Profile
                  </a>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <h6 className="text-xl font-bold text-white">Liel Stephen</h6>
                <div className="flex flex-col gap-3">
                  <a href="mailto:lielstephen@gmail.com" className="flex items-center gap-3 text-sm text-slate-400 hover:text-pink-400 transition-colors">
                    <Mail className="w-4 h-4" /> lielstephen@gmail.com
                  </a>
                  <a href="https://github.com/LielStephen" target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm text-slate-400 hover:text-pink-400 transition-colors">
                    <Github className="w-4 h-4" /> GitHub: LielStephen
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-widest text-slate-600 font-bold">
          <p>© {new Date().getFullYear()} Femlytix Platform</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-pink-500 transition-colors">Privacy</a>
            <a href="#" className="hover:text-pink-500 transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </main>
  );
}

function StepCard({ number, icon, title, desc }: { number: string, icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="relative p-8 rounded-3xl bg-slate-900/40 border border-slate-800 hover:border-pink-500/20 transition-all group overflow-hidden">
      <div className="absolute -top-4 -right-4 text-8xl font-black text-white/5 group-hover:text-pink-500/10 transition-colors pointer-events-none">
        {number}
      </div>
      <div className="relative z-10">
        <div className="w-14 h-14 bg-slate-800 text-pink-500 rounded-2xl flex items-center justify-center mb-8 border border-slate-700 group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <h4 className="text-xl font-bold text-white mb-3 tracking-tight">{title}</h4>
        <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

const CpuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="15" x2="23" y2="15"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="15" x2="4" y2="15"></line></svg>
);
