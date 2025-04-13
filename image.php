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
    $obraz = $row['zdjecia'];

    // Ustawienie nagłówka MIME — tu zakładamy JPG, ale można dodać typ w bazie
    header("Content-Type: image/jpeg");
    echo $obraz;
} else {
    // Obraz nie istnieje
    http_response_code(404);
    echo "Brak zdjęcia.";
}
?>
