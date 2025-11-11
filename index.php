<?php
// index.php
// Bezpieczny panel: logowanie, zapisywanie wyników, usuwanie własnego rekordu, upload zdjęć.
// Wymaga: PHP 7.2+ (dla random_bytes), MySQL, i katalogu uploads (najlepiej poza public root).

// ----------------- KONFIG -----------------
ini_set('display_errors', 0);              // NIE pokazuj błędów w produkcji
error_reporting(E_ALL);

define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'x_wing');

// Ustaw katalog uploadów — rekomendowane POZA publicznym katalogiem
// Przykład: jeśli index.php jest w /var/www/html, ustaw upload dir na /var/www/uploads
define('UPLOAD_DIR', __DIR__ . '/../uploads'); // zmień jeśli potrzebujesz innej ścieżki
define('UPLOAD_MAX_BYTES', 40 * 1024 * 1024); // 40 MB

// ----------------- BEZPIECZNE NAGŁÓWKI -----------------
header("X-Frame-Options: SAMEORIGIN");
header("X-Content-Type-Options: nosniff");
header("Referrer-Policy: strict-origin-when-cross-origin");
header("Permissions-Policy: microphone=(), camera=()");
header("Content-Security-Policy: default-src 'self'; img-src 'self' data:; script-src 'self'; style-src 'self' 'unsafe-inline';");

// ----------------- SESJA -----------------
// ustawienia sesji MUSZĄ być przed session_start()
ini_set('session.cookie_httponly', 1);
ini_set('session.use_strict_mode', 1);
if (!empty($_SERVER['HTTPS'])) {
    ini_set('session.cookie_secure', 1);
} else {
    ini_set('session.cookie_secure', 0); // jeśli nie masz HTTPS, w produkcji -> wymuś HTTPS
}
session_start();

// Proste zabezpieczenie: ogranicz długość sesji (opcjonalne)
if (!isset($_SESSION['started_at'])) $_SESSION['started_at'] = time();
if (time() - $_SESSION['started_at'] > 60 * 60 * 6) { // 6h
    session_unset();
    session_regenerate_id(true);
    $_SESSION['started_at'] = time();
}

// ----------------- DB CONNECT -----------------
function db_connect() {
    $conn = mysqli_init();
    mysqli_options($conn, MYSQLI_OPT_CONNECT_TIMEOUT, 5);
    if (!@mysqli_real_connect($conn, DB_HOST, DB_USER, DB_PASS, DB_NAME)) {
        error_log("[DB] connect error: " . mysqli_connect_error());
        die("Błąd połączenia z bazą danych.");
    }
    mysqli_set_charset($conn, 'utf8mb4');
    return $conn;
}
$conn = db_connect();

// ----------------- CSRF -----------------
if (empty($_SESSION['csrf_token'])) $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
function csrf_token() { return $_SESSION['csrf_token']; }
function check_csrf($token) {
    return isset($_SESSION['csrf_token']) && hash_equals($_SESSION['csrf_token'], $token);
}

// ----------------- LOGIN RATE LIMIT (session-based) -----------------
if (!isset($_SESSION['login_attempts'])) $_SESSION['login_attempts'] = 0;
if (!isset($_SESSION['last_login_attempt'])) $_SESSION['last_login_attempt'] = 0;

// ----------------- UTILS -----------------
function e($s) { return htmlspecialchars($s ?? '', ENT_QUOTES, 'UTF-8'); }

// ----------------- HANDLERS -----------------

// LOGOUT
if (isset($_GET['action']) && $_GET['action'] === 'logout') {
    session_unset();
    session_regenerate_id(true);
    header('Location: ' . strtok($_SERVER["REQUEST_URI"],'?'));
    exit;
}

// LOGIN
$login_error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['login'], $_POST['password'], $_POST['csrf_token']) && !isset($_POST['upload_photo']) && !isset($_POST['deleteLast']) && !isset($_POST['gracz'])) {
    if (!check_csrf($_POST['csrf_token'])) die('CSRF error');

    // rate limit: max 5 attempts per 10 minutes
    if ($_SESSION['login_attempts'] >= 5 && (time() - $_SESSION['last_login_attempt']) < 600) {
        $login_error = 'Zbyt wiele prób logowania. Spróbuj później.';
    } else {
        $login = trim($_POST['login']);
        $password = $_POST['password'];
        $stmt = mysqli_prepare($conn, "SELECT id, login, haslo FROM users WHERE login = ?");
        mysqli_stmt_bind_param($stmt, 's', $login);
        mysqli_stmt_execute($stmt);
        $res = mysqli_stmt_get_result($stmt);
        if ($res && $user = mysqli_fetch_assoc($res)) {
            if (password_verify($password, $user['haslo'])) {
                session_regenerate_id(true);
                $_SESSION['user_id'] = (int)$user['id'];
                $_SESSION['login'] = $user['login'];
                $_SESSION['login_attempts'] = 0;
                header('Location: ' . $_SERVER['PHP_SELF']);
                exit;
            }
        }
        $_SESSION['login_attempts'] += 1;
        $_SESSION['last_login_attempt'] = time();
        $login_error = 'Nieprawidłowy login lub hasło.';
        mysqli_stmt_close($stmt);
    }
}

