from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Enable frontend requests (VERY IMPORTANT)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load trained model
model = joblib.load("model.pkl")

# Input schema
class InputData(BaseModel):
    age: int
    sex: int
    bmi: float
    children: int
    smoker: int
    region_northwest: int
    region_southeast: int
    region_southwest: int

@app.get("/")
def home():
    return {"status": "API running"}

@app.post("/predict")
def predict(data: InputData):

    features = np.array([[
        data.age,
        data.sex,
        data.bmi,
        data.children,
        data.smoker,
        data.region_northwest,
        data.region_southeast,
        data.region_southwest
    ]])

    prediction = model.predict(features)

    return {"prediction": float(prediction[0])}
