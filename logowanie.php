<?php
session_start();
include 'template.php';

// Raportowanie błędów (włączamy tylko do debugowania)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Konfiguracja bazy danych
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'x wing');

// Funkcja łączenia z bazą danych z wykorzystaniem try-catch
function db_connect() 
{
    try 
    {
        $conn = @mysqli_connect(DB_HOST, DB_USER, DB_PASS, DB_NAME);
        if (!$conn) {
            throw new Exception("Błąd połączenia: " . mysqli_connect_error());
        }
        mysqli_set_charset($conn, "utf8");
        return $conn;
    } 
    catch (Exception $e) 
    {
        die("Wystąpił problem podczas łączenia z bazą danych: " . $e->getMessage());
    }
}

$conn = db_connect();
$login_error = '';

try {
    // Przetwarzanie formularza logowania, gdy metoda to POST
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Pobranie danych z formularza
        $login    = trim($_POST['login']);
        $password = trim($_POST['password']);

        // Podstawowa walidacja pól
        if (empty($login) || empty($password)) {
            throw new Exception('Wszystkie pola są wymagane.');
        } else {
            // Przygotowanie zapytania SQL
            $stmt = mysqli_prepare($conn, "SELECT id, login, haslo FROM users WHERE login = ?");
            if (!$stmt) {
                throw new Exception('Wystąpił błąd podczas przygotowywania zapytania.');
            }
            mysqli_stmt_bind_param($stmt, "s", $login);
            mysqli_stmt_execute($stmt);
            
            // Pobranie wyniku przy pomocy get_result (wymaga sterownika MySQLnd)
            $result = mysqli_stmt_get_result($stmt);
            if ($result && mysqli_num_rows($result) === 1) {
                $user = mysqli_fetch_assoc($result);

                // Weryfikacja hasła – używamy funkcji password_verify(), aby porównać hasło z formularza z zahashowaną wartością w bazie
                if (password_verify($password, $user['haslo'])) {
                    // Dane są poprawne – zapisujemy informacje o użytkowniku w sesji
                    $_SESSION['user_id'] = $user['id'];
                    $_SESSION['login']   = $user['login'];
                    // Przekierowanie do panelu użytkownika (np. index.php)
                    header("Location: index.php");
                    exit;
                } else {
                    throw new Exception('Nieprawidłowy login lub hasło.');
                }
            } else {
                throw new Exception('Nieprawidłowy login lub hasło.');
            }
            mysqli_stmt_close($stmt);
        }
    }
} catch (Exception $e) {
    // Przechwycenie wyjątku i zapisanie komunikatu błędu
    $login_error = $e->getMessage();
}
?>
<!DOCTYPE html>
<html lang="pl">
<head>
    <?php getHead(); ?>
    <link rel="stylesheet" href="bootstrap.css">
    <meta charset="UTF-8">
    <title>Logowanie</title>
</head>
<body>
    <?php getHeader(); ?>
    <main>
        <section class="login container mt-5">
            <h2>Logowanie</h2>
            <?php
                // Wyświetlenie komunikatu o błędzie (jeśli wystąpił)
                if (!empty($login_error)) {
                    echo "<section class='alert alert-danger' role='alert'>{$login_error}</section>";
                }
            ?>
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
                <a href="index.php"><button type="button" class="btn btn-secondary">Powrót do strony głównej</button></a>
            </form>
        </section>
    </main>
    <?php getFooter(); ?>
</body>
</html>
