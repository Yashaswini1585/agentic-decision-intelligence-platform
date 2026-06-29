## Team Details

**Team Name:** Agentic Decision Intelligence Platform

### Team Members

- Kankanala Anushna
- Yashaswini
- Siri Chandhana

---
## Overview

The **Agentic Decision Intelligence Platform** is an AI-powered web application that helps businesses make intelligent decisions by analyzing customer information, business documents, CRM data, and meeting notes. The platform leverages multiple AI agents to process inputs, generate recommendations, perform business analysis, and provide explainable insights through an interactive dashboard.

---
## GitHub Repository

Repository Link:

https://github.com/Yashaswini1585/agentic-decision-intelligence-platform

---

## Features

- Multi-Agent AI Architecture
- Intelligent Business Analysis
- CRM Data Integration
- Knowledge Base Search
- Memory-Based Recommendations
- AI-Powered Decision Support
- Explainable Recommendations
- Modern Responsive Dashboard
- FastAPI Backend
- MongoDB Database Integration

---
## Architecture

```text
                 User
                   │
                   ▼
         Upload Business Input
   (Meeting Notes / Customer Data)
                   │
                   ▼
            Input Processing Agent
                   │
                   ▼
              Planner Agent
                   │
        ┌──────────┼──────────┐
        ▼          ▼          ▼
   CRM Agent   Knowledge   Memory Agent
                  Agent
        └──────────┼──────────┘
                   ▼
      Business Analysis Agent
                   │
                   ▼
      Recommendation Agent
                   │
                   ▼
        Explanation Agent
                   │
                   ▼
        Decision Dashboard
                   │
                   ▼
     Notifications & CRM Update
```
---
## Screenshots

### 1. Persona Selection

Users can choose their role (Customer Success Manager or Sales Manager) to access role-specific AI workflows.

<img width="1600" height="737" alt="image" src="https://github.com/user-attachments/assets/55a936a2-aa84-49d4-bf20-879d7c3dae89" />

---

### 2. Decision Control Dashboard

Upload meeting notes or business documents and monitor document ingestion, AI agent configuration, and processing status.

<img width="1600" height="731" alt="image" src="https://github.com/user-attachments/assets/301a0efa-8a8b-4222-a35e-c90e0dd1c286" />

---

### 3. Agent Pipeline Execution

Displays the Planner Agent's execution strategy, selected AI agents, orchestration path, and confidence level.

<img width="1600" height="737" alt="image" src="https://github.com/user-attachments/assets/b327e274-240d-40c8-b0b4-c2c458bcd4db" />

---

### 4. Agent Execution Trace

Live monitoring of each AI agent, execution logs, processing milestones, and autonomous decision workflow.

<img width="1600" height="727" alt="image" src="https://github.com/user-attachments/assets/7d4269a5-5d37-449d-a1c1-6640068aabea" />

---

### 5. Recommendation & Analysis Results

Shows business analysis, strategic recommendations, confidence score, and human approval interface.

<img width="1600" height="722" alt="image" src="https://github.com/user-attachments/assets/6550e936-3917-4642-9ea8-53b481272f5c" />

---

### 6. Platform Evaluation Summary

Displays execution metrics, AI confidence, latency, adoption rate, and historical decision records.

<img width="1600" height="728" alt="image" src="https://github.com/user-attachments/assets/f79c3c37-431d-4a15-a4dc-697d0738a9f7" />

## Project Structure

```
agentic-decision-intelligence-platform
│
├── backend/
│   ├── app/
│   ├── requirements.txt
│   └── README.md
│
├── public/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── routes/
│   └── assets/
│
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

---

## Prerequisites

Before running the project, install the following software:

- Git
- Python 3.10 or later
- Node.js (v18 or later recommended)
- npm
- MongoDB

Verify the installation:

```bash
git --version
python3 --version
node -v
npm -v
```

---

## Clone the Repository

```bash
git clone https://github.com/Yashaswini1585/agentic-decision-intelligence-platform.git
cd agentic-decision-intelligence-platform
```

---

## Backend Setup

## Step 1: Navigate to the Backend Folder

```bash
cd backend
```

## Step 2: Create a Virtual Environment

### macOS / Linux

```bash
python3 -m venv .venv
```

### Windows

```bash
python -m venv .venv
```

---

## Step 3: Activate the Virtual Environment

### macOS / Linux

```bash
source .venv/bin/activate
```

### Windows

```bash
.venv\Scripts\activate
```

---

## Step 4: Install Dependencies

```bash
pip install -r requirements.txt
```

---

## Step 5: Start MongoDB

Make sure MongoDB is running locally.

Default MongoDB connection:

```
mongodb://localhost:27017
```

---

## Step 6: Run the Backend Server

```bash
uvicorn app.main:app --reload
```

Backend URL:

```
http://127.0.0.1:8000
```

API Documentation (Swagger UI):

```
http://127.0.0.1:8000/docs
```

---

## Frontend Setup

Open a new terminal.

Navigate to the project root:

```bash
cd agentic-decision-intelligence-platform
```

Install frontend dependencies:

```bash
npm install
```

Run the frontend server:

```bash
npm run dev
```

Frontend URL:

```
http://localhost:5173
```

---

## Running the Complete Application

### Terminal 1 – Backend

```bash
cd backend
source .venv/bin/activate
uvicorn app.main:app --reload
```

### Terminal 2 – Frontend

```bash
npm install
npm run dev
```

Open the following URLs in your browser:

### Frontend

```
http://localhost:5173
```

### Backend

```
http://127.0.0.1:8000
```

### API Documentation

```
http://127.0.0.1:8000/docs
```

---

## Troubleshooting

### Backend dependencies not installed

```bash
pip install -r requirements.txt
```

---

### Frontend dependencies missing

```bash
npm install
```

---

### Port 8000 already in use

macOS / Linux

```bash
lsof -i :8000
kill -9 <PID>
```

---

### Virtual Environment Activation

macOS / Linux

```bash
source .venv/bin/activate
```

Windows

```bash
.venv\Scripts\activate
```

---

## Future Enhancements

- Authentication and Authorization
- Role-Based Access Control
- Cloud Deployment
- Real-Time Notifications
- Advanced AI Agent Collaboration
- Analytics Dashboard
- Multi-Database Support

---

## Additional Notes

- This project demonstrates an enterprise-grade Agentic AI platform for intelligent business decision support.
- The current implementation focuses on SaaS Customer Success and Sales Management workflows.
- The Planner Agent dynamically selects the required AI agents based on business context.
- Human-in-the-loop approval ensures transparency and governance before recommendations are finalized.
- The platform is designed to be reusable and can be extended to domains such as Healthcare, Finance, HR, and Supply Chain.

