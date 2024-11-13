const circle = document.getElementById('circle');
const icons = document.querySelectorAll('.icon');
let iconCoordinates = {}; // Stores coordinates for each icon

// Add drag-and-drop functionality
icons.forEach(icon => {
  icon.addEventListener('dragstart', dragStart);
  icon.addEventListener('dragend', dragEnd);
});

circle.addEventListener('dragover', (event) => {
  event.preventDefault(); // Allows dropping
});

circle.addEventListener('drop', dropIcon);

function dragStart(event) {
  event.dataTransfer.setData('text', event.target.id);
}

function dropIcon(event) {
  event.preventDefault();
  const iconId = event.dataTransfer.getData('text');
  const icon = document.getElementById(iconId);

  // Position the icon inside the circle
  const circleRect = circle.getBoundingClientRect();
  const iconSize = icon.getBoundingClientRect().width / 2;

  const x = event.clientX - circleRect.left - iconSize;
  const y = event.clientY - circleRect.top - iconSize;

  // Update icon position
  icon.style.position = 'absolute';
  icon.style.left = `${x}px`;
  icon.style.top = `${y}px`;
  circle.appendChild(icon);

  // Save coordinates relative to circle center
  const relativeX = x + iconSize - circleRect.width / 2;
  const relativeY = y + iconSize - circleRect.height / 2;
  iconCoordinates[iconId] = { x: relativeX, y: relativeY };
}

function dragEnd(event) {
  event.target.style.cursor = 'grab';
}

// Send coordinates to the server and save them as a CSV file


function saveCoordinates() {
  // Prepare data to send
  const coordinates = [];
  Object.keys(iconCoordinates).forEach(iconId => {
    const { x, y } = iconCoordinates[iconId];
    coordinates.push({ id: iconId, x: x, y: y });
  });

  console.log('Sending coordinates:', coordinates); // Log data to check

  // Send data to the server via POST request
  fetch('/save-coordinates', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(coordinates),
  })
  .then(response => response.json())
  .then(data => {
    alert('Data saved successfully!');
  })
  .catch(error => {
    console.error('Error:', error); // Log error to the console
    alert('Error saving data');
  });
}
