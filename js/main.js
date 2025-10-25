document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("prediction-form");
    const resultBox = document.getElementById("result-box");
    const resultText = document.getElementById("result-text");
    const loadingAnimation = document.getElementById("loading-animation");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData(form);

        // Reset UI
        resultText.innerText = "";
        resultText.className = "result-text";
        resultBox.classList.remove("hidden");
        loadingAnimation.style.display = "block";

        try {
            const response = await fetch("/predict", {
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
                else if (resultValue.includes("decimal")) resultText.classList.add("decimal");
                else if (resultValue.includes("integer")) resultText.classList.add("integer");
                else resultText.classList.add("error");
            } else {
                resultText.innerText = "ERROR";
                resultText.classList.add("error");
            }
        } catch (error) {
            console.error("Prediction failed:", error);
            loadingAnimation.style.display = "none";
            resultText.innerText = "ERROR";
            resultText.className = "result-text error";
        }
    });
});
