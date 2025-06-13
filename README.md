# X-Wing Squad Builder

## Specyfikacja i cel projektu

### 1. Nazwa projektu
Strona ligowa dla **"Dzielni Piloci Weterani"**  
Strona przedstawia ranking i punkty turniejowe, wzorowane m.in. na [www.longshanks.org](https://www.longshanks.org).  
Zawiera także squad builder dla graczy, inspirowany YASB.

### 2. Cele strony
- Stworzenie strony głównej z tabelą wyników i galerią.
- Stworzenie squad buildera dla 7 frakcji.
- Możliwość zapisywania własnych rozpisek przez użytkowników posiadających konto.

### 3. Przewidywana długość projektu
- Strona główna i tabela wyników — **gotowa**.
- Squad builder — około **4 tygodnie** pracy.

---

## Informacje o stronie

### 4. Podstawowe założenia
- System logowania:
- Konta administratorów (Hunter i Przemek) z możliwością edycji danych.
- Pozostali użytkownicy mogą tworzyć konta w celu zapisu rozpisek.
- Rejestracja wymaga: **loginu, emaila i hasła**.
- Konto administracyjne oznaczane specjalnym atrybutem w bazie danych.
- Zapisywanie i wgrywanie rozpisek w formacie **XWS**.

### 5. Podział stron

#### a) Strona główna
- Tabela ligowa (stworzona przez Przemka).
- Galeria zdjęć z gier.
- Odnośniki do buildera i logowania.

#### b) Profil użytkownika
- Po zalogowaniu:
  - Tylko administratorzy mogą edytować tabelę.
  - Gracze mogą tworzyć i edytować własne rozpiski.
- Dostęp przez menu na stronie głównej.
- Opcja „Wyloguj się”.

#### c) Squad Builder
- Obsługa 7 frakcji:
  - Sojusz Rebeliantów
  - Imperium Galaktyczne
  - Przemytnicy
  - Republika
  - Separatyści
  - Ruch Oporu
  - Najwyższy Porządek
- Zapisywanie rozpisek w XWS.
- Możliwość wykorzystania w TTS (Tabletop Simulator).
- Zapis na koncie użytkownika.

### 6. Planowane technologie
- **Frontend:** HTML / CSS / JavaScript  
- **Backend:** PHP / Node.js / TypeScript  
- **Baza danych:** MySQL  
- Całość wersjonowana w repozytorium.

### 7. Rozkład interfejsu
- Nagłówek z logo "Dzielni Piloci Weterani", loginem i linkami do podstron.
- Hamburger menu dla urządzeń mobilnych.
- Styl graficzny inspirowany Star Wars.

---

## Metadane projektu

### 1. Analiza SWOT

**S (Mocne strony):**
- Szybki dostęp do wyników i możliwość ich edycji.
- Styl inspirowany Star Wars.
- Bezpieczny backend.

**W (Słabe strony):**
- Możliwa konieczność użycia web scraperów.
- Styl Star Wars może utrudniać czytelność dla niektórych.

**O (Okazje):**
- Ułatwiony dostęp do wyników może przyciągnąć nowych graczy.

**T (Zagrożenia):**
- Możliwe problemy z działaniem strony przy dużych aktualizacjach danych.

