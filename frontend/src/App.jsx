import { useState, useEffect } from "react";
import "./App.css";

const REGIONS = [
  { label: "Northeast", value: "northeast" },
  { label: "Northwest", value: "northwest" },
  { label: "Southeast", value: "southeast" },
  { label: "Southwest", value: "southwest" },
];

function regionToOneHot(region) {
  return {
    region_northwest: region === "northwest" ? 1 : 0,
    region_southeast: region === "southeast" ? 1 : 0,
    region_southwest: region === "southwest" ? 1 : 0,
  };
}

function calcBmi(heightCm, weightKg) {
  const h = parseFloat(heightCm);
  const w = parseFloat(weightKg);
  if (!h || !w || h <= 0 || w <= 0) return "";
  return (w / ((h / 100) ** 2)).toFixed(2);
}

const defaultForm = {
  age: "",
  sex: "0",
  bmi: "",
  children: "0",
  smoker: "0",
  region: "northeast",
};

export default function App() {
  const [form, setForm] = useState(defaultForm);
  const [useBmiCalc, setUseBmiCalc] = useState(false);
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ageError, setAgeError] = useState("");

  // Auto-calculate BMI whenever height or weight changes
  useEffect(() => {
    if (useBmiCalc) {
      const computed = calcBmi(height, weight);
      setForm((prev) => ({ ...prev, bmi: computed }));
    }
  }, [height, weight, useBmiCalc]);

  // When user toggles OFF the calculator, clear height/weight but keep BMI value
  const handleToggleBmiCalc = () => {
    setUseBmiCalc((prev) => {
      if (prev) {
        setHeight("");
        setWeight("");
      }
      return !prev;
    });
    setPrediction(null);
    setError(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setPrediction(null);
    setError(null);
    if (name === "age") {
      setAgeError(value !== "" && parseInt(value) < 18
        ? "Age must be 18 or older to use this predictor."
        : "");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPrediction(null);

    const payload = {
      age: parseInt(form.age),
      sex: parseInt(form.sex),
      bmi: parseFloat(form.bmi),
      children: parseInt(form.children),
      smoker: parseInt(form.smoker),
      ...regionToOneHot(form.region),
    };

    if (parseInt(form.age) < 18) {
      setAgeError("Age must be 18 or older to use this predictor.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Server error: " + res.status);
      const data = await res.json();
      setPrediction(data.prediction);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const bmiCategory = () => {
    const b = parseFloat(form.bmi);
    if (!b) return null;
    if (b < 18.5) return { label: "Underweight", color: "#60a5fa" };
    if (b < 25) return { label: "Normal", color: "#34d399" };
    if (b < 30) return { label: "Overweight", color: "#fbbf24" };
    return { label: "Obese", color: "#f87171" };
  };

  const cat = bmiCategory();

  return (
    <div className="page">
      <div className="hero-bg" />
      <div className="card">
        <div className="card-header">
          <div className="icon-wrap">💊</div>
          <h1>Insurance Charge Predictor</h1>
          <p className="subtitle">Fill in your details to estimate your medical insurance cost</p>
        </div>

        <form onSubmit={handleSubmit} className="form">
          {/* Age */}
          <div className="field">
            <label htmlFor="age">Age</label>
            <input
              id="age" name="age" type="number"
              min="18" max="120" required
              placeholder="e.g. 28"
              value={form.age} onChange={handleChange}
              className={ageError ? "input-error" : ""}
            />
            {ageError && <p className="field-error">{ageError}</p>}
          </div>

          {/* BMI field + optional calculator */}
          <div className="field bmi-field">
            <div className="bmi-label-row">
              <label htmlFor="bmi">BMI</label>
              <button
                type="button"
                className={`calc-toggle ${useBmiCalc ? "active" : ""}`}
                onClick={handleToggleBmiCalc}
                title="Calculate BMI from height & weight"
              >
                {useBmiCalc ? "✖ Hide Calculator" : "📐 Don't know BMI?"}
              </button>
            </div>

            {useBmiCalc && (
              <div className="bmi-calc-box">
                <div className="bmi-calc-inputs">
                  <div className="bmi-sub-field">
                    <label htmlFor="height">Height (cm)</label>
                    <input
                      id="height" type="number" min="50" max="250"
                      placeholder="e.g. 170"
                      value={height}
                      onChange={(e) => { setHeight(e.target.value); setPrediction(null); setError(null); }}
                    />
                  </div>
                  <div className="bmi-sub-field">
                    <label htmlFor="weight">Weight (kg)</label>
                    <input
                      id="weight" type="number" min="20" max="300"
                      placeholder="e.g. 70"
                      value={weight}
                      onChange={(e) => { setWeight(e.target.value); setPrediction(null); setError(null); }}
                    />
                  </div>
                </div>
                {form.bmi && (
                  <div className="bmi-preview">
                    <span>BMI = <strong>{form.bmi}</strong></span>
                    {cat && (
                      <span className="bmi-badge" style={{ background: cat.color + "22", color: cat.color, border: `1px solid ${cat.color}55` }}>
                        {cat.label}
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}

            <input
              id="bmi" name="bmi" type="number"
              step="0.01" min="10" max="60" required
              placeholder="e.g. 22.4"
              value={form.bmi}
              onChange={handleChange}
              readOnly={useBmiCalc}
              className={useBmiCalc ? "bmi-readonly" : ""}
            />
          </div>

          {/* Children */}
          <div className="field">
            <label htmlFor="children">Children</label>
            <div className="select-wrap">
              <select id="children" name="children" value={form.children} onChange={handleChange}>
                {[0, 1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
              <span className="chevron">▾</span>
            </div>
          </div>

          {/* Sex */}
          <div className="field">
            <label htmlFor="sex">Sex</label>
            <div className="select-wrap">
              <select id="sex" name="sex" value={form.sex} onChange={handleChange}>
                <option value="0">Female</option>
                <option value="1">Male</option>
              </select>
              <span className="chevron">▾</span>
            </div>
          </div>

          {/* Smoker */}
          <div className="field">
            <label htmlFor="smoker">Smoker</label>
            <div className="select-wrap">
              <select id="smoker" name="smoker" value={form.smoker} onChange={handleChange}>
                <option value="0">No</option>
                <option value="1">Yes</option>
              </select>
              <span className="chevron">▾</span>
            </div>
          </div>

          {/* Region */}
          <div className="field">
            <label htmlFor="region">Region</label>
            <div className="select-wrap">
              <select id="region" name="region" value={form.region} onChange={handleChange}>
                {REGIONS.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
              <span className="chevron">▾</span>
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? <span className="spinner" /> : "Predict Charge"}
          </button>
        </form>

        {prediction !== null && (
          <div className="result-card">
            <p className="result-label">Estimated Annual Insurance Charge</p>
            <p className="result-value">
              ${prediction.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        )}

        {error && (
          <div className="error-card">
            <span>⚠️</span> {error}
          </div>
        )}
      </div>
    </div>
  );
}
