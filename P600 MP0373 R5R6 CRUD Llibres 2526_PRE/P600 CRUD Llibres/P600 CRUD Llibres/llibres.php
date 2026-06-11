<?php
include_once("partials/header.php");
include_once("partials/navbar.php");
require_once("class/Llibre.php");

$llibre = new Llibre();
$llibres = $llibre->index();
?>
<div class="container m-5 mx-auto text-white">
    <div class="row">
        <div class="col-12">
            <h3 class="text-success my-2">Llistat de Llibres</h3>
            <a href="llibre.insert.php" class="btn btn-success mb-3">Afegir Llibre</a>
            <?php if ($llibres): ?>
                <table class="table table-dark">
                    <thead>
                        <tr>
                            <th>ISBN</th>
                            <th>Títol</th>
                            <th>Autor</th>
                            <th>Preu</th>
                            <th>Accions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($llibres as $llibre_item): ?>
                            <tr>
                                <td><?php echo htmlspecialchars($llibre_item['isbn']); ?></td>
                                <td><?php echo htmlspecialchars($llibre_item['title']); ?></td>
                                <td><?php echo htmlspecialchars($llibre_item['author']); ?></td>
                                <td><?php echo htmlspecialchars($llibre_item['price']); ?> €</td>
                                <td>
                                    <a href="llibre.show.php?isbn=<?php echo urlencode($llibre_item['isbn']); ?>" class="btn btn-info btn-sm">Veure</a>
                                    <a href="llibre.edit.php?isbn=<?php echo urlencode($llibre_item['isbn']); ?>" class="btn btn-warning btn-sm">Editar</a>
                                    <a href="llibre.delete.php?isbn=<?php echo urlencode($llibre_item['isbn']); ?>" class="btn btn-danger btn-sm" onclick="return confirm('Estàs segur?')">Eliminar</a>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            <?php else: ?>
                <p>No hi ha cap llibre.</p>
            <?php endif; ?>
        </div>
    </div>
</div>
</body>
</html>
