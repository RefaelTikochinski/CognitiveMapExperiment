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

// Convert data to CSV format and download
function saveCoordinates() {
  // Create CSV data
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "Icon,Relative X,Relative Y\n"; // CSV header

  Object.keys(iconCoordinates).forEach(iconId => {
    const { x, y } = iconCoordinates[iconId];
    csvContent += `${iconId},${x},${y}\n`;
  });

  // Create a downloadable link for the CSV file
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "cognitive_map_coordinates.csv");
  document.body.appendChild(link); // Required for Firefox

  link.click();
  document.body.removeChild(link); // Clean up the link element
}
