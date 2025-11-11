<?php
// ---------------- SESJE ----------------
session_start([
    'cookie_httponly' => true,
    'cookie_secure' => true, // true jeśli HTTPS
    'cookie_samesite' => 'Strict'
]);

include 'template.php';

// ---------------- BŁĘDY ----------------
error_reporting(E_ALL);
ini_set('display_errors', 0); // w produkcji wyłączamy

// ---------------- KONFIGURACJA BAZY ----------------
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'x_wing');

function db_connect() {
    $conn = mysqli_connect(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    if (!$conn) die("Błąd połączenia z bazą danych.");
    mysqli_set_charset($conn, "utf8");
    return $conn;
}

$conn = db_connect();

// ---------------- CSRF TOKEN ----------------
if (empty($_SESSION['csrf_token'])) $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
function check_csrf($token) { return isset($_SESSION['csrf_token']) && hash_equals($_SESSION['csrf_token'], $token); }

// ---------------- LIMIT PRÓB LOGOWANIA ----------------
if (!isset($_SESSION['login_attempts'])) $_SESSION['login_attempts'] = 0;
if (!isset($_SESSION['last_attempt'])) $_SESSION['last_attempt'] = time();

// ---------------- FUNKCJA SANITYZUJĄCA ----------------
function safe_echo($string) { return htmlspecialchars($string, ENT_QUOTES, 'UTF-8'); }

// ---------------- LOGOWANIE ----------------
$login_error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['login'], $_POST['password'], $_POST['csrf_token'])) {
    if (!check_csrf($_POST['csrf_token'])) die("Błąd CSRF.");

    // Limit prób logowania: max 5 prób / 10 minut
    if ($_SESSION['login_attempts'] >= 5 && (time() - $_SESSION['last_attempt']) < 600) {
        die("Zbyt wiele prób logowania. Spróbuj później.");
    }

    $login = trim($_POST['login']);
    $password = trim($_POST['password']);

    $stmt = mysqli_prepare($conn, "SELECT id, login, haslo FROM users WHERE login = ?");
    mysqli_stmt_bind_param($stmt, "s", $login);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);

    if ($result && $user = mysqli_fetch_assoc($result)) {
        if (password_verify($password, $user['haslo'])) {
            session_regenerate_id(true);
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['login'] = $user['login'];
            $_SESSION['login_attempts'] = 0;
            header("Location: " . $_SERVER['PHP_SELF']);
            exit;
        }
    }

    $_SESSION['login_attempts'] += 1;
    $_SESSION['last_attempt'] = time();
    $login_error = 'Nieprawidłowy login lub hasło.';
    mysqli_stmt_close($stmt);
}

// ---------------- ZAPIS WYNIKÓW ----------------
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['gracz'], $_POST['csrf_token']) && !isset($_POST['upload_photo'], $_POST['deleteLast'])) {
    if (!isset($_SESSION['user_id'])) { echo json_encode(['message'=>'Musisz się zalogować.']); exit; }
    if (!check_csrf($_POST['csrf_token'])) die("Błąd CSRF.");

    $gracz = trim($_POST['gracz']);
    $frakcja1 = trim($_POST['frakcja1'] ?? '');
    $frakcja2 = trim($_POST['frakcja2'] ?? '');
    $zniszczone_statki = trim($_POST['zniszczone_statki'] ?? '');
    $punkty = isset($_POST['punkty']) && $_POST['punkty'] !== '' ? intval($_POST['punkty']) : 0;

    $check_stmt = mysqli_prepare($conn, "SELECT id, frakcja1, frakcja2, zniszczone_statki, punkty FROM wyniki WHERE gracz = ? AND user_id = ?");
    mysqli_stmt_bind_param($check_stmt, "si", $gracz, $_SESSION['user_id']);
    mysqli_stmt_execute($check_stmt);
    $result = mysqli_stmt_get_result($check_stmt);

    if ($row = mysqli_fetch_assoc($result)) {
        $update_stmt = mysqli_prepare($conn, "UPDATE wyniki SET frakcja1=?, frakcja2=?, zniszczone_statki=?, punkty=? WHERE id=?");
        mysqli_stmt_bind_param($update_stmt, "sssii",
            $frakcja1 ?: $row['frakcja1'],
            $frakcja2 ?: $row['frakcja2'],
            $zniszczone_statki ?: $row['zniszczone_statki'],
            $punkty,
            $row['id']
        );
        mysqli_stmt_execute($update_stmt);
        mysqli_stmt_close($update_stmt);
        $msg = "Dane zaktualizowane.";
    } else {
        $insert_stmt = mysqli_prepare($conn, "INSERT INTO wyniki (user_id, gracz, frakcja1, frakcja2, zniszczone_statki, punkty) VALUES (?,?,?,?,?,?)");
        mysqli_stmt_bind_param($insert_stmt, "issssi", $_SESSION['user_id'], $gracz, $frakcja1, $frakcja2, $zniszczone_statki, $punkty);
        mysqli_stmt_execute($insert_stmt);
        mysqli_stmt_close($insert_stmt);
        $msg = "Dane dodane.";
    }
    mysqli_stmt_close($check_stmt);
    echo json_encode(['message'=>$msg]);
    exit();
}

