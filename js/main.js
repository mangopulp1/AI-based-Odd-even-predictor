document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("prediction-form");
  const resultBox = document.getElementById("result-box");
  const resultText = document.getElementById("result-text");
  const loadingAnimation = document.getElementById("loading-animation");
  const numberInput = document.getElementById("numberInput");

  const sidebar = document.getElementById("sidebar");
  const toggleBtn = document.getElementById("toggle-btn");
  let collapsed = false;

  // Sidebar toggle
  toggleBtn.addEventListener("click", () => {
    collapsed = !collapsed;
    sidebar.classList.toggle("collapsed");

    // Change icon dynamically
    toggleBtn.innerHTML = collapsed
      ? `<i data-lucide="arrow-right-from-line"></i>`
      : `<i data-lucide="arrow-left-from-line"></i>`;

    lucide.createIcons();
  });

  // Handle form submission
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);

    resultText.innerText = "";
    resultText.className = "result-text";
    resultBox.classList.remove("hidden");
    loadingAnimation.style.display = "block";

    try {
      const response = await fetch("http://127.0.0.1:8000", {
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
