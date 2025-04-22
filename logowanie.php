<?php
session_start();
include 'template.php';

error_reporting(E_ALL);
ini_set('display_errors', 1);

define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'x wing');

function db_connect() {
    try {
        $conn = @mysqli_connect(DB_HOST, DB_USER, DB_PASS, DB_NAME);
        if (!$conn) {
            throw new Exception("Błąd połączenia: " . mysqli_connect_error());
        }
        mysqli_set_charset($conn, "utf8");
        return $conn;
    } catch (Exception $e) {
        die("Wystąpił problem podczas łączenia z bazą danych: " . $e->getMessage());
    }
}

$conn = db_connect();
$login_error = '';
$insert_message = '';
$upload_message = '';

// Obsługa usunięcia ostatniego rekordu
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['deleteLast'])) {
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['message' => 'Musisz się zalogować, aby usunąć rekord.']);
        exit();
    }

    try {
        $delete_stmt = mysqli_prepare($conn, "DELETE FROM wyniki ORDER BY id DESC LIMIT 1");
        if (!$delete_stmt) throw new Exception('Błąd przy przygotowywaniu usunięcia rekordu.');
        mysqli_stmt_execute($delete_stmt);
        $delete_message = mysqli_stmt_affected_rows($delete_stmt) > 0
            ? "Ostatni rekord został usunięty."
            : "Brak rekordów do usunięcia.";
        mysqli_stmt_close($delete_stmt);
    } catch (Exception $e) {
        $delete_message = "Wystąpił błąd: " . $e->getMessage();
    }

    echo json_encode(['message' => $delete_message]);
    exit();
}

// Logowanie
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['login'], $_POST['password'])) {
    try {
        $login = trim($_POST['login']);
        $password = trim($_POST['password']);

        if (empty($login) || empty($password)) {
            throw new Exception('Wszystkie pola są wymagane.');
        }

        $stmt = mysqli_prepare($conn, "SELECT id, login, haslo FROM users WHERE login = ?");
        if (!$stmt) throw new Exception('Błąd podczas przygotowywania zapytania.');

        mysqli_stmt_bind_param($stmt, "s", $login);
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);

        if ($result && mysqli_num_rows($result) === 1) {
            $user = mysqli_fetch_assoc($result);
            if (password_verify($password, $user['haslo'])) {
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['login']   = $user['login'];
                header("Location: " . $_SERVER['PHP_SELF']);
                exit;
            } else {
                throw new Exception('Nieprawidłowy login lub hasło.');
            }
        } else {
            throw new Exception('Nieprawidłowy login lub hasło.');
        }
    } catch (Exception $e) {
        $login_error = $e->getMessage();
    } finally {
        if (isset($stmt) && $stmt) mysqli_stmt_close($stmt);
    }
}

// Zapis wyników gracza
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['gracz'])) {
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['message' => 'Musisz się zalogować, aby zapisać dane.']);
        exit();
    }

    try {
        $gracz = trim($_POST['gracz'] ?? '');
        $frakcja1 = trim($_POST['frakcja1'] ?? '');
        $frakcja2 = trim($_POST['frakcja2'] ?? '');
        $zniszczone_statki = trim($_POST['zniszczone_statki'] ?? '');
        $punkty = intval($_POST['punkty'] ?? 0);

        if (empty($gracz) || empty($frakcja1) || empty($frakcja2)) {
            throw new Exception('Wszystkie pola są wymagane.');
        }

        $check_stmt = mysqli_prepare($conn, "SELECT id FROM wyniki WHERE gracz = ?");
        if (!$check_stmt) throw new Exception('Błąd przy sprawdzaniu istnienia rekordu.');
        mysqli_stmt_bind_param($check_stmt, "s", $gracz);
        mysqli_stmt_execute($check_stmt);
        mysqli_stmt_store_result($check_stmt);

        if (mysqli_stmt_num_rows($check_stmt) > 0) {
            $update_stmt = mysqli_prepare($conn, "UPDATE wyniki SET frakcja1 = ?, frakcja2 = ?, zniszczone_statki = ?, punkty = ? WHERE gracz = ?");
            if (!$update_stmt) throw new Exception('Błąd przy przygotowywaniu aktualizacji.');
            mysqli_stmt_bind_param($update_stmt, "sssis", $frakcja1, $frakcja2, $zniszczone_statki, $punkty, $gracz);
            mysqli_stmt_execute($update_stmt);
            $insert_message = "Dane gracza zostały zaktualizowane.";
            mysqli_stmt_close($update_stmt);
        } else {
            $insert_stmt = mysqli_prepare($conn, "INSERT INTO wyniki (gracz, frakcja1, frakcja2, zniszczone_statki, punkty) VALUES (?, ?, ?, ?, ?)");
            if (!$insert_stmt) throw new Exception('Błąd przy przygotowywaniu wstawienia.');
            mysqli_stmt_bind_param($insert_stmt, "ssssi", $gracz, $frakcja1, $frakcja2, $zniszczone_statki, $punkty);
            mysqli_stmt_execute($insert_stmt);
            $insert_message = "Dane zostały dodane poprawnie!";
            mysqli_stmt_close($insert_stmt);
        }

        mysqli_stmt_close($check_stmt);
    } catch (Exception $e) {
        $insert_message = $e->getMessage();
    }

    echo json_encode(['message' => $insert_message]);
    exit();
}

