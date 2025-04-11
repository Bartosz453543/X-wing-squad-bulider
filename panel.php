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

// Funkcja łączenia z bazą danych
function db_connect() 
{
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
$insert_message = "";

// Obsługa AJAX
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
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
            // Gracz istnieje – aktualizuj dane
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
            // Gracz nie istnieje – dodaj nowy wpis
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

    // Zwracamy odpowiedź w formacie JSON
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
</head>
<body>
    <?php getHeader(); ?>
    <main>
        <section class="panel">
            <section class="container mt-4">
                <h1>Formularz – Star Wars Battle</h1>

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
                    <a href="index.php"><button type="button" class="btn btn-secondary">Powrót do strony głównej</button></a>
                </form>
            </section>
        </section>
    </main>
    <?php getFooter(); ?>

    <script>
        $(document).ready(function() {
            $('#battleForm').on('submit', function(e) {
                e.preventDefault(); // Zatrzymaj domyślną akcję formularza
                var formData = $(this).serialize(); // Serializuj dane formularza

                $.ajax({
                    url: '', // Pozostaje ta sama strona
                    type: 'POST',
                    data: formData,
                    dataType: 'json',
                    success: function(response) {
                        // Wyświetl komunikat o wyniku
                        $('#insertMessage').text(response.message).show();
                    },
                    error: function() {
                        $('#insertMessage').text('Wystąpił błąd przy zapisywaniu danych.').show();
                    }
                });
            });
        });
    </script>
</body>
</html>
