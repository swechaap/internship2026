# WorkRights Hub

WorkRights Hub is a premium, interactive Employee Self-Service portal designed to empower employees. The application allows users to explore labor rights, view company-specific policies, file workplace grievances, and track complaint resolution timelines in real-time, all within a secure, responsive, and aesthetically stunning environment.

---

## 📂 File Architecture

This repository has been restructured into a modular, production-ready React + Vite application:

```text
├── supabase/
│   └── schema.sql          # Database setup, seed parameters, & RLS policies
├── src/
│   ├── main.jsx            # Vite React entry point
│   ├── App.jsx             # Root layout, routing, and global state
│   ├── index.css           # Injects Tailwind CSS & styles import
│   ├── components/         # Reusable UI components
│   │   ├── Icon.jsx
│   │   ├── Sidebar.jsx
│   │   ├── Topbar.jsx
│   │   ├── ComplaintChat.jsx  # [NEW] Real-time grievance live chat panel
│   │   ├── AutoHeight.jsx
│   │   └── ...
│   ├── pages/              # Page view modules
│   │   ├── Dashboard.jsx
│   │   ├── RightsFinder.jsx
│   │   ├── LawExplorer.jsx
│   │   ├── PoliciesCenter.jsx
│   │   ├── ComplaintTracker.jsx
│   │   └── Profile.jsx
│   ├── lib/
│   │   └── supabaseClient.js  # Initializes Supabase client
│   ├── data/               # Static dataset declarations
│   │   └── ...
│   └── styles/
│       └── style.css       # Native variables & glassmorphism CSS
├── package.json            # Node dependencies and build scripts
├── tailwind.config.js      # Tailwind configurations
├── vite.config.js          # Vite configuration
└── vercel.json             # Single Page Application rewrite rules
```

---

## 🌟 Key Features

* **Grievance Tracking**: Raise grievances categorized by department, priority, and subject, with options for anonymous submissions.
* **Grievance Live Chat [NEW]**: Real-time communication on individual complaints directly linking employees and coordinators via Supabase Realtime socket events.
* **8-Stage Resolution Timeline**: View real-time status updates on a visually structured pipeline from "Submitted" to "Resolved".
* **Labor Rights Library**: A structured directory classifying labor rights and statutory provisions.
* **Company Policies**: Dynamically retrieved documentation published by administrators.
* **Premium Glassmorphic UI**: High-end styling utilizing radial gradients, slow-pulsing background blobs, and frosted glass components.
* **Micro-Animations**: Framer Motion powered transitions for hover triggers and page swaps.

---

## 🛠️ Technology Stack

* **Frontend**: React 18, Vite 5, Framer Motion, Lucide React.
* **Styling**: Tailwind CSS (Utility classes) & Vanilla CSS (Custom variables, glassmorphism, animations).
* **Database & Auth**: Supabase (PostgreSQL database, client SDK, Realtime channels).

---

## 🚀 Setup & Local Running

### 1. Database Setup
1. Create a project in your [Supabase Console](https://supabase.com/).
2. Navigate to the SQL Editor and execute the script inside [supabase/schema.sql](supabase/schema.sql) to set up tables, triggers, seed parameters, and Row-Level Security (RLS) policies.

### 2. Configure Credentials
Create a `.env.local` file in your root project directory:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-string
```
*Note: If the environment variables are not set, the application will display a setup screen letting you link database credentials dynamically.*

### 3. Local Development Server
To run the project locally, install Node.js and run:
```bash
# Install dependencies
npm install

# Start Vite dev server
npm run dev
```
Open **http://localhost:3000** in your browser.

---

## 🌐 Deployment

To deploy this project to hosting services like **Vercel** or **Netlify**:
1. Connect your GitHub repository containing this directory.
2. The project will build automatically as a static site using the `npm run build` command, outputting to the `dist/` directory.
3. The configurations inside `vercel.json` ensure Vercel routes all subpaths correctly to `index.html` to prevent 404 errors during client-side navigation.
