import tensorflow as tf
import numpy as np
from pathlib import Path
import sys

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "models" / "even_odd_advanced_model.h5"

class EvenOddModel:
    def __init__(self, allow_decimal: bool = False):
        self.allow_decimal = allow_decimal
        self.model = self._load_model()

    def _load_model(self):
        try:
            return tf.keras.models.load_model(MODEL_PATH)
        except (FileNotFoundError, ValueError):
            print(f"❌ Model not found or invalid at {MODEL_PATH}. Training a new one...", file=sys.stderr)
            return self._train_model()

    def _train_model(self):
        X = np.array([[i] for i in range(-10000, 10001)])
        y = np.array([0 if i % 2 == 0 else 1 for i in range(-10000, 10001)]).reshape(-1, 1)

        model = tf.keras.Sequential([
            tf.keras.layers.Input(shape=(1,)),
            tf.keras.layers.Dense(64, activation='relu'),
            tf.keras.layers.BatchNormalization(),
            tf.keras.layers.Dropout(0.2),
            tf.keras.layers.Dense(32, activation='relu'),
            tf.keras.layers.BatchNormalization(),
            tf.keras.layers.Dropout(0.2),
            tf.keras.layers.Dense(16, activation='relu'),
            tf.keras.layers.BatchNormalization(),
            tf.keras.layers.Dense(1, activation='sigmoid')
        ])

        model.compile(optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
                     loss='binary_crossentropy',
                     metrics=['accuracy'])

        model.fit(X, y, epochs=20, batch_size=64, validation_split=0.2, verbose=1)

        model.save(MODEL_PATH)
        print(f"✅ Advanced model trained and saved at {MODEL_PATH}")
        return model

    def predict(self, number: str) -> str:
        if not number.strip():
            return "Please enter a number"

        try:
            num_float = float(number)
        except ValueError:
            return "Please enter a valid number"

        is_decimal_input = num_float != int(num_float)

        if self.allow_decimal and not is_decimal_input:
            return "Decimal number is required."
        elif not self.allow_decimal and is_decimal_input:
            return "Decimal input not allowed. Tick the box to enable it."

        num_for_prediction = int(num_float)

        if self.model is None:
            pred = num_for_prediction % 2
        else:
            prediction = self.model.predict(np.array([[num_for_prediction]]), verbose=0)
            pred = 0 if prediction[0][0] < 0.5 else 1

        return "EVEN" if pred == 0 else "ODD"