"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  Users,
  AlertTriangle,
  Server,
  LogOut,
  ChevronRight,
  BrainCircuit,
  CheckCircle2,
  Clock,
  Shield,
  FileText,
  UserX,
  UserCheck,
  X,
  Stethoscope
} from "lucide-react";



const initialUsers = [
  { id: "USR-001", name: "Dr. Jane Smith", role: "SysAdmin", email: "jane.smith@clinic.com", active: true },
  { id: "USR-002", name: "Mark Torres", role: "Nurse", email: "mtorres@clinic.com", active: true },
  { id: "USR-003", name: "Dr. Alan Grant", role: "Doctor", email: "agrant@clinic.com", active: false },
  { id: "USR-004", name: "Sarah Connor", role: "Patient", email: "sconnor@email.com", active: true },
];

const mlNodes = [
  { name: "FastAPI Orchestrator", status: "Online", uptime: "14d 2h", port: 8000 },
  { name: "PyTorch Inference (Vision)", status: "Online", uptime: "14d 2h", port: 8001 },
  { name: "LLM Gemini Flash Interface", status: "Connected", uptime: "14d 2h", port: "Global" },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"overview" | "patients" | "users">("overview");
  
  // States for interactive features
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [systemUsers, setSystemUsers] = useState(initialUsers);
  
  const [livePatients, setLivePatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Hydrate Data from Dynamic Backend Call
  useEffect(() => {
    fetch("http://localhost:8000/api/predict/patients")
      .then(res => res.json())
      .then(data => {
        if(Array.isArray(data)) {
           setLivePatients(data);
        }
        setLoading(false);
      })
      .catch(err => {
         console.error("Failed to fetch patients", err);
         setLoading(false);
      });
  }, []);

  const totalPatients = livePatients.length;
  const highRisk = livePatients.filter(p => p.status === "High Risk" || p.status === "Review Required").length;
  let avgConfidence = 0;
  if(totalPatients > 0) {
      const sum = livePatients.reduce((acc, p) => acc + parseFloat(p.confidence), 0);
      avgConfidence = sum / totalPatients;
  }

  const liveStats = [
    { name: "Total Prescreened", value: totalPatients.toString(), change: "Live", icon: Users, color: "text-blue-400" },
    { name: "High-Risk Detected", value: highRisk.toString(), change: "Live", icon: AlertTriangle, color: "text-amber-400" },
    { name: "AI Confidence Avg", value: `${avgConfidence.toFixed(1)}%`, change: "Live", icon: BrainCircuit, color: "text-purple-400" },
    { name: "Sys Health", value: "99.9%", change: "Stable", icon: Activity, color: "text-emerald-400" },
  ];

  // User Management functions
  const toggleUserRole = (id: string) => {
    setSystemUsers(prev => prev.map(u => {
      if (u.id === id) {
        return { ...u, role: u.role === "SysAdmin" ? "Patient" : "SysAdmin" };
      }
      return u;
    }));
  };

  const toggleUserAccess = (id: string) => {
    setSystemUsers(prev => prev.map(u => {
      if (u.id === id) {
        return { ...u, active: !u.active };
      }
      return u;
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      {/* Background Effect */}
      <div className="fixed top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-900/10 to-transparent pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl border-b border-white/5 bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
              <Shield className="w-5 h-5 text-emerald-400" />
            </div>
            <h1 className="font-bold text-xl tracking-tight text-white">Administrator<span className="text-emerald-500">.AI</span></h1>
          </div>
          
          <div className="flex items-center gap-8">
            <nav className="hidden md:flex gap-6 text-sm font-medium">
              <button type="button" onClick={() => setActiveTab("overview")} className={`transition-colors ${activeTab === 'overview' ? 'text-emerald-400 border-b-2 border-emerald-400 pb-5 translate-y-[10px]' : 'text-slate-400 hover:text-white'}`}>Overview</button>
              <button type="button" onClick={() => setActiveTab("patients")} className={`transition-colors ${activeTab === 'patients' ? 'text-emerald-400 border-b-2 border-emerald-400 pb-5 translate-y-[10px]' : 'text-slate-400 hover:text-white'}`}>Patient Records</button>
              <button type="button" onClick={() => setActiveTab("users")} className={`transition-colors ${activeTab === 'users' ? 'text-emerald-400 border-b-2 border-emerald-400 pb-5 translate-y-[10px]' : 'text-slate-400 hover:text-white'}`}>User Management</button>
            </nav>

            <button 
              onClick={() => router.push("/")}
              className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-full border border-white/10 hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 relative">
        
        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {liveStats.map((stat, i) => (
                <div key={i} className="glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-white/10 transition-colors">
                  <div className={`absolute -right-6 -top-6 w-24 h-24 bg-current opacity-[0.03] rounded-full group-hover:scale-110 transition-transform duration-500 ${stat.color}`} />
                  <div className="flex items-center justify-between mb-4">
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    <span className="text-xs font-medium text-slate-400 bg-slate-800/50 px-2 py-1 rounded-full">
                      {stat.change}
                    </span>
                  </div>
                  <h3 className="text-slate-400 text-sm font-medium mb-1">{stat.name}</h3>
                  <p className="text-3xl font-bold text-white mb-0">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main List */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Clock className="w-5 h-5 text-emerald-400" />
                    Live Diagnostic Queue
                  </h2>
                </div>

                <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-light text-sm text-slate-400 bg-black/20">
                        <th className="p-4 font-medium">Patient ID</th>
                        <th className="p-4 font-medium">Age</th>
                        <th className="p-4 font-medium">AI Diagnosis</th>
                        <th className="p-4 font-medium">Confidence</th>
                        <th className="p-4 font-medium text-right">Review</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {loading ? (
                         <tr><td colSpan={5} className="p-8 text-center text-slate-500 animate-pulse">Connecting to Database...</td></tr>
                      ) : livePatients.length === 0 ? (
                         <tr><td colSpan={5} className="p-8 text-center text-slate-500">No patient records found in database.</td></tr>
                      ) : livePatients.map((pt, i) => (
                        <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                          <td className="p-4 font-medium text-slate-300">{pt.id}</td>
                          <td className="p-4 text-slate-400">{pt.age}</td>
                          <td className="p-4">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                              pt.severity === 'critical' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 
                              pt.severity === 'warning' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 
                              'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            }`}>
                              {pt.severity === 'critical' ? <AlertTriangle className="w-3.5 h-3.5" /> : 
                              pt.severity === 'warning' ? <Clock className="w-3.5 h-3.5" /> : 
                              <CheckCircle2 className="w-3.5 h-3.5" />}
                              {pt.status}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <div className="h-1.5 w-16 bg-slate-800 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full ${parseInt(pt.confidence) > 90 ? 'bg-emerald-400' : 'bg-amber-400'}`}
                                  style={{ width: pt.confidence }}
                                />
                              </div>
                              <span className="text-sm font-medium text-slate-300">{pt.confidence}</span>
                            </div>
                          </td>
                          <td className="p-4 text-right">
                            <button 
                              type="button"
                              onClick={() => { setSelectedPatient(pt); setActiveTab("patients"); }}
                              className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors"
                            >
                              <ChevronRight className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Server className="w-5 h-5 text-purple-400" />
                  ML Architecture Health
                </h2>
                
                <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-6">
                  {mlNodes.map((node, i) => (
                    <div key={i} className="flex flex-col gap-2">
                      <div className="flex justify-between items-start">
                        <span className="font-medium text-slate-200 text-sm">{node.name}</span>
                        <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          {node.status}
                        </span>
                      </div>
                      <div className="flex gap-4 text-xs text-slate-500">
                        <span>Uptime: {node.uptime}</span>
                        <span>Port: {node.port}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PATIENT RECORDS TAB */}
        {activeTab === "patients" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
             <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <FileText className="w-6 h-6 text-emerald-400" />
                Comprehensive Patient Records
             </h2>
             
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               {/* Patient List */}
               <div className="lg:col-span-1 border border-white/5 bg-slate-900/50 rounded-2xl overflow-hidden h-fit">
                 {loading ? (
                    <div className="p-8 text-center text-slate-500 animate-pulse">Loading DB...</div>
                 ) : livePatients.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">No records found.</div>
                 ) : livePatients.map((pt, i) => (
                   <div 
                    onClick={() => setSelectedPatient(pt)}
                    key={i} 
                    className={`p-4 border-b border-light cursor-pointer hover:bg-white/[0.04] transition-colors ${selectedPatient?.id === pt.id ? 'bg-emerald-900/20 border-l-2 border-l-emerald-500' : 'border-l-2 border-l-transparent'}`}
                   >
                     <div className="flex justify-between items-center mb-1">
                       <span className="font-semibold text-white">{pt.name}</span>
                       <span className="text-xs text-slate-500">{pt.id}</span>
                     </div>
                     <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider ${
                          pt.severity === 'critical' ? 'bg-red-500/10 text-red-400' : 
                          pt.severity === 'warning' ? 'bg-amber-500/10 text-amber-400' : 
                          'bg-emerald-500/10 text-emerald-400'
                        }`}>
                          {pt.status}
                     </span>
                   </div>
                 ))}
               </div>

               {/* Patient Details Detail View */}
               <div className="lg:col-span-2">
                 {selectedPatient ? (
                   <div className="glass-panel p-8 rounded-2xl border border-white/5 animate-in slide-in-from-right-8 duration-300">
                     <div className="flex justify-between items-start mb-8 pb-6 border-b border-white/5">
                        <div>
                          <h3 className="text-3xl font-bold text-white mb-2">{selectedPatient.name}</h3>
                          <div className="flex gap-4 text-sm text-slate-400">
                            <span>Age: {selectedPatient.age}</span>
                            <span>ID: {selectedPatient.id}</span>
                            <span>Admitted: {selectedPatient.time}</span>
                          </div>
                        </div>
                        <span className={`px-4 py-2 rounded-lg text-sm font-bold border ${selectedPatient.severity === 'critical' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                          {selectedPatient.confidence} AI MATCH
                        </span>
                     </div>

                     <h4 className="text-sm font-semibold tracking-widest text-slate-500 mb-4 uppercase flex items-center gap-2">
                       <Stethoscope className="w-4 h-4" /> Clinical Biomarkers
                     </h4>
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                       <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                         <span className="block text-xs text-slate-500 mb-1">BMI</span>
                         <span className={`text-lg font-semibold ${selectedPatient.features.bmi > 25 ? 'text-amber-400' : 'text-slate-200'}`}>{selectedPatient.features.bmi}</span>
                       </div>
                       <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                         <span className="block text-xs text-slate-500 mb-1">FSH/LH Ratio</span>
                         <span className={`text-lg font-semibold ${selectedPatient.features.fshLhRatio > 2 ? 'text-red-400' : 'text-slate-200'}`}>{selectedPatient.features.fshLhRatio}</span>
                       </div>
                       <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                         <span className="block text-xs text-slate-500 mb-1">Cycle Length (Days)</span>
                         <span className={`text-lg font-semibold ${selectedPatient.features.cycleLength > 35 ? 'text-red-400' : 'text-slate-200'}`}>{selectedPatient.features.cycleLength}</span>
                       </div>
                       <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                         <span className="block text-xs text-slate-500 mb-1">Ovarian Follicles</span>
                         <span className={`text-lg font-semibold ${selectedPatient.features.follicles > 12 ? 'text-red-400' : 'text-slate-200'}`}>{selectedPatient.features.follicles}</span>
                       </div>
                     </div>

                     <h4 className="text-sm font-semibold tracking-widest text-slate-500 mb-4 uppercase flex items-center gap-2">
                       <BrainCircuit className="w-4 h-4" /> Machine Learning Conclusion
                     </h4>
                     <div className="bg-blue-500/5 border border-blue-500/20 p-6 rounded-xl relative overflow-hidden">
                       <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
                       <p className="text-slate-300 leading-relaxed text-sm">
                         Analysis by the PyTorch Deep Q-Network indicates a highly probable alignment with {selectedPatient.status === 'High Risk' ? 'Polycystic Ovary Syndrome phenotypes' : 'standard metabolic functioning'}. 
                         The follicle count ({selectedPatient.features.follicles}) combined with a BMI of {selectedPatient.features.bmi} heavily mapped to class cluster A.
                       </p>
                     </div>
                   </div>
                 ) : (
                   <div className="h-full border border-white/5 border-dashed rounded-2xl flex flex-col items-center justify-center text-slate-500 py-24">
                     <Users className="w-12 h-12 mb-4 opacity-20" />
                     <p>Select a patient from the queue to view full diagnostic breakdown.</p>
                   </div>
                 )}
               </div>
             </div>
          </div>
        )}

        {/* USER MANAGEMENT TAB */}
        {activeTab === "users" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
             <div className="flex justify-between items-center mb-8">
               <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Shield className="w-6 h-6 text-purple-400" />
                  System Authorization Roles
               </h2>
               <button type="button" className="bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium px-6 py-2 rounded-full transition-colors shadow-lg">
                 + Invite Staff
               </button>
             </div>

             <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-light text-sm text-slate-400 bg-black/20">
                      <th className="p-4 font-medium">User Name</th>
                      <th className="p-4 font-medium">Network ID</th>
                      <th className="p-4 font-medium">System Role</th>
                      <th className="p-4 font-medium">Status</th>
                      <th className="p-4 font-medium text-right">Admin Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {systemUsers.map((user, i) => (
                      <tr key={i} className={`hover:bg-white/[0.02] transition-colors ${!user.active && 'opacity-50 grayscale'}`}>
                        <td className="p-4">
                          <span className="font-medium text-white block">{user.name}</span>
                          <span className="text-xs text-slate-500">{user.email}</span>
                        </td>
                        <td className="p-4 text-slate-400 text-sm font-mono">{user.id}</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                              user.role === 'SysAdmin' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 
                              user.role === 'Doctor' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 
                              'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                            }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="p-4">
                          {user.active ? (
                            <span className="text-xs font-medium text-emerald-400 flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> Active</span>
                          ) : (
                            <span className="text-xs font-medium text-red-500 flex items-center gap-1.5"><X className="w-3.5 h-3.5" /> Suspended</span>
                          )}
                        </td>
                        <td className="p-4 text-right flex justify-end gap-2">
                          <button 
                            type="button"
                            onClick={() => toggleUserRole(user.id)}
                            className="text-xs px-3 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300 font-medium transition-colors"
                          >
                            {user.role === 'SysAdmin' ? 'Revoke Admin' : 'Make Admin'}
                          </button>
                          <button 
                            type="button"
                            onClick={() => toggleUserAccess(user.id)}
                            className={`p-1.5 rounded-lg border transition-colors ${user.active ? 'border-red-500/20 text-red-400 hover:bg-red-500/10' : 'border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10'}`}
                            title={user.active ? "Suspend Access" : "Restore Access"}
                          >
                            {user.active ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          </div>
        )}
      </main>
    </div>
  );
}
