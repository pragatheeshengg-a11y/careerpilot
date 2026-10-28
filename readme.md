# 🚀 CareerPilot — AI Job Search Assistant

[![Frontend Deployment](https://img.shields.io/badge/Frontend-Netlify-00C7B7?style=flat&logo=netlify&logoColor=white)](https://careerpilotaiapp.netlify.app)
[![Backend Deployment](https://img.shields.io/badge/Backend-Render-46E3B7?style=flat&logo=render&logoColor=white)](https://careerpilot-d5om.onrender.com)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-181717?style=flat&logo=github&logoColor=white)](https://github.com/pragatheeshengg-a11y/careerpilot)
[![Node.js](https://img.shields.io/badge/Runtime-Node.js_v18+-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)

**CareerPilot** is an end-to-end full-stack MERN application powered by Google Gemini AI and the Model Context Protocol (MCP). Built primarily for learning, research, and study purposes, it demonstrates how to integrate modern AI tool-calling workflows with a robust CRUD application to manage job applications, evaluate resume-to-job compatibility, and generate targeted interview preparation material.

---

## 🌐 Live Demos & Links

* **Frontend Application:** [careerpilotaiapp.netlify.app](https://careerpilotaiapp.netlify.app)
* **Backend API Base:** [careerpilot-d5om.onrender.com](https://careerpilot-d5om.onrender.com)
* **API Health Check:** [careerpilot-d5om.onrender.com/api/health](https://careerpilot-d5om.onrender.com/api/health)
* **Source Repository:** [github.com/pragatheeshengg-a11y/careerpilot](https://github.com/pragatheeshengg-a11y/careerpilot)

> **Note:** Render spins down free-tier web services during periods of inactivity. If the service is idling, the first incoming request may require 30–50 seconds to warm up.

---

## ✨ Features

### 🔐 Authentication & API Security
* **User Lifecycle:** Account registration and login workflows.
* **Token Handling:** Stateless, signed JWT (JSON Web Token) authentication.
* **Password Hashing:** One-way salted hashing using `bcryptjs`.
* **API Hardening:** Secure HTTP headers using `Helmet`, rate limiting on sensitive routes using `express-rate-limit`, and robust runtime schema validation via `Zod`.

### 🤖 AI-Powered Career Assistance
* **Resume Compatibility Scoring:** Compares candidates' technical skills and background against job description requirements.
* **Structured Output Validation:** Enforces structured, predictable JSON schemas on Gemini AI responses using validation models.
* **Interview Preparation:** Generates role-specific behavioral and technical mock interview questions.

### 📋 Job Application Tracking (Pipeline Management)
* **State Management:** Track application statuses across 5 stages:
  * `Wishlist` → `Applied` → `Interview` → `Offer` → `Rejected`
* **CRUD Functionality:** Full capabilities to add, edit notes/status, view, and delete job records.
* **Search & Metrics:** Aggregated overview metrics summarizing your active pipeline.

### 🔌 Model Context Protocol (MCP) Integration
* **Standardized Tool Use:** Exposes backend utility functions as MCP tools, allowing AI agents to interact directly with application data.
* **Data Context Retrieval:** Equips the AI chat assistant with access to user-specific job application statistics and records while strictly respecting authentication boundaries.

---

## 🛠️ Tech Stack

| Domain | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite | Component-driven UI, fast HMR, and production bundling |
| **Styling** | Vanilla CSS3 | Responsive UI styling across mobile and desktop breakpoints |
| **Backend** | Node.js, Express.js | REST routing, middleware orchestration, and MCP protocol integration |
| **Database** | MongoDB Atlas, Mongoose | Cloud document database and object data modeling |
| **Generative AI** | Google Gemini API | Resume matching and interview generation |
| **Agent Protocols** | Model Context Protocol (MCP) | Tool-based application interfaces for AI workflows |
| **Validation** | Zod | Runtime schema validation for requests and LLM outputs |
| **Authentication** | JWT, bcryptjs | Session signing and credential protection |
| **Hosting** | Netlify, Render | Distributed static hosting (SPA) and containerized backend API |

---

## 🏗️ Project Architecture

```text
CareerPilot/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── AIWorkspace.jsx
│   │   │   ├── ApplicationForm.jsx
│   │   │   ├── ApplicationList.jsx
│   │   │   └── MCPChat.jsx
│   │   ├── services/
│   │   │   ├── applicationApi.js
│   │   │   └── applicationTools.js
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env.example
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── vercel.json
│   └── vite.config.js
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── aiController.js
│   │   ├── applicationController.js
│   │   ├── authController.js
│   │   └── mcpChatController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── Application.js
│   │   └── User.js
│   ├── routes/
│   │   ├── aiRoutes.js
│   │   ├── applicationRoutes.js
│   │   ├── authRoutes.js
│   │   ├── careerPilotToolsRoutes.js
│   │   ├── mcpChatRoutes.js
│   │   └── mcpWebRoutes.js
│   ├── services/
│   │   ├── applicationApi.js
│   │   ├── applicationTools.js
│   │   ├── geminiService.js
│   │   └── mcpGeminiService.js
│   ├── utils/
│   │   ├── aiValidators.js
│   │   ├── applicationValidators.js
│   │   └── validators.js
│   ├── .env.example
│   ├── mcpserver.js
│   ├── package.json
│   └── server.js
│
└── README.md
```

---

## 🔄 Execution Flow

```text
+-----------------------+           +-----------------------+           +----------------------+
|  React Client (Vite)  | <=======> |  Express Server (API) | <=======> |  MongoDB Atlas (DB)  |
+-----------------------+  (JWT)    +-----------------------+           +----------------------+
            |                                   |
            |                                   |
            v                                   v
   (MCP Chat & Prompts)            +-------------------------+
            |                      | Google Gemini & MCP SDK |
            +====================> +-------------------------+
```

1. **Client Auth:** The client submits credentials to `/api/auth/login`. On successful hash comparison, the backend responds with a signed JWT.
2. **Authorized Invocations:** The React client attaches the token in the `Authorization: Bearer <TOKEN>` header for protected data mutations.
3. **AI Resume Analysis:** Frontend packages the raw resume and job description. The backend validates schema constraints via `Zod`, injects a system prompt, and calls Google Gemini to return a structured match evaluation.
4. **Tool Calls via MCP:** MCP routes (`/api/mcp-tools` and `/api/careerpilot-tools`) expose server capabilities to AI agents, letting them query tracked applications or compile preparation prompts dynamically.

---

## 📡 API Endpoints

### System & Health
* `GET /api/health` — Service health verification and uptime check

### Authentication
* `POST /api/auth/register` — Create a new user profile
* `POST /api/auth/login` — Authenticate and receive a JWT

### Application Management (Protected)
* `GET /api/applications` — Retrieve all jobs tracked by the authenticated user
* `POST /api/applications` — Save a new application record
* `PUT /api/applications/:id` — Update status, dates, or company details
* `DELETE /api/applications/:id` — Delete an application record

### AI & Assistant Engine (Protected)
* `POST /api/ai/analyze` — Run resume vs. JD alignment analysis
* `POST /api/ai/interview-prep` — Generate customized interview questions and advice

### Model Context Protocol (MCP)
* `/api/mcp-tools` — Access exposed MCP web tools
* `/api/mcp-chat` — Direct MCP conversational and tool-call interactions
* `/api/careerpilot-tools` — Application-specific MCP tool definitions

---

## ⚙️ Installation and Setup

### Prerequisites
* **Node.js** (v18.x or later) & **npm**
* **MongoDB** (Local instance or MongoDB Atlas cluster connection)
* **Google Gemini API Key** (Accessible from [Google AI Studio](https://aistudio.google.com/))
* **Git**

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/pragatheeshengg-a11y/careerpilot.git
cd careerpilot
```

---

### Step 2: Configure & Start the Backend
1. Navigate to the backend directory and install dependencies:
   ```bash
   cd backend
   npm install
   ```
2. Create your `.env` configuration file:
   ```bash
   cp .env.example .env
   ```
3. Populate `.env` with your credentials:
   ```env
   PORT=5000
   CLIENT_URL=http://localhost:5173
   JWT_SECRET=replace_with_a_secure_random_string_min_32_chars
   GEMINI_API_KEY=your_gemini_api_key_here
   MONGO_URL=mongodb://127.0.0.1:27017/careerpilot
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
   *Health endpoint:* `http://localhost:5000/api/health`

---

### Step 3: Configure & Start the Frontend
1. Open a new terminal session and navigate to the frontend folder:
   ```bash
   cd frontend
   npm install
   ```
2. Create the frontend environment configuration:
   ```bash
   cp .env.example .env
   ```
3. Update the API base URL:
   ```env
   VITE_API_URL=http://localhost:5000
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *Client dashboard:* `http://localhost:5173`

---

## 🔑 Environment Variables Reference

### Backend (`backend/.env`)
| Variable | Description |
| :--- | :--- |
| `PORT` | Local port for Express API server (default: `5000`) |
| `CLIENT_URL` | Allowed origin for CORS (e.g., `http://localhost:5173`) |
| `JWT_SECRET` | Cryptographic secret used for signing authentication tokens |
| `GEMINI_API_KEY` | Google Gemini API access token |
| `MONGO_URL` | MongoDB URI connection string (Local or Atlas) |

### Frontend (`frontend/.env`)
| Variable | Description |
| :--- | :--- |
| `VITE_API_URL` | Base URL of the running backend server |

---

## 🔒 Security Best Practices

* **No Plaintext Passwords:** Passwords are fully hashed with salt rounds using `bcryptjs` before write operations to MongoDB.
* **Environment Boundaries:** Secrets and keys are never compiled into the frontend client build bundle.
* **CORS Whitelisting:** Cross-Origin Resource Sharing is locked down to trusted domains defined in `CLIENT_URL`.
* **Schema Validation:** Untrusted client bodies are parsed through strict `Zod` schemas before hitting controllers.

---

## 👨‍💻 Author

**Pragatheesh**
* GitHub: [@pragatheeshengg-a11y](https://github.com/pragatheeshengg-a11y)
* Project Repository: [careerpilot](https://github.com/pragatheeshengg-a11y/careerpilot)

---

## 📄 License & Study Disclaimer

This project is created and shared strictly for **educational, learning, and study purposes**.

```text
Educational & Study License

Copyright (c) 2026 Pragatheesh

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to inspect,
study, run, and modify the Software for educational, academic, and personal learning
purposes.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```