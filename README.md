# Viyal – AI-Powered Forest Monitoring System

## 🚀 Quick Start

### Step 1: Configure MongoDB

Edit `backend/.env` and replace the MongoDB URI:
```env
MONGO_URI=your_mongodb_atlas_connection_string_here
JWT_SECRET=forestmind_secret_key_2024
PORT=5000
```

Also update `frontend/.env` if needed:
```env
VITE_API_URL=http://localhost:5000/api
```

---

### Step 2: Start the Backend

```bash
cd backend
npm install       # (already done)
npm run seed      # Populate the database with mock data
npm run dev       # Start backend on port 5000
```

---

### Step 3: Start the Frontend

```bash
cd frontend
npm install       # (already done)
npm run dev       # Start frontend on port 5173
```

---

### Step 4: Login

Open [http://localhost:5173](http://localhost:5173) and use:

| Field | Value |
|-------|-------|
| District | Coimbatore |
| Forest | Anamalai Tiger Reserve |
| Office | Pollachi Forest Division |
| Password | `forest123` |

**Second account:**
| Field | Value |
|-------|-------|
| District | Nilgiris |
| Forest | Mudumalai Tiger Reserve |
| Office | Gudalur Forest Division |
| Password | `forest456` |

---

## 📁 Project Structure

```
viyal/
├── backend/
│   ├── models/          # Mongoose schemas (User, Alert, Zone, Species, Insight)
│   ├── routes/          # REST API routes (auth, alerts, zones, species, insights)
│   ├── middleware/      # JWT auth middleware
│   ├── seed/            # Database seeder with mock data
│   └── server.js        # Express entry point
│
└── frontend/
    └── src/
        ├── api/         # Axios client
        ├── components/  # Sidebar, Layout, Card, AlertBadge, etc.
        ├── context/     # AuthContext (login, logout, session)
        └── pages/
            ├── Login.jsx
            ├── Dashboard.jsx
            ├── threat/          # LiveAlerts, AlertHistory
            ├── geofencing/      # ZoneMonitoring, ActivityLogs
            ├── species/         # DetectionFeed, SpeciesRecords
            └── insights/        # EnvironmentalTrends, Recommendations
```

## 🔧 REST API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/login` | Authenticate forest officer |
| GET | `/api/alerts` | List alerts (filter by type/severity/status) |
| GET | `/api/alerts/stats` | Alert count statistics |
| PATCH | `/api/alerts/:id/status` | Update alert status |
| GET | `/api/zones` | List all zones |
| GET | `/api/zones/logs` | All zone activity logs |
| GET | `/api/species` | List detected species |
| PATCH | `/api/species/:id/alert` | Mark alert as sent |
| GET | `/api/insights` | Environmental insights |
| GET | `/api/insights/recommendations` | AI recommendations |
