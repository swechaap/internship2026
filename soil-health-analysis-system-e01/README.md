# 🌿 MittiSeva (మిట్టిసేవ) – Soil Health Analysis & Crop Advisor

MittiSeva is a **free, AI-powered Soil Health Analysis and Crop Advisory System** developed for farmers in **Andhra Pradesh** and **Telangana**. The application analyzes soil parameters, calculates a soil health score, recommends fertilizers and crops, maintains historical records, and provides multilingual agricultural assistance through **Krishi AI**.

🌐 **Live Demo:** https://soilhealth-analysis.vercel.app/

---

## 📌 Features

### 🔬 Soil Health Analysis

* Calculate soil health score (0–100)
* Analyze:

  * Nitrogen (N)
  * Phosphorus (P)
  * Potassium (K)
  * pH
  * Moisture
  * Organic Carbon

### 🌱 Fertilizer Recommendations

* Detect nutrient deficiencies
* Recommend Nitrogen, Phosphorus, and Potassium dosage
* Provide fertilizer application guidance

### 🌾 Crop Advisory

* Suggest suitable crops based on soil condition
* Recommend crop rotation strategies
* Improve agricultural productivity

### 💬 Krishi AI Assistant

* AI-powered farming assistant
* Personalized recommendations based on soil data
* Supports:

  * 🇬🇧 English
  * 🇮🇳 Telugu (తెలుగు)
  * 🇮🇳 Hindi (हिंदी)

### 📡 Offline AI Fallback

* Automatically detects AI service downtime
* Switches to a local offline response engine
* Ensures uninterrupted assistance

### 📋 Printable Soil Reports

* Generate professional soil health certificates
* Print or save as PDF

### 📊 Farmer Dashboard

* View previous soil tests
* Track soil health history
* Visualize trends using Chart.js

### 🔐 Secure Authentication

* Phone number-based login
* Virtual email authentication using Supabase

Example:

```text
ms.farmer.<phone>@gmail.com
```

---

# 🛠 Tech Stack

## Frontend

* HTML5
* CSS3
* JavaScript (ES6)
* Chart.js
* Supabase Client SDK
* Custom Localization Engine

## Backend

* Node.js
* Express.js
* CORS
* Dotenv

## Database

* PostgreSQL (Supabase)

## Authentication

* Supabase Auth

## AI

* OpenRouter API
* Offline AI Engine

---

# 📂 Project Structure

```text
mittiseva/
├── api/
│   └── index.js
│
├── public/
│   ├── index.html
│   ├── mittiseva.css
│   ├── mittiseva.js
│   ├── ai_engine.js
│   └── config.js
│
├── server.js
├── supabase_schema.sql
├── package.json
└── .env
```

---

# ⚙️ Getting Started

## Prerequisites

* Node.js v18+
* npm
* Supabase Account
* OpenRouter API Key

---

## Installation

Clone the repository:

```bash
git clone <repository-url>
cd mittiseva
```

Install dependencies:

```bash
npm install
```

---

## Environment Variables

Create a `.env` file in the project root:

```env
PORT=5000
OPENROUTER_API_KEY=your_openrouter_api_key
```

---

## Database Setup

1. Create a project in Supabase.
2. Open the SQL Editor.
3. Execute `supabase_schema.sql`.
4. Copy:

   * Project URL
   * Anon Key

Update `public/config.js`:

```javascript
const SUPABASE_URL = "https://your-project.supabase.co";
const SUPABASE_ANON_KEY = "your-anon-key";
```

---

## Run the Application

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:8000
```

---

# 🔄 Application Workflow

```text
Farmer Login
      │
      ▼
Enter Soil Parameters
(N, P, K, pH, Moisture, Organic Carbon)
      │
      ▼
Calculate Soil Health Score
      │
      ▼
Generate Fertilizer Recommendations
      │
      ▼
Suggest Suitable Crops
      │
      ▼
Store Results in Supabase
      │
      ▼
Display Dashboard & History
      │
      ▼
Interact with Krishi AI
```

---

# 🗄 Database Schema

## Profiles

Stores farmer profile information.

* User ID
* Name
* Phone Number
* Preferred Language

## Soil Tests

Stores:

* Nitrogen
* Phosphorus
* Potassium
* pH
* Moisture
* Organic Carbon
* Soil Health Score
* Crop Recommendation
* Timestamp

## Chat Messages

Stores:

* User ID
* User Query
* AI Response
* Timestamp

---

# 🔒 Security

* Supabase Authentication
* Row Level Security (RLS)
* User-specific data isolation
* Secure API proxy for AI requests

---

# 🌍 Supported Languages

* 🇬🇧 English
* 🇮🇳 Telugu (తెలుగు)
* 🇮🇳 Hindi (हिंदी)

---

# 🚀 Future Enhancements

* 🌦 Weather Forecast Integration
* 🛰 GPS-Based Soil Mapping
* 📱 Android & iOS Mobile App
* 🎤 Voice-Based Krishi AI
* 🌿 Pest & Disease Detection
* 📷 Image-Based Crop Analysis
* 📩 SMS Notifications
* 🌱 Government Scheme Recommendations
* 📡 IoT Soil Sensor Integration

---

# 📸 Screenshots

Add screenshots of:

* Home Page
* Soil Analysis
* Dashboard
* Krishi AI
* Soil Report
* History Page

---

# 🌐 Live Demo

https://soilhealth-analysis.vercel.app/

---

# 📄 License

This project is developed for educational and research purposes. Feel free to use and modify it for learning.
