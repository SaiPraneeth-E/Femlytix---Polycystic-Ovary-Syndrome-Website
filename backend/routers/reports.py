from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from services.report_generator import generate_medical_report

router = APIRouter(prefix="/api/reports", tags=["Reports"])

class ReportRequest(BaseModel):
    patient_name: str
    patient_data: dict
    clinical_results: dict
    recommendations: dict
    ultrasound_results: dict

@router.post("/generate")
def generate_report_endpoint(req: ReportRequest):
    pdf_buffer = generate_medical_report(
        req.patient_name,
        req.patient_data,
        req.clinical_results,
        req.recommendations,
        req.ultrasound_results
    )
    
    return StreamingResponse(
        pdf_buffer, 
        media_type="application/pdf", 
        headers={"Content-Disposition": f"attachment; filename=medical_report_{req.patient_name.replace(' ', '_')}.pdf"}
    )
