# 🏡 MidiDater – Property Mediation CRM
**A full-stack PWA for property mediators** | React + Vite + Python FastAPI + Google Sheets + Vercel

---

## 📱 What This App Does

| Role | Features |
|------|----------|
| **Client (User)** | 4-step property requirement form → map pin location → beautiful thank-you screen |
| **Admin** | Secure dashboard → all leads with search/filter → call/WhatsApp actions → pipeline stages → follow-up timeline → WhatsApp templates |

---

## 🚀 Setup Guide

### Step 1 – Google Sheets Database

1. Create a new Google Sheet and note the **Sheet ID** from the URL:
   ```
   https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit
   ```

2. Go to [Google Cloud Console](https://console.cloud.google.com/)
3. Create a new project → Enable **Google Sheets API**
4. Create **Service Account** → Download JSON credentials
5. Share your Google Sheet with the service account email (Editor access)

### Step 2 – Local Development

```bash
# Backend
cd backend
pip install -r requirements.txt

# Set environment variables (create .env or export directly)
export GOOGLE_SHEET_ID="your_sheet_id_here"
export GOOGLE_CREDS_JSON='{"type":"service_account",...}' # paste full JSON as string
export ADMIN_USERNAME="admin"
export ADMIN_PASSWORD="your_secure_password"

uvicorn main:app --reload --port 8000
```

```bash
# Frontend (new terminal)
cd frontend
npm install
npm run dev
# App runs at http://localhost:5173
```

### Step 3 – Deploy to Vercel

```bash
npm install -g vercel

# From project root
vercel

# Set environment variables in Vercel dashboard:
# Settings → Environment Variables:
# GOOGLE_SHEET_ID = your_sheet_id
# GOOGLE_CREDS_JSON = { full JSON string }
# ADMIN_USERNAME = admin
# ADMIN_PASSWORD = your_secure_password
```

---

## 🔐 Admin Access

- URL: `https://your-app.vercel.app/admin/login`
- Default: `admin` / `midiadmin2024` (change via env vars!)

---

## 📊 Google Sheets Structure

The app auto-creates two sheets on first use:

**Leads Sheet** columns:
`ID | Name | Phone | Email | Property Type | Budget | Location | Latitude | Longitude | BHK | Area SqFt | Requirements | Status | Created At | Remarks | Last Followup | WhatsApp Sent`

**Pipeline Sheet** columns:
`Lead ID | Stage | Remark | DateTime | Admin`

---

## 🏗️ Project Structure

```
mediator-app/
├── vercel.json              # Single Vercel deployment config
├── backend/
│   ├── main.py              # FastAPI app
│   └── requirements.txt
└── frontend/
    ├── index.html           # PWA meta tags
    ├── vite.config.js       # Vite + PWA plugin
    ├── package.json
    └── src/
        ├── App.jsx          # Router
        ├── main.jsx
        ├── index.css        # Design tokens
        ├── pages/
        │   ├── UserForm.jsx       # 4-step lead form
        │   ├── ThankYou.jsx       # Success screen
        │   ├── AdminLogin.jsx     # Secure login
        │   ├── AdminDashboard.jsx # CRM dashboard
        │   └── LeadDetail.jsx     # Lead + pipeline + WA templates
        ├── components/
        │   └── MapPicker.jsx      # Leaflet map
        ├── hooks/
        │   └── useAdminAuth.jsx   # Auth context
        └── utils/
            └── api.js             # API calls
```

---

## 📱 PWA Installation

The app is fully installable as a PWA:
- **Android**: Chrome → "Add to Home Screen"
- **iOS**: Safari → Share → "Add to Home Screen"

Add icons at `frontend/public/`:
- `logo192.png` (192×192)
- `logo512.png` (512×512)
- `apple-touch-icon.png` (180×180)

---

## 💬 WhatsApp Templates (5 built-in)

1. **First Contact** – Welcome message after new lead
2. **Property Options Ready** – When matches are found
3. **Follow-up Reminder** – Re-engage cold leads
4. **Deal Closed Congrats** – Celebrate the win
5. **Re-engage / Lost** – Low-pressure reactivation

All templates are auto-personalized with client name, property type, location, and budget.

---

## 🔒 Security Notes

- Users can ONLY submit leads — zero access to other data
- Admin routes require HTTP Basic Auth
- All credentials via environment variables (never hardcoded)
- Google Sheets API uses service account (no OAuth needed)

---

## 🛠️ Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, Vite, React Router v6 |
| PWA | vite-plugin-pwa, Workbox |
| Maps | Leaflet + React-Leaflet (OpenStreetMap) |
| Backend | Python FastAPI + uvicorn |
| Database | Google Sheets (via gspread) |
| Deploy | Vercel (frontend + serverless functions) |
| Design | CSS custom properties, Space Grotesk + Plus Jakarta Sans |
