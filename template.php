<?php
// Upewnij się, że sesja jest już uruchomiona w index.php
function getHead() 
{
    ?>
   
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Strona główna</title>
        <link rel="stylesheet" href="reset.css">
        <link rel="stylesheet" href="style.css">
        <link rel="icon" href="swz-logotreatment.jpg">
        </head>
    

<?php
}

function getHeader()
{
    ?>
    <header>
        <h1>Dzielni Piloci Weterani</h1>
        <nav class="nav">
            <input type="checkbox" id="menu-toggle" class="menu-toggle">
            <label for="menu-toggle" class="menu-icon" id="menu-icon">
                <span></span>
                <span></span>
                <span></span>
            </label>
            <ul class="menu">
                <?php 
                // Sprawdzenie, czy użytkownik jest zalogowany
                if (isset($_SESSION['user_id'])) : ?>
                    <li><a href="logout.php">Wyloguj się</a></li>
                <?php else : ?>
                    <li><a href="logowanie.php">Zaloguj się</a></li>
                <?php endif; ?>
                <li><a href="panel.php">Menu</a></li>
                
            </ul>
        </nav>
    </header>
    <?php


    }
    function getFooter()  
    {
        ?>
        <footer>
           <p>strone stworzył Hunter</p> 
        </footer>
        <?php
    }
    ?>

 