# 🏥 Insurance Charge Predictor  
(https://insurancechargepredictions.onrender.com/)

> A full-stack Machine Learning web application that estimates annual medical insurance charges based on personal health and demographic data.

![Python](https://img.shields.io/badge/Python-3.10+-blue?logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-green?logo=fastapi)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)
![Model Accuracy](https://img.shields.io/badge/Model%20Accuracy-87%25-brightgreen)

---

## 📌 Project Overview

This project predicts **medical insurance charges** using a supervised machine learning model trained on real-world insurance data. The user fills out a simple form on the React frontend, which sends the data to a **FastAPI** backend that runs the ML model and returns the estimated annual charge.

---

## ✨ Features

- 🔮 **Real-time insurance cost prediction** powered by a trained ML model
- 📐 **Optional BMI Calculator** — enter height & weight to auto-calculate BMI
- 🏷️ **BMI Category Badge** — live feedback (Underweight / Normal / Overweight / Obese)
- 🌍 **Region Dropdown** — select from Northeast, Northwest, Southeast, Southwest
- 🔞 **Age Validation** — inline error shown if age is below 18
- 🎨 **Premium Dark UI** — glassmorphism design with animated gradient background
- ⚡ **Hot-reloaded Frontend** via Vite

---

## 🧠 Machine Learning Model

| Property | Detail |
|---|---|
| **Algorithm** | Supervised Regression (scikit-learn) |
| **Model File** | `model.pkl` (loaded via `joblib`) |
| **Accuracy** | **87%** |
| **Input Features** | Age, Sex, BMI, Children, Smoker, Region |
| **Target** | Annual Insurance Charge (USD) |

### Feature Encoding

| Feature | Type | Encoding |
|---|---|---|
| `age` | Integer | Raw value |
| `sex` | Binary | `0` = Female, `1` = Male |
| `bmi` | Float | Raw value |
| `children` | Integer | Raw value (0–5) |
| `smoker` | Binary | `0` = No, `1` = Yes |
| `region` | Categorical | One-hot encoded |

**Region one-hot encoding:**
- Northeast → `region_northwest=0, region_southeast=0, region_southwest=0` (baseline)
- Northwest → `region_northwest=1, region_southeast=0, region_southwest=0`
- Southeast → `region_northwest=0, region_southeast=1, region_southwest=0`
- Southwest → `region_northwest=0, region_southeast=0, region_southwest=1`

---

## 🗂️ Project Structure

```
insurance_charge/
├── main.py                  # FastAPI backend (prediction API)
├── requirements.txt         # Python dependencies
├── model.pkl                # Trained ML model (joblib)
└── frontend/                # React + Vite frontend
    ├── index.html
    ├── package.json
    └── src/
        ├── main.jsx
        ├── App.jsx          # Main form component
        ├── App.css          # Dark glassmorphism styles
        └── index.css        # Global reset
```

---

## 🚀 Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- npm

---

### 1️⃣ Backend Setup (FastAPI)

```bash
# Navigate to the project folder
cd insurance_charge

# (Recommended) Create and activate a virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

# Install Python dependencies
pip install -r requirements.txt

# Start the FastAPI server
python -m uvicorn main:app --reload
```

The API will be live at: **`http://127.0.0.1:8000`**

You can explore the auto-generated API docs at: **`http://127.0.0.1:8000/docs`**

---

### 2️⃣ Frontend Setup (React + Vite)

```bash
# Open a new terminal and navigate to the frontend folder
cd insurance_charge/frontend

# Install dependencies (only needed once)
npm install

# Start the development server
npm run dev
```

The app will open at: **`http://localhost:5173`**

---

## 🔌 API Reference

### `GET /`
Health check — returns API status.

**Response:**
```json
{ "status": "API running" }
```

---

### `POST /predict`
Returns the predicted annual insurance charge.

**Request body:**
```json
{
  "age": 28,
  "sex": 1,
  "bmi": 22.4,
  "children": 0,
  "smoker": 0,
  "region_northwest": 0,
  "region_southeast": 0,
  "region_southwest": 1
}
```

**Response:**
```json
{ "prediction": 3456.78 }
```

---

## 🖥️ Frontend UI Guide

| Field | Options | Notes |
|---|---|---|
| Age | Number (≥ 18) | Shows error if below 18 |
| BMI | Number | Can be entered directly or calculated |
| Height & Weight | cm / kg | Optional — auto-calculates BMI |
| Children | 0 – 5 | Dropdown |
| Sex | Female / Male | Dropdown |
| Smoker | No / Yes | Dropdown |
| Region | Northeast / Northwest / Southeast / Southwest | Dropdown |

---

## 📦 Dependencies

### Backend
| Package | Purpose |
|---|---|
| `fastapi` | Web framework for the REST API |
| `uvicorn` | ASGI server to run FastAPI |
| `pydantic` | Data validation for request bodies |
| `scikit-learn` | Machine learning model |
| `joblib` | Model serialization / loading |
| `numpy` | Numerical computation |

### Frontend
| Package | Purpose |
|---|---|
| `react` | UI library |
| `vite` | Build tool and dev server |

---

## 📄 License

This project is for educational and demonstration purposes.


