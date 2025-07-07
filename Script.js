const apiKey = "69f0de05-36c8-4516-a4a2-cd26c2c00d4a";
const apiUrl = `https://developerservices.itsmarta.com:18096/itsmarta/railrealtimearrivals/developerservices/traindata?apiKey=${apiKey}`;
let allTrainData = [];

const stationCoords = {
  "Airport": [33.6407, -84.4467],
  "Midtown": [33.7810, -84.3867],
  "Five Points": [33.7538, -84.3915],
  "North Springs": [34.0321, -84.3566]
};

const map = L.map('map').setView([33.76, -84.39], 11);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

function showLoading() {
  document.getElementById('transitList').innerHTML = '<p>Loading train data...</p>';
}

function displayTransit(data) {
  const list = document.getElementById('transitList');
  list.innerHTML = '';

  if (window.currentMarkers) {
    window.currentMarkers.forEach(marker => map.removeLayer(marker));
  }
  window.currentMarkers = [];

  data.forEach(({ Line, Station, WaitingTime, Destination }) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <h3>${Line} Line</h3>
      <p><strong>Station:</strong> ${Station}</p>
      <p><strong>To:</strong> ${Destination}</p>
      <p><strong>Arrival:</strong> ${WaitingTime}</p>
    `;
    list.appendChild(card);

    if (stationCoords[Station]) {
      const marker = L.circleMarker(stationCoords[Station], {
        radius: 6,
        fillColor: '#f68b1f',
        color: '#003366',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.9
      }).addTo(map).bindPopup(`<strong>${Station}</strong><br>${Line} to ${Destination}<br>Arrival: ${WaitingTime}`);
      window.currentMarkers.push(marker);
    }
  });

  document.getElementById('lastUpdated').textContent = `Last updated: ${new Date().toLocaleTimeString()}`;
}

async function fetchTrainData() {
  showLoading();
  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      },
      mode: 'cors'
    });
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    allTrainData = data;
    applyFilter();
  } catch (error) {
    console.error('Error fetching data:', error);
    document.getElementById('transitList').innerHTML = '<p style="color:red">Unable to fetch transit data. Please try again later.</p>';
  }
}

function applyFilter() {
  const selected = document.getElementById('lineFilter').value;
  const filtered = selected === 'all' ? allTrainData : allTrainData.filter(t => t.Line === selected);
  displayTransit(filtered);
}

document.getElementById('fetchButton').addEventListener('click', () => {
  fetchTrainData();
});

// Initial load
fetchTrainData();
setInterval(fetchTrainData, 30000);
