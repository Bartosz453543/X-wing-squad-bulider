<?php
// logowanie.php - Poprawiona i bezpieczniejsza wersja panelu

declare(strict_types=1);

include 'template.php'; // <<<<<<<<<<<<<< DODANE

date_default_timezone_set('Europe/Warsaw');

// ------------------------------------------------------------
// 1. SESJA I LOGOWANIE BŁĘDÓW
// ------------------------------------------------------------
ini_set('display_errors', '0');
ini_set('log_errors', '1');
ini_set('error_log', __DIR__ . '/logs/php_error.log');
error_reporting(E_ALL);

ini_set('session.use_strict_mode', '1');
ini_set('session.cookie_httponly', '1');
ini_set(
    'session.cookie_secure',
    (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? '1' : '0'
);

$cookieParams = session_get_cookie_params();
session_set_cookie_params([
    'lifetime' => 0,
    'path'     => $cookieParams['path'] ?? '/',
    'domain'   => $cookieParams['domain'] ?? '',
    'secure'   => (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off'),
    'httponly' => true,
    'samesite' => 'Strict'
]);

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (!isset($_SESSION['__init'])) {
    session_regenerate_id(true);
    $_SESSION['__init'] = time();
}

// ------------------------------------------------------------
// 2. CSRF
// ------------------------------------------------------------
if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}
function csrf_token(): string {
    return (string)($_SESSION['csrf_token'] ?? '');
}
function check_csrf_post(): bool {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') return false;
    if (!isset($_POST['csrf_token'])) return false;
    return hash_equals((string)csrf_token(), (string)$_POST['csrf_token']);
}

// ------------------------------------------------------------
// 3. KONFIG BAZY
// ------------------------------------------------------------
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'x_wing');

function db_connect() {
    $conn = mysqli_init();
    mysqli_options($conn, MYSQLI_OPT_CONNECT_TIMEOUT, 5);

    if (!@mysqli_real_connect($conn, DB_HOST, DB_USER, DB_PASS, DB_NAME)) {
        error_log("[DB CONNECT] " . mysqli_connect_error());
        http_response_code(500);
        die("Błąd serwera bazy danych.");
    }

    mysqli_set_charset($conn, 'utf8mb4');
    return $conn;
}

$conn = db_connect();

// ------------------------------------------------------------
// 4. NAGŁÓWKI BEZPIECZEŃSTWA
// ------------------------------------------------------------
header("X-Frame-Options: SAMEORIGIN");
header("X-Content-Type-Options: nosniff");
header("Referrer-Policy: no-referrer-when-downgrade");
header("Content-Security-Policy: default-src 'self'; script-src 'self' https://code.jquery.com 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:;");

