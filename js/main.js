document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("prediction-form");
    const resultBox = document.getElementById("result-box");
    const resultText = document.getElementById("result-text");
    const loadingAnimation = document.getElementById("loading-animation");
    const numberInput = document.getElementById("numberInput");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData(form);

        // Reset UI
        resultText.innerText = "";
        resultText.className = "result-text";
        resultBox.classList.remove("hidden");
        loadingAnimation.style.display = "block";

        try {
            const response = await fetch("http://localhost:8000/predict", {
                method: "POST",
                body: formData
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const data = await response.json();

            loadingAnimation.style.display = "none";

            if (data.prediction) {
                const resultValue = data.prediction.toLowerCase();
                resultText.innerText = data.prediction.toUpperCase();

                if (resultValue.includes("even")) resultText.classList.add("even");
                else if (resultValue.includes("odd")) resultText.classList.add("odd");
                else resultText.classList.add("error");
            } else {
                resultText.innerText = "ERROR";
                resultText.classList.add("error");
            }
        } catch (error) {
            console.error("Prediction failed:", error);
            loadingAnimation.style.display = "none";
            resultText.innerText = "ERROR: Network or server issue";
            resultText.className = "result-text error";
        }
    });

    // Real-time input validation
    numberInput.addEventListener("input", () => {
        if (numberInput.value && isNaN(numberInput.value)) {
            numberInput.setCustomValidity("Please enter a valid number");
        } else {
            numberInput.setCustomValidity("");
        }
    });
});