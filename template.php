<?php

function getHead() 
{
    ?>
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Strona główna</title>
    <link rel="stylesheet" href="CSS/reset.css">
    <link rel="stylesheet" href="CSS/style.css">
    <link rel="icon" href="swz-logotreatment.jpg">
</head>
<?php
}
function getHeader()
{
    ?>
        <header class="main-header">
        <h1>Dzielni Piloci Weterani</h1>
        <nav class="nav">
            <input type="checkbox" id="menu-toggle" class="menu-toggle">
            <label for="menu-toggle" class="menu-icon" id="menu-icon">
                <span></span>
                <span></span>
                <span></span>
            </label>
            <ul class="menu">
                <li><a href="edytor.html">Edytor</a></li>
                <?php 
                // Sprawdzenie, czy użytkownik jest zalogowany
                if (isset($_SESSION['user_id'])) : ?>
                    <li><a href="logowanie.php">Panel użytkownika</a></li> 
                    <li><a href="logout.php">Wyloguj się</a></li>
                <?php else : ?>
                    <li><a href="logowanie.php">Zaloguj się</a></li>
                <?php endif; ?>
            </ul>
        </nav>
    </header>
    <script src="script.js"></script>
    <?php
    }
    function getFooter()  
    {
        ?>
        <footer class ="main-footer">
           <a href="https://discord.gg/4UHjwwe9" target="_blank"><img src="CSS/dc.png" class="social" alt="Nasz discord"></a>
           <a href="https://www.facebook.com/profile.php?id=100075737566229&locale=pl_PL" target="_blank"><img src="CSS/fb.png" class="social" alt="Nasz facebook"></a>
        </footer>
        <?php
    }
    ?>

 