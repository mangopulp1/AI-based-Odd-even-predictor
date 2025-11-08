document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("prediction-form");
  const resultBox = document.getElementById("result-box");
  const resultText = document.getElementById("result-text");
  const loadingAnimation = document.getElementById("loading-animation");
  const numberInput = document.getElementById("numberInput");
  const sidebar = document.getElementById("sidebar");
  const history_page = document.getElementById("history");
  const search = document.getElementById("search");


  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    resultText.textContent = "";
    resultText.className = "result-text";
    resultBox.classList.remove("hidden");
    loadingAnimation.style.display = "block";

    try {
      const response = await fetch("/predict", 
        { method: "POST", 
          body: formData 
        });

      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

      const data = await response.json();
      loadingAnimation.style.display = "none";

      if (data.prediction) {
        const resultValue = data.prediction.toLowerCase();
        resultText.textContent = data.prediction.toUpperCase();

        if (resultValue.includes("even")) resultText.classList.add("even");
        else if (resultValue.includes("odd")) resultText.classList.add("odd");
        else resultText.classList.add("error");
      } else {
        resultText.textContent = "ERROR";
        resultText.classList.add("error");
      }
    } catch (err) {
      loadingAnimation.style.display = "none";
      resultText.textContent = "ERROR: Network or server issue";
      resultText.classList.add("error");
    }
  });

  numberInput.addEventListener("input", () => {
    numberInput.setCustomValidity(isNaN(numberInput.value) ? "Please enter a valid number" : "");
  });

  search.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const searchTerm = search.value.trim().toLowerCase();
      if (searchTerm === "history") {
        window.location.href = "/history";
      }
    }
  });
});
