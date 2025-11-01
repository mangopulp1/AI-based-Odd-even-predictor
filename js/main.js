document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("prediction-form");
  const resultBox = document.getElementById("result-box");
  const resultText = document.getElementById("result-text");
  const loadingAnimation = document.getElementById("loading-animation");
  const numberInput = document.getElementById("numberInput");
  const sidebar = document.getElementById("sidebar");
  const toggleBtn = document.getElementById("toggle-btn");
  const history_page = document.getElementById("history");

  let isCollapsed = false;

  const setToggleIcon = (name) => {
    toggleBtn.innerHTML = `<i data-feather="${name}"></i>`;
    feather.replace();
  };

  setToggleIcon("columns");

  toggleBtn.addEventListener("click", () => {
    isCollapsed = !isCollapsed;
    sidebar.classList.toggle("collapsed");
    setToggleIcon("columns");
  });

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

  history_page.addEventListener("click", async () => {
      const response = await fetch("/history", 
        { 
          method: "GET"
        });
      const html = await response.text();
      document.querySelector(".main-content").innerHTML = html;

  });
});
