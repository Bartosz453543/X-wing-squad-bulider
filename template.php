<?php
// ===================================================
//  🔧 FUNKCJE SZABLONU (HEAD, HEADER, FOOTER)
// ===================================================

// Funkcja generująca sekcję <head>
function getHead() 
{
    ?>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Liga X wing</title>
        <link rel="stylesheet" href="CSS/reset.css">
        <link rel="stylesheet" href="CSS/style.css">
        <link rel="icon" href="swz-logotreatment.jpg">
    </head>
    <?php
}

// Funkcja generująca nagłówek strony
function getHeader()
{
    ?>
    <header class="main-header">
        <h1><a href="index.php">Dzielni Piloci Weterani</a></h1>
        <nav class="nav">
            <input type="checkbox" id="menu-toggle" class="menu-toggle">
            <label for="menu-toggle" class="menu-icon" id="menu-icon">
                <span></span>
                <span></span>
                <span></span>
            </label>
            <ul class="menu">
                <li><a href="edytor.html">Edytor</a></li>
                <?php if (isset($_SESSION['user_id'])) : ?>
                    <li><a href="logowanie.php">Panel użytkownika</a></li>
                    <!-- Bezpieczny logout z tokenem CSRF -->
                    <li>
                        <form method="POST" action="logout.php" style="display:inline;">
                            <input type="hidden" name="csrf_token" value="<?php echo htmlspecialchars($_SESSION['csrf_token'] ?? '', ENT_QUOTES, 'UTF-8'); ?>">
                            <button type="submit" style="background:none;border:none;padding:0;color:#007bff;cursor:pointer;">Wyloguj się</button>
                        </form>
                    </li>
                <?php else : ?>
                    <li><a href="logowanie.php">Zaloguj się</a></li>
                <?php endif; ?>
            </ul>
        </nav>
    </header>
    <script src="script.js" defer></script>
    <?php
}

// Funkcja generująca stopkę strony
function getFooter()  
{
    ?>
    <footer class="main-footer">
        <a href="https://discord.gg/4UHjwwe9" target="_blank" rel="noopener noreferrer">
            <img src="CSS/dc.png" class="social" alt="Nasz discord">
        </a>
        <a href="https://www.facebook.com/profile.php?id=100075737566229&locale=pl_PL" target="_blank" rel="noopener noreferrer">
            <img src="CSS/fb.png" class="social" alt="Nasz facebook">
        </a>
    </footer>
    <?php
}
?>
