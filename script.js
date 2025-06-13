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
document.addEventListener('DOMContentLoaded', function() {
  const prevBtn = document.getElementById('arrow-left');
  const nextBtn = document.getElementById('arrow-right');
  const slider = document.querySelector('.galeria-zdjec');
  const slides = document.querySelectorAll('.galeria-zdjec .zdjecie');
  const totalSlides = slides.length;
  
  let currentIndex = 0;
  
  // Funkcja aktualizująca pozycję slidera
  function updateSlider(transition = true) {
    slider.style.transition = transition ? 'transform 0.5s ease' : 'none';
    slider.style.transform = `translateX(-${currentIndex * 100}%)`;
  }
  
  // Funkcja przejścia do następnego slajdu
  function nextSlide() {
    if (currentIndex >= totalSlides - 1) {//test
      currentIndex = 0;
      updateSlider(false);
      setTimeout(() => updateSlider(), 20);
    } else {
      currentIndex++;
      updateSlider();
    }
  }
  
  // Funkcja przejścia do poprzedniego slajdu
  function prevSlide() {
    if (currentIndex <= 0) {
      currentIndex = totalSlides - 1;
      updateSlider(false);
      setTimeout(() => updateSlider(), 20);
    } else {
      currentIndex--;
      updateSlider();
    }
  }
  
  // Obsługa kliknięcia przycisku strzałki w prawo
  nextBtn.addEventListener('click', function() {
    nextSlide();
    resetAutoSlide();
  });
  
  // Obsługa kliknięcia przycisku strzałki w lewo
  prevBtn.addEventListener('click', function() {
    prevSlide();
    resetAutoSlide();
  });
  
  // przesuwanie palcem
  let startX = 0;
  let endX = 0;

  slider.addEventListener('touchstart', function(e) {
    startX = e.touches[0].clientX;
  });

  slider.addEventListener('touchmove', function(e) {
    endX = e.touches[0].clientX;
  });

  slider.addEventListener('touchend', function() {
    if (startX - endX > 50) {
      // Przesunięcie palcem w lewo – kolejny slajd
      nextSlide();
      resetAutoSlide();
    } else if (endX - startX > 50) {
      // Przesunięcie palcem w prawo – poprzedni slajd
      prevSlide();
      resetAutoSlide();
    }
    
    startX = 0;
    endX = 0;
  });
  
  // Automatyczne przełączanie slajdów co 10 sekund
  let autoSlideInterval = setInterval(nextSlide, 5000);

  // Reset interwału w przypadku ręcznej interakcji użytkownika
  function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(nextSlide, 5000);
  }
});




