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
  const resultsContainer = document.querySelector('.search-modal-results');
  const confidencePercentage = document.querySelector('.confidence-percentage');
  const confidenceFill = document.querySelector('.confidence-progress-fill');
  let currentConfidence = 0;

  


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

        // Update confidence if it exists in the response
        // Assuming the backend sends a value between 0 and 1 (e.g., 0.87)
        if (data.confidence !== undefined) updateConfidence(data.confidence);
  
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

  // --- Confidence Indicator Logic ---
  const updateConfidence = (newConfidence) => {
    const targetPercent = Math.round(newConfidence * 100);
    // Always start animation from 0 for a new prediction
    const startPercent = 0;
    currentConfidence = targetPercent;

    // Animate the progress bar width
    if (confidenceFill) {
      // Temporarily reset width to 5% (minimum visible) to ensure animation plays from start
      confidenceFill.style.width = '5%';
      // Force reflow to ensure the browser registers the reset before applying the new width
      void confidenceFill.offsetWidth;
      // Then set to target width, ensuring it doesn't go below 5%
      confidenceFill.style.width = `${Math.max(targetPercent, 5)}%`;
    }

    // Animate the percentage text count-up
    if (confidencePercentage) {
      let currentDisplayPercent = startPercent;
      const step = (targetPercent - startPercent) / 50; // Animate over ~50 frames

      // Clear any existing interval to prevent multiple animations running simultaneously
      if (confidencePercentage.dataset.animationInterval) {
        clearInterval(parseInt(confidencePercentage.dataset.animationInterval));
      }

      const counter = setInterval(() => {
        currentDisplayPercent += step;
        if ((step > 0 && currentDisplayPercent >= targetPercent) || (step < 0 && currentDisplayPercent <= targetPercent)) {
          clearInterval(counter);
          confidencePercentage.textContent = `${targetPercent}%`;
        } else {
          confidencePercentage.textContent = `${Math.round(currentDisplayPercent)}%`;
        }
      }, 20); // Update every 20ms for a smooth count-up
      confidencePercentage.dataset.animationInterval = counter.toString(); // Store interval ID
    }
  }

    // --- Search Modal Logic ---
    let selectedIndex = -1;

    // Function to close the modal
    const closeModal = () => {
        searchOverlay.classList.add("hidden");
        modalSearchInput.value = '';
        filterResults(''); // Reset filter
        document.body.style.overflow = '';
    };

    // Function to open the modal
    const openModal = () => {
        searchOverlay.classList.remove("hidden");
        modalSearchInput.focus();
        document.body.style.overflow = 'hidden';
        feather.replace(); // Ensure icons are rendered
    };

    const updateSelection = () => {
        const items = resultsContainer.querySelectorAll('.result-item:not([style*="display: none"])');
        items.forEach((item, index) => {
            if (index === selectedIndex) {
                item.classList.add('selected');
                item.scrollIntoView({ block: 'nearest' });
            } else {
                item.classList.remove('selected');
            }
        });
    };

    const filterResults = (query) => {
        const items = resultsContainer.querySelectorAll('.result-item');
        const lowerCaseQuery = query.toLowerCase();
        let hasVisibleItems = false;

        items.forEach(item => {
            const text = item.textContent.toLowerCase();
            if (text.includes(lowerCaseQuery)) {
                item.style.display = 'flex';
                hasVisibleItems = true;
            } else {
                item.style.display = 'none';
            }
        });
        
        selectedIndex = hasVisibleItems ? 0 : -1;
        updateSelection();
    };

    if (sidebarSearchInput) {
        sidebarSearchInput.addEventListener('click', openModal);
        sidebarSearchInput.addEventListener('keydown', (e) => e.preventDefault());
    }

    if (searchOverlay) {
        searchOverlay.addEventListener('click', (e) => {
            if (e.target === searchOverlay) closeModal();
        });
    }

    if (modalSearchInput) {
        modalSearchInput.addEventListener('input', () => filterResults(modalSearchInput.value));

        modalSearchInput.addEventListener('keydown', (e) => {
            const items = Array.from(resultsContainer.querySelectorAll('.result-item:not([style*="display: none"])'));
            if (items.length === 0) return;

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                selectedIndex = (selectedIndex + 1) % items.length;
                updateSelection();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                selectedIndex = (selectedIndex - 1 + items.length) % items.length;
                updateSelection();
            } else if (e.key === 'Enter' && selectedIndex > -1) {
                e.preventDefault();
                if (items[selectedIndex]) items[selectedIndex].click();
            }
        });
    }

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !searchOverlay.classList.contains("hidden")) {
        closeModal();
      }
    });

    // --- Keyboard shortcut for Sidebar Search ---
    document.addEventListener("keydown", (e) => {
        // Check if user is typing in an input, textarea, or select
        const activeElement = document.activeElement;
        const isTyping = ['INPUT', 'TEXTAREA', 'SELECT'].includes(activeElement.tagName);

        // If '/' or 'k' is pressed and user is not typing, focus the sidebar search
        if (!isTyping && (e.key === '/' || e.key.toLowerCase() === 'k')) {
            // Prevent default browser action (like quick find in Firefox)
            e.preventDefault();
            
            if (sidebarSearchInput) {
                sidebarSearchInput.focus();
            }
        }
    });
});
