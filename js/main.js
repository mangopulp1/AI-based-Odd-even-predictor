document.addEventListener("DOMContentLoaded", () => {
  
  const form = document.getElementById("prediction-form");
  const resultBox = document.getElementById("result-box");
  const resultText = document.getElementById("result-text");
  const loadingAnimation = document.getElementById("loading-animation");
  const numberInput = document.getElementById("numberInput");
  const sidebar = document.getElementById("sidebar");
  const toggleBtn = document.getElementById("toggle-btn");

  let isCollapsed = false;

  const setToggleIcon = (name) => {
    toggleBtn.innerHTML = `<i data-feather="${name}"></i>`;
    if (window.feather)
      feather.replace({
        attr: 
        { 
          "stroke-width": 0.7,
          width : 10,
          height : 10
        },
      });
  };

  // initial icon
  setToggleIcon("code");

  toggleBtn.addEventListener("click", () => {
    isCollapsed = !isCollapsed;
    sidebar.classList.toggle("collapsed");
    const iconName = isCollapsed ? "code" : "code";
    setToggleIcon(iconName);
    toggleBtn.style.transform = isCollapsed
      ? "translateX(4px)"
      : "translateX(0)";
  });

  // form handling
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);

    resultText.innerText = "";
    resultText.className = "result-text";
    resultBox.classList.remove("hidden");
    loadingAnimation.style.display = "block";

    try {
      const response = await fetch("/predict", { method: "POST", body: formData });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      loadingAnimation.style.display = "none";

      if (data.prediction) {
        const resultValue = String(data.prediction).toLowerCase();
        resultText.innerText = String(data.prediction).toUpperCase();

        if (resultValue.includes("even")) resultText.classList.add("even");
        else if (resultValue.includes("odd")) resultText.classList.add("odd");
        else resultText.classList.add("error");
      } else {
        resultText.innerText = "ERROR";
        resultText.classList.add("error");
      }
    } catch (err) {
      console.error("Prediction failed:", err);
      loadingAnimation.style.display = "none";
      resultText.innerText = "ERROR: Network or server issue";
      resultText.className = "result-text error";
    }
  });

  // input validation
  if (numberInput) {
    numberInput.addEventListener("input", () => {
      if (numberInput.value && isNaN(numberInput.value)) {
        numberInput.setCustomValidity("Please enter a valid number");
      } else {
        numberInput.setCustomValidity("");
      }
    });
  }
});
