# 📦 Inventory & Logistics Management System

A comprehensive, AI-powered ERP solution designed to streamline inventory tracking, order processing, and supplier management. By integrating intelligent features such as AI chat, automated restock recommendations, and instant business reporting, this system helps you manage logistics effortlessly.

**🚀 Live Demo:** https://inventory-and-logistics-management.vercel.app

---

## ✨ Key Features

- **🛡️ Secure Authentication:** JWT-based login and registration system with encrypted passwords.
- **📊 Inventory & Order Management:** Complete CRUD operations for products, orders, and shipments.
- **🤝 Supplier Tracking:** Maintain records of suppliers, their categories, and active statuses.
- **🤖 AI-Powered Insights (Powered by Groq):** 
  - Generates real-time business reports and metrics.
  - Smart restock recommendations based on low stock alerts.
  - Interactive AI Chat assistant that understands live inventory data.
- **🔔 Notifications:** Automated alerts for critical events (e.g., low stock, system initialization).
- **🚀 Cloud Ready:** Easy to deploy on platforms like Render (Backend) and Vercel (Frontend), backed by Aiven MySQL.

---

## 🛠️ Technology Stack

- **Frontend:** Vanilla HTML5, CSS3, JavaScript (ES6)
- **Backend:** Node.js, Express.js
- **Database:** MySQL 8.0+
- **AI Integration:** Groq API (LLaMA 3 Models)
- **Security:** bcrypt (password hashing), jsonwebtoken (JWT)
- **Deployment:** Render, Vercel

---

## ⚙️ Environment Variables

To run this project, you will need to add the following environment variables to your `backend/.env` file:

| Variable | Description |
| :--- | :--- |
| `PORT` | Local port for the Express Server (e.g., `5000`) |
| `DB_HOST` | Database Host URL (e.g., Aiven MySQL URL) |
| `DB_PORT` | Database Port (e.g., `14062` for Aiven, or `3306` locally) |
| `DB_USER` | MySQL Username |
| `DB_PASSWORD` | MySQL Password |
| `DB_NAME` | Database Name (e.g., `defaultdb`) |
| `GROQ_API_KEY` | Your API key from the [GroqCloud Console](https://console.groq.com/) |
| `JWT_SECRET` | A secure, random string used to sign authentication tokens |

---

## 🚀 Local Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/Inventory_Logistics.git
   cd Inventory_Logistics
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   ```
   - Create a `.env` file inside the `backend` directory based on the variables listed above.
   - Start the development server:
   ```bash
   npm run dev
   ```
   *(The server will automatically connect to MySQL, create the necessary tables, and seed the initial sample data if the tables are empty).*

3. **Frontend Setup:**
   - Open the `frontend` folder.
   - Update the `BASE_URL` inside `frontend/js/api.js` and `frontend/js/script2.js` to point to your local backend (`http://localhost:5000` or the port you chose).
   - Use a tool like [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) in VS Code to open `index.html`.

---

## 🌐 Production Deployment Guide

### Backend (Render)
1. Push your code to GitHub.
2. Create a new **Web Service** on [Render](https://render.com) linked to your GitHub repository.
3. Set the build command to `npm install` and the start command to `node server.js` (Root Directory: `backend`).
4. In the Render Dashboard under the **Environment** tab, add all the environment variables from your local `.env`.
5. **Important for Aiven DB users:** Ensure that Render's dynamic IPs are allowed to connect to your database by setting your Aiven Allowed IP Addresses to `0.0.0.0/0`.

### Frontend (Vercel)
1. Create a new project on [Vercel](https://vercel.com) and link it to your GitHub repository.
2. Set the Root Directory to `frontend`.
3. Vercel will automatically build and deploy your static HTML/CSS/JS frontend.
4. Ensure the `BASE_URL` in your frontend JS files points to your live Render backend URL before deploying.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page if you want to contribute.

## 📝 License

This project is licensed under the ISC License.
