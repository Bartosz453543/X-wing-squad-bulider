<?php
// serve_image.php
// Uwaga: ten plik musi mieć dostęp do tej samej konfiguracji DB co index.php

define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'x_wing');
define('UPLOAD_DIR', __DIR__ . '/../uploads'); // musi być zgodne z index.php

// minimalne zabezpieczenia
header("X-Content-Type-Options: nosniff");
header("Content-Security-Policy: default-src 'none'; img-src 'self' data:;");

// DB connect
$conn = mysqli_init();
mysqli_options($conn, MYSQLI_OPT_CONNECT_TIMEOUT, 5);
if (!@mysqli_real_connect($conn, DB_HOST, DB_USER, DB_PASS, DB_NAME)) {
    http_response_code(500); exit;
}
mysqli_set_charset($conn, 'utf8mb4');

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
if ($id <= 0) { http_response_code(400); exit; }

$stmt = mysqli_prepare($conn, "SELECT filename, mime FROM galeria WHERE id = ?");
mysqli_stmt_bind_param($stmt, 'i', $id);
mysqli_stmt_execute($stmt);
$res = mysqli_stmt_get_result($stmt);
if (!$res || mysqli_num_rows($res) !== 1) { http_response_code(404); exit; }
$row = mysqli_fetch_assoc($res);
$filename = basename($row['filename']); // sanitize
$mime = $row['mime'];

$path = rtrim(UPLOAD_DIR, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . $filename;
if (!is_file($path) || !is_readable($path)) { http_response_code(404); exit; }

// dodatkowa weryfikacja mime pliku na dysku
$f = finfo_open(FILEINFO_MIME_TYPE);
$real_mime = finfo_file($f, $path);
finfo_close($f);
$allowed = ['image/jpeg','image/png','image/gif','image/webp'];
if (!in_array($real_mime, $allowed)) { http_response_code(403); exit; }

header('Content-Type: ' . $real_mime);
header('Content-Length: ' . filesize($path));
header('Cache-Control: public, max-age=3600');
readfile($path);
exit;
