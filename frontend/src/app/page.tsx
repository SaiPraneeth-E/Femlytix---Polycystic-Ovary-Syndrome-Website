"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Activity, Brain, ShieldAlert, Cpu, ChevronDown, CheckCircle, Database, FileText, Github, Linkedin, Mail } from "lucide-react";

export default function Home() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, -200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, 200]);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 overflow-x-hidden selection:bg-cyan-500/30">
      
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex flex-col items-center justify-center p-6 pt-20">
        {/* Background Decor */}
        <motion.div style={{ y: y1 }} className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] bg-blue-600 rounded-full blur-[150px] opacity-20 pointer-events-none" />
        <motion.div style={{ y: y2 }} className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500 rounded-full blur-[150px] opacity-20 pointer-events-none" />

        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-[0.03] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-5xl mx-auto text-center z-10"
        >
          <div className="flex justify-center mb-8">
            <div className="bg-slate-900 border border-cyan-500/30 p-5 rounded-full shadow-[0_0_30px_rgba(6,182,212,0.15)] relative group">
              <div className="absolute inset-0 bg-cyan-400 rounded-full blur-md opacity-20 group-hover:opacity-40 transition-opacity" />
              <Cpu className="w-14 h-14 text-cyan-400 relative z-10" />
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-8">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 drop-shadow-sm">
              Femlytix
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            The advanced multimodal diagnostic pipeline for early PCOS detection, metabolic risk analysis, and AI-driven personalized lifestyle recommendations.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-24">
            <Link href="/intake">
              <button className="w-full sm:w-auto px-10 py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold text-lg shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] transition-all hover:-translate-y-1">
                Start AI Assessment
              </button>
            </Link>
            <Link href="/login">
              <button className="w-full sm:w-auto px-10 py-4 bg-slate-900/80 backdrop-blur-md border border-slate-700 hover:border-cyan-500/50 text-slate-200 rounded-xl font-bold text-lg transition-all hover:bg-slate-800 hover:-translate-y-1">
                Patient & Admin Login
              </button>
            </Link>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }} 
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-slate-500 flex flex-col items-center gap-2"
        >
          <span className="text-xs uppercase tracking-widest font-semibold flex flex-col items-center gap-2">Discover Health</span>
          <ChevronDown className="w-5 h-5 text-cyan-500" />
        </motion.div>
      </section>

      {/* EDUCATIONAL SECTION: What is PCOS */}
      <section className="py-24 relative border-t border-slate-800 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-cyan-400 tracking-widest uppercase mb-3">Understanding the Condition</h2>
            <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">What is PCOS?</h3>
            <p className="text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
              Polycystic Ovary Syndrome (PCOS) is a hormonal disorder common among women of reproductive age. It can cause irregular menstrual cycles, excess androgen levels, and polycystic ovaries—which can impact fertility and metabolic health.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Activity className="text-red-400 w-8 h-8" />}
              title="Hormonal Imbalance"
              desc="Elevated androgens (male hormones) can prevent the ovaries from releasing eggs properly and cause bodily changes like excess hair growth or severe acne."
              borderColor="border-red-500/20"
              bgColor="bg-red-500/5"
            />
            <FeatureCard
              icon={<ShieldAlert className="text-amber-400 w-8 h-8" />}
              title="Metabolic Complications"
              desc="If left unmanaged, PCOS significantly increases the risk of metabolic syndrome, type 2 diabetes, high blood pressure, and cardiovascular issues."
              borderColor="border-amber-500/20"
              bgColor="bg-amber-500/5"
            />
            <FeatureCard
              icon={<Brain className="text-emerald-400 w-8 h-8" />}
              title="Why Early Detection Matters"
              desc="Diagnosing PCOS early allows for lifestyle interventions, automated dietary adjustments, and medication that severely reduces long-term metabolic risks."
              borderColor="border-emerald-500/20"
              bgColor="bg-emerald-500/5"
            />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-sm font-bold text-cyan-400 tracking-widest uppercase mb-3">Diagnostic Pipeline</h2>
            <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">How Femlytix Works</h3>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Our platform orchestrates a powerful multi-stage Machine Learning approach combining tabular clinical records with computer-vision ultrasound scans.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <StepCard number="01" icon={<FileText />} title="Intake Form" desc="Submit age, BMI, and hormonal assays (FSH/LH levels) via our secure patient portal." />
            <StepCard number="02" icon={<Database />} title="Image Upload" desc="Attach sonographic ultrasound imaging of the ovaries for neural network routing." />
            <StepCard number="03" icon={<Cpu />} title="AI Analysis" desc="Our PyTorch Ensemble Models cross-verify tabular risk data against vision-based follicle patterns." />
            <StepCard number="04" icon={<CheckCircle />} title="Prescription" desc="The LLM Orchestrator generates a fully synthesized PDF risk report and lifestyle modification plan." />
          </div>
        </div>
      </section>

      {/* FOOTER & AUTHOR INFO */}
      <footer className="bg-slate-950 border-t border-slate-800 pt-16 pb-8 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
          
          <div className="text-center md:text-left">
            <h4 className="text-2xl font-bold text-white mb-2">Femlytix<span className="text-cyan-500">.AI</span></h4>
            <p className="text-slate-500 text-sm max-w-md">
              Democratizing advanced healthcare diagnostics by pairing high-performance Machine Learning infrastructure with intuitive clinical dashboards.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-md">
            <h5 className="text-sm uppercase tracking-widest font-bold text-slate-400 mb-4 text-center md:text-left">Created By</h5>
            <div className="flex flex-col gap-2">
              <h6 className="text-lg font-bold text-cyan-400">Edupulapati Sai Praneeth</h6>
              
              <div className="flex flex-col gap-2 mt-2">
                <a href="mailto:saipraneeth080805@gmail.com" className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors group">
                  <Mail className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" /> saipraneeth080805@gmail.com
                </a>
                <a href="https://www.linkedin.com/in/edupulapatisaipraneeth/" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors group">
                  <Linkedin className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" /> LinkedIn Profile
                </a>
                <a href="https://github.com/SaiPraneeth-E" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors group">
                  <Github className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" /> GitHub: SaiPraneeth-E
                </a>
              </div>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-slate-800/50 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-600">
          <p>© {new Date().getFullYear()} Femlytix Platform. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-400">Privacy Policy</a>
            <a href="#" className="hover:text-slate-400">Terms of Service</a>
          </div>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({ icon, title, desc, borderColor = "border-slate-700", bgColor = "bg-slate-800/50" }: { icon: React.ReactNode, title: string, desc: string, borderColor?: string, bgColor?: string }) {
  return (
    <div className={`glass-panel p-8 rounded-2xl border ${borderColor} hover:border-cyan-500/50 transition-all duration-300 group hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-500/10`}>
      <div className={`mb-6 ${bgColor} w-16 h-16 rounded-xl flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function StepCard({ number, icon, title, desc }: { number: string, icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="relative p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/30 transition-all group overflow-hidden">
      <div className="absolute top-[-20%] right-[-10%] text-8xl font-black text-slate-800/30 group-hover:text-cyan-900/20 transition-colors pointer-events-none select-none">
        {number}
      </div>
      <div className="relative z-10">
        <div className="w-12 h-12 bg-slate-800 text-cyan-400 rounded-lg flex items-center justify-center mb-6 border border-slate-700 group-hover:bg-cyan-500/10 transition-colors">
          {icon}
        </div>
        <h4 className="text-lg font-bold text-white mb-2">{title}</h4>
        <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
