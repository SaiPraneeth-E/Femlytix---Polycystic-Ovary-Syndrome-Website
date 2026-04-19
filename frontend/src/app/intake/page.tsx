"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { UploadCloud, Activity, ArrowRight, Loader2 } from "lucide-react";

export default function IntakeForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState<File | null>(null);

    const [formData, setFormData] = useState({
        name: "",
        patient_id: `PT-${Math.floor(Math.random() * 100000)}`,
        age: 28,
        height: 165,
        weight: 65,
        waist: 80,
        menstrual_irregularity: 0,
        family_history_pcos: 0,
        thyroid_history: 0,
        glucose_level: 90,
        insulin_level: 10,
        activity_level: 2,
        lh: 5.0,
        fsh: 5.0,
        testosterone: 0.5,
        cycle_length: 28,
        hair_growth: 0,
        weight_gain: 0
    });

    const [imageBase64, setImageBase64] = useState<string>("");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const uploadedFile = e.target.files[0];
            setFile(uploadedFile);

            // Convert to Base64 for PDF generation later
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageBase64(reader.result as string);
            };
            reader.readAsDataURL(uploadedFile);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === "name" || name === "patient_id" ? value : Number(value)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            alert("Please upload an ultrasound image.");
            return;
        }
        if (!formData.name) {
            alert("Please enter the patient's name.");
            return;
        }
        setLoading(true);

        try {
            const fd = new FormData();
            fd.append("patient_data", JSON.stringify(formData));
            fd.append("ultrasound_image", file);

            const apiBase = typeof window !== 'undefined' ? `http://${window.location.hostname}:8000` : 'http://127.0.0.1:8000';
            const res = await fetch(`${apiBase}/api/predict/full-pipeline`, {
                method: "POST",
                body: fd
            });

            if (!res.ok) throw new Error("API Request Failed");

            const data = await res.json();

            // Pass data to dashboard via session storage
            sessionStorage.setItem("pcos_results", JSON.stringify(data));

            // Attach the base64 image to the patient info so it can be sent to the Report Generator
            const enrichedPatientData = {
                ...formData,
                ultrasound_base64: imageBase64
            };
            sessionStorage.setItem("patient_info", JSON.stringify(enrichedPatientData));

            router.push("/dashboard");
        } catch (error) {
            console.error(error);
            alert("Failed to run prediction pipeline. Make sure backend is running.");
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen p-8 md:p-16 flex justify-center items-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-4xl glass-panel p-8"
            >
                <div className="flex items-center gap-3 mb-8 border-b border-slate-700 pb-4">
                    <Activity className="text-cyan-400 w-8 h-8" />
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                        Medical Intake & Assessment
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormInput label="Patient Name" name="name" type="text" value={formData.name} onChange={handleChange} />
                        <FormInput label="Age" name="age" type="number" value={formData.age} onChange={handleChange} />
                        <FormInput label="Height (cm)" name="height" type="number" value={formData.height} onChange={handleChange} />
                        <FormInput label="Weight (kg)" name="weight" type="number" value={formData.weight} onChange={handleChange} />
                        <FormInput label="Waist Circumference (cm)" name="waist" type="number" value={formData.waist} onChange={handleChange} />
                        <FormInput label="Glucose Level (mg/dL)" name="glucose_level" type="number" value={formData.glucose_level} onChange={handleChange} />
                        <FormInput label="Insulin Level (µU/mL)" name="insulin_level" type="number" value={formData.insulin_level} onChange={handleChange} />

                        <FormInput label="LH (Luteinizing Hormone) IU/L" name="lh" type="number" value={formData.lh} onChange={handleChange} />
                        <FormInput label="FSH (Follicle Stimulating) IU/L" name="fsh" type="number" value={formData.fsh} onChange={handleChange} />
                        <FormInput label="Testosterone (ng/dL)" name="testosterone" type="number" value={formData.testosterone} onChange={handleChange} />
                        <FormInput label="Avg Cycle Length (Days)" name="cycle_length" type="number" value={formData.cycle_length} onChange={handleChange} />

                        <FormSelect label="Menstrual Irregularity" name="menstrual_irregularity" value={formData.menstrual_irregularity} onChange={handleChange} options={[{ l: "No", v: 0 }, { l: "Occasional", v: 1 }, { l: "Yes", v: 2 }, { l: "Optional / Not Sure", v: 3 }]} />
                        <FormSelect label="Family History of PCOS" name="family_history_pcos" value={formData.family_history_pcos} onChange={handleChange} options={[{ l: "No", v: 0 }, { l: "Occasional / Rare", v: 1 }, { l: "Yes", v: 2 }, { l: "Optional / Not Sure", v: 3 }]} />
                        <FormSelect label="Thyroid History" name="thyroid_history" value={formData.thyroid_history} onChange={handleChange} options={[{ l: "No", v: 0 }, { l: "Yes", v: 1 }]} />
                        <FormSelect label="Activity Level" name="activity_level" value={formData.activity_level} onChange={handleChange} options={[{ l: "Low", v: 1 }, { l: "Moderate", v: 2 }, { l: "High", v: 3 }]} />
                        <FormSelect label="Excessive Hair Growth" name="hair_growth" value={formData.hair_growth} onChange={handleChange} options={[{ l: "No", v: 0 }, { l: "Yes", v: 1 }]} />
                        <FormSelect label="Recent Weight Gain" name="weight_gain" value={formData.weight_gain} onChange={handleChange} options={[{ l: "No", v: 0 }, { l: "Yes", v: 1 }]} />
                    </div>

                    <div className="border-t border-slate-700 pt-6">
                        <label className="block text-sm font-medium text-slate-300 mb-2">Ultrasound Scan (Optional/Required for CNN)</label>
                        <div className="flex items-center justify-center w-full">
                            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-600 border-dashed rounded-lg cursor-pointer bg-slate-800/50 hover:bg-slate-800/80 transition-colors">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <UploadCloud className="w-8 h-8 text-cyan-400 mb-2" />
                                    <p className="mb-2 text-sm text-slate-400">
                                        <span className="font-semibold text-cyan-400">Click to upload</span> or drag and drop
                                    </p>
                                    <p className="text-xs text-slate-500">PNG, JPG, or DICOM (Max 5MB)</p>
                                </div>
                                <input id="dropzone-file" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                            </label>
                        </div>
                        {file && <p className="mt-2 text-sm text-emerald-400">File attached: {file.name}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-700 text-white rounded-lg font-bold text-lg shadow-[0_0_15px_rgba(14,165,233,0.3)] hover:shadow-[0_0_25px_rgba(14,165,233,0.5)] transition-all disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Run AI Pipeline"}
                        {!loading && <ArrowRight className="w-5 h-5" />}
                    </button>
                </form>
            </motion.div>
        </main>
    );
}

function FormInput({ label, name, type, value, onChange }: any) {
    return (
        <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
            />
        </div>
    );
}

function FormSelect({ label, name, value, onChange, options }: any) {
    return (
        <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
            <select
                name={name}
                value={value}
                onChange={onChange}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
            >
                {options.map((opt: any) => (
                    <option key={opt.v} value={opt.v}>{opt.l}</option>
                ))}
            </select>
        </div>
    );
}
