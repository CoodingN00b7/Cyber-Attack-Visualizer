# 🛡️ Cyber Attack Visualizer

> A full-stack cyber intelligence and breach-checking platform for scanning identifiers, detecting exposures, and visualizing threat data in real time.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Frontend Pages](#frontend-pages)
- [Authentication](#authentication)
- [Scan Engine](#scan-engine)
- [Database Schema](#database-schema)
- [Project Structure](#project-structure)
- [Known Limitations](#known-limitations)
- [Roadmap](#roadmap)

---

## Overview

Cyber Attack Visualizer is a full-stack web application that enables individuals and government agencies to check whether their personal identifiers — such as email addresses, phone numbers, IP addresses, Aadhaar numbers, PAN cards, and URLs — have been exposed in data breaches or flagged in threat intelligence feeds.

The application combines a Node.js + Express + SQLite backend with a React + Vite frontend featuring animated UI, role-based dashboards, and a resilient fallback scan strategy.

---

## Features

- **Multi-identifier scanning** — supports EMAIL, PHONE, IP, AADHAAR, PAN, and URL
- **Breach intelligence** — integrates with LeakCheck, AbuseIPDB, VirusTotal, and Numverify
- **Fallback strategy** — gracefully falls back to local scan history when APIs are unavailable
- **IP enrichment** — caches IP threat intelligence with a 24-hour recency window
- **Global threat feed** — pulls and visualizes top threat IPs from SANS ISC
- **Role-based access** — separate dashboards for regular users and government accounts
- **Animated result modals** — masked identifiers, privacy fingerprints, risk scores, and mitigation steps
- **Scan history** — per-user history persisted in SQLite and mirrored in localStorage
- **Theme system** — global CSS theming via ThemeContext

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Frontend (React)                  │
│  Login │ Register │ Home Scanner │ Dashboard │ Gov  │
└────────────────────────┬────────────────────────────┘
                         │ REST API
┌────────────────────────▼────────────────────────────┐
│                 Backend (Node + Express)             │
│   Auth Controller   │   Scan Controller             │
└────────────────────────┬────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────┐
│                  SQLite Database                     │
│   users  │  attacks  │  threat_cache                │
└─────────────────────────────────────────────────────┘
```

The backend exposes a REST API consumed by the React frontend. SQLite handles persistence for scan records, threat cache, and user accounts. The frontend manages session state via localStorage and enforces route-level access control.

---

## Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React, Vite, React Router           |
| Styling   | CSS Modules, ThemeContext, index.css |
| Backend   | Node.js, Express                    |
| Database  | SQLite (via better-sqlite3 or similar) |
| Auth      | SHA-256 password hashing (see Roadmap) |
| APIs      | LeakCheck, AbuseIPDB, VirusTotal, Numverify, SANS ISC |
| Config    | dotenv                              |

---

## Getting Started

### Prerequisites

- Node.js v18+
- npm or yarn

### 1. Clone the repository

```bash
git clone https://github.com/your-org/cyber-attack-visualizer.git
cd cyber-attack-visualizer
```

### 2. Install backend dependencies

```bash
cd cyber-backend
npm install
```

### 3. Install frontend dependencies

```bash
cd ../cyber-visualizer
npm install
```

### 4. Configure environment variables

Create a `.env` file in `cyber-backend/` (see [Environment Variables](#environment-variables)).

### 5. Start the backend

```bash
cd cyber-backend
npm start
```

The backend runs on `http://localhost:5000` by default.

### 6. Start the frontend

```bash
cd cyber-visualizer
npm run dev
```

The frontend runs on `http://localhost:5173` by default.

---

## Environment Variables

Create `cyber-backend/.env` with the following keys:

```env
PORT=5000

# API Keys
LEAKCHECK_API_KEY=your_leakcheck_key
ABUSEIPDB_API_KEY=your_abuseipdb_key
VIRUSTOTAL_API_KEY=your_virustotal_key
NUMVERIFY_API_KEY=your_numverify_key

# Government account defaults (auto-created on first run)
GOV_ID=GOV001
GOV_PASSWORD=your_gov_password
```

All API keys are optional — the scan engine will fall back to local history when keys are absent or calls fail.

---

## API Reference

### Auth

| Method | Endpoint             | Description                     |
|--------|----------------------|---------------------------------|
| POST   | `/api/auth/register` | Register a new user account     |
| POST   | `/api/auth/login`    | Login (user or government mode) |

**Register request body:**
```json
{
  "name": "Jane Doe",
  "username": "janedoe",
  "email": "jane@example.com",
  "password": "securepassword"
}
```

**Login request body (user mode):**
```json
{
  "loginId": "jane@example.com",
  "password": "securepassword",
  "mode": "user"
}
```

**Login request body (government mode):**
```json
{
  "govId": "GOV001",
  "password": "govpassword",
  "mode": "government"
}
```

---

### Scan & Attacks

| Method | Endpoint                  | Description                          |
|--------|---------------------------|--------------------------------------|
| POST   | `/api/scan`               | Scan an identifier for breaches      |
| GET    | `/api/attacks`            | Retrieve all logged scan results     |
| GET    | `/api/attacks/search`     | Search scan history by query params  |
| DELETE | `/api/attacks/:id`        | Delete a specific scan record        |
| GET    | `/api/enrich/:ip`         | Enrich an IP with threat intelligence|
| GET    | `/api/global-threats`     | Fetch top global threat IPs          |

**Scan request body:**
```json
{
  "identifier": "user@example.com",
  "type": "EMAIL"
}
```

Supported `type` values: `EMAIL`, `PHONE`, `IP`, `AADHAAR`, `PAN`, `URL`

---

## Frontend Pages

| Route           | Access         | Description                                 |
|-----------------|----------------|---------------------------------------------|
| `/login`        | Public         | User and government login                   |
| `/register`     | Public         | New user registration                       |
| `/home`         | Authenticated  | Main identifier scanner                     |
| `/dashboard`    | Authenticated (non-guest) | Personal scan history and analytics |
| `/gov-dashboard`| Government only | Threat intelligence overview               |

### Route Guards

- `ProtectedRoute` — requires any active session
- `DashboardRoute` — blocks guest/unauthenticated users
- `GovRoute` — permits only users with `role = government`

---

## Authentication

### Registration

1. Validates name, username, email, and password fields
2. Enforces minimum password length
3. Rejects duplicate email or username
4. Stores password as SHA-256 hash
5. Returns the created user payload

### Login

Supports two modes:

- **User mode** — authenticates via `email/username` + password
- **Government mode** — authenticates via `govId` + password with role verification

A default government account is auto-created on first backend startup if none exists.

### Session Management

Sessions are persisted in `localStorage` via `userStorage.js` helpers (`getSession`, `setSession`, `clearSession`). There is currently no server-side token system (see [Roadmap](#roadmap)).

---

## Scan Engine

### Supported Identifier Types and APIs

| Type    | Primary API   | Fallback          |
|---------|---------------|-------------------|
| EMAIL   | LeakCheck     | Local attack history |
| IP      | AbuseIPDB     | Local attack history |
| URL     | VirusTotal    | Local attack history |
| PHONE   | Numverify     | Local attack history |
| AADHAAR | —             | Local fallback path  |
| PAN     | —             | Local fallback path  |

### Fallback Strategy

When an API key is missing or a live call fails, the scan controller:

1. Searches the local `attacks` table for a prior record matching the identifier and type
2. Returns the most recent local result if found
3. Otherwise returns a safe, neutral fallback response

### Result Modal

Each scan result is displayed in an animated modal with:

- Masked identifier display
- Privacy fingerprint (SHA-256-based reference hash)
- Risk score and exposure metadata
- Recommended mitigation actions per identifier type

### Input Constraints (Frontend)

| Type    | Max Length | Normalization      |
|---------|------------|--------------------|
| PHONE   | 10 chars   | Digits only        |
| AADHAAR | 12 chars   | Digits only        |
| PAN     | 10 chars   | Alphanumeric upper |

---

## Database Schema

### `users`

| Column       | Type    | Description                    |
|--------------|---------|--------------------------------|
| id           | INTEGER | Primary key                    |
| name         | TEXT    | Display name                   |
| username     | TEXT    | Unique username                |
| email        | TEXT    | Unique email                   |
| passwordHash | TEXT    | SHA-256 hashed password        |
| role         | TEXT    | `user` or `government`         |

### `attacks`

| Column     | Type    | Description                          |
|------------|---------|--------------------------------------|
| id         | INTEGER | Primary key                          |
| identifier | TEXT    | Scanned value                        |
| type       | TEXT    | Identifier type (EMAIL, IP, etc.)    |
| status     | TEXT    | Scan outcome                         |
| severity   | REAL    | Risk score                           |
| source     | TEXT    | API or fallback source               |
| metadata   | TEXT    | Breach details (JSON)                |
| scannedAt  | TEXT    | Timestamp                            |

### `threat_cache`

| Column    | Type    | Description                        |
|-----------|---------|------------------------------------|
| ip        | TEXT    | Cached IP address                  |
| data      | TEXT    | Enrichment response (JSON)         |
| cachedAt  | TEXT    | Cache timestamp (24hr TTL)         |

The database module includes lightweight schema migration logic to handle missing columns in existing `attacks` tables.

---

## Project Structure

```
cyber-attack-visualizer/
├── cyber-backend/
│   ├── server.js                      # Entry point
│   ├── config/
│   │   └── db.js                      # SQLite setup and migrations
│   ├── controllers/
│   │   ├── authController.js          # Register and login logic
│   │   └── scanController.js          # Scan engine and enrichment
│   └── models/
│       └── Attack.js                  # Attack record persistence
│
└── cyber-visualizer/
    ├── src/
    │   ├── main.jsx                   # App bootstrap
    │   ├── App.jsx                    # Router and route guards
    │   ├── userStorage.js             # Session helpers
    │   ├── index.css                  # Global styles and theme variables
    │   └── components/
    │       ├── Home.jsx               # Scanner page
    │       ├── LoginPage.jsx          # Login UI
    │       ├── RegisterPage.jsx       # Registration UI
    │       ├── DashboardPage.jsx      # User dashboard
    │       └── GovDashboard.jsx       # Government dashboard
    └── vite.config.js
```

**Line count summary (excluding node_modules, dist, lockfiles):**

| Area         | Lines |
|--------------|-------|
| Backend      | 740   |
| Frontend     | 3,292 |
| **Total**    | **4,032** |

---

## Known Limitations

- **Password security** — SHA-256 without salt is used; not suitable for production
- **No server-side sessions** — user sessions are stored in `localStorage` with no token expiry
- **Scan history is client-local** — per-user history is browser-bound and not synced across devices
- **Government dashboard** — currently presentation-oriented with limited live data integration
- **No test suite** — no automated backend or frontend tests are currently wired into package scripts
- **Route organization** — `scanRoutes.js` exists but routes are mounted directly in `server.js`

---

## Roadmap

The following improvements are planned to move the project toward production readiness:

1. **Replace SHA-256 with bcrypt or argon2** for salted, secure password hashing
2. **Implement JWT or secure cookie sessions** to replace localStorage-based auth
3. **Move scan history to backend** for cross-device sync via user-scoped endpoints
4. **Add pagination and filters** for the attacks list and search results
5. **Write integration tests** for auth, scan fallback, and enrichment endpoints
6. **Consolidate legacy userStorage helpers** that are no longer used in active auth flows
7. **Mount `scanRoutes.js`** for cleaner route organization in `server.js`

---

## Educational Disclaimer

This project was built **for educational purposes only**. It is intended to demonstrate full-stack web development concepts including REST API design, authentication flows, third-party API integration, and role-based access control. It is not intended for use in production environments without significant security hardening (see [Roadmap](#roadmap)).

---

## Author

**Fardeen Akmal**

Built as a learning project to explore cyber intelligence tooling, full-stack architecture, and breach-detection workflows.

---

*Last updated: April 2026*
