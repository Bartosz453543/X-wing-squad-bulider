<?php
// logout.php - bezpieczny logout (wywołanie musi być POST z csrf_token)

session_start();

// prosta funkcja sprawdzająca token CSRF (dopasuj do swojej implementacji)
function check_csrf($token) {
    return isset($_SESSION['csrf_token']) && hash_equals($_SESSION['csrf_token'], $token);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Method Not Allowed
    exit;
}

$token = $_POST['csrf_token'] ?? '';
if (!check_csrf($token)) {
    http_response_code(400);
    echo "Błąd CSRF.";
    exit;
}

// Wyloguj bezpiecznie:
// 1. Wyczyszczenie danych sesji
$_SESSION = [];

// 2. Jeżeli sesja używa ciasteczek — usuń ciasteczko przeglądarki
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(
        session_name(),
        '',
        time() - 42000,
        $params['path'],
        $params['domain'],
        $params['secure'],
        $params['httponly']
    );
}

// 3. Zniszcz dane sesji po stronie serwera
session_destroy();

// Opcjonalnie: stwórz nową pustą sesję i zregeneruj id (zapobiega reuse)
session_start();
session_regenerate_id(true);

// Przekierowanie do strony startowej (stały, bezpośredni URL jest bezpieczny)
header("Location: index.php");
exit;
