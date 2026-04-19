from fastapi import APIRouter, File, UploadFile, Form
from typing import Optional
from services.ml_pipeline import predict_clinical, process_ultrasound, get_rl_recommendations, get_gemini_analysis
import json

router = APIRouter(prefix="/api/predict", tags=["Predictions"])

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
