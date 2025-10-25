import joblib
import numpy as np
from sklearn.linear_model import LogisticRegression
from pathlib import Path

# --- Setup ---
BASE_DIR = Path(__file__).resolve().parent
MODELS_DIR = BASE_DIR / "models"
MODELS_DIR.mkdir(exist_ok=True)
MODEL_PATH = MODELS_DIR / "even_odd_model.pkl"

# --- Generate Data ---
X = np.array([[i] for i in range(10000)])
y = np.array([0 if i % 2 == 0 else 1 for i in range(10000)])

# --- Train Model ---
model = LogisticRegression(solver='liblinear')
model.fit(X, y)

joblib.dump(model, MODEL_PATH)
print(f"✅ Model saved at {MODEL_PATH}")