// SAVE RESULT (AJAX)
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['gracz'], $_POST['csrf_token']) && !isset($_POST['upload_photo']) && !isset($_POST['deleteLast'])) {
    if (!isset($_SESSION['user_id'])) { echo json_encode(['message'=>'Musisz się zalogować.']); exit; }
    if (!check_csrf($_POST['csrf_token'])) { echo json_encode(['message'=>'CSRF']); exit; }

    $user_id = (int)$_SESSION['user_id'];
    $gracz = substr(trim($_POST['gracz']), 0, 200);
    $fr1 = substr(trim($_POST['frakcja1'] ?? ''), 0, 80);
    $fr2 = substr(trim($_POST['frakcja2'] ?? ''), 0, 80);
    $zniszczone = substr(trim($_POST['zniszczone_statki'] ?? ''), 0, 2000);
    $punkty = isset($_POST['punkty']) && $_POST['punkty'] !== '' ? (int)$_POST['punkty'] : 0;

    // check if user's record for this player exists
    $check = mysqli_prepare($conn, "SELECT id, frakcja1, frakcja2, zniszczone_statki, punkty FROM wyniki WHERE gracz = ? AND user_id = ?");
    mysqli_stmt_bind_param($check, 'si', $gracz, $user_id);
    mysqli_stmt_execute($check);
    $r = mysqli_stmt_get_result($check);
    if ($row = mysqli_fetch_assoc($r)) {
        $update = mysqli_prepare($conn, "UPDATE wyniki SET frakcja1=?, frakcja2=?, zniszczone_statki=?, punkty=? WHERE id=?");
        mysqli_stmt_bind_param($update, 'sssii',
            $fr1 !== '' ? $fr1 : $row['frakcja1'],
            $fr2 !== '' ? $fr2 : $row['frakcja2'],
            $zniszczone !== '' ? $zniszczone : $row['zniszczone_statki'],
            $punkty,
            $row['id']
        );
        mysqli_stmt_execute($update);
        mysqli_stmt_close($update);
        $msg = "Dane zaktualizowane.";
    } else {
        $insert = mysqli_prepare($conn, "INSERT INTO wyniki (user_id, gracz, frakcja1, frakcja2, zniszczone_statki, punkty) VALUES (?,?,?,?,?,?)");
        mysqli_stmt_bind_param($insert,'issssi',$user_id,$gracz,$fr1,$fr2,$zniszczone,$punkty);
        mysqli_stmt_execute($insert);
        mysqli_stmt_close($insert);
        $msg = "Dane dodane.";
    }
    mysqli_stmt_close($check);
    echo json_encode(['message'=>$msg]);
    exit;
}

// DELETE LAST (AJAX)
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['deleteLast'], $_POST['csrf_token'])) {
    if (!isset($_SESSION['user_id'])) { echo json_encode(['message'=>'Musisz się zalogować.']); exit; }
    if (!check_csrf($_POST['csrf_token'])) { echo json_encode(['message'=>'CSRF']); exit; }

    $user_id = (int)$_SESSION['user_id'];
    $del = mysqli_prepare($conn, "DELETE FROM wyniki WHERE user_id = ? ORDER BY id DESC LIMIT 1");
    mysqli_stmt_bind_param($del, 'i', $user_id);
    mysqli_stmt_execute($del);
    $affected = mysqli_stmt_affected_rows($del);
    mysqli_stmt_close($del);
    $msg = $affected > 0 ? "Ostatni rekord usunięty." : "Brak rekordów do usunięcia.";
    echo json_encode(['message'=>$msg]);
    exit;
}

