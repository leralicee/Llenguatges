<?php
include_once("partials/header.php");
include_once("partials/navbar.php");
require_once("class/Llibre.php");

$llibre = new Llibre();
$book = null;
if (isset($_GET['isbn'])) {
    $book = $llibre->show($_GET['isbn']);
}
?>
<div class="container m-5 mx-auto text-white">
    <div class="row">
        <div class="col-6 offset-3">
            <h3 class="text-success my-2">Detalls del Llibre</h3>
            <?php if ($book): ?>
                <div class="card bg-dark text-white">
                    <div class="card-body">
                        <h5 class="card-title"><?php echo htmlspecialchars($book['title']); ?></h5>
                        <p class="card-text"><strong>ISBN:</strong> <?php echo htmlspecialchars($book['isbn']); ?></p>
                        <p class="card-text"><strong>Autor:</strong> <?php echo htmlspecialchars($book['author']); ?></p>
                        <p class="card-text"><strong>Preu:</strong> <?php echo htmlspecialchars($book['price']); ?> €</p>
                    </div>
                </div>
                <a href="llibres.php" class="btn btn-secondary mt-3">Tornar</a>
            <?php else: ?>
                <p>Llibre no trobat.</p>
            <?php endif; ?>
        </div>
    </div>
</div>
</body>
</html>
