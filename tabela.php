
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Strona główna</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="reset.css">
    <link rel="icon" href="swz-logotreatment.jpg">
   

</head>
<body>

    <header>
        
        <p><i>Dzielni piloci weterani</i></p>
        <nav>
            <a href="">Zaloguj</a>
        </nav>
    </header>
    <main>
    <section class="content">
        <h2>Tabela wyników</h2>
        <?php
        $dbhost = "localhost";
        $dbuser = "root";
        $dbpass = "";
        $dbname = "x wing";
        
        $conn = mysqli_connect($dbhost, $dbuser, $dbpass);
        if(mysqli_connect_errno())
        {
            exit();
        }
        mysqli_select_db($conn, $dbname);
        mysqli_query($conn, "SET CHARACTER SET UTF8");

        $sql = "SELECT  `gracz`, `frakcja`, `frakcja_awaryjna`, `rezultaty`, `punkty` FROM `statystyki`";
        $wynik = mysqli_query($conn, $sql);
        if(mysqli_num_rows($wynik) > 0)
        {
            echo"<table>";
            echo"<tr><th>Gracz</th><th>Frakcja</th><th>Frakcja awaryjna</th><th>Rezultaty</th><th>Punkty</th></tr>";
            while($wiersz = mysqli_fetch_assoc($wynik))
            {
                echo"<tr>";
                echo "<td>" . $wiersz["gracz"] ."</td>" ;
                echo "<td>" . $wiersz["frakcja"] ."</td>" ;
                echo "<td>" . $wiersz["frakcja_awaryjna"] ."</td>" ;
                echo "<td>" . $wiersz["rezultaty"] ."</td>" ;      
                echo "<td>" .$wiersz["punkty"] ."</td>" ;
                echo"</tr>";
            }
            echo"</table>";
        }
            

        
        mysqli_close($conn);
        ?>
    </section>
    </main>
    <footer><p>Strone stowrzył Hunter</p></footer>

</body>
</html>