async function fetchUberData() {
    const pickup = document.getElementById("pickup").value;
    const dropoff = document.getElementById("dropoff").value;
    const ridesContainer = document.getElementById("rides");
  
    if (!pickup || !dropoff) {
      alert("Please enter both pickup and dropoff locations.");
      return;
    }
  
    ridesContainer.innerHTML = "<p>Loading rides...</p>";
  
    try {
      const res = await fetch(`/api/uber?pickup=${encodeURIComponent(pickup)}&dropoff=${encodeURIComponent(dropoff)}`);
      const data = await res.json();
      ridesContainer.innerHTML = "";
  
      data.rides.forEach(ride => {
        const rideDiv = document.createElement("div");
        rideDiv.className = "ride-card";
        rideDiv.innerHTML = `
          <h2>${ride.name}</h2>
          <p>ETA: ${ride.eta} minutes</p>
          <p>Price: ${ride.price}</p>
          <a href="${ride.deepLink}" target="_blank">Book Now</a>
        `;
        ridesContainer.appendChild(rideDiv);
      });
    } catch (err) {
      ridesContainer.innerHTML = "<p>Failed to load rides. Try again later.</p>";
      console.error(err);
    }
  }
  