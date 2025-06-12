# X-wing-squad-bulider






# Specyfikacja i cel projetku
## informacje podstawoe 
### 1 Nazwa projetku
Strona ligowa dla "Dzielni Piloci Weterani".
Strona ta będzie przedstawiać ranking i punkty turniejowe wzorowane m.in,
na www.longshanks.org. Na stronie będzie też dostępny squad bulider dla graczy wzorowany na Yasb.
### 2 Cele strony:
  - stowrzenie strony głównej, która przedstawia tabelke z wynikami i galerią.
  - stworzenie squad bulidera dla 7 frakcji.
  - użytkownicy będą mogli zapisywać swoje "Rozpiski" poprzez stworzenie konta.
### 3 Przewidywana długość projektu
- strona głowna wraz z obslugą tabeli (gotowa)
- około 4 tygodni squad bulider
# Informacje o stronie 
### 4 Podstawowe założenia 
- system logowania Konto admina czy ja (Hunter) i Przemek możemy zmieniać dane (on jest pomysłowadcą).
- reszta będzie mogła stworzyć konto do tworzenia "rozpisek".
- do stworzenia kont będzie potrzebny login email i haslo.
- konta administratorskie będą oznaczone specjalnym atrybutem, który tylko może być nadany z poziomu bazy danych
- możliwosć zapisu rozpisek będzie możliwe w typie XWS i będzie też możliwość przesłanie rozpiski w tym samym stylu.
### 5 Podział Stron.
#### a) Strona główna
- tabela stworzona przez Przemka (tabela ligowa).
- Galeria zdjec z gier.
- odnośnik do bulidera i logowania.
#### b) Profil uzytkownika
- po zalogowaniu możliwosc do zmian w tabeli będzie miał tylko Ja (Hunter) i Przemek reszta w tym gracze wymienieni
  wcześniej towrzenie rozpisek w squad buliderze.
- Podglad i możliwość edycji rozpisek.
- wejście w tą podstrone bedzie mozliwe tylko i wyłacznie kliknięcia "menu" na stronie głownej.
- uzytkownik będzie mógł się wylogować poprzez "wyloguj się".
#### c) Squad bulider
- możliwość tworzenia "rozpisek " dla 7 frakcji (Sojusz Rebeliantów, Imperium Galaktyczne, Przemitnicy, Republika,
  Separatyści, Ruch Oporu i Najwyższy Porządek.
- Zapis rozpisek w formacie XWS i klejenie ich do np TTSa (Tabletop Simulator).
- Zapis rozpisek na konto. 
### 6 Planowane technologie: 
- Frontend: HTML/CSS, JS 
- Backend: PHP, Node.js, TypeScript 
- Baza danych: MySQL 
- kod strony będzie zawarty na tym repozytorium
### 7 Rozkład intefejsu
- część nagłowkowa z logiem Dzielni Piloci Weterani, z loginem i odnośnikami do podstron
- schowanie odnośników do hamburger menu w razie mobilnych rozdzielczości
- styl strony inspirowany Star warsami

## Metadane projektu
1 Analiza SWOT
- (S)Mocne strony: Dostęp do wyników turnieju i szybka zmiana ich wyników.
Styl Star warsowy, dobrze zabezpieczony backend   
- (W) Słabe strony: W zależności od napotkanych problemów, może być konieczność korzystania z webscraperów, używane na stronie moty star warsow
   może dla niektórych utrudnić czytelność stron.
- (O) Okazje: Pozytywny rozglos dzięki łatwniej dostępności do wyników  może się zwiększyć liczba graczy w zespole.
- (T) Zagrożenia: Strona może źle działać podczas dużych aktualizacji tabeli.
