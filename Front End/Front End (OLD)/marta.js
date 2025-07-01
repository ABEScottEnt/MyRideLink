// Train API setup
const API_URL = '/train-proxy.php';
let trainDataFull = [];
let filteredTrainData = [];
let currentDirectionFilter = 'ALL';
let currentLineFilter = 'ALL';
let trainPage = 1;
const trainsPerPage = 10;

// Countdown timer to refresh data
let countdown = 30;
setInterval(() => {
  countdown--;
  if (countdown <= 0) {
    fetchTrainData();
    countdown = 30;
  }
  document.getElementById('refresh-seconds2').textContent = countdown;
  document.getElementById('refresh-seconds').textContent = countdown;
}, 1000);

// Fetch and handle train data
async function fetchTrainData() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    document.getElementById('line-filter').value = currentLineFilter;
    trainDataFull = data;

    applyCombinedFilters();

    // Last updated timestamp
    const now = new Date();
    const timestamp = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const updatedEl = document.getElementById('last-updated');
    if (updatedEl) updatedEl.textContent = `Last updated: ${timestamp}`;
  } catch (err) {
    console.error("Failed to fetch MARTA train data", err);
    document.getElementById('results-trains').innerHTML = "<p>Error loading info on trains.</p>";
  }
}

// Apply combined filters
function applyCombinedFilters() {
  filteredTrainData = trainDataFull.filter(train => {
    const matchesLine = currentLineFilter === 'ALL' || (train.LINE || '').toUpperCase() === currentLineFilter;
    const matchesDirection = currentDirectionFilter === 'ALL' || (train.DIRECTION || '').toUpperCase() === currentDirectionFilter;
    return matchesLine && matchesDirection;
  });
  trainPage = 1;
  renderTrainPage();
}

// Filter for line change
function filterTrainLine() {
  currentLineFilter = document.getElementById('line-filter').value.toUpperCase();
  applyCombinedFilters();
}

// Filter for direction change
function filterDirection(button) {
  document.querySelectorAll('.dir-btn').forEach(btn => btn.classList.remove('active'));
  button.classList.add('active');

  currentDirectionFilter = button.getAttribute('data-dir');
  applyCombinedFilters();
}

// Render current page of trains
function renderTrainPage() {
  const container = document.getElementById('results-trains');
  container.innerHTML = '';

  const northSection = document.createElement('div');
  const southSection = document.createElement('div');

  northSection.innerHTML = `<h2 style="text-align:center;">Northbound</h2>`;
  southSection.innerHTML = `<h2 style="text-align:center;">Southbound</h2>`;

  const northbound = filteredTrainData.filter(train => train.DIRECTION === 'N');
  const southbound = filteredTrainData.filter(train => train.DIRECTION === 'S');

  [ { list: northbound, container: northSection },
    { list: southbound, container: southSection }
  ].forEach(group => {
    const start = (trainPage - 1) * trainsPerPage;
    const end = start + trainsPerPage;
    const pageData = group.list.slice(start, end);

    pageData.forEach(train => {
      const line = (train.LINE || '').trim().toLowerCase();

      const card = document.createElement('div');
      card.classList.add('card', 'train-card');
      if (['red', 'gold', 'blue', 'green'].includes(line)) {
        card.classList.add(line);
      }

      card.innerHTML = `
        <h3 class="station-name">
          <span class="line-circle ${line}"></span>
          ${train.STATION || ''} (${train.LINE || ''} Line)
        </h3>
        <p><strong>Next Arrival:</strong> <span class="next-arrival">${train.NEXT_ARR || ''}</span></p>
        <p><strong>Waiting Time:</strong> <span class="waiting-time">${train.WAITING_TIME || ''}</span></p>
        <p><strong>Destination:</strong> <span class="destination">${train.DESTINATION || ''}</span></p>
        <p><strong>Train ID:</strong> <span class="train-id">${train.TRAIN_ID || ''}</span></p>
      `;

      group.container.appendChild(card);
    });
  });

  if (northbound.length > 0) {
    container.appendChild(northSection);
  }
  
  if (southbound.length > 0) {
    container.appendChild(southSection);
  }

  document.getElementById('train-page-info').textContent = `Page ${trainPage}`;
  const pageInfo2 = document.getElementById('train-page-info2');
  if (pageInfo2) pageInfo2.textContent = `Page ${trainPage}`;

  lucide.createIcons();
}

// Next/Prev page button
function changeTrainPage(direction) {
  const maxPage = Math.ceil(filteredTrainData.length / trainsPerPage);
  trainPage += direction;
  if (trainPage < 1) trainPage = 1;
  if (trainPage > maxPage) trainPage = maxPage;

  renderTrainPage();

  document.getElementById('results-trains').scrollIntoView({ behavior: 'smooth' });
}

// Run on load
fetchTrainData();
