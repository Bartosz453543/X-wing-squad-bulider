<?php
session_start();
include 'template.php';

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
        if (!$conn) 
        {
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
    <?php getHead(); ?>
  </head>
  <body>

    <?php getHeader(); ?>

    <main class="hole">
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
     <section class="content">
        <section class="galeria">
          <h2>Galeria</h2>
          <section class="galeria-zdjec-wrapper">
            <!-- Przycisk strzałki w lewo -->
            <button class="arrow left" id="arrow-left">&#9664;</button>

            <section class="galeria-zdjec">
              <?php
              $upload_dir = 'uploads/';
              $images = glob($upload_dir . '*.{jpg,jpeg,png,gif,webp}', GLOB_BRACE);

              if (count($images) > 0) {
                  foreach ($images as $img_path) {
                      $escaped_path = htmlspecialchars($img_path, ENT_QUOTES, 'UTF-8');
                      echo "<section class='zdjecie'><img src='{$escaped_path}' alt='Zdjęcie'></section>";
                  }

                  // Duplikat pierwszego zdjęcia na końcu
                  $first_img = htmlspecialchars($images[0], ENT_QUOTES, 'UTF-8');
                  echo "<section class='zdjecie'><img src='{$first_img}' alt='Duplikat'></section>";
              } else {
                  echo "<p>Brak zdjęć w folderze <code>uploads/</code>.</p>";
              }
              ?>
            </section>

            <!-- Przycisk strzałki w prawo -->
            <button class="arrow right" id="arrow-right">&#9654;</button>
          </section>
        </section>
      </section>
    </main>

    <?php getFooter(); ?>

    <script src="script.js"></script>
  </body>
</html>
