document.addEventListener('DOMContentLoaded', () => {
  const iconsData = [
    '🍎', '🍌', '👟', '🔬', '📱', '🍇', '🍉', '👓', '🖥️', '📚', 
    '🛋️', '🚗', '🖍️', '🖼️', '🎮', '🏠', '⚽', '🧳', '🏀', '🌍', 
    '🍔', '🍕', '🎵', '🎧', '🌟', '🏖️'
  ];

  const iconsContainer = document.querySelector('.icons');
  const circle = document.querySelector('.circle');
  const submitBtn = document.getElementById('submitBtn');
  const participantIdInput = document.getElementById('participantId');
  
  let iconPositions = [];

  // Dynamically add icons to the pool
  iconsData.forEach(icon => {
    const iconElement = document.createElement('div');
    iconElement.classList.add('icon');
    iconElement.innerText = icon;
    iconElement.draggable = true;

    // Allow dragging of the icon
    iconElement.addEventListener('dragstart', function (e) {
      e.target.style.opacity = '0.5';  // Optional: make the dragged icon semi-transparent
      setTimeout(() => {
        e.target.style.display = 'none';  // Hide the dragged icon temporarily
      }, 0);
    });

    // When icon is dropped inside the circle, place it
    iconElement.addEventListener('dragend', function (e) {
      e.target.style.display = 'block';  // Show the dragged icon again in the pool
      e.target.style.opacity = '1';  // Reset the opacity to normal
    });

    iconsContainer.appendChild(iconElement);
  });

  // Allow dropping inside the circle
  circle.addEventListener('dragover', (e) => {
    e.preventDefault();
  });

  // Drop Event: Place the icon inside the circle
  circle.addEventListener('drop', (e) => {
    e.preventDefault();
    const icon = e.dataTransfer.getData('text');
    const iconElement = document.createElement('div');
    iconElement.classList.add('icon');
    iconElement.innerText = icon;
    iconElement.style.position = 'absolute';
    iconElement.style.left = `${e.offsetX - 25}px`;
    iconElement.style.top = `${e.offsetY - 25}px`;
    circle.appendChild(iconElement);

    // Store the coordinates of the dropped icon
    iconPositions.push({ icon, x: e.offsetX, y: e.offsetY });

    // Enable the item to be draggable again inside the circle
    iconElement.draggable = true;

    // Allow moving the icon after it's been dropped
    iconElement.addEventListener('dragstart', function (e) {
      e.target.style.opacity = '0.5';
      setTimeout(() => {
        e.target.style.display = 'none';
      }, 0);
    });

    // Drag over event to enable re-positioning within the circle
    circle.addEventListener('dragover', function (e) {
      e.preventDefault();
    });

    // Drop event to update position inside the circle
    circle.addEventListener('drop', function (e) {
      e.preventDefault();
      const draggedIcon = e.target;
      draggedIcon.style.left = `${e.offsetX - 25}px`;
      draggedIcon.style.top = `${e.offsetY - 25}px`;

      // Update the coordinates in iconPositions array
      const index = iconPositions.findIndex(item => item.icon === draggedIcon.innerText);
      if (index !== -1) {
        iconPositions[index].x = e.offsetX;
        iconPositions[index].y = e.offsetY;
      }
    });
  });

  // Submit button click event
  submitBtn.addEventListener('click', () => {
    const participantId = participantIdInput.value;

    if (participantId && iconPositions.length === iconsData.length) {
      // Send data to the server (GitHub Actions)
      fetch('https://api.github.com/repos/your-username/your-repository/dispatches', {
        method: 'POST',
        headers: {
          'Authorization': `token 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`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          event_type: 'save-coordinates',
          client_payload: { participantId, iconPositions }
        })
      })
      .then(response => response.json())
      .then(data => alert('Data saved successfully!'))
      .catch(error => alert('Error saving data'));
    } else {
      alert('Please complete the task and enter your ID.');
    }
  });
});