// ------------------------------------------------------------
// 5. FUNKCJE POMOCNICZE
// ------------------------------------------------------------
function e($s) { return htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8'); }
function json_die(array $payload) {
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

function safe_prepare_execute(mysqli $conn, string $sql, string $types = '', array $params = []) {
    $stmt = mysqli_prepare($conn, $sql);
    if (!$stmt) return false;

    if ($types !== '' && !empty($params)) {
        $refs = [];
        foreach ($params as $key => $val) {
            $refs[$key] = &$params[$key];
        }
        array_unshift($refs, $types);
        call_user_func_array([$stmt, 'bind_param'], $refs);
    }

    if (!mysqli_stmt_execute($stmt)) {
        mysqli_stmt_close($stmt);
        return false;
    }

    return $stmt;
}

// ------------------------------------------------------------
// 6. ZMIENNE
// ------------------------------------------------------------
$login_error = '';
$upload_message = '';

// ------------------------------------------------------------
// 7. LOGOUT
// ------------------------------------------------------------
if (isset($_GET['logout']) && isset($_SESSION['user_id'])) {
    $_SESSION = [];
    session_destroy();
    header("Location: " . strtok($_SERVER['PHP_SELF'], '?'));
    exit;
}

// ------------------------------------------------------------
// 8. POST HANDLERY
// ------------------------------------------------------------

// LOGOWANIE
if ($_SERVER['REQUEST_METHOD'] === 'POST'
    && isset($_POST['login'], $_POST['password'])
    && !isset($_POST['gracz'], $_POST['upload_photo'])
) {
    if (!check_csrf_post()) {
        $login_error = 'Błąd CSRF — odrzucono żądanie.';
    } else {
        $login = trim((string)$_POST['login']);
        $password = (string)$_POST['password'];

        $stmt = safe_prepare_execute($conn, "SELECT id, login, haslo FROM users WHERE login = ?", "s", [$login]);
        if ($stmt) {
            $res = mysqli_stmt_get_result($stmt);
            $user = $res ? mysqli_fetch_assoc($res) : null;
            mysqli_stmt_close($stmt);

            if ($user && password_verify($password, $user['haslo'])) {
                session_regenerate_id(true);
                $_SESSION['user_id'] = (int)$user['id'];
                $_SESSION['login'] = $user['login'];
                header("Location: " . $_SERVER['PHP_SELF']);
                exit;
            } else {
                $login_error = 'Nieprawidłowy login lub hasło.';
            }
        }
    }
}

// ZAPIS WYNIKÓW – AJAX
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['gracz'])) {
    if (!check_csrf_post()) json_die(['message' => 'Błąd CSRF']);
    if (!isset($_SESSION['user_id'])) json_die(['message' => 'Nie zalogowano']);

    $gracz = $_POST['gracz'];
    $f1 = $_POST['frakcja1'];
    $f2 = $_POST['frakcja2'];
    $zs = $_POST['zniszczone_statki'];
    $pkt = (int)($_POST['punkty'] ?? 0);

    $check = safe_prepare_execute($conn, "SELECT id FROM wyniki WHERE gracz = ?", "s", [$gracz]);
    $res = mysqli_stmt_get_result($check);
    $row = mysqli_fetch_assoc($res);
    mysqli_stmt_close($check);

    if ($row) {
        $upd = safe_prepare_execute($conn,
            "UPDATE wyniki SET frakcja1=?, frakcja2=?, zniszczone_statki=?, punkty=? WHERE gracz=?",
            "sssds", [$f1, $f2, $zs, $pkt, $gracz]
        );
        mysqli_stmt_close($upd);
        json_die(['message' => 'Zaktualizowano wpis.']);
    } else {
        $ins = safe_prepare_execute($conn,
            "INSERT INTO wyniki (gracz, frakcja1, frakcja2, zniszczone_statki, punkty) VALUES (?,?,?,?,?)",
            "sssdi", [$gracz, $f1, $f2, $zs, $pkt]
        );
        mysqli_stmt_close($ins);
        json_die(['message' => 'Dodano wpis.']);
    }
}

// USUNIĘCIE OSTATNIEGO – AJAX
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['deleteLast'])) {
    if (!check_csrf_post()) json_die(['message' => 'Błąd CSRF']);
    if (!isset($_SESSION['user_id'])) json_die(['message' => 'Nie zalogowano']);

    $get = safe_prepare_execute($conn, "SELECT id FROM wyniki ORDER BY id DESC LIMIT 1");
    $res = mysqli_stmt_get_result($get);
    $row = mysqli_fetch_assoc($res);
    mysqli_stmt_close($get);

    if (!$row) json_die(['message' => 'Brak rekordów.']);

    $del = safe_prepare_execute($conn, "DELETE FROM wyniki WHERE id = ?", "i", [$row['id']]);
    mysqli_stmt_close($del);

    json_die(['message' => 'Usunięto rekord: ' . $row['id']]);
}

// UPLOAD ZDJĘCIA
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['upload_photo'])) {
    if (!check_csrf_post()) {
        $upload_message = 'Błąd CSRF.';
    } else {
        if (!isset($_FILES['zdjecie']) || $_FILES['zdjecie']['error'] !== UPLOAD_ERR_OK) {
            $upload_message = 'Błąd uploadu.';
        } else {
            $ext = strtolower(pathinfo($_FILES['zdjecie']['name'], PATHINFO_EXTENSION));
            $safe = time() . '_' . bin2hex(random_bytes(8)) . '.' . $ext;

            $dir = __DIR__ . '/uploads/';
            if (!is_dir($dir)) mkdir($dir, 0755, true);

            $path = $dir . $safe;

            if (move_uploaded_file($_FILES['zdjecie']['tmp_name'], $path)) {
                $ins = safe_prepare_execute($conn, "INSERT INTO galeria (zdjecia) VALUES (?)", "s", ['uploads/' . $safe]);
                mysqli_stmt_close($ins);
                $upload_message = 'Zdjęcie dodane!';
            } else {
                $upload_message = 'Nie udało się zapisać.';
            }
        }
    }
}