// UPLOAD PHOTO
$upload_message = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['upload_photo'], $_POST['csrf_token'])) {
    if (!isset($_SESSION['user_id'])) { $upload_message = 'Musisz się zalogować.'; }
    elseif (!check_csrf($_POST['csrf_token'])) { $upload_message = 'CSRF.'; }
    else {
        if (!isset($_FILES['zdjecie']) || $_FILES['zdjecie']['error'] !== UPLOAD_ERR_OK) {
            $upload_message = 'Błąd przesyłania pliku.';
        } else {
            if ($_FILES['zdjecie']['size'] > UPLOAD_MAX_BYTES) {
                $upload_message = 'Plik jest za duży.';
            } else {
                // validate mime & extension
                $finfo = finfo_open(FILEINFO_MIME_TYPE);
                $mime = finfo_file($finfo, $_FILES['zdjecie']['tmp_name']);
                finfo_close($finfo);
                $allowed_mime = ['image/jpeg','image/png','image/gif','image/webp'];
                $ext = strtolower(pathinfo($_FILES['zdjecie']['name'], PATHINFO_EXTENSION));
                $allowed_ext = ['jpg','jpeg','png','gif','webp'];

                if (!in_array($mime, $allowed_mime) || !in_array($ext, $allowed_ext)) {
                    $upload_message = 'Nieobsługiwany format pliku.';
                } else {
                    // ensure upload dir exists (outside public root if possible)
                    if (!is_dir(UPLOAD_DIR)) {
                        if (!mkdir(UPLOAD_DIR, 0755, true)) {
                            $upload_message = 'Nie udało się utworzyć katalogu uploadów.';
                        }
                    }
                    if ($upload_message === '') {
                        // generate filename
                        $safe_name = time() . '_' . bin2hex(random_bytes(8)) . '.' . $ext;
                        $dst = rtrim(UPLOAD_DIR, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . $safe_name;

                        // Move uploaded file
                        if (!move_uploaded_file($_FILES['zdjecie']['tmp_name'], $dst)) {
                            $upload_message = 'Błąd zapisu pliku.';
                        } else {
                            // store relative identifier in DB (we store filename only)
                            $user_id = (int)$_SESSION['user_id'];
                            $store = mysqli_prepare($conn, "INSERT INTO galeria (user_id, filename, mime) VALUES (?,?,?)");
                            mysqli_stmt_bind_param($store, 'iss', $user_id, $safe_name, $mime);
                            mysqli_stmt_execute($store);
                            mysqli_stmt_close($store);
                            $upload_message = 'Zdjęcie przesłane poprawnie.';
                        }
                    }
                }
            }
        }
    }
}

// ----------------- HTML OUTPUT -----------------
?>
<!doctype html>
<html lang="pl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Panel - X Wing</title>
<link rel="stylesheet" href="CSS/bootstrap.css">
</head>
<body>
<header class="container mt-3">
    <h1>X Wing - Panel</h1>
    <?php if (isset($_SESSION['user_id'])): ?>
        <p>Zalogowany jako: <strong><?= e($_SESSION['login']) ?></strong> — <a href="?action=logout">Wyloguj</a></p>
    <?php endif; ?>
</header>

<main class="container">
    <?php if (!isset($_SESSION['user_id'])): ?>
        <section class="card p-3 mb-3">
            <h2>Logowanie</h2>
            <?php if ($login_error): ?><div class="alert alert-danger"><?= e($login_error) ?></div><?php endif; ?>
            <form method="post" novalidate>
                <input type="hidden" name="csrf_token" value="<?= csrf_token() ?>">
                <div class="mb-2">
                    <label>Login<input name="login" type="text" class="form-control" required></label>
                </div>
                <div class="mb-2">
                    <label>Hasło<input name="password" type="password" class="form-control" required></label>
                </div>
                <button class="btn btn-primary" type="submit">Zaloguj</button>
            </form>
            <p class="mt-2 text-muted">Uwaga: jeśli nie masz konta, dodaj użytkownika bezpośrednio do tabeli `users` (password hashowane funkcją password_hash).</p>
        </section>
    <?php else: ?>

    <section class="card p-3 mb-3">
        <h2>Dodaj / zaktualizuj wynik</h2>
        <div id="insertMessage" class="alert alert-info" style="display:none;"></div>
        <form id="battleForm" method="post" novalidate>
            <input type="hidden" name="csrf_token" value="<?= csrf_token() ?>">
            <div class="mb-2"><label>Gracz<input name="gracz" class="form-control" maxlength="200"></label></div>
            <div class="mb-2">
                <label>Frakcja 1
                    <select name="frakcja1" class="form-select">
                        <option value="">--</option>
                        <option>Imperium</option><option>Rebelia</option><option>Scumy</option>
                        <option>Ruch Oporu</option><option>Najwyższy_Porządek</option>
                    </select>
                </label>
            </div>
            <div class="mb-2">
                <label>Frakcja 2
                    <select name="frakcja2" class="form-select">
                        <option value="">--</option>
                        <option>Imperium</option><option>Rebelia</option><option>Scumy</option>
                        <option>Ruch Oporu</option><option>Najwyższy_Porządek</option>
                    </select>
                </label>
            </div>
            <div class="mb-2"><label>Zniszczone statki<textarea name="zniszczone_statki" class="form-control" rows="3" maxlength="2000"></textarea></label></div>
            <div class="mb-2"><label>Punkty<input name="punkty" type="number" class="form-control"></label></div>
            <div class="d-flex gap-2">
                <button class="btn btn-primary" type="submit">Zapisz</button>
                <button type="button" id="deleteLastButton" class="btn btn-danger">Usuń ostatni rekord</button>
            </div>
        </form>
    </section>

    <section class="card p-3 mb-3">
        <h2>Prześlij zdjęcie do galerii</h2>
        <?php if ($upload_message): ?><div class="alert alert-info"><?= e($upload_message) ?></div><?php endif; ?>
        <form method="post" enctype="multipart/form-data">
            <input type="hidden" name="csrf_token" value="<?= csrf_token() ?>">
            <div class="mb-2">
                <label>Wybierz zdjęcie (max 40 MB)
                    <input type="file" name="zdjecie" accept="image/*" class="form-control">
                </label>
            </div>
            <button class="btn btn-success" name="upload_photo" type="submit">Prześlij</button>
        </form>
    </section>

    <?php endif; ?>

    <section class="card p-3 mb-3">
        <h2>Tabela wyników</h2>
        <?php
        // Bezpieczne pobieranie wszystkich wyników (prepared statement nie jest konieczne bez parametrów, ale stosujemy dla konsekwencji)
        $stmt = mysqli_prepare($conn, "SELECT id, user_id, gracz, frakcja1, frakcja2, zniszczone_statki, punkty FROM wyniki ORDER BY punkty DESC, id DESC");
        mysqli_stmt_execute($stmt);
        $res = mysqli_stmt_get_result($stmt);
        if ($res && mysqli_num_rows($res) > 0):
        ?>
            <div class="table-responsive">
                <table class="table table-striped">
                    <thead><tr><th>Gracz</th><th>Frakcja 1</th><th>Frakcja 2</th><th>Zniszczone</th><th>Punkty</th></tr></thead>
                    <tbody>
                    <?php while ($row = mysqli_fetch_assoc($res)): ?>
                        <tr>
                            <td><?= e($row['gracz']) ?></td>
                            <td><?= e($row['frakcja1']) ?></td>
                            <td><?= e($row['frakcja2']) ?></td>
                            <td><?= e($row['zniszczone_statki']) ?></td>
                            <td><?= e($row['punkty']) ?></td>
                        </tr>
                    <?php endwhile; ?>
                    </tbody>
                </table>
            </div>
        <?php else: ?>
            <p>Brak wyników do wyświetlenia.</p>
        <?php endif;
        mysqli_stmt_close($stmt);
        ?>
    </section>

    <section class="card p-3 mb-3">
        <h2>Galeria</h2>
        <div class="d-flex flex-wrap gap-2">
            <?php
            // Pobieramy listę plików z bazy i generujemy bezpieczne linki do serve_image.php?img=<id>
            $g = mysqli_prepare($conn, "SELECT id, filename, mime FROM galeria ORDER BY id DESC LIMIT 48");
            mysqli_stmt_execute($g);
            $gr = mysqli_stmt_get_result($g);
            if ($gr && mysqli_num_rows($gr) > 0) {
                while ($img = mysqli_fetch_assoc($gr)) {
                    $id = (int)$img['id'];
                    $thumb = 'serve_image.php?id=' . $id; // serve_image pobierze plik i ustawi Content-Type
                    echo '<div style="width:150px"><img src="' . e($thumb) . '" style="max-width:100%;height:auto;border:1px solid #ddd;padding:4px;background:#fff"></div>';
                }
            } else {
                echo '<p>Brak zdjęć w galerii.</p>';
            }
            mysqli_stmt_close($g);
            ?>
        </div>
    </section>

</main>

<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script>
$(function(){
    $('#battleForm').on('submit', function(e){
        e.preventDefault();
        var form = $(this);
        $.ajax({
            url: '',
            type: 'POST',
            data: form.serialize(),
            dataType: 'json',
            success: function(res){
                $('#insertMessage').text(res.message).show().fadeOut(4000);
            },
            error: function(){
                $('#insertMessage').text('Wystąpił błąd serwera').show().fadeOut(4000);
            }
        });
    });
    $('#deleteLastButton').on('click', function(){
        $.ajax({
            url: '',
            type: 'POST',
            data: { deleteLast: 1, csrf_token: '<?= csrf_token() ?>' },
            dataType: 'json',
            success: function(res){
                $('#insertMessage').text(res.message).show().fadeOut(4000);
            },
            error: function(){
                $('#insertMessage').text('Wystąpił błąd serwera').show().fadeOut(4000);
            }
        });
    });
});
</script>
</body>
</html>
