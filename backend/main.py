from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from pydantic import BaseModel
from typing import Optional, List
import gspread
from google.oauth2.service_account import Credentials
import os
import json
import secrets
from datetime import datetime

app = FastAPI(title="MidiDater CRM API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBasic()

ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", "admin")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "midiadmin2024")
GOOGLE_SHEET_ID = os.getenv("GOOGLE_SHEET_ID", "")
GOOGLE_CREDS_JSON = os.getenv("GOOGLE_CREDS_JSON", "")

SCOPES = ["https://www.googleapis.com/auth/spreadsheets"]

def get_sheet():
    try:
        creds_dict = json.loads(GOOGLE_CREDS_JSON)
        creds = Credentials.from_service_account_info(creds_dict, scopes=SCOPES)
        client = gspread.authorize(creds)
        sheet = client.open_by_key(GOOGLE_SHEET_ID)
        return sheet
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Sheet connection failed: {str(e)}")

def verify_admin(credentials: HTTPBasicCredentials = Depends(security)):
    correct_username = secrets.compare_digest(credentials.username, ADMIN_USERNAME)
    correct_password = secrets.compare_digest(credentials.password, ADMIN_PASSWORD)
    if not (correct_username and correct_password):
        raise HTTPException(status_code=401, detail="Invalid credentials",
                            headers={"WWW-Authenticate": "Basic"})
    return credentials.username

def ensure_sheets(sheet):
    try:
        sheet.worksheet("Leads")
    except gspread.WorksheetNotFound:
        ws = sheet.add_worksheet("Leads", rows=1000, cols=20)
        ws.append_row([
            "ID", "Name", "Phone", "Email", "Property Type",
            "Budget", "Location", "Latitude", "Longitude",
            "BHK", "Area SqFt", "Requirements", "Status",
            "Created At", "Remarks", "Last Followup", "WhatsApp Sent"
        ])
    try:
        sheet.worksheet("Pipeline")
    except gspread.WorksheetNotFound:
        ws = sheet.add_worksheet("Pipeline", rows=1000, cols=10)
        ws.append_row(["Lead ID", "Stage", "Remark", "DateTime", "Admin"])


class LeadSubmission(BaseModel):
    name: str
    phone: str
    email: Optional[str] = ""
    property_type: str  # house, apartment, gym, salon, hotel, commercial, plot
    budget: str
    location: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    bhk: Optional[str] = ""
    area_sqft: Optional[str] = ""
    requirements: str

class PipelineUpdate(BaseModel):
    lead_id: str
    stage: str  # new, contacted, interested, negotiation, closed, lost
    remark: str

class LeadStatusUpdate(BaseModel):
    status: str


@app.get("/")
def root():
    return {"status": "MidiDater CRM API running"}

@app.post("/api/leads/submit")
def submit_lead(lead: LeadSubmission):
    sheet = get_sheet()
    ensure_sheets(sheet)
    ws = sheet.worksheet("Leads")
    
    all_rows = ws.get_all_values()
    lead_id = f"LD{str(len(all_rows)).zfill(4)}"
    created_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    ws.append_row([
        lead_id, lead.name, lead.phone, lead.email,
        lead.property_type, lead.budget, lead.location,
        str(lead.latitude or ""), str(lead.longitude or ""),
        lead.bhk, lead.area_sqft, lead.requirements,
        "New", created_at, "", "", "No"
    ])
    
    return {"success": True, "lead_id": lead_id, "message": "Lead submitted successfully"}

@app.get("/api/admin/leads")
def get_leads(admin: str = Depends(verify_admin)):
    sheet = get_sheet()
    ensure_sheets(sheet)
    ws = sheet.worksheet("Leads")
    rows = ws.get_all_records()
    return {"leads": rows}

@app.get("/api/admin/leads/{lead_id}")
def get_lead(lead_id: str, admin: str = Depends(verify_admin)):
    sheet = get_sheet()
    ws = sheet.worksheet("Leads")
    rows = ws.get_all_records()
    lead = next((r for r in rows if r["ID"] == lead_id), None)
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    
    pipeline_ws = sheet.worksheet("Pipeline")
    pipeline = pipeline_ws.get_all_records()
    lead_pipeline = [p for p in pipeline if p["Lead ID"] == lead_id]
    
    return {"lead": lead, "pipeline": lead_pipeline}

@app.post("/api/admin/leads/{lead_id}/pipeline")
def add_pipeline_entry(lead_id: str, update: PipelineUpdate, admin: str = Depends(verify_admin)):
    sheet = get_sheet()
    ensure_sheets(sheet)
    
    # Update lead status in Leads sheet
    leads_ws = sheet.worksheet("Leads")
    records = leads_ws.get_all_records()
    for i, row in enumerate(records, start=2):
        if row["ID"] == lead_id:
            leads_ws.update_cell(i, 13, update.stage)  # Status column
            leads_ws.update_cell(i, 15, update.remark)  # Remarks
            leads_ws.update_cell(i, 16, datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
            break
    
    # Add to Pipeline sheet
    pipeline_ws = sheet.worksheet("Pipeline")
    pipeline_ws.append_row([
        lead_id, update.stage, update.remark,
        datetime.now().strftime("%Y-%m-%d %H:%M:%S"), admin
    ])
    
    return {"success": True}

@app.get("/api/admin/stats")
def get_stats(admin: str = Depends(verify_admin)):
    sheet = get_sheet()
    ensure_sheets(sheet)
    ws = sheet.worksheet("Leads")
    rows = ws.get_all_records()
    
    stats = {
        "total": len(rows),
        "new": sum(1 for r in rows if r.get("Status") == "New"),
        "contacted": sum(1 for r in rows if r.get("Status") == "contacted"),
        "interested": sum(1 for r in rows if r.get("Status") == "interested"),
        "closed": sum(1 for r in rows if r.get("Status") == "closed"),
        "property_types": {}
    }
    for r in rows:
        pt = r.get("Property Type", "unknown")
        stats["property_types"][pt] = stats["property_types"].get(pt, 0) + 1
    
    return stats
