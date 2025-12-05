async function calculateETA() {
  const payload = {
    origin: document.getElementById("origin").value.trim(),
    destination: document.getElementById("destination").value.trim(),
    distance_km: parseFloat(document.getElementById("distance").value),
    mode: document.getElementById("mode").value
  };

  // Basic validation
  if (!payload.origin || !payload.destination || isNaN(payload.distance_km)) {
    alert("Please fill in all fields correctly.");
    return;
  }

  try {
    const res = await fetch("http://127.0.0.1:8000/calculate_eta", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error("Server error");

    const data = await res.json();

    document.getElementById("eta-hours").innerHTML =
      `<b>Travel Duration:</b> ${data.estimated_hours} hours`;
    document.getElementById("eta-time").innerHTML =
      `<b>ETA (UTC):</b> ${data.eta_utc}`;
    document.getElementById("result").style.display = "block";
  } catch (err) {
    alert("Failed to calculate ETA. Check console or backend server.");
    console.error(err);
  }
}