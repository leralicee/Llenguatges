<?php
include_once("partials/header.php");
include_once("partials/navbar.php");
require_once("class/Database.php");

$db = new Database();
$message = '';
$databaseDisabled = false;
$tableDisabled = false;
$populateDisabled = true;

if ($db->existDatabase()) {
    $message = 'Database exist.';
    $databaseDisabled = true;
}
if ($db->existDatatable()) {
    $message .= ' Table exist.';
    $tableDisabled = true;
    $populateDisabled = false;
}
if ($db->existData()) {
    $message .= ' Data exist.';
    $tableDisabled = true;
    $populateDisabled = true;
}


if (isset($_GET['action'])) {
    switch ($_GET['action']) {
        case 'create_db':
            $db->createDatabase();
            $message = 'Database created.';
            break;
        case 'create_table':
            $db->createDatatable();
            $message = 'Table created.';
            break;
        case 'populate':
            $db->populateDatatable();
            $message = 'Data inserted.';
            break;
    }
}
?>
<div class="container m-5 mx-auto text-white">
    <div class="row">
        <div class="col-6 offset-3">
            <h3 class="text-success my-2">Configuració de la Base de Dades</h3>
            <?php if ($message): ?>
                <div class="alert alert-info"><?php echo $message; ?></div>
            <?php endif; ?>
            <button type="button" class="btn btn-primary" <?php echo $databaseDisabled ? 'disabled' : ''; ?> onclick="location.href='?action=create_db'">Crear Base de Dades</button>
            <button type="button" class="btn btn-primary" <?php echo $tableDisabled ? 'disabled' : ''; ?> onclick="location.href='?action=create_table'">Crear Taula</button>
            <button type="button" class="btn btn-primary" <?php echo $populateDisabled ? 'disabled' : ''; ?> onclick="location.href='?action=populate'">Omplir Taula</button>
        </div>
    </div>
</div>
</body>
</html>
