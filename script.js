// animacja hamburger
const menuToggle = document.getElementById('menu-toggle');
const menuIcon = document.getElementById('menu-icon');

menuToggle.addEventListener('change', function() 
{
  if (this.checked) 
    {
    menuIcon.classList.add('open');
  } 
  else 
  {
    menuIcon.classList.remove('open');
  }
});
// galeria
document.addEventListener("DOMContentLoaded", function () {
  const galeria = document.querySelector(".galeria-zdjec");
  const zdjecia = document.querySelectorAll(".galeria-zdjec .zdjecie");

  if (!galeria || zdjecia.length < 2) return;

  const szerokosc = 600;
  let index = 0;
  const czas = 3000;

  const przesuwaj = () => {
    index++;

    galeria.style.scrollBehavior = 'smooth';
    galeria.scrollTo({
      left: index * szerokosc
    });

    // Jeśli dojedziemy do duplikatu → reset bez animacji
    if (index === zdjecia.length - 1) {
      setTimeout(() => {
        galeria.style.scrollBehavior = 'auto';
        galeria.scrollTo({ left: 0 });
        index = 0;
      }, 600); // czas przewijania = CSS transition-like
    }
  };

  setInterval(przesuwaj, czas);
});


