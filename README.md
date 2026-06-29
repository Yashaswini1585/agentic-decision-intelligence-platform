# Agentic Decision Intelligence Platform

## Overview

The **Agentic Decision Intelligence Platform** is an AI-powered web application that helps businesses make intelligent decisions by analyzing customer information, business documents, CRM data, and meeting notes. The platform leverages multiple AI agents to process inputs, generate recommendations, perform business analysis, and provide explainable insights through an interactive dashboard.

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

# Prerequisites

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

# Clone the Repository

```bash
git clone https://github.com/Yashaswini1585/agentic-decision-intelligence-platform.git
cd agentic-decision-intelligence-platform
```

---

# Backend Setup

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

# Frontend Setup

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

# Running the Complete Application

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

# Troubleshooting

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

