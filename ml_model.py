import joblib
import numpy as np
from pathlib import Path
import sys

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "models" / "even_odd_model.pkl"

class EvenOddModel:
    def __init__(self, allow_decimal: bool = False):
        self.allow_decimal = allow_decimal
        self.model = None
        try:
            self.model = joblib.load(MODEL_PATH)
        except FileNotFoundError:
            print(f"❌ Model not found at {MODEL_PATH}. Run train_model.py first.", file=sys.stderr)

    def predict(self, number: str) -> str:
        if not number.strip():
            return "Please enter a number"

        try:
            num_float = float(number)
        except ValueError:
            return "Please enter a number"

        is_decimal_input = num_float != int(num_float)

        if is_decimal_input and not self.allow_decimal:
            return "Error: Decimal input not allowed. Tick the box to enable it."

        if self.allow_decimal and not is_decimal_input:
            return "Decimal number is required."

        num_for_prediction = int(num_float)

        if self.model is None:
            pred = num_for_prediction % 2
        else:
            prediction_array = self.model.predict(np.array([[num_for_prediction]]))
            pred = prediction_array.item()

        return "EVEN" if pred == 0 else "ODD"