// ------------------------------------------------------------
// 9. WIDOK HTML
// ------------------------------------------------------------
?>
<!DOCTYPE html>
<html lang="pl">
<head>
    <?php getHead(); ?>
    <title>Panel - X Wing</title>
    <link rel="stylesheet" href="CSS/bootstrap.css">
</head>

<body>
<?php getHeader(); ?>

<main class="hole ">

<?php if (!isset($_SESSION['user_id'])): ?>
        <section class="login_text">
            <section class="login mt-5">
            <h2>Logowanie</h2>

            <?php if ($login_error): ?>
                <div class="alert alert-danger"><?= e($login_error) ?></div>
            <?php endif; ?>

            <form method="POST">
                <input type="hidden" name="csrf_token" value="<?= e(csrf_token()) ?>">

                <div class="mb-3">
                    <label>Login</label>
                    <input type="text" name="login" class="form-control" required>
                </div>

                <div class="mb-3">
                    <label>Hasło</label>
                    <input type="password" name="password" class="form-control" required>
                </div>

                <button class="btn btn-primary">Zaloguj</button>
            </form>
        </section>
    </section>

<?php else: ?>

    <section class="panel mt-5">
        <div class="d-flex justify-content-between">
            <h2>Panel administracyjny</h2>
        </div>

        <div id="insertMessage" class="alert alert-info mt-3"></div>

        <form id="battleForm" method="POST">
            <input type="hidden" name="csrf_token" value="<?= e(csrf_token()) ?>">

            <div class="mb-3">
                <label>Gracz</label>
                <input type="text" class="form-control" name="gracz" required>
            </div>

            <div class="mb-3">
                <label>Frakcja 1</label>
                <select class="form-select" name="frakcja1">
                    <option value="">Wybierz...</option>
                    <option>Imperium</option>
                    <option>Rebelia</option>
                    <option>Scumy</option>
                    <option>Ruch_Oporu</option>
                    <option>Najwyższy_Porządek</option>
                    <option>Republika</option>
                    <option>Separatyści</option>
                </select>
            </div>

            <div class="mb-3">
                <label>Frakcja 2</label>
                <select class="form-select" name="frakcja2">
                    <option value="">Wybierz...</option>
                    <option>Imperium</option>
                    <option>Rebelia</option>
                    <option>Scumy</option>
                    <option>Ruch_Oporu</option>
                    <option>Najwyższy_Porządek</option>
                    <option>Republika</option>
                    <option>Separatyści</option>
                </select>
            </div>

            <div class="mb-3">
                <label>Zniszczone statki</label>
                <textarea class="form-control" name="zniszczone_statki"></textarea>
            </div>

            <div class="mb-3">
                <label>Punkty</label>
                <input type="number" class="form-control" name="punkty" value="0">
            </div>

            <button class="btn btn-primary">Zapisz</button>
            <button type="button" id="deleteLastButton" class="btn btn-danger">Usuń ostatni</button>
        </form>
    </section>

    <section class="panel mt-5">
        <h3>Dodaj zdjęcie do galerii</h3>

        <form method="POST" enctype="multipart/form-data">
            <input type="hidden" name="csrf_token" value="<?= e(csrf_token()) ?>">
            <input type="file" name="zdjecie" class="form-control mb-3" accept="image/*" required>

            <button class="btn btn-success" name="upload_photo">Wyślij</button>
        </form>

        <?php if ($upload_message): ?>
            <div class="alert alert-info mt-3"><?= e($upload_message) ?></div>
        <?php endif; ?>
    </section>

<?php endif; ?>
</main>

<?php getFooter(); ?>

<?php if (isset($_SESSION['user_id'])): ?>
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script>
$(function(){

    var csrf = <?= json_encode(csrf_token()) ?>;

    $("#battleForm").on("submit", function(e){
        e.preventDefault();
        $.post("", $(this).serialize(), function(res){
            $("#insertMessage").text(res.message).show().delay(4000).fadeOut();
        }, "json");
    });

    $("#deleteLastButton").on("click", function(){
        $.post("", { deleteLast: 1, csrf_token: csrf }, function(res){
            $("#insertMessage").text(res.message).show().delay(4000).fadeOut();
        }, "json");
    });

});
</script>
<?php endif; ?>

</body>
</html>
