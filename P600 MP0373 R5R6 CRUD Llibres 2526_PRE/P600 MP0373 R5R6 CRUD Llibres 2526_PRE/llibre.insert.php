<?php
include_once("partials/header.php");
include_once("partials/navbar.php");
require_once("class/Llibre.php");

$message = '';
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $llibre = new Llibre();
    $llibre->isbn = $_POST['isbn'];
    $llibre->title = $_POST['title'];
    $llibre->author = $_POST['author'];
    $llibre->price = $_POST['price'];
    if ($llibre->store()) {
        $message = '<div class="alert alert-success">Llibre afegit correctament.</div>';
    } else {
        $message = '<div class="alert alert-danger">Error en afegir el llibre.</div>';
    }
}
?>
<div class="container m-5 mx-auto text-white">
    <div class="row">
        <div class="col-6 offset-3">
            <h3 class="text-success my-2">Afegir Llibre</h3>
            <?php echo $message; ?>
            <form method="post">
                <div class="mb-3">
                    <label for="isbn" class="form-label">ISBN</label>
                    <input type="text" class="form-control" id="isbn" name="isbn" required maxlength="13">
                </div>
                <div class="mb-3">
                    <label for="title" class="form-label">Títol</label>
                    <input type="text" class="form-control" id="title" name="title" required maxlength="100">
                </div>
                <div class="mb-3">
                    <label for="author" class="form-label">Autor</label>
                    <input type="text" class="form-control" id="author" name="author" required maxlength="50">
                </div>
                <div class="mb-3">
                    <label for="price" class="form-label">Preu</label>
                    <input type="number" step="0.01" class="form-control" id="price" name="price" required>
                </div>
                <button type="submit" class="btn btn-primary">Afegir</button>
                <a href="llibres.php" class="btn btn-secondary">Cancel·lar</a>
            </form>
        </div>
    </div>
</div>
</body>
</html>
