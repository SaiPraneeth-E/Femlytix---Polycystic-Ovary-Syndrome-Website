"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert, ArrowRight, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [mode, setMode] = useState<"login" | "register">("login");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            if (mode === "login") {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
            } else {
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;
                setError("Check your email to confirm your account, then sign in.");
                setMode("login");
                setLoading(false);
                return;
            }
            router.push("/intake");
        } catch (err: any) {
            setError(err.message || "Authentication failed.");
        }
        setLoading(false);
    };

    return (
        <main className="min-h-screen flex items-center justify-center p-6 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-blue-600 rounded-full blur-[150px] opacity-10 pointer-events-none" />

            <div className="w-full max-w-md glass-panel p-8 z-10 text-center">
                <div className="flex justify-center mb-6">
                    <ShieldAlert className="w-12 h-12 text-cyan-400" />
                </div>

                <h2 className="text-2xl font-bold text-white mb-2">
                    {mode === "login" ? "Patient Portal Login" : "Create Patient Account"}
                </h2>
                <p className="text-slate-400 text-sm mb-8">Secure access to your biometric AI scans.</p>

                {error && (
                    <div className={`mb-4 p-3 rounded-lg text-sm ${error.includes("Check your email") ? "bg-emerald-900/50 border border-emerald-500/50 text-emerald-300" : "bg-red-900/50 border border-red-500/50 text-red-300"}`}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
                            required
                            minLength={6}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-lg mt-6 transition-colors disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (mode === "login" ? "Sign In" : "Sign Up")}
                        {!loading && <ArrowRight className="w-4 h-4" />}
                    </button>
                </form>

                <div className="mt-6 text-sm text-slate-400">
                    {mode === "login" ? (
                        <p>New patient? <button onClick={() => { setMode("register"); setError(""); }} className="text-cyan-400 hover:underline">Register here</button></p>
                    ) : (
                        <p>Already registered? <button onClick={() => { setMode("login"); setError(""); }} className="text-cyan-400 hover:underline">Sign in</button></p>
                    )}
                </div>
            </div>
        </main>
    );
}
