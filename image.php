<?php
// Połączenie z bazą
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'x wing');

$conn = mysqli_connect(DB_HOST, DB_USER, DB_PASS, DB_NAME);
if (!$conn) {
    die("Błąd połączenia z bazą danych");
}

// Pobierz ID zdjęcia z parametru GET
$id = isset($_GET['id']) ? intval($_GET['id']) : 0;

$sql = "SELECT zdjecia FROM galeria WHERE id = $id";
$result = mysqli_query($conn, $sql);

if ($row = mysqli_fetch_assoc($result)) {
    // Nagłówki uniemożliwiają cache'owanie:
    header("Content-Type: image/jpeg");
    header("Cache-Control: no-cache, no-store, must-revalidate"); // HTTP/1.1
    header("Pragma: no-cache");                                   // HTTP/1.0
    header("Expires: 0");                                         // Proxies

    echo $row['zdjecia'];
} else {
    // Obraz nie istnieje
    http_response_code(404);
    echo "Brak zdjęcia.";
}