// Przesyłanie zdjęcia z limitem 40 MB
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['upload_photo'])) {
    if (!isset($_FILES['zdjecie']) || $_FILES['zdjecie']['error'] !== UPLOAD_ERR_OK) {
        $upload_message = 'Błąd podczas przesyłania zdjęcia.';
    } elseif ($_FILES['zdjecie']['size'] > 40 * 1024 * 1024) {
        $upload_message = 'Plik jest za duży. Maksymalny rozmiar to 40 MB.';
    } else {
        $upload_dir = 'uploads/';
        if (!file_exists($upload_dir)) {
            mkdir($upload_dir, 0777, true);
        }

        $file_tmp = $_FILES['zdjecie']['tmp_name'];
        $file_name = basename($_FILES['zdjecie']['name']);
        $file_path = $upload_dir . time() . '_' . $file_name;

        if (move_uploaded_file($file_tmp, $file_path)) {
            $stmt = mysqli_prepare($conn, "INSERT INTO galeria (zdjecia) VALUES (?)");
            mysqli_stmt_bind_param($stmt, "s", $file_path);
            mysqli_stmt_execute($stmt);
            mysqli_stmt_close($stmt);

            $upload_message = 'Zdjęcie zostało dodane!';
        } else {
            $upload_message = 'Nie udało się zapisać zdjęcia.';
        }
    }
}
?>

<!DOCTYPE html>
<html lang="pl">
<head>
    <?php getHead(); ?>
    <link rel="stylesheet" href="CSS/bootstrap.css">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <meta charset="UTF-8">
    <title>Panel użytkownika</title>
</head>
<body>
<?php getHeader(); ?>
<main>
<?php if (!isset($_SESSION['user_id'])): ?>
    <section class="login container mt-5">
        <h2>Logowanie</h2>
        <?php if (!empty($login_error)) echo "<section class='alert alert-danger'>{$login_error}</section>"; ?>
        <form method="POST" action="">
            <section class="form-floating mb-3">
                <input type="text" name="login" class="form-control" id="floatingInput" placeholder="Podaj login" required>
                <label for="floatingInput">Login</label>
            </section>
            <section class="form-floating mb-3">
                <input type="password" name="password" class="form-control" id="floatingPassword" placeholder="Hasło" required>
                <label for="floatingPassword">Hasło</label>
            </section>
            <button type="submit" class="btn btn-primary">Zaloguj się</button>
        </form>
    </section>
<?php else: ?>
    <section class="panel container mt-5">
        <h2>Panel do tabelki <i>X wing 2.5</i></h2>
        <section class="alert alert-info" id="insertMessage" style="display: none;"></section>
        <form id="battleForm" method="POST" action="">
            <section class="mb-3">
                <label for="gracz" class="form-label">Gracz</label>
                <input type="text" class="form-control" id="gracz" name="gracz" required>
            </section>
            <section class="mb-3">
                <label for="frakcja1" class="form-label">Frakcja 1</label>
                <select class="form-select" id="frakcja1" name="frakcja1" required>
                    <option value="" selected disabled>Wybierz frakcję...</option>
                    <option value="Imperium">Imperium</option>
                    <option value="Rebelia">Rebelia</option>
                    <option value="Republika">Republika</option>
                    <option value="Separatyści">Separatyści</option>
                </select>
            </section>
            <section class="mb-3">
                <label for="frakcja2" class="form-label">Frakcja 2</label>
                <select class="form-select" id="frakcja2" name="frakcja2" required>
                    <option value="" selected disabled>Wybierz frakcję...</option>
                    <option value="Imperium">Imperium</option>
                    <option value="Rebelia">Rebelia</option>
                    <option value="Republika">Republika</option>
                    <option value="Separatyści">Separatyści</option>
                </select>
            </section>
            <section class="mb-3">
                <label for="zniszczone_statki" class="form-label">Zniszczone statki</label>
                <textarea class="form-control" id="zniszczone_statki" name="zniszczone_statki" rows="3" required></textarea>
            </section>
            <section class="mb-3">
                <label for="punkty" class="form-label">Punkty</label>
                <input type="number" class="form-control" id="punkty" name="punkty" required>
            </section>
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
            <section class="mb-3">
                <label for="zdjęcie" class="form-label">Wybierz zdjęcie</label>
                <p>Maksymalny rozmiar zdjęcia: 40 MB</p>
                <input type="file" name="zdjecie" id="zdjecie" class="form-control" accept="image/*">
            </section>
            <button type="submit" name="upload_photo" class="btn btn-success">Prześlij zdjęcie</button>
        </form>
        <?php if (!empty($upload_message)): ?>
            <section id="uploadMessage" class="alert alert-<?php echo ($upload_message === 'Zdjęcie zostało dodane!') ? 'success' : 'danger'; ?> mt-3">
                <?php echo $upload_message; ?>
            </section>
        <?php endif; ?>
    </section>
<?php endif; ?>
</main>
<?php getFooter(); ?>

<?php if (isset($_SESSION['user_id'])): ?>
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
            data: { deleteLast: 1 },
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
</body>
</html>
