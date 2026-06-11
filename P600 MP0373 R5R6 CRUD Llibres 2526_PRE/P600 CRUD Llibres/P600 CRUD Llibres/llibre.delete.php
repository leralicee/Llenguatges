<?php
include_once("partials/header.php");
include_once("partials/navbar.php");
require_once("class/Llibre.php");

$message = '';
if (isset($_GET['isbn'])) {
    $llibre = new Llibre();
    if ($llibre->destroy($_GET['isbn'])) {
        $message = '<div class="alert alert-success">Llibre eliminat correctament.</div>';
    } else {
        $message = '<div class="alert alert-danger">Error en eliminar el llibre.</div>';
    }
}
?>
<div class="container m-5 mx-auto text-white">
    <div class="row">
        <div class="col-6 offset-3">
            <?php echo $message; ?>
            <a href="llibres.php" class="btn btn-primary">Tornar a la llista</a>
        </div>
    </div>
</div>
</body>
</html>
