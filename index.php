<?php
// ------------------------------------------------------------
// production-ready.php
// Bezpieczniejsza wersja twojego pliku z komentarzami
// ------------------------------------------------------------

// ============================================================
// 1) USTAWIENIA SESJI — MUSZĄ BYĆ PRZED session_start()
// ============================================================
ini_set('session.use_strict_mode', 1);
ini_set('session.use_cookies', 1);
ini_set('session.cookie_httponly', 1);
ini_set('session.cookie_secure', isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off');
ini_set('session.cookie_lifetime', 0); // sesja przeglądarki
// ustaw Samesite
$cookieParams = session_get_cookie_params();
session_set_cookie_params([
    'lifetime' => 0,
    'path'     => $cookieParams['path'] ?? '/',
    'domain'   => $cookieParams['domain'] ?? '',
    'secure'   => isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
    'httponly' => true,
    'samesite' => 'Strict'
]);

session_start();
session_regenerate_id(true);

// ============================================================
// 2) ŁADOWANIE SZABLONÓW I KONTROLA BŁĘDÓW
// ============================================================
// Na produkcji NIE wyświetlamy błędów użytkownikowi
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/logs/php_error.log'); // upewnij się, że folder logs jest zapisywalny

include 'template.php';

// ============================================================
// 3) NAGŁÓWKI BEZPIECZEŃSTWA
// ============================================================
// Nonce do bezpiecznego wstrzykiwania skryptów inline (jeśli potrzebne)
$csp_nonce = base64_encode(random_bytes(16));

// Nagłówki
header("X-Frame-Options: SAMEORIGIN");
header("X-Content-Type-Options: nosniff");
header("Referrer-Policy: no-referrer-when-downgrade");
header("Permissions-Policy: geolocation=(), microphone=()"); // przykładowo
// CSP — usuwamy 'unsafe-inline'. Jeśli masz style inline, przenieś je do pliku CSS.
// Dozwolone script-src zawiera nonce — dodamy go do <script> tagu.
$csp = "default-src 'self'; img-src 'self' data:; script-src 'self' 'nonce-{$csp_nonce}'; style-src 'self';";
header("Content-Security-Policy: {$csp}");

// ============================================================
// 4) KONFIGURACJA BAZY DANYCH
// ============================================================
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'x_wing');

function db_connect() {
    $conn = mysqli_init();
    mysqli_options($conn, MYSQLI_OPT_CONNECT_TIMEOUT, 5);

    if (!@mysqli_real_connect($conn, DB_HOST, DB_USER, DB_PASS, DB_NAME)) {
        error_log("Błąd połączenia z bazą danych: " . mysqli_connect_error());
        // Nie pokazuj szczegółów użytkownikowi
        http_response_code(500);
        echo "<p style='color:red;'>Błąd serwera — spróbuj ponownie później.</p>";
        exit;
    }

    if (!mysqli_set_charset($conn, "utf8mb4")) {
        error_log("Nie można ustawić utf8mb4: " . mysqli_error($conn));
    }
    return $conn;
}

$conn = db_connect();

// ============================================================
// 5) FUNKCJE UŻYTECZNE
// ============================================================
/**
 * Bezpieczne przygotowane zapytanie — przykład użycia gdy masz parametry.
 * Zwraca wynik mysqli_stmt->get_result() lub false.
 */
function safe_query_param($conn, $sql, $types = '', $params = []) {
    $stmt = mysqli_prepare($conn, $sql);
    if (!$stmt) {
        error_log("Prepare failed: " . mysqli_error($conn));
        return false;
    }
    if ($types && !empty($params)) {
        mysqli_stmt_bind_param($stmt, $types, ...$params);
    }
    if (!mysqli_stmt_execute($stmt)) {
        error_log("Execute failed: " . mysqli_stmt_error($stmt));
        mysqli_stmt_close($stmt);
        return false;
    }
    $res = mysqli_stmt_get_result($stmt);
    mysqli_stmt_close($stmt);
    return $res;
}

// ============================================================
// 6) WINDING UP HTML (HEAD, HEADER) — używamy template.php
// ============================================================
?><!DOCTYPE html>
<html lang="pl">
<head>
    <?php getHead(); ?>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tabela wyników</title>
</head>
<body>

<?php getHeader(); ?>