// ---------------- USUWANIE OSTATNIEGO REKORDU ----------------
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['deleteLast'], $_POST['csrf_token'])) {
    if (!isset($_SESSION['user_id'])) { echo json_encode(['message'=>'Musisz się zalogować.']); exit; }
    if (!check_csrf($_POST['csrf_token'])) die("Błąd CSRF.");

    $delete_stmt = mysqli_prepare($conn, "DELETE FROM wyniki WHERE user_id=? ORDER BY id DESC LIMIT 1");
    mysqli_stmt_bind_param($delete_stmt, "i", $_SESSION['user_id']);
    mysqli_stmt_execute($delete_stmt);
    $msg = mysqli_stmt_affected_rows($delete_stmt) > 0 ? "Rekord usunięty." : "Brak rekordów.";
    mysqli_stmt_close($delete_stmt);
    echo json_encode(['message'=>$msg]);
    exit();
}

// ---------------- UPLOAD ZDJĘCIA (BEZPIECZNY) ----------------
$upload_message = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['upload_photo'], $_POST['csrf_token'])) {
    if (!isset($_SESSION['user_id'])) die("Musisz się zalogować.");
    if (!check_csrf($_POST['csrf_token'])) die("Błąd CSRF.");

    if (!isset($_FILES['zdjecie']) || $_FILES['zdjecie']['error'] !== UPLOAD_ERR_OK) {
        $upload_message = 'Błąd przesyłania.';
    } else {
        $allowed_mime = ['image/jpeg', 'image/png', 'image/gif'];
        $allowed_ext  = ['jpg', 'jpeg', 'png', 'gif'];

        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mime = finfo_file($finfo, $_FILES['zdjecie']['tmp_name']);
        finfo_close($finfo);

        $ext = strtolower(pathinfo($_FILES['zdjecie']['name'], PATHINFO_EXTENSION));

        if (!in_array($mime, $allowed_mime) || !in_array($ext, $allowed_ext)) {
            $upload_message='Nieprawidłowy format pliku.';
        } else {
            $upload_dir = __DIR__.'/uploads/'; // najlepiej poza publicznym katalogiem
            if (!file_exists($upload_dir)) mkdir($upload_dir, 0777, true);

            $file_path = $upload_dir . time() . '_' . bin2hex(random_bytes(8)) . '.' . $ext;

            if (move_uploaded_file($_FILES['zdjecie']['tmp_name'], $file_path)) {
                $stmt = mysqli_prepare($conn, "INSERT INTO galeria (zdjecia, user_id) VALUES (?,?)");
                mysqli_stmt_bind_param($stmt, "si", $file_path, $_SESSION['user_id']);
                mysqli_stmt_execute($stmt);
                mysqli_stmt_close($stmt);
                $upload_message = 'Zdjęcie dodane!';
            } else $upload_message = 'Nie udało się zapisać pliku.';
        }
    }
}
?>
<!DOCTYPE html>
<html lang="pl">
<head>
    <?php getHead(); ?>
    <link rel="stylesheet" href="CSS/bootstrap.css">
    <meta charset="UTF-8">
    <title>Panel użytkownika</title>
</head>
<body>
<?php getHeader(); ?>
<main class="hole">
<?php if (!isset($_SESSION['user_id'])): ?>
<section class="login_text">
<section class="login container mt-5">
    <h2>Logowanie</h2>
    <?php if (!empty($login_error)) echo "<section class='alert alert-danger'>".safe_echo($login_error)."</section>"; ?>
    <form method="POST" action="">
        <input type="hidden" name="csrf_token" value="<?php echo $_SESSION['csrf_token']; ?>">
        <div class="mb-3">
            <label for="login" class="form-label">Login</label>
            <input type="text" name="login" id="login" class="form-control" placeholder="login" required>
        </div>
        <div class="mb-3">
            <label for="password" class="form-label">Hasło</label>
            <input type="password" name="password" id="password" class="form-control" placeholder="hasło" required>
        </div>
        <button type="submit" class="btn btn-primary">Zaloguj się</button>
    </form>
