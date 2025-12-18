# 🛡️ Cyber Attack Visualizer: ECEBIP PRO
### Enhanced Cyber Exposure and Breach Intelligence Platform

<div align="center">

![React](https://img.shields.io/badge/Frontend-React_Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Tailwind](https://img.shields.io/badge/Styling-Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Node](https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Status](https://img.shields.io/badge/Status-Semester_1_MVP-success?style=for-the-badge)

**A Real-Time Network Threat Mapping & Privacy-Preserving Breach Detection Dashboard.**
*Aligned with the Digital Personal Data Protection (DPDP) Act, 2023.*

[View Demo](#) · [Report Bug](https://github.com/YOUR_USERNAME/Cyber-Attack-Visualizer/issues) · [Request Feature](https://github.com/YOUR_USERNAME/Cyber-Attack-Visualizer/issues)

</div>

---

## 📖 Abstract

In an era of increasing digital dependency, data security is critical. [cite_start]**ECEBIP PRO** is a region-specific intelligence platform designed to address the evolving threat landscape in Maharashtra and India[cite: 75]. [cite_start]Unlike global tools, this system offers **multi-identifier search** (Email, Phone, Aadhaar, PAN) and uses advanced **SHA-256 k-anonymity** to ensure user data never leaves the device in raw form[cite: 77].

## ✨ Key Features

* [cite_start]**🔒 Privacy-First Architecture:** Uses SHA-256 hashing to verify breaches without exposing sensitive user data[cite: 100].
* [cite_start]**🇮🇳 Indian Context:** Specifically designed to detect leaks related to **Aadhaar, PAN, and Indian mobile numbers**[cite: 99].
* **📊 Threat Dashboard:** Visualizes the Indian cyber threat landscape with regional data for Maharashtra, Delhi, Karnataka, etc.
* **⚡ Real-Time Scanning:** Simulates connection to Dark Web nodes and public breach dumps.
* [cite_start]**🚨 Severity Scoring:** Categorizes risks (Low, High, Critical) and provides actionable remediation steps[cite: 101].
* **🎨 Cyber UI:** A responsive, animated "Hacker/Dark Mode" interface built with Tailwind CSS and Framer Motion.

## 📸 Screenshots

| **Scanner Home** | **Threat Dashboard** |
|:---:|:---:|
| *[Paste your Home Page Screenshot here]* | *[Paste your Dashboard Screenshot here]* |
| *Multi-identifier privacy search interface* | *Real-time threat vectors & regional data* |

| **Scan in Progress** | **Breach Result Card** |
|:---:|:---:|
| *[Paste your Scanning Animation Screenshot here]* | *[Paste your Result/Severity Card Screenshot here]* |

## 🏗️ System Architecture

[cite_start]The system follows a layered architecture separating data ingestion, processing, and presentation[cite: 553].



## 🛠️ Tech Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React.js + Vite | [cite_start]Core UI framework [cite: 108] |
| **Styling** | Tailwind CSS | Utility-first styling for the "Cyber" look |
| **Animations** | Framer Motion | Scanning effects and transitions |
| **Charts** | Recharts | Data visualization for the dashboard |
| **Backend** | Node.js + Express | [cite_start]API handling and logic [cite: 686] |
| **Security** | Crypto (Node) | SHA-256 Hashing implementation |
| **Icons** | Lucide React | Modern, clean UI icons |

## 📂 Project Structure

```text
Cyber-Attack-Visualizer/
├── cyber-backend/         # Node.js Server
│   ├── controllers/       # Logic for Hashing & Severity Scoring
│   ├── routes/            # API Route Definitions
│   └── server.js          # Entry Point (Port 5000)
│
└── cyber-visualizer/      # React Frontend
    ├── src/
    │   ├── components/    # HomePage.jsx, DashboardPage.jsx
    │   ├── App.jsx        # Routing Logic
    │   └── main.jsx       # Entry Point
    └── tailwind.config.js # Custom Theme Config
🚀 Getting Started
Follow these steps to set up the project locally.

Prerequisites
Node.js (v14 or higher)

npm (Node Package Manager)

1. Clone the Repository
Bash

git clone [https://github.com/YOUR_USERNAME/Cyber-Attack-Visualizer.git](https://github.com/YOUR_USERNAME/Cyber-Attack-Visualizer.git)
cd Cyber-Attack-Visualizer
2. Setup Backend
Bash

cd cyber-backend
npm install
node server.js
Output: [ECEBIP] Backend running on http://localhost:5000

3. Setup Frontend (Open a new terminal)
Bash

cd cyber-visualizer
npm install
npm run dev
Output: Local: http://localhost:5173/

4. Usage
Open http://localhost:5173 in your browser.

Enter an email or phone number to test the Scanner.

Click "Threat Dashboard" in the navbar to view live analytics.

📜 Compliance & Ethics
This project adheres to the principles of the Digital Personal Data Protection (DPDP) Act, 2023.

No Data Retention: We do not store user search queries.


k-Anonymity: Only hashed prefixes are sent to the server, ensuring privacy.

👥 Team Members

G.V. Acharya Institute of Engineering and Technology

Department of Computer Science Engineering (IoT, CS Including BCT) 

Fardeen Akmal - Lead Developer & Architect 
Jigisha Naidu - Frontend & Documentation 
Sushil Nirmal - Data Analysis & Research 
Suvajit Ghosh - Testing & Compliance 

© 2025 ECEBIP Project. Submitted for Semester 1 Requirements.
