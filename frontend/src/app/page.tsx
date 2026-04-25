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
      <header className="fixed top-0 left-0 w-full z-50 p-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <OvaryIcon className="w-8 h-8 text-pink-500" />
            <span className="font-bold text-xl text-white tracking-tight">Femlytix<span className="text-pink-500">.AI</span></span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-10 text-sm font-semibold absolute left-1/2 -translate-x-1/2">
            <Link href="/" className="text-pink-500 transition-colors">Home</Link>
            <Link href="#how-it-works" className="text-slate-400 hover:text-white transition-colors">How It Works</Link>
            <Link href="/intake" className="text-slate-400 hover:text-white transition-colors">AI Diagnostics</Link>
            <Link href="/login" className="text-slate-400 hover:text-white transition-colors">Patient Web</Link>
          </nav>

          <Link href="/admin">
            <button className="px-6 py-2 text-xs font-bold text-pink-400 border border-pink-500/40 rounded-full hover:bg-pink-500/10 transition-all duration-300">
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
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3
              }
            }
          }}
          className="z-10 max-w-4xl"
        >
          {/* Central Glowing Icon */}
          <motion.div 
            variants={{
              hidden: { opacity: 0, scale: 0.5 },
              show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 100 } }
            }}
            className="relative mb-12 inline-block"
          >
            <div className="absolute inset-0 bg-pink-500 rounded-full blur-[50px] opacity-20" />
            <div className="relative bg-[#0f172a]/40 border border-pink-500/20 p-6 rounded-full backdrop-blur-2xl shadow-[0_0_60px_rgba(236,72,153,0.15)]">
              <OvaryIcon className="w-14 h-14 text-pink-500" />
            </div>
          </motion.div>

          <motion.h1 
            variants={{
              hidden: { opacity: 0, y: 30 },
              show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
            }}
            className="text-8xl md:text-[140px] font-black tracking-tighter mb-8 leading-none"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-indigo-500 drop-shadow-2xl">
              Femlytix
            </span>
          </motion.h1>

          <motion.p 
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
            }}
            className="text-lg md:text-xl text-slate-300 mb-16 max-w-2xl mx-auto leading-relaxed font-medium"
          >
            Pioneering women&apos;s health with multimodal diagnostics for Polycystic Ovary Syndrome. 
            Early detection, AI risk analysis, and personalized metabolic tracking.
          </motion.p>

          <motion.div 
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
            }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link href="/intake">
              <button className="px-10 py-5 bg-gradient-to-r from-[#e11d48] to-[#9333ea] text-white rounded-xl font-bold text-lg shadow-[0_0_30px_rgba(225,29,72,0.3)] hover:scale-[1.02] transition-all">
                Start Risk Assessment
              </button>
            </Link>
            
            <Link href="/login">
              <button className="px-10 py-5 bg-[#0f172a]/60 backdrop-blur-xl border border-slate-800 text-slate-200 rounded-xl font-bold text-lg hover:bg-slate-800/80 transition-all">
                Patient Login
              </button>
            </Link>

            <Link href="/login">
              <button className="px-10 py-5 bg-[#1e1b4b]/60 backdrop-blur-md border border-purple-900/30 text-slate-300 rounded-xl font-bold text-lg hover:bg-[#1e1b4b]/80 transition-all">
                Admin Login
              </button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
        >
          <span className="text-[10px] font-bold tracking-[0.4em] text-pink-500 uppercase">Discover Health</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ChevronDown className="w-5 h-5 text-pink-500/50" />
          </motion.div>
        </motion.div>
      </section>

      {/* CLINICAL PCOS WORKFLOW (Flowchart) */}
      <section id="how-it-works" className="py-32 relative bg-slate-950 overflow-hidden">
        {/* Background decorative flow line */}
        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-pink-500/20 to-transparent hidden md:block" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-xs font-bold text-pink-500 tracking-[0.4em] uppercase mb-4">Precision Pipeline</h2>
            <h3 className="text-5xl md:text-6xl font-black text-white mb-8 tracking-tighter italic">Clinical PCOS Workflow</h3>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-medium">
              Our diagnostic architecture mirrors professional clinical protocols, synthesizing multimodal data streams through an ensemble AI infrastructure.
            </p>
          </div>

          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.2
                }
              }
            }}
            className="grid grid-cols-1 md:grid-cols-4 gap-12 relative"
          >
            {/* Connection Arrows (Mobile Hidden) */}
            <div className="absolute top-[3.5rem] left-[15%] right-[15%] hidden md:flex justify-between pointer-events-none opacity-30">
              <div className="w-full h-[1px] bg-gradient-to-r from-pink-500 to-purple-500" />
              <div className="w-full h-[1px] bg-gradient-to-r from-purple-500 to-indigo-500" />
              <div className="w-full h-[1px] bg-gradient-to-r from-indigo-500 to-blue-500" />
            </div>

            <StepCard 
              number="01" 
              icon={<FileText className="w-7 h-7" />} 
              title="Clinical Intake" 
              desc="Collection of patient history including menstrual regularity, hirsutism assessment, and biometric tracking." 
            />
            <StepCard 
              number="02" 
              icon={<Database className="w-7 h-7" />} 
              title="Biochemical Screening" 
              desc="Integration of hormonal panels (FSH, LH, Testosterone) and metabolic markers for systemic risk evaluation." 
            />
            <StepCard 
              number="03" 
              icon={<Brain className="w-7 h-7" />} 
              title="Multimodal AI Analysis" 
              desc="Synchronized processing of clinical data and sonographic patterns via our PyTorch ensemble pipeline." 
            />
            <StepCard 
              number="04" 
              icon={<CheckCircle className="w-7 h-7" />} 
              title="Diagnostic Synthesis" 
              desc="Generation of a comprehensive PCOS risk profile, including follicle-count-per-ovary (FNPO) and clinical plans." 
            />
          </motion.div>
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
                  <a href="https://www.linkedin.com/in/edupulapatisaipraneeth/" target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm text-slate-400 hover:text-pink-400 transition-colors">
                    <Linkedin className="w-4 h-4" /> LinkedIn Profile
                  </a>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <h6 className="text-xl font-bold text-white">Liel Stephen</h6>
                <div className="flex flex-col gap-3">
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
    <motion.div 
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
      }}
      whileHover={{ y: -5 }}
      className="relative p-8 rounded-3xl bg-slate-900/40 border border-slate-800 hover:border-pink-500/30 transition-all group overflow-hidden"
    >
      {/* Biological pulse effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/0 via-pink-500/0 to-pink-500/0 group-hover:from-pink-500/5 group-hover:to-purple-500/5 transition-all duration-500" />
      
      <div className="absolute -top-4 -right-4 text-8xl font-black text-white/5 group-hover:text-pink-500/10 transition-colors pointer-events-none select-none">
        {number}
      </div>
      
      <div className="relative z-10">
        <div className="w-16 h-16 bg-slate-800 text-pink-500 rounded-2xl flex items-center justify-center mb-8 border border-slate-700 shadow-xl group-hover:scale-110 group-hover:bg-pink-500 group-hover:text-white transition-all duration-500">
          {icon}
        </div>
        <h4 className="text-2xl font-bold text-white mb-4 tracking-tight group-hover:text-pink-400 transition-colors">{title}</h4>
        <p className="text-sm text-slate-400 leading-relaxed font-medium">{desc}</p>
      </div>

      {/* Connection dot */}
      <div className="absolute bottom-4 right-4 w-1 h-1 bg-pink-500/20 rounded-full group-hover:scale-[10] group-hover:opacity-0 transition-all duration-700" />
    </motion.div>
  );
}

const CpuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="15" x2="23" y2="15"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="15" x2="4" y2="15"></line></svg>
);
