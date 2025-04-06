const menuToggle = document.getElementById('menu-toggle');
const menuIcon = document.getElementById('menu-icon');

menuToggle.addEventListener('change', function() {
  if (this.checked) {
    menuIcon.classList.add('open');
  } else {
    menuIcon.classList.remove('open');
  }
});
