import os
import requests
from pydantic import BaseModel

def load_models():
    print("[ml_pipeline.py] Models are managed by external ml_service on port 8001")

def predict_clinical(data: dict):
    weight = float(data.get("weight", 65))
    height = float(data.get("height", 165))
    bmi = weight / ((height / 100) ** 2) if height > 0 else 22
    
    bmi_class = "Normal"
    if bmi >= 25.0 and bmi < 30.0:
        bmi_class = "Overweight"
    elif bmi >= 30.0:
        bmi_class = "Obese"
    elif bmi < 18.5:
        bmi_class = "Underweight"
        
    return {
        "calculated_bmi": round(bmi, 2),
        "bmi_classification": bmi_class,
        "clinical_diagnosis_likelihood": "Moderate" if bmi >= 25 else "Low"
    }

def get_gemini_analysis(patient_data: dict, pcos_prob: float, bmi: float, bmi_class: str):
    """Use Google Gemini 1.5 Flash for high-reliability medical insights."""
    api_key = os.environ.get("GEMINI_API_KEY", "")
    if not api_key:
        return None
    
    try:
        prompt = f"""You are a specialized PCOS Medical AI. Analyze the following diagnostic consensus:
Patient: {patient_data.get('age', 'N/A')}yo, BMI: {bmi:.1f}
Local ML PCOS Probability: {pcos_prob*100:.1f}%

Please provide:
1. Clinical Assessment (Concise)
2. Primary Risk Flags
3. 3 Targeted Recommendations
4. Critical Warning Signs

Format: Plain text, professional tone."""

        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
        payload = {"contents": [{"parts": [{"text": prompt}]}]}
        
        resp = requests.post(url, json=payload, timeout=30)
        resp.raise_for_status()
        return resp.json().get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "")
    except Exception as e:
        print(f"[GEMINI] Error: {e}")
        return "AI analysis currently limited. Please review your metrics below."

def process_ultrasound(image_bytes: bytes, clinical_data: dict = None):
    """Stage 2: Multimodal Local ML + Parallel Gemini 1.5 Flash Assistance."""
    
    local_res = {
        "cysts_detected": False,
        "pcos_probability": 0.0,
        "model_status": "local_unreachable",
        "top_risk_factors": []
    }

    # 1. Hit Local Microservice
    try:
        c_data = clinical_data or {}
        files = {"image": ("ultrasound.jpg", image_bytes, "image/jpeg")}
        data_payload = {
            "bmi": c_data.get("weight", 65) / ((c_data.get("height", 165)/100)**2) if c_data.get("height", 165) > 0 else 22,
            "insulin": c_data.get("insulin_level", 10),
            "glucose": c_data.get("glucose_level", 90),
            "lh": c_data.get("lh", 5.0),
            "fsh": c_data.get("fsh", 5.0),
            "testosterone": c_data.get("testosterone", 0.5),
            "cycle_length": c_data.get("cycle_length", 28),
            "hair_growth": c_data.get("hair_growth", 0),
            "weight_gain": c_data.get("weight_gain", 0)
        }
        ml_resp = requests.post("http://localhost:8001/predict", files=files, data=data_payload, timeout=10)
        if ml_resp.status_code == 200:
            ml_data = ml_resp.json()
            local_res = {
                "cysts_detected": ml_data.get("cysts_detected", False),
                "pcos_probability": ml_data.get("pcos_probability", 0.0),
                "model_status": "pytorch_active",
                "top_risk_factors": ml_data.get("top_risk_factors", []),
                "spots": ml_data.get("spots", []),
                "cyst_area": ml_data.get("cyst_area", 0.0),
                "rl_recommendations": ml_data.get("rl_recommendations", [])
            }
    except Exception as e:
        print(f"[ML] Local Model Skip: {e}")

    # 2. Parallel Gemini Assistant (Always runs to assist the model)
    api_key = os.environ.get("GEMINI_API_KEY", "")
    if not api_key:
        return local_res

    try:
        import base64
        import json
        
        encoded_image = base64.b64encode(image_bytes).decode("utf-8")
        prompt = """Analyze this ovarian ultrasound. Assist the local ML models by providing a high-confidence follicles/cysts check.
Return ONLY raw JSON: {"confidence": float, "cysts_visible": boolean, "notes": string}"""

        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
        payload = {
            "contents": [{
                "parts": [
                    {"text": prompt},
                    {"inline_data": {"mime_type": "image/jpeg", "data": encoded_image}}
                ]
            }]
        }
        
        resp = requests.post(url, json=payload, timeout=30)
        if resp.status_code == 200:
            gem_text = resp.json().get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "").strip()
            gem_text = gem_text.replace("```json", "").replace("```", "").strip()
            gem_data = json.loads(gem_text)
            
            # Blend results: Use the higher probability or combine
            local_res["gemini_confidence"] = gem_data.get("confidence", 0.0)
            local_res["gemini_cysts_detected"] = gem_data.get("cysts_visible", False)
            local_res["ai_peer_notes"] = gem_data.get("notes", "")
            
            # If Gemini detected cysts or had high confidence, override/blend with local
            if local_res["gemini_cysts_detected"]:
                local_res["cysts_detected"] = True
            local_res["pcos_probability"] = max(local_res.get("pcos_probability", 0.0), local_res["gemini_confidence"])
            
            # Update System Mode status accordingly
            if local_res["model_status"] not in ["active", "pytorch_active"]:
                local_res["model_status"] = "gemini_only"
            else:
                local_res["model_status"] = "multimodal_consensus"
                
    except Exception as e:
        print(f"[ML] Gemini Assistance Error: {e}")

    return local_res


