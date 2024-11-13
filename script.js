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

    // Remove icon from pool when dragging starts
    iconElement.addEventListener('dragstart', function (e) {
      e.target.style.opacity = '0.5';  // Optional: make the dragged icon semi-transparent
      setTimeout(() => {
        e.target.style.display = 'none';  // Hide the dragged icon
      }, 0);

      // Remove the icon from the pool
      e.target.remove();
    });

    iconsContainer.appendChild(iconElement);
  });

  // Allow dropping inside the circle
  circle.addEventListener('dragover', (e) => {
    e.preventDefault();
  });

  // Drop Event
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
  });

  // Submit button click event
  submitBtn.addEventListener('click', () => {
    const participantId = participantIdInput.value;

    if (participantId && iconPositions.length === iconsData.length) {
      // Send data to the server (GitHub Actions)
      fetch('https://api.github.com/repos/your-username/your-repository/dispatches', {
        method: 'POST',
        headers: {
          'Authorization': `token YOUR_GITHUB_TOKEN`,
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