</section>
</section>
<?php else: ?>
<section class="panel container mt-5">
    <h2>Panel do tabelki <i>X wing 2.5</i></h2>
    <div id="insertMessage" class="alert alert-info" style="display:none;"></div>
    <form id="battleForm" method="POST" action="">
        <input type="hidden" name="csrf_token" value="<?php echo $_SESSION['csrf_token']; ?>">
        <div class="mb-3">
            <label for="gracz" class="form-label">Gracz</label>
            <input type="text" class="form-control" id="gracz" name="gracz">
        </div>
        <div class="mb-3">
            <label for="frakcja1" class="form-label">Frakcja 1</label>
            <select class="form-select" id="frakcja1" name="frakcja1">
                <option value="" selected>Wybierz frakcję...</option>
                <option value="Imperium">Imperium</option>
                <option value="Rebelia">Rebelia</option>
                <option value="Scumy">Scumy</option>
                <option value="Ruch_Oporu">Ruch Oporu</option>
                <option value="Najwyższy_Porządek">Najwyższy Porządek</option>
                <option value="Republika">Republika</option>
                <option value="Separatyści">Separatyści</option>
            </select>
        </div>
        <div class="mb-3">
            <label for="frakcja2" class="form-label">Frakcja 2</label>
            <select class="form-select" id="frakcja2" name="frakcja2">
                <option value="" selected>Wybierz frakcję...</option>
                <option value="Imperium">Imperium</option>
                <option value="Rebelia">Rebelia</option>
                <option value="Scumy">Scumy</option>
                <option value="Ruch_Oporu">Ruch Oporu</option>
                <option value="Najwyższy_Porządek">Najwyższy Porządek</option>
                <option value="Republika">Republika</option>
                <option value="Separatyści">Separatyści</option>
            </select>
        </div>
        <div class="mb-3">
            <label for="zniszczone_statki" class="form-label">Zniszczone statki</label>
            <textarea class="form-control" id="zniszczone_statki" name="zniszczone_statki" rows="3"></textarea>
        </div>
        <div class="mb-3">
            <label for="punkty" class="form-label">Punkty</label>
            <input type="number" class="form-control" id="punkty" name="punkty">
        </div>
        <div class="d-flex gap-2">
            <button type="submit" class="btn btn-primary">Zapisz</button>
            <button type="button" id="deleteLastButton" class="btn btn-danger">Usuń ostatni rekord</button>
            <a href="index.php" class="btn btn-secondary">Powrót</a>
        </div>
    </form>
</section>

<section class="panel container mt-5">
    <h3>Dodaj zdjęcie do galerii</h3>
    <form action="" method="POST" enctype="multipart/form-data">
        <input type="hidden" name="csrf_token" value="<?php echo $_SESSION['csrf_token']; ?>">
        <div class="mb-3">
            <label for="zdjecie" class="form-label">Wybierz zdjęcie (max 40 MB)</label>
            <input type="file" name="zdjecie" id="zdjecie" class="form-control" accept="image/*">
        </div>
        <button type="submit" name="upload_photo" class="btn btn-success">Prześlij zdjęcie</button>
    </form>
    <?php if (!empty($upload_message)): ?>
        <div class="alert alert-<?php echo ($upload_message === 'Zdjęcie dodane!') ? 'success' : 'danger'; ?> mt-3">
            <?php echo safe_echo($upload_message); ?>
        </div>
    <?php endif; ?>
</section>
<?php endif; ?>
</main>
<?php getFooter(); ?>

<?php if (isset($_SESSION['user_id'])): ?>
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script>
$(document).ready(function() {
    $('#battleForm').on('submit', function(e) {
        e.preventDefault();
        var formData = $(this).serialize();
        $.ajax({
            url: '',
            type: 'POST',
            data: formData,
            dataType: 'json',
            success: function(response) {
                $('#insertMessage').text(response.message).show();
            },
            error: function() {
                $('#insertMessage').text('Wystąpił błąd przy zapisie.').show();
            }
        });
    });
    $('#deleteLastButton').on('click', function() {
        $.ajax({
            url: '',
            type: 'POST',
            data: { deleteLast: 1, csrf_token: '<?php echo $_SESSION['csrf_token']; ?>' },
            dataType: 'json',
            success: function(response) {
                $('#insertMessage').text(response.message).show();
            },
            error: function() {
                $('#insertMessage').text('Wystąpił błąd przy usuwaniu rekordu.').show();
            }
        });
    });
});
</script>
<?php endif; ?>
