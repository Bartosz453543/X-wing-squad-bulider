
// Funkcja, która dopina przyciski "Usuń statek"
function addRemoveButtons() {
    document.querySelectorAll('.ship-section').forEach(section => {
      if (section.classList.contains('remove-added')) return;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.innerText = 'Usuń statek';
      btn.className = 'remove-ship-btn';
      btn.addEventListener('click', () => {
        section.remove();
        updateGlobalTotalPoints();
      });
      section.appendChild(btn);
      section.classList.add('remove-added');
    });
  }
  
  // Twoje pozostałe funkcje:
  function addShipByType() { /* ... */ }
  function updateGlobalTotalPoints() { /* ... */ }
  
  window.addEventListener('DOMContentLoaded', () => {
    addRemoveButtons();
    updateGlobalTotalPoints();
  });
  window.updateGlobalTotalPoints = updateGlobalTotalPoints;
  window.addRemoveButtons   = addRemoveButtons;
  