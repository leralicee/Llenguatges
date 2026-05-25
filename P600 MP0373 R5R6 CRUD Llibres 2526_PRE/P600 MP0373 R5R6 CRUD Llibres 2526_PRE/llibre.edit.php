<?php
include_once("partials/header.php");
include_once("partials/navbar.php");
require_once("class/Llibre.php");

$message = '';
$llibre = new Llibre();
$book = null;
if (isset($_GET['isbn'])) {
    $book = $llibre->show($_GET['isbn']);
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $llibre->isbn = $_POST['isbn'];
    $llibre->title = $_POST['title'];
    $llibre->author = $_POST['author'];
    $llibre->price = $_POST['price'];
    if ($llibre->update()) {
        $message = '<div class="alert alert-success">Llibre actualitzat correctament.</div>';
        $book = $llibre->show($_POST['isbn']); // Refresh data
    } else {
        $message = '<div class="alert alert-danger">Error en actualitzar el llibre.</div>';
    }
}
?>
<div class="container m-5 mx-auto text-white">
    <div class="row">
        <div class="col-6 offset-3">
            <h3 class="text-success my-2">Editar Llibre</h3>
            <?php echo $message; ?>
            <?php if ($book): ?>
                <form method="post">
                    <div class="mb-3">
                        <label for="isbn" class="form-label">ISBN</label>
                        <input type="text" class="form-control" id="isbn" name="isbn" value="<?php echo htmlspecialchars($book['isbn']); ?>" required maxlength="13" readonly>
                    </div>
                    <div class="mb-3">
                        <label for="title" class="form-label">Títol</label>
                        <input type="text" class="form-control" id="title" name="title" value="<?php echo htmlspecialchars($book['title']); ?>" required maxlength="100">
                    </div>
                    <div class="mb-3">
                        <label for="author" class="form-label">Autor</label>
                        <input type="text" class="form-control" id="author" name="author" value="<?php echo htmlspecialchars($book['author']); ?>" required maxlength="50">
                    </div>
                    <div class="mb-3">
                        <label for="price" class="form-label">Preu</label>
                        <input type="number" step="0.01" class="form-control" id="price" name="price" value="<?php echo htmlspecialchars($book['price']); ?>" required>
                    </div>
                    <button type="submit" class="btn btn-primary">Actualitzar</button>
                    <a href="llibres.php" class="btn btn-secondary">Cancel·lar</a>
                </form>
            <?php else: ?>
                <p>Llibre no trobat.</p>
            <?php endif; ?>
        </div>
    </div>
</div>
</body>
</html>
