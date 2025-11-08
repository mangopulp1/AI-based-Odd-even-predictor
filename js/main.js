document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("prediction-form");
  const resultBox = document.getElementById("result-box");
  const resultText = document.getElementById("result-text");
  const loadingAnimation = document.getElementById("loading-animation");
  const numberInput = document.getElementById("numberInput");
  const sidebar = document.getElementById("sidebar");
  const history_page = document.getElementById("history");
  const sidebarSearchInput = document.getElementById("search");
  const searchOverlay = document.getElementById("search-overlay");
  const modalSearchInput = document.getElementById("modal-search-input");



  // Only add form listener if the form exists on the page
  if (form) {
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
  }

  // Only add input listener if the input exists on the page
  if (numberInput) {
    numberInput.addEventListener("input", () => {
      numberInput.setCustomValidity(isNaN(numberInput.value) ? "Please enter a valid number" : "");
    });
  }

  // --- Search Modal Logic ---
  if (sidebarSearchInput && searchOverlay) {
    // Open modal on click
    sidebarSearchInput.addEventListener("click", () => {
      searchOverlay.classList.remove("hidden");
      // Use a timeout to ensure the element is visible before focusing
      setTimeout(() => modalSearchInput.focus(), 100);
      feather.replace(); // Re-run feather to render icons in the modal
    });

    // Function to close the modal
    const closeModal = () => {
      searchOverlay.classList.add("hidden");
    };

    // Close modal when clicking on the overlay
    searchOverlay.addEventListener("click", (e) => {
      // Only close if the overlay itself is clicked, not the modal content
      if (e.target === searchOverlay) {
        closeModal();
      }
    });

    // Close modal with the 'Escape' key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !searchOverlay.classList.contains("hidden")) {
        closeModal();
      }
    });
  }
});
