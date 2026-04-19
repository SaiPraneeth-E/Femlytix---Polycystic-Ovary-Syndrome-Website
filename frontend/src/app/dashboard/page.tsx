"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert, Activity, FileText, Download, Utensils, Dumbbell, Moon, Brain, Pill, Stethoscope, Droplets, AlertTriangle } from "lucide-react";
import dynamic from "next/dynamic";

const AuraScanner = dynamic(() => import("@/components/AuraScanner"), { ssr: false });

export default function Dashboard() {
    const router = useRouter();
    const [results, setResults] = useState<any>(null);
    const [patient, setPatient] = useState<any>(null);
    const [loadingPdf, setLoadingPdf] = useState(false);
    const [activeTab, setActiveTab] = useState("diet");

    useEffect(() => {
        const res = sessionStorage.getItem("pcos_results");
        const pat = sessionStorage.getItem("patient_info");
        if (res && pat) {
            setResults(JSON.parse(res));
            setPatient(JSON.parse(pat));
        } else {
            router.push("/intake");
        }
    }, [router]);

    const handleDownloadReport = async () => {
        if (!results || !patient) return;
        setLoadingPdf(true);
        try {
            const apiBase = typeof window !== 'undefined' ? `http://${window.location.hostname}:8000` : 'http://127.0.0.1:8000';
            const res = await fetch(`${apiBase}/api/reports/generate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    patient_name: patient.name || "Patient",
                    patient_data: patient, // Now contains patient_id and ultrasound_base64
                    clinical_results: results.clinical_results,
                    recommendations: results.recommendations,
                    ultrasound_results: results.ultrasound_results
                })
            });
            if (!res.ok) throw new Error("Failed to generate report");
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "PCOS_Medical_Report.pdf";
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (e) {
            console.error(e);
            alert("Failed to download report.");
        }
        setLoadingPdf(false);
    };

    if (!results) return <div className="min-h-screen flex items-center justify-center text-cyan-400">Loading AI Data...</div>;

    const { clinical_results: cr, ultrasound_results: ur, recommendations: rec, affected_organs: organs } = results;

    const tabs = [
        { id: "diet", label: "Diet Plan", icon: <Utensils className="w-4 h-4" /> },
        { id: "exercise", label: "Exercise", icon: <Dumbbell className="w-4 h-4" /> },
        { id: "supplements", label: "Supplements", icon: <Pill className="w-4 h-4" /> },
        { id: "sleep", label: "Sleep", icon: <Moon className="w-4 h-4" /> },
        { id: "stress", label: "Stress", icon: <Brain className="w-4 h-4" /> },
        { id: "medical", label: "Medical", icon: <Stethoscope className="w-4 h-4" /> },
    ];

    return (
        <main className="min-h-screen p-6 md:p-12">
            <header className="flex justify-between items-center mb-8 pb-6 border-b border-slate-700">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Patient Dashboard</h1>
                    <p className="text-slate-400">AI Diagnostic Overview & Recommendations</p>
                </div>
                <button
                    onClick={handleDownloadReport}
                    disabled={loadingPdf}
                    className="flex items-center gap-2 bg-slate-800 border border-cyan-500/50 hover:bg-slate-700 px-4 py-2 rounded-lg text-cyan-400 transition-colors disabled:opacity-50"
                >
                    {loadingPdf ? <Activity className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                    Export PDF
                </button>
            </header>

            {/* Risk Banner */}
            {rec?.risk_level && (
                <div className={`mb-6 p-4 rounded-xl border flex items-center gap-3 ${rec.risk_level === "high" ? "bg-red-950/30 border-red-500/40 text-red-300" :
                    rec.risk_level === "moderate" ? "bg-amber-950/30 border-amber-500/40 text-amber-300" :
                        "bg-emerald-950/30 border-emerald-500/40 text-emerald-300"
                    }`}>
                    <AlertTriangle className="w-5 h-5" />
                    <span className="font-medium">Risk Level: <span className="uppercase font-bold">{rec.risk_level}</span></span>
                    <span className="text-sm opacity-70 ml-2">Score: {rec.risk_score}</span>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Col: Stats */}
                <div className="flex flex-col gap-6">
                    <StatCard
                        icon={<Activity className="text-amber-400" />}
                        title="BMI Classification"
                        val={`${cr?.calculated_bmi?.toFixed(1) || "N/A"}`}
                        sub={cr?.bmi_classification || ""}
                        alert={cr?.calculated_bmi > 25}
                    />
                    <StatCard
                        icon={<ShieldAlert className={ur?.cysts_detected ? "text-red-400" : "text-emerald-400"} />}
                        title="Diagnostic Consensus"
                        val={`${(ur?.pcos_probability * 100).toFixed(1)}%`}
                        sub={ur?.model_status === "multimodal_consensus" ? "Multimodal Consensus Active" : ur?.cysts_detected ? "Anomalies Detected" : "Normal"}
                        alert={ur?.cysts_detected}
                    />

                    {/* AI Peer Review Notes */}
                    {ur?.ai_peer_notes && (
                        <div className="glass-panel p-4 border-l-4 border-l-cyan-500 bg-cyan-950/10">
                            <div className="flex items-center gap-2 mb-2">
                                <Brain className="w-4 h-4 text-cyan-400" />
                                <h4 className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">AI Peer Review (Gemini 1.5)</h4>
                            </div>
                            <p className="text-xs text-slate-300 italic leading-relaxed">
                                "{ur.ai_peer_notes}"
                            </p>
                            <div className="mt-2 flex items-center gap-2">
                                <div className="h-1 flex-1 bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-cyan-500" style={{ width: `${(ur?.gemini_confidence ?? 0) * 100}%` }} />
                                </div>
                                <span className="text-[10px] text-slate-500">{(ur?.gemini_confidence * 100).toFixed(0)}% Conf.</span>
                            </div>
                        </div>
                    )}

                    {ur?.model_status && ur.model_status !== "active" && ur.model_status !== "multimodal_consensus" && (
                        <div className="glass-panel p-4 border-l-4 border-l-amber-500 text-sm text-amber-300">
                            ⚠️ System Mode: {ur.model_status}
                        </div>
                    )}

                    {/* Hormonal Panel */}
                    <div className="glass-panel p-4 border-l-4 border-l-purple-500">
                        <div className="flex items-center gap-2 mb-3">
                            <Droplets className="w-5 h-5 text-purple-400" />
                            <h4 className="text-slate-300 font-medium">Hormonal Profile</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-[10px] text-slate-500 uppercase">LH / FSH Ratio</p>
                                <p className="text-lg font-bold text-white">
                                    {(patient?.lh && patient?.fsh && patient.fsh > 0) ? (patient.lh / patient.fsh).toFixed(2) : "1.00"}
                                </p>
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-500 uppercase">Testosterone</p>
                                <p className="text-lg font-bold text-white">{patient?.testosterone ?? "0.5"} <span className="text-[10px] font-normal text-slate-400">ng/dL</span></p>
                            </div>
                        </div>
                    </div>

                    {/* Top Risk Factors */}
                    {ur?.top_risk_factors && ur.top_risk_factors.length > 0 && (
                        <div className="glass-panel p-4 border-l-4 border-l-amber-500">
                            <div className="flex items-center gap-2 mb-3">
                                <AlertTriangle className="w-5 h-5 text-amber-500" />
                                <h4 className="text-slate-300 font-medium">Top Risk Factors</h4>
                            </div>
                            <div className="space-y-2">
                                {ur.top_risk_factors.map((rf: any, i: number) => (
                                    <div key={i} className="flex justify-between items-center bg-slate-800/40 p-2 rounded">
                                        <span className="text-xs text-slate-300 capitalize">{rf?.feature?.replace(/_/g, ' ') || "Factor"}</span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                                <div className="h-full bg-amber-500" style={{ width: `${(rf?.importance ?? 0) * 100}%` }} />
                                            </div>
                                            <span className="text-[10px] text-slate-500">{((rf?.importance ?? 0) * 100).toFixed(0)}%</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Hydration & Temporal Trend */}
                    <div className="glass-panel p-4 border-l-4 border-l-cyan-500">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <Activity className="w-5 h-5 text-cyan-400" />
                                <h4 className="text-slate-300 font-medium">Trend: {ur?.temporal_risk || "Stable"}</h4>
                            </div>
                            <span className={`text-[10px] px-2 py-0.5 rounded ${ur?.temporal_risk === 'Worsening' ? 'bg-red-900/30 text-red-400' : 'bg-emerald-900/30 text-emerald-400'}`}>
                                {ur?.temporal_risk_score ? (ur.temporal_risk_score * 100).toFixed(0) + '%' : '0%'}
                            </span>
                        </div>
                        <p className="text-xs text-slate-400">{rec?.hydration}</p>
                    </div>
                </div>

                {/* Center: Aura Scanner */}
                <div className="lg:col-span-2">
                    <h3 className="text-xl font-semibold text-slate-200 mb-4 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-cyan-400" />
                        Biometric Ultrasound Scan
                    </h3>
                    <AuraScanner 
                        imageUrl={patient?.ultrasound_base64} 
                        spots={ur?.spots || []} 
                        isScanning={false} 
                    />
                </div>
            </div>

            {/* ── Gemini AI Insights ── */}
            {
                results?.gemini_analysis && (
                    <div className="mt-8 glass-panel p-6 border-l-4 border-l-purple-500">
                        <h3 className="text-xl font-semibold text-slate-200 mb-4 flex items-center gap-2">
                            <Brain className="w-5 h-5 text-purple-400" />
                            Gemini AI Medical Insights
                        </h3>
                        <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                            {results.gemini_analysis}
                        </div>
                    </div>
                )
            }
            {/* ── Expanded RL Recommendations ── */}
            <div className="mt-8 glass-panel p-6">
                <h3 className="text-xl font-semibold text-slate-200 mb-6 flex items-center gap-2 border-b border-slate-700 pb-4">
                    <FileText className="w-5 h-5 text-cyan-400" />
                    AI Lifestyle Prescription
                </h3>

                {/* Tab Bar */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab.id
                                ? "bg-cyan-600/30 text-cyan-300 border border-cyan-500/50"
                                : "bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:bg-slate-700/50"
                                }`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="min-h-[300px]">
                    {activeTab === "diet" && rec?.diet && <DietPanel diet={rec.diet} />}
                    {activeTab === "exercise" && rec?.exercise && <ExercisePanel exercise={rec.exercise} />}
                    {activeTab === "supplements" && rec?.supplements && <SupplementsPanel supplements={rec.supplements} />}
                    {activeTab === "sleep" && rec?.sleep && <SleepPanel sleep={rec.sleep} />}
                    {activeTab === "stress" && rec?.stress_management && <StressPanel stress={rec.stress_management} />}
                    {activeTab === "medical" && rec?.medical_advice && <MedicalPanel medical={rec.medical_advice} />}
                </div>
            </div>
        </main >
    );
}

/* ── Stat Card ── */
function StatCard({ icon, title, val, sub, alert }: any) {
    return (
        <div className={`glass-panel p-6 border-l-4 ${alert ? 'border-l-red-500' : 'border-l-cyan-500'}`}>
            <div className="flex items-center gap-3 mb-2">
                <div className="bg-slate-800/80 p-2 rounded-md">{icon}</div>
                <h4 className="text-slate-300 font-medium">{title}</h4>
            </div>
            <div className={`text-3xl font-bold mt-4 ${alert ? 'text-red-400' : 'text-white'}`}>{val}</div>
            {sub && <p className="text-sm text-slate-400 mt-1">{sub}</p>}
        </div>
    );
}

/* ── Diet Panel ── */
function DietPanel({ diet }: any) {
    return (
        <div className="space-y-6">
            <div>
                <h4 className="text-lg font-semibold text-cyan-400 mb-1">{diet.title}</h4>
                <p className="text-slate-400 text-sm">{diet.overview}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-4">
                    <h5 className="text-emerald-400 font-medium mb-3 flex items-center gap-2">✅ Foods to Eat</h5>
                    <ul className="space-y-2">
                        {diet.foods_to_eat?.map((f: string, i: number) => (
                            <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                                <span className="text-emerald-400 mt-0.5">•</span> {f}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="bg-red-950/20 border border-red-500/20 rounded-xl p-4">
                    <h5 className="text-red-400 font-medium mb-3 flex items-center gap-2">❌ Foods to Avoid</h5>
                    <ul className="space-y-2">
                        {diet.foods_to_avoid?.map((f: string, i: number) => (
                            <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                                <span className="text-red-400 mt-0.5">•</span> {f}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            {diet.meal_timing && (
                <div className="bg-slate-800/40 border border-slate-700/50 p-4 rounded-lg">
                    <h5 className="text-amber-400 font-medium mb-1">⏰ Meal Timing</h5>
                    <p className="text-sm text-slate-300">{diet.meal_timing}</p>
                </div>
            )}
        </div>
    );
}

/* ── Exercise Panel ── */
function ExercisePanel({ exercise }: any) {
    return (
        <div className="space-y-6">
            <div>
                <h4 className="text-lg font-semibold text-cyan-400 mb-1">{exercise.title}</h4>
                <p className="text-slate-400 text-sm">{exercise.overview}</p>
            </div>
            {exercise.weekly_plan && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {exercise.weekly_plan.map((d: any, i: number) => (
                        <div key={i} className="bg-slate-800/50 border border-slate-700/50 p-3 rounded-lg">
                            <div className="text-cyan-400 font-medium text-sm mb-1">{d.day}</div>
                            <p className="text-xs text-slate-300">{d.activity}</p>
                        </div>
                    ))}
                </div>
            )}
            {exercise.key_exercises && (
                <div className="bg-blue-950/20 border border-blue-500/20 rounded-xl p-4">
                    <h5 className="text-blue-400 font-medium mb-3">💪 Key Exercises</h5>
                    <ul className="space-y-2">
                        {exercise.key_exercises.map((e: string, i: number) => (
                            <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                                <span className="text-blue-400 mt-0.5">•</span> {e}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

/* ── Supplements Panel ── */
function SupplementsPanel({ supplements }: any) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {supplements?.map((s: any, i: number) => (
                <div key={i} className="bg-purple-950/20 border border-purple-500/20 rounded-xl p-4">
                    <h5 className="text-purple-400 font-medium mb-1">{s.name}</h5>
                    <p className="text-xs text-slate-400 mb-2">{s.dose}</p>
                    <p className="text-sm text-slate-300">{s.benefit}</p>
                </div>
            ))}
        </div>
    );
}

/* ── Sleep Panel ── */
function SleepPanel({ sleep }: any) {
    return (
        <div className="space-y-4">
            <div className="bg-indigo-950/20 border border-indigo-500/20 rounded-xl p-4">
                <h5 className="text-indigo-400 font-medium mb-2">🌙 Recommended Schedule</h5>
                <p className="text-slate-300 text-lg font-semibold">{sleep.schedule}</p>
            </div>
            <div className="bg-slate-800/40 border border-slate-700/50 p-4 rounded-xl">
                <h5 className="text-slate-200 font-medium mb-3">Sleep Hygiene Tips</h5>
                <ul className="space-y-2">
                    {sleep.tips?.map((t: string, i: number) => (
                        <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                            <span className="text-indigo-400 mt-0.5">•</span> {t}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

/* ── Stress Panel ── */
function StressPanel({ stress }: any) {
    return (
        <div className="bg-teal-950/20 border border-teal-500/20 rounded-xl p-4">
            <h5 className="text-teal-400 font-medium mb-3">🧘 Daily Stress Management</h5>
            <ul className="space-y-2">
                {stress.daily_practices?.map((p: string, i: number) => (
                    <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                        <span className="text-teal-400 mt-0.5">•</span> {p}
                    </li>
                ))}
            </ul>
        </div>
    );
}

/* ── Medical Panel ── */
function MedicalPanel({ medical }: any) {
    return (
        <div className="space-y-4">
            <div className="bg-rose-950/20 border border-rose-500/20 rounded-xl p-4">
                <h5 className="text-rose-400 font-medium mb-3">🩺 Recommended Tests</h5>
                <ul className="space-y-2">
                    {medical.tests_recommended?.map((t: string, i: number) => (
                        <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                            <span className="text-rose-400 mt-0.5">•</span> {t}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="bg-slate-800/40 border border-slate-700/50 p-4 rounded-xl">
                <h5 className="text-amber-400 font-medium mb-2">⚕️ When to See a Doctor</h5>
                <p className="text-sm text-slate-300">{medical.when_to_see_doctor}</p>
            </div>
        </div>
    );
}
