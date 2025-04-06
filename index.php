<?php
session_start();

// Raportowanie błędów (włączamy tylko do debugowania)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Konfiguracja bazy danych
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'x wing');

// Funkcja łączenia z bazą danych
function db_connect() 
{
    try 
    {
        $conn = @mysqli_connect(DB_HOST, DB_USER, DB_PASS, DB_NAME);
        if (!$conn) {
            throw new Exception("Błąd połączenia: " . mysqli_connect_error());
        }
        mysqli_set_charset($conn, "utf8");
        return $conn;
    } 
    catch (Exception $e) 
    {
        die("Wystąpił problem podczas łączenia z bazą danych: " . $e->getMessage());
    }
}

$conn = db_connect();
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Strona główna</title>
  <link rel="stylesheet" href="reset.css">
  <link rel="stylesheet" href="style.css">
  <link rel="icon" href="swz-logotreatment.jpg">
</head>
<body>

  <header>
    <h1>Dzielni Piloci Weterani</h1>
    <nav class="nav">
      <input type="checkbox" id="menu-toggle" class="menu-toggle">
      <label for="menu-toggle" class="menu-icon" id="menu-icon">
        <span></span>
        <span></span>
        <span></span>
      </label>
      <ul class="menu">
        <li><a href="#">Zaloguj się</a></li>
        <li><a href="#">Menu</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <section class="table">
      <h2>Tabela wyników</h2>
      <?php
      
      $sql = "SELECT `id`, `gracz`, `frakcja1`, `frakcja2`, `zniszczone_statki`, `punkty` FROM `wyniki`";
      $wynik = mysqli_query($conn, $sql);
      
      if (mysqli_num_rows($wynik) > 0)
      {
        echo "<table>";
        echo "<tr><td rowspan=\"2\">Gracz</td><td colspan=\"2\">Frakcja</td><td rowspan=\"2\">Zniszczone statki</td><td rowspan=\"2\">Punkty</td></tr>";
        echo "<tr><td>Frakcja 1</td><td>Frakcja 2</td></tr>";
        while ($wiersz = mysqli_fetch_assoc($wynik))
        {
          echo "<tr>";
          echo "<td>" . htmlspecialchars($wiersz["gracz"]) . "</td>";
          echo "<td>" . htmlspecialchars($wiersz["frakcja1"]) . "</td>";
          echo "<td>" . htmlspecialchars($wiersz["frakcja2"]) . "</td>";
          echo "<td>" . htmlspecialchars($wiersz["zniszczone_statki"]) . "</td>";
          echo "<td>" . htmlspecialchars($wiersz["punkty"]) . "</td>";
          echo "</tr>";
        }
        echo "</table>";
      }
      else
      {
        echo "<p>Brak danych do wyświetlenia.</p>";
      }
      
      ?>
    </section>

    <section class="bulider">
      <p>edytor tu będzie odnośniki</p>
    </section>

    <section class="columns">
      <section class="content">
        <h2>Aktualności</h2>
      </section>
      <section class="content">
        <h2>Galeria</h2>
      </section>
    </section>
  </main>

  <footer>
    <p>Stronę stworzył Hunter</p>
  </footer>

  <script src="script.js"></script>
</body>
</html>
