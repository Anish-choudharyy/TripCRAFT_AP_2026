# ✈️ TripCraft — Trip Itinerary Planner & Travel Expense Analytics

**Plan your trips. Organize your days. Track your budget.**

TripCraft is a full-stack travel planning web application and data engineering platform designed to help users organize itineraries, manage expenses, and analyze their travel costs in one centralized dashboard.

---

## 📌 Problem Statement

Planning a trip involves organizing destinations, activities, schedules, and expenses across multiple sources. Managing these details manually can be time-consuming and makes it difficult to monitor the overall budget.

TripCraft provides a centralized, database-backed platform for planning trips, organizing daily activities, tracking expenses, and analyzing travel costs with automated data processing.

---

## 💡 Key Features

- 🗺️ **Trip Management:** Full CRUD operations for custom travel circuits (planned budget, destination, travel dates, status).
- 📅 **Daily Itinerary:** Organize day-by-day activities with time slots, categories, costs, and completion checkboxes.
- 💰 **Expense Tracking:** Record itemized expenses for Transport, Accommodation, Food, Activities, and Miscellaneous.
- 📊 **Budget Analytics:** Live financial variance analysis, category distribution, and burn rates visualized via Recharts.
- 📁 **CSV Ingestion (Data Engineering):** Automated ETL pipeline that imports raw destination datasets, sanitizes currency formatting, resolves categories, and logs cleaning transformations.
- 🔄 **Data Processing Pipeline:** Clean, validate, and normalize records before relational persistence.
- 🗄️ **Database Management:** PostgreSQL relational schema with foreign key cascades, JSONB highlights, and indexes (plus automatic memory fallback if PostgreSQL is not active yet).
- 📈 **Visual Analytics:** Interactive Donut charts, Bar charts, and metric dashboards for budget comparison.

---

## 🛠️ Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS 4, Lucide Icons, Recharts
- **Backend:** Node.js, Express, Multer, CSV-Parser, Morgan, Dotenv
- **Database:** PostgreSQL (with connection pooling via `pg`, auto-migrations, and seed data)
- **Version Control:** Git & GitHub

---

## 🚀 Quick Start Guide

### 1. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server && npm install && cd ..
```

### 2. Configure PostgreSQL Database

Edit `server/.env` to provide your PostgreSQL connection string:

```env
PORT=5001
NODE_ENV=development

# PostgreSQL Connection String (Local, Neon, Supabase, Render, Railway, etc.):
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/tripcraft
PGSSL=false
```

> **Note:** If PostgreSQL is not currently running on your machine, TripCraft will automatically boot with its **In-Memory Fallback Engine**, ensuring the frontend, API, and demo features function immediately out of the box!

### 3. Start the Application

You can start the backend and frontend in two terminal tabs:

**Terminal 1 — Backend API:**
```bash
npm run server
# Running on http://localhost:5001
```

**Terminal 2 — Frontend Client:**
```bash
npm run dev
# Running on http://localhost:5173
```

---

## 🗄️ Database Architecture & Schemas

The PostgreSQL database enforces relational integrity across five primary tables:

1. **`destinations`**: Indian travel locations, categories, budget estimates, duration, best seasons, and JSONB highlights.
2. **`trips`**: Travel circuits, allocated budget, target dates, travel party, status, and cover photography.
3. **`itinerary_items`**: Scheduled daily activities linked to trips (`ON DELETE CASCADE`), time slots, and costs.
4. **`expenses`**: Itemized expenditures linked to trips (`ON DELETE CASCADE`), category allocations, and payment methods.
5. **`imported_datasets`**: Audit logs for the Data Engineering CSV ETL pipeline recording valid vs rejected rows.

The full SQL DDL script is located at `server/src/db/schema.sql`.

---

## 📡 REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | System health and database engine status |
| `GET` | `/api/destinations` | Search and filter destinations |
| `POST` | `/api/destinations` | Add a new destination record |
| `GET` | `/api/trips` | List all trips with expense totals & burn rate |
| `GET` | `/api/trips/:id` | Fetch trip with full itinerary and expense items |
| `POST` | `/api/trips` | Create a new trip |
| `PUT` | `/api/trips/:id` | Update trip details |
| `DELETE` | `/api/trips/:id` | Delete trip and cascade child items |
| `GET` | `/api/itinerary/trip/:tripId` | Get day-by-day itinerary |
| `POST` | `/api/itinerary/trip/:tripId` | Add activity to itinerary |
| `PUT` | `/api/itinerary/:id` | Update activity or toggle completion |
| `DELETE` | `/api/itinerary/:id` | Delete activity |
| `GET` | `/api/expenses/trip/:tripId` | Get expenses for a trip |
| `POST` | `/api/expenses/trip/:tripId` | Record a new expense |
| `DELETE` | `/api/expenses/:id` | Delete an expense |
| `GET` | `/api/expenses/trip/:tripId/analytics` | Financial breakdown for single trip |
| `GET` | `/api/analytics/dashboard` | Global budget vs spent analytics |
| `POST` | `/api/data/import-destinations` | Upload CSV and run ETL pipeline |
| `GET` | `/api/data/export-trips-csv` | Download CSV expense report |

---

## 🎯 College Evaluation Context

**Built as a group college project for Advance Programming (AP) and Data Engineering (DE) 2026.**

### 👥 Team T0063 Roster

| Role | Name | Enrollment No. | Section | GitHub Username |
|------|------|----------------|---------|-----------------|
| Group Lead | Harsh Raja | 2501010177 | C | [Harsh-07-Raja](https://github.com/Harsh-07-Raja) |
| Member 2 | Anish Choudhary | 2501010569 | B | [Anish-choudharyy](https://github.com/Anish-choudharyy) |
| Member 3 | Aksh Rathi | 2501010044 | B | [aksh2801](https://github.com/aksh2801) |
| Member 4 | Sikunj Yadav | 2501010570 | E | [CodewithSikunj](https://github.com/CodewithSikunj) |
