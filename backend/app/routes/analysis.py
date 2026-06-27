from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
from datetime import datetime
import uuid
from app.database.connection import get_customer_info

router = APIRouter()

class AnalyzeRequest(BaseModel):
    file_id: str

@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    """
    Endpoint to ingest meeting notes files.
    Accepts form-data file uploads and returns dummy receipt metadata.
    """
    # Simple check to mock file presence
    if not file:
        raise HTTPException(status_code=400, detail="No file uploaded")
    
    # Read file properties
    contents = await file.read()
    file_size = len(contents)
    
    # Return dummy receipt JSON
    return {
        "status": "success",
        "message": "File uploaded successfully",
        "filename": file.filename,
        "content_type": file.content_type,
        "size_bytes": file_size,
        "file_id": f"doc_{uuid.uuid4().hex[:8]}",
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }

@router.post("/analyze")
async def analyze_document(request: AnalyzeRequest):
    """
    Endpoint to coordinate agentic decision analysis on ingested notes.
    Accepts JSON containing file_id and returns dummy analysis KPI models.
    """
    if not request.file_id:
        raise HTTPException(status_code=400, detail="Invalid or missing file_id")
        
    # Query customer details from MongoDB via helper function
    customer_info = get_customer_info("Acme Global Conglomerate Inc.")

    # Return dummy business decision JSON
    return {
        "status": "completed",
        "file_id": request.file_id,
        "accuracy_realized": 0.918,
        "confidence_score": 0.94,
        "risk_level": "Medium-High",
        "latency_seconds": 0.52,
        "analysis_timestamp": datetime.utcnow().isoformat() + "Z",
        "customer_summary": {
          "name": customer_info["name"] if customer_info else "Acme Global Conglomerate Inc.",
          "health_score": customer_info["health_score"] if customer_info else 84,
          "contract_value": customer_info["contract_value"] if customer_info else "$2.4M ACV"
        },
        "recommendations": [
          {
            "id": 1,
            "title": "Redirect 60% Cargo via Algeciras",
            "description": "Shift incoming container shipments from Rotterdam/Antwerp to Algeciras and Valencia ports to bypass strike zones.",
            "impact": "High Impact",
            "cost": "Low Cost"
          },
          {
            "id": 2,
            "title": "Secure Spot Contracts with Hapag-Lloyd",
            "description": "Lock in 20% spot rate cargo space immediately to hedge against rising freight rates over the next 30 days.",
            "impact": "High Impact",
            "cost": "Medium Cost"
          },
          {
            "id": 3,
            "title": "Establish Secondary Trucking Agreements",
            "description": "Authorize short-term agreements with Spanish regional freight carriers to facilitate inland logistics distribution.",
            "impact": "Medium Impact",
            "cost": "Low Cost"
          }
        ],
        "explanation": "The risk model detected a 24% spike in European maritime tariffs coupled with labor union strikes at the Antwerp port. Rerouting via Algeciras maintains a 94% SLA score and avoids the strike tariff zone, saving $142,400 overall."
    }