<main class="hole">

    <!-- ============================================================ -->
    <!--  TABELA WYNIKÓW                                              -->
    <!-- ============================================================ -->
    <section class="table">
        <h2>Tabela wyników</h2>

        <?php
        // Używamy przygotowanego zapytania jako dobrej praktyki, chociaż nie ma parametrów
        $sql = "SELECT `id`, `gracz`, `frakcja1`, `frakcja2`, `zniszczone_statki`, `punkty` FROM `wyniki`";
        $wynik = safe_query_param($conn, $sql);

        if ($wynik && mysqli_num_rows($wynik) > 0) {
            echo "<table>";
            echo "<tr>
                    <td rowspan='2'>Gracz</td>
                    <td colspan='2'>Frakcja</td>
                    <td rowspan='2'>Zniszczone statki</td>
                    <td rowspan='2'>Punkty</td>
                  </tr>";
            echo "<tr>
                    <td>Frakcja 1</td>
                    <td>Frakcja 2</td>
                  </tr>";

            while ($row = mysqli_fetch_assoc($wynik)) {
                echo "<tr>";
                echo "<td>" . htmlspecialchars($row["gracz"], ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') . "</td>";
                echo "<td>" . htmlspecialchars($row["frakcja1"], ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') . "</td>";
                echo "<td>" . htmlspecialchars($row["frakcja2"], ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') . "</td>";
                echo "<td>" . htmlspecialchars($row["zniszczone_statki"], ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') . "</td>";
                echo "<td>" . htmlspecialchars($row["punkty"], ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') . "</td>";
                echo "</tr>";
            }

            echo "</table>";
        } else {
            echo "<p>Brak danych do wyświetlenia.</p>";
        }
        ?>
    </section>

    <!-- ============================================================ -->
    <!--  GALERIA ZDJĘĆ                                               -->
    <!-- ============================================================ -->
    <section class="content">
        <section class="galeria">
            <h2>Galeria</h2>

            <section class="galeria-zdjec-wrapper">
                <button class="arrow left" id="arrow-left" aria-label="Previous">&#9664;</button>

                <section class="galeria-zdjec">
                <?php
                // Bezpieczna walidacja i wyświetlanie plików z katalogu uploads/
                $upload_dir = __DIR__ . DIRECTORY_SEPARATOR . 'uploads' . DIRECTORY_SEPARATOR;
                $allowed_ext = ['jpg','jpeg','png','gif','webp'];

                if (is_dir($upload_dir)) {
                    // Pobierz listę plików bez używania glob z rozszerzeniami wprost
                    $files = array_values(array_filter(scandir($upload_dir), function($f) use ($upload_dir) {
                        return is_file($upload_dir . $f);
                    }));

                    $images_found = 0;
                    foreach ($files as $file) {
                        // Upewnij się, że nie ma path traversal
                        $basename = basename($file);
                        $ext = strtolower(pathinfo($basename, PATHINFO_EXTENSION));
                        if (!in_array($ext, $allowed_ext, true)) continue;

                        $full = $upload_dir . $basename;

                        // Dodatkowa weryfikacja: getimagesize zwraca false jeśli to nie obraz
                        $img_info = @getimagesize($full);
                        if ($img_info === false) continue;

                        // Bezpieczna ścieżka do przeglądarki (relatywna)
                        $public_path = 'uploads/' . rawurlencode($basename); // rawurlencode, nie htmlspecialchars dla URL
                        echo "<section class='zdjecie'>
                                <img src='{$public_path}' alt='Zdjęcie'>
                              </section>";
                        $images_found++;
                    }

                    if ($images_found > 0) {
                        // duplikat pierwszego zdjęcia — jeśli potrzebne; sprawdzamy czy pierwszy istnieje
                        // (nie duplikujemy ścieżki jeśli zero plików)
                    } else {
                        echo "<p>Brak zdjęć w folderze <code>uploads/</code>.</p>";
                    }

                } else {
                    echo "<p>Folder galerii nie istnieje.</p>";
                }
                ?>
                </section>

                <button class="arrow right" id="arrow-right" aria-label="Next">&#9654;</button>
            </section>
        </section>
    </section>

</main>

<?php getFooter(); ?>

<!-- Dołączamy skrypt z CSP nonce -->
<script nonce="<?php echo htmlspecialchars($csp_nonce, ENT_QUOTES, 'UTF-8'); ?>" src="script.js"></script>
</body>
</html>
