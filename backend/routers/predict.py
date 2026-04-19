from fastapi import APIRouter, File, UploadFile, Form
from typing import Optional
from services.ml_pipeline import predict_clinical, process_ultrasound, get_rl_recommendations, get_gemini_analysis
import json
import os
from datetime import datetime

router = APIRouter(prefix="/api/predict", tags=["Predictions"])

DB_FILE = "patients_db.json"

def save_patient_record(patient_info, clinical_res, image_res):
    try:
        if not os.path.exists(DB_FILE):
            with open(DB_FILE, "w") as f:
                json.dump([], f)
        
        with open(DB_FILE, "r") as f:
            db = json.load(f)
            
        # Determine strict severity based on ensemble logic
        prob = image_res.get("pcos_probability", 0)
        risk_status = "High Risk" if prob > 0.6 else ("Review Required" if prob > 0.4 else "Clear")
        severity_class = "critical" if prob > 0.6 else ("warning" if prob > 0.4 else "normal")
        
        record = {
            "id": patient_info.get("patient_id", f"PT-{len(db)+1000}"),
            "name": patient_info.get("name", "Unknown Patient"),
            "age": patient_info.get("age", 25),
            "status": risk_status,
            "confidence": f"{prob * 100:.1f}%",
            "time": datetime.now().strftime("%Y-%m-%d %H:%M"),
            "severity": severity_class,
            "features": {
                "bmi": clinical_res.get("calculated_bmi", 22.0),
                "fshLhRatio": round(patient_info.get("fsh", 1.0) / (patient_info.get("lh", 1.0) + 0.001), 2),
                "cycleLength": patient_info.get("cycle_length", 28),
                "follicles": 14 if prob > 0.5 else 5
            }
        }
        
        # Insert at top (newest first)
        db.insert(0, record)
        
        with open(DB_FILE, "w") as f:
            json.dump(db, f, indent=4)
    except Exception as e:
        print(f"Failed to append to DB: {e}")

@router.get("/patients")
def get_patients():
    if os.path.exists(DB_FILE):
        with open(DB_FILE, "r") as f:
            return json.load(f)
    return []


@router.post("/clinical")
def predict_clinical_endpoint(data: dict):
    res = predict_clinical(data)
    return res

@router.post("/full-pipeline")
async def full_prediction_pipeline(
    patient_data: str = Form(...),
    ultrasound_image: UploadFile = File(...)
):
    # Parse patient data
    data = json.loads(patient_data)
    
    # 1. Clinical Predictions
    clinical_res = predict_clinical(data)
    
    # 2. Ultrasound Image Analysis
    img_bytes = await ultrasound_image.read()
    image_res = process_ultrasound(img_bytes, data)
    
    # 3. RL Recommendations (pass all available state)
    rl_state = {
        "bmi": clinical_res["calculated_bmi"],
        "glucose_level": data.get("glucose_level", 90),
        "insulin_level": data.get("insulin_level", 10),
        "pcos_prob": image_res["pcos_probability"],
        "activity_level": data.get("activity_level", 2),
        "menstrual_irregularity": data.get("menstrual_irregularity", 0),
        "age": data.get("age", 25)
    }
    recommendations = get_rl_recommendations(rl_state)
    
    # 4. Gemini AI Analysis (enhanced predictions)
    gemini_insights = get_gemini_analysis(
        patient_data=data,
        pcos_prob=image_res["pcos_probability"],
        bmi=clinical_res["calculated_bmi"],
        bmi_class=clinical_res.get("bmi_classification", "Normal")
    )
    
    # 5. Persist the diagnostics to local JSON database before routing logic back to user
    save_patient_record(data, clinical_res, image_res)
    
    return {
        "clinical_results": clinical_res,
        "ultrasound_results": image_res,
        "recommendations": recommendations,
        "gemini_analysis": gemini_insights,
        "affected_organs": determine_affected_organs(clinical_res, image_res)
    }

def determine_affected_organs(clinical, image):
    organs = []
    if image.get("cysts_detected", False):
        organs.append("ovaries")
        organs.append("uterus")
    if clinical.get("calculated_bmi", 22) > 25:
        organs.append("abdominal_fat")
    return organs
