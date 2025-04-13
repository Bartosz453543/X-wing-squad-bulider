<?php
session_start();
include 'template.php';

// Raportowanie błędów (tylko do debugowania)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Konfiguracja bazy danych
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'x wing');

// Funkcja łączenia z bazą danych
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

// Obsługa logowania (formularz logowania przesyłany metodą POST)
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['login'], $_POST['password'])) {
    try {
        $login    = trim($_POST['login']);
        $password = trim($_POST['password']);
        
        if (empty($login) || empty($password)) {
            throw new Exception('Wszystkie pola są wymagane.');
        }
        
        $stmt = mysqli_prepare($conn, "SELECT id, login, haslo FROM users WHERE login = ?");
        if (!$stmt) {
            throw new Exception('Wystąpił błąd podczas przygotowywania zapytania.');
        }
        mysqli_stmt_bind_param($stmt, "s", $login);
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);
        
        if ($result && mysqli_num_rows($result) === 1) {
            $user = mysqli_fetch_assoc($result);
            if (password_verify($password, $user['haslo'])) {
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['login']   = $user['login'];
                // Po zalogowaniu następuje przekierowanie na tę samą stronę
                header("Location: " . $_SERVER['PHP_SELF']);
                exit;
            } else {
                throw new Exception('Nieprawidłowy login lub hasło.');
            }
        } else {
            throw new Exception('Nieprawidłowy login lub hasło.');
        }
        mysqli_stmt_close($stmt);
    } catch (Exception $e) {
        $login_error = $e->getMessage();
    }
}

// Obsługa formularza wyników (AJAX) – dostępna tylko dla zalogowanych użytkowników
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['gracz'])) {
    // Jeśli użytkownik nie jest zalogowany, zwróć komunikat o błędzie
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['message' => 'Musisz się zalogować, aby zapisać dane.']);
        exit();
    }
    
    $gracz = trim($_POST['gracz'] ?? '');
    $frakcja1 = trim($_POST['frakcja1'] ?? '');
    $frakcja2 = trim($_POST['frakcja2'] ?? '');
    $zniszczone_statki = intval($_POST['zniszczone_statki'] ?? 0);
    $punkty = intval($_POST['punkty'] ?? 0);
    
    if (empty($gracz) || empty($frakcja1) || empty($frakcja2)) {
        $insert_message = "Wszystkie pola są wymagane.";
    } else {
        // Sprawdź, czy gracz już istnieje
        $check_stmt = mysqli_prepare($conn, "SELECT id FROM wyniki WHERE gracz = ?");
        mysqli_stmt_bind_param($check_stmt, "s", $gracz);
        mysqli_stmt_execute($check_stmt);
        mysqli_stmt_store_result($check_stmt);
        
        if (mysqli_stmt_num_rows($check_stmt) > 0) {
            // Aktualizacja danych
            $update_stmt = mysqli_prepare($conn, "UPDATE wyniki SET frakcja1 = ?, frakcja2 = ?, zniszczone_statki = ?, punkty = ? WHERE gracz = ?");
            if ($update_stmt) {
                mysqli_stmt_bind_param($update_stmt, "ssiis", $frakcja1, $frakcja2, $zniszczone_statki, $punkty, $gracz);
                mysqli_stmt_execute($update_stmt);
                $insert_message = "Dane gracza zostały zaktualizowane.";
                mysqli_stmt_close($update_stmt);
            } else {
                $insert_message = "Błąd przy aktualizacji danych.";
            }
        } else {
            // Dodanie nowego wpisu
            $insert_stmt = mysqli_prepare($conn, "INSERT INTO wyniki (gracz, frakcja1, frakcja2, zniszczone_statki, punkty) VALUES (?, ?, ?, ?, ?)");
            if ($insert_stmt) {
                mysqli_stmt_bind_param($insert_stmt, "sssii", $gracz, $frakcja1, $frakcja2, $zniszczone_statki, $punkty);
                mysqli_stmt_execute($insert_stmt);
                $insert_message = "Dane zostały dodane poprawnie!";
                mysqli_stmt_close($insert_stmt);
            } else {
                $insert_message = "Błąd przy dodawaniu danych.";
            }
        }
        mysqli_stmt_close($check_stmt);
    }
    
    echo json_encode(['message' => $insert_message]);
    exit();
}
?>
<!DOCTYPE html>
<html lang="pl">
<head>
    <?php getHead(); ?>
    <link rel="stylesheet" href="bootstrap.css">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <meta charset="UTF-8">
    <title>Panel użytkownika</title>
</head>
<body>
<?php getHeader(); ?>
<main>
<?php if (!isset($_SESSION['user_id'])): ?>
    <!-- Formularz logowania -->
    <section class="login container mt-5">
        <h2>Logowanie</h2>
        <?php if (!empty($login_error)) {
            echo "<section class='alert alert-danger' role='alert'>{$login_error}</section>";
        } ?>
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
    <!-- Formularz wyników dostępny tylko dla zalogowanych -->
    <section class="panel container mt-5">
        <h2>Panel – Star Wars Battle</h2>
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
                <input type="number" class="form-control" id="zniszczone_statki" name="zniszczone_statki" required>
            </section>
            <section class="mb-3">
                <label for="punkty" class="form-label">Punkty</label>
                <input type="number" class="form-control" id="punkty" name="punkty" required>
            </section>
            <button type="submit" class="btn btn-primary">Zapisz</button>
            <a href="index.php" class="btn btn-secondary">Powrót</a>
        </form>
    </section>
<?php endif; ?>
</main>
<?php getFooter(); ?>

<?php if (isset($_SESSION['user_id'])): ?>
<script>
    $(document).ready(function() {
        $('#battleForm').on('submit', function(e) {
            e.preventDefault(); // Zatrzymanie domyślnej akcji formularza
            var formData = $(this).serialize();
            $.ajax({
                url: '', // wysyła do tej samej strony
                type: 'POST',
                data: formData,
                dataType: 'json',
                success: function(response) {
                    $('#insertMessage').text(response.message).show();
                },
                error: function() {
                    $('#insertMessage').text('Wystąpił błąd przy zapisywaniu danych.').show();
                }
            });
        });
    });
</script>
<?php endif; ?>
</body>
</html>
