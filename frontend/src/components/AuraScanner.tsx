"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Crosshair } from "lucide-react";

interface Spot {
  x: number;
  y: number;
  area: number;
}

interface AuraScannerProps {
  imageUrl?: string;
  spots?: Spot[];
  isScanning?: boolean;
}

export default function AuraScanner({ imageUrl, spots = [], isScanning = false }: AuraScannerProps) {
  const [scanComplete, setScanComplete] = useState(false);

  useEffect(() => {
    if (!isScanning) {
      const timer = setTimeout(() => setScanComplete(true), 2500);
      return () => clearTimeout(timer);
    } else {
      setScanComplete(false);
    }
  }, [isScanning]);

  return (
    <div className="relative w-full aspect-square md:aspect-video bg-slate-950 rounded-2xl border border-slate-700 overflow-hidden shadow-[0_0_50px_rgba(0,180,255,0.15)] group">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20 pointer-events-none" />

      {/* Main Image Viewport */}
      {imageUrl ? (
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="relative w-full h-full max-w-2xl max-h-full aspect-square rounded-xl overflow-hidden border border-slate-800 shadow-2xl">
            {/* The Ultrasound/Medical Image */}
            <img 
              src={imageUrl?.startsWith('data:') ? imageUrl : `data:image/jpeg;base64,${imageUrl}`} 
              alt="Medical Scan" 
              className={`w-full h-full object-cover mix-blend-screen transition-all duration-1000 ${scanComplete ? 'grayscale-0' : 'grayscale'}`} 
            />
            
            {/* Dark Color Burn Overlay for medical feel */}
            <div className="absolute inset-0 bg-cyan-900/20 mix-blend-color pointer-events-none" />

            {/* Simulated Scan Line (Top to Bottom) */}
            <AnimatePresence>
              {!scanComplete && (
                <motion.div
                  initial={{ top: "0%" }}
                  animate={{ top: "100%" }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute left-0 right-0 h-4 bg-gradient-to-b from-transparent to-cyan-400/50 border-b-2 border-cyan-400 z-20 pointer-events-none shadow-[0_0_20px_rgba(34,211,238,0.8)]"
                />
              )}
            </AnimatePresence>

            {/* Detected Spots (Follicles/Cysts) */}
            {scanComplete && spots.slice(0, 15).map((spot, idx) => (
              <motion.div
                key={idx}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: idx * 0.15, type: "spring", stiffness: 200, damping: 10 }}
                className="absolute z-30 flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
                style={{ top: `${spot.y}%`, left: `${spot.x}%` }}
              >
                {/* Targeting Crosshair */}
                <Crosshair className="absolute text-cyan-400 w-8 h-8 opacity-70 animate-spin-slow" />
                
                {/* Pulsing Core */}
                <div className="w-4 h-4 bg-red-500/80 rounded-full shadow-[0_0_15px_rgba(239,68,68,1)] animate-pulse" />
                
                {/* Ripple Effect */}
                <div className="absolute w-12 h-12 border border-red-500/50 rounded-full animate-ping opacity-75" />
                
                {/* Label Line & Text */}
                <div className="absolute left-8 bottom-8 pointer-events-none">
                  <svg className="w-16 h-16 absolute -bottom-2 -left-2 overflow-visible">
                    <line x1="0" y1="64" x2="32" y2="32" stroke="#06b6d4" strokeWidth="1" strokeDasharray="2,2" />
                    <line x1="32" y1="32" x2="64" y2="32" stroke="#06b6d4" strokeWidth="1" />
                  </svg>
                  <div className="absolute left-[64px] bottom-[34px] whitespace-nowrap bg-slate-900/80 border border-cyan-900/50 px-2 py-0.5 rounded backdrop-blur-md">
                    <span className="text-[9px] font-mono text-cyan-300 uppercase tracking-wider">
                      Area: {spot.area}px²
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Holographic scan overlay text */}
            <div className="absolute top-4 left-4 z-40 flex flex-col gap-1 pointer-events-none">
              <span className="text-[10px] font-mono text-cyan-500 bg-black/40 px-1">TGT: PELVIC_ULTRASOUND</span>
              <span className="text-[10px] font-mono text-cyan-500 bg-black/40 px-1">MDL: UNET_SEG_V2</span>
              {scanComplete && (
                <span className="text-[10px] font-mono text-rose-400 bg-black/40 px-1 animate-pulse">
                  DETECTED: {spots.length} ANOMALIES
                </span>
              )}
            </div>
            
            <div className="absolute bottom-4 right-4 z-40 pointer-events-none">
              <div className="flex items-center gap-2">
                <Activity className={`w-4 h-4 ${scanComplete ? 'text-cyan-500' : 'text-amber-500 animate-pulse'}`} />
                <span className="text-[10px] font-mono text-slate-300">
                  {scanComplete ? 'ANALYSIS COMPLETE' : 'SCANNING MATRIX...'}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full border-2 border-slate-700 border-t-cyan-500 animate-spin mx-auto" />
            <p className="text-sm font-mono text-slate-500">AWAITING IMAGE DATA STREAM...</p>
          </div>
        </div>
      )}

      {/* Decorative cyber corners */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-500/50 m-4 rounded-tl-lg" />
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-500/50 m-4 rounded-tr-lg" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-500/50 m-4 rounded-bl-lg" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-500/50 m-4 rounded-br-lg" />
    </div>
  );
}