def get_rl_recommendations(state: dict):
    """Stage 3: Deep RL-based Lifestyle Recommendation Engine.
    Uses a rule-based policy network simulation with weighted state factors.
    """
    bmi = state.get('bmi', 22.0)
    glucose = state.get('glucose_level', 90.0)
    pcos_prob = state.get('pcos_prob', 0.2)
    activity = state.get('activity_level', 2)
    insulin = state.get('insulin_level', 10.0)
    menstrual = state.get('menstrual_irregularity', 0)
    
    # RL State Vector: [bmi_normalized, glucose_normalized, pcos_risk, activity_score, insulin_resistance]
    bmi_risk = min((bmi - 18.5) / 15.0, 1.0) if bmi > 18.5 else 0.0
    glucose_risk = min((glucose - 70) / 130.0, 1.0) if glucose > 70 else 0.0
    insulin_risk = min(insulin / 25.0, 1.0)
    activity_score = (3 - activity) / 2.0  # Higher score = less active = more risk
    
    # Combined risk score (weighted sum - simulates RL Q-value)
    risk_score = (pcos_prob * 0.35) + (bmi_risk * 0.2) + (glucose_risk * 0.15) + (insulin_risk * 0.15) + (activity_score * 0.15)
    
    # Determine risk level
    if risk_score > 0.6:
        risk_level = "high"
    elif risk_score > 0.35:
        risk_level = "moderate"
    else:
        risk_level = "low"
    
    # ===== DIET PLAN =====
    if risk_level == "high":
        diet = {
            "title": "Anti-Inflammatory PCOS Diet",
            "overview": "Focus on low-glycemic, anti-inflammatory foods to manage insulin resistance and hormonal balance.",
            "foods_to_eat": [
                "Leafy greens (spinach, kale, broccoli)",
                "Fatty fish (salmon, mackerel, sardines) - 3x/week",
                "Berries (blueberries, strawberries, raspberries)",
                "Nuts and seeds (walnuts, flaxseeds, chia seeds)",
                "Whole grains (quinoa, brown rice, oats)",
                "Lean proteins (chicken breast, tofu, lentils)",
                "Avocado and olive oil for healthy fats",
                "Turmeric and cinnamon (anti-inflammatory spices)"
            ],
            "foods_to_avoid": [
                "Refined sugar and sugary drinks",
                "White bread, pasta, and processed carbs",
                "Fried foods and trans fats",
                "Excessive dairy (can worsen hormonal imbalance)",
                "Red meat more than 2x/week",
                "Alcohol and caffeine (limit to 1 cup/day)"
            ],
            "meal_timing": "Eat every 3-4 hours. Never skip breakfast. Last meal 3 hours before bed."
        }
    elif risk_level == "moderate":
        diet = {
            "title": "Balanced Hormonal Diet",
            "overview": "A moderately controlled diet emphasizing whole foods and balanced macronutrients.",
            "foods_to_eat": [
                "Colorful vegetables (at least 5 servings/day)",
                "Lean protein with every meal",
                "Complex carbohydrates (sweet potatoes, legumes)",
                "Greek yogurt and fermented foods (probiotics)",
                "Green tea (antioxidant support)",
                "Seeds mix (pumpkin, sunflower, sesame)"
            ],
            "foods_to_avoid": [
                "Processed and packaged snacks",
                "Sugary cereals and juices",
                "Excess sodium (reduce salt intake)",
                "Artificial sweeteners"
            ],
            "meal_timing": "3 main meals + 2 healthy snacks. Stay hydrated with 2-3L of water."
        }
    else:
        diet = {
            "title": "Maintenance Wellness Diet",
            "overview": "Continue with a balanced, nutrient-rich diet for overall wellness.",
            "foods_to_eat": [
                "Diverse fruits and vegetables",
                "Lean proteins and healthy fats",
                "Whole grains and fiber-rich foods",
                "Adequate water intake (2L/day)"
            ],
            "foods_to_avoid": [
                "Limit processed foods",
                "Moderate sugar intake"
            ],
            "meal_timing": "Regular meal schedule. Eat mindfully."
        }
    
    # ===== EXERCISE ROUTINE =====
    if risk_level == "high":
        exercise = {
            "title": "PCOS-Focused Fitness Plan",
            "overview": "Combines cardio, strength training, and yoga to improve insulin sensitivity and reduce stress.",
            "weekly_plan": [
                {"day": "Monday", "activity": "30 min brisk walking + 20 min strength training (lower body)"},
                {"day": "Tuesday", "activity": "45 min yoga (focus: hip openers, twists for reproductive health)"},
                {"day": "Wednesday", "activity": "20 min HIIT intervals + 10 min cool-down stretching"},
                {"day": "Thursday", "activity": "Rest day - 20 min gentle walking or swimming"},
                {"day": "Friday", "activity": "30 min strength training (upper body + core) + 15 min cardio"},
                {"day": "Saturday", "activity": "45 min cycling or dancing + flexibility work"},
                {"day": "Sunday", "activity": "30 min restorative yoga or meditation walk"}
            ],
            "key_exercises": [
                "Squats and lunges (improve insulin sensitivity)",
                "Planks and bird-dogs (core stability)",
                "Surya Namaskar / Sun Salutations (hormonal balance)",
                "Deep breathing exercises (stress reduction)",
                "Pelvic floor exercises (reproductive health)"
            ]
        }
    elif risk_level == "moderate":
        exercise = {
            "title": "Active Lifestyle Plan",
            "overview": "Moderate intensity exercise to maintain metabolic health.",
            "weekly_plan": [
                {"day": "Mon/Wed/Fri", "activity": "30 min cardio (walking, cycling, swimming)"},
                {"day": "Tue/Thu", "activity": "25 min strength training + 15 min yoga"},
                {"day": "Sat", "activity": "45 min recreational sport or dance"},
                {"day": "Sun", "activity": "Rest or light stretching"}
            ],
            "key_exercises": [
                "Brisk walking (10,000 steps/day goal)",
                "Bodyweight exercises (push-ups, squats)",
                "Stretching and mobility work",
                "Yoga or Pilates 2x/week"
            ]
        }
    else:
        exercise = {
            "title": "Wellness Maintenance",
            "overview": "Stay active with enjoyable activities.",
            "weekly_plan": [
                {"day": "Daily", "activity": "30 min of any enjoyable physical activity"},
                {"day": "3x/week", "activity": "Include strength training or yoga"}
            ],
            "key_exercises": [
                "Walking, jogging, or cycling",
                "Yoga for flexibility",
                "Any sport you enjoy"
            ]
        }
    
    # ===== SUPPLEMENTS =====
    if risk_level == "high":
        supplements = [
            {"name": "Myo-Inositol", "dose": "2000mg twice daily", "benefit": "Improves insulin sensitivity and ovarian function"},
            {"name": "Vitamin D3", "dose": "2000-4000 IU daily", "benefit": "Supports hormonal balance and bone health"},
            {"name": "Omega-3 Fish Oil", "dose": "1000-2000mg daily", "benefit": "Reduces inflammation and triglycerides"},
            {"name": "Magnesium", "dose": "400mg before bed", "benefit": "Reduces anxiety, improves sleep and insulin sensitivity"},
            {"name": "Zinc", "dose": "30mg daily", "benefit": "Supports immune function and reduces hair loss"},
            {"name": "Berberine", "dose": "500mg 2x daily", "benefit": "Natural alternative for blood sugar management"}
        ]
    elif risk_level == "moderate":
        supplements = [
            {"name": "Myo-Inositol", "dose": "2000mg daily", "benefit": "Supports ovarian health"},
            {"name": "Vitamin D3", "dose": "2000 IU daily", "benefit": "Hormone support"},
            {"name": "Omega-3", "dose": "1000mg daily", "benefit": "Anti-inflammatory"},
            {"name": "Magnesium", "dose": "300mg before bed", "benefit": "Sleep and stress support"}
        ]
    else:
        supplements = [
            {"name": "Multivitamin", "dose": "As directed", "benefit": "General nutritional support"},
            {"name": "Vitamin D3", "dose": "1000 IU daily", "benefit": "Overall health"}
        ]
    
    # ===== SLEEP =====
    sleep = {
        "schedule": "10:30 PM - 6:30 AM (8 hours)",
        "tips": [
            "Maintain consistent sleep/wake times (even weekends)",
            "No screens 1 hour before bed",
            "Keep bedroom cool (65-68°F / 18-20°C)",
            "Use blackout curtains for complete darkness",
            "Try 4-7-8 breathing technique before sleep" if risk_level != "low" else "Maintain a relaxing bedtime routine"
        ]
    }
    
    # ===== STRESS MANAGEMENT =====
    stress = {
        "daily_practices": [
            "10-15 min morning meditation or deep breathing",
            "Journaling (gratitude + feelings) before bed",
            "Progressive muscle relaxation when anxious",
            "Limit social media to 30 min/day",
            "Spend 20 min in nature daily"
        ] if risk_level == "high" else [
            "10 min daily meditation",
            "Regular breaks during work (5 min every hour)",
            "Connect with friends/family regularly",
            "Practice a hobby you enjoy"
        ]
    }
    
    # ===== MEDICAL ADVICE =====
    medical = {
        "tests_recommended": [
            "Complete hormonal panel (LH, FSH, testosterone, DHEA-S)",
            "Fasting insulin and glucose tolerance test",
            "Thyroid function tests (TSH, T3, T4)",
            "Lipid profile",
            "Vitamin D and B12 levels",
            "Pelvic ultrasound (every 6-12 months)"
        ] if risk_level != "low" else [
            "Annual general health checkup",
            "Routine blood work"
        ],
        "when_to_see_doctor": "Immediately if experiencing severe pain, sudden weight changes, or missed periods for 3+ months." if risk_level == "high" else "Schedule regular follow-ups every 6 months."
    }
    
    return {
        "risk_level": risk_level,
        "risk_score": round(risk_score, 3),
        "diet": diet,
        "exercise": exercise,
        "supplements": supplements,
        "sleep": sleep,
        "stress_management": stress,
        "medical_advice": medical,
        "hydration": f"Drink at least {'3' if risk_level == 'high' else '2.5' if risk_level == 'moderate' else '2'} liters of water daily. Add lemon or cucumber for electrolytes."
    }
