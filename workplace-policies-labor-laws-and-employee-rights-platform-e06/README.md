# WorkRights Hub

WorkRights Hub is a premium, interactive Employee Self-Service portal designed to empower employees. The application allows users to explore labor rights, view company-specific policies, file workplace grievances, and track complaint resolution timelines in real-time, all within a secure, responsive, and aesthetically stunning environment.

---

## 🌟 Key Features

* **Grievance Tracking**: Raise grievances categorized by department, priority, and subject, with options for anonymous submissions.
* **8-Stage Resolution Timeline**: View real-time status updates on a visually structured pipeline from "Submitted" to "Resolved".
* **Interactive Chat**: Live chat capability on individual complaints directly linking employees and coordinators.
* **Labor Rights Library**: A structured directory classifying labor rights and statutory provisions.
* **Company Policies**: Dynamically retrieved documentation published by administrators.
* **Premium Glassmorphic UI**: High-end styling utilizing radial gradients, slow-pulsing background blobs, and frosted glass components.
* **Micro-Animations & Interactive Glows**: Input fields animate with soft orange outer glows on focus. Buttons lift on hover and scale down on press. Links feature custom sliding underlines.

---

## 🛠️ Technology Stack

* **Frontend**: HTML5, CSS3, JavaScript (ES6+), React 18 (loaded via CDN).
* **Styling**: Tailwind CSS (Utility classes) & Vanilla CSS (Custom variables, glassmorphism, animations).
* **Database & Auth**: Supabase (PostgreSQL database & client SDK).
* **Typography & Icons**: Google Fonts (Inter, Fraunces, IBM Plex Mono) and Lucide Icons.
* **JSX Compiling**: Babel Standalone (runs client-side to compile React code on-the-fly).

---

## 📂 File Architecture

* **`index.html`**: Clean entry point loading Google fonts, CDN dependencies, external style assets, and initiating the React wrapper.
* **`style.css`**: Central design system definitions, theme variables, glassmorphic layout properties, transition times, and keyframe animations.
* **`app.js`**: React component hierarchy, routing, state managers, custom SVG icon components, and backend database queries (~2,600 lines).
* **`schema.sql`**: Full database setup containing SQL tables, indices, check constraints, default companies, and Postgres Row-Level Security (RLS) policies.
* **`config.js`**: Stores local Supabase URL and anonymous keys used to establish database clients.
* **`vercel.json`**: Deployment configurations handling static assets routing.

---

## 🚀 Setup & Local Running

### 1. Database Setup
1. Create a project in your [Supabase Console](https://supabase.com/).
2. Navigate to the SQL Editor and run the queries defined inside [schema.sql](schema.sql) to set up your tables, seeding parameters, and security layers.

### 2. Configure Credentials
Open [config.js](config.js) and populate it with your Supabase credentials:
```javascript
window.ENV = {
  SUPABASE_URL: "https://your-project-id.supabase.co",
  SUPABASE_ANON_KEY: "your-anon-key-string"
};
```

### 3. Start a Local Dev Server
Babel Standalone requires files to be served over an HTTP server to load external JSX modules. Running the application using a `file://` link will trigger CORS blockages.

Run one of the following commands in your project directory:

**Using Python (Recommended):**
```bash
python -m http.server 8090
```

**Using Node.js:**
```bash
# Install server globally
npm install -g http-server

# Run server
http-server -p 8090
```
Open **https://workplace-policies-labor-laws-and-e.vercel.app** in your browser.

---

## 🌐 Deployment
To deploy this project to hosting services like **Vercel** or **Netlify**:
1. Connect your GitHub repository containing this directory.
2. The project will build automatically as a static site. The configurations inside `vercel.json` ensure Vercel routes all subpaths correctly to `index.html` to prevent 404 errors during client-side navigation.
