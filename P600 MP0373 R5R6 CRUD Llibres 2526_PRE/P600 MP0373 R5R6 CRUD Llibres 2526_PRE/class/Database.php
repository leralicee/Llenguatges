<?php

class Database {

    private static $pdo;

    public function __construct() {
        require_once './config/settings.php';
        try {
            self::$pdo = new PDO(
                'mysql:host=' . _DB_SERVER_ . ';dbname=' . _DB_NAME_,
                _DB_USER_,
                _DB_PASSWD_
            );
            self::$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            self::$pdo = null;
        }
    }

    private function getBaseConnection() {
        require_once './config/settings.php';
        $conn = new PDO(
            'mysql:host=' . _DB_SERVER_,
            _DB_USER_,
            _DB_PASSWD_
        );
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $conn;
    }

    private static function getConnection() {
        if (self::$pdo === null) {
            require_once './config/settings.php';
            self::$pdo = new PDO(
                'mysql:host=' . _DB_SERVER_ . ';dbname=' . _DB_NAME_,
                _DB_USER_,
                _DB_PASSWD_
            );
            self::$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        }
        return self::$pdo;
    }

    public function createDatabase() {
        $conn = $this->getBaseConnection();
        $conn->exec("CREATE DATABASE IF NOT EXISTS `dam_llibres` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci");
        require_once './config/settings.php';
        self::$pdo = new PDO(
            'mysql:host=' . _DB_SERVER_ . ';dbname=' . _DB_NAME_,
            _DB_USER_,
            _DB_PASSWD_
        );
        self::$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }

    public function createDatatable() {
        $pdo = self::getConnection();
        $sql = "CREATE TABLE IF NOT EXISTS `llibres` (
                    `isbn`   char(13)    NOT NULL,
                    `author` char(50)    DEFAULT NULL,
                    `title`  char(100)   DEFAULT NULL,
                    `price`  float(4,2)  DEFAULT NULL,
                    PRIMARY KEY (`isbn`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8";
        $pdo->exec($sql);
    }

    public function populateDatatable() {
        $pdo = self::getConnection();
        $registres = [
            ['1112', 'Gambardella, Matthew', "XML Developer's Guide",                   44.95],
            ['1113', 'Ralls, Kim',           'Midnight Rain',                            5.95],
            ['1114', 'Corets, Eva',          'Maeve Ascendant',                          5.95],
            ['1115', 'Corets, Eva',          "Oberon's Legacy",                          5.95],
            ['1116', 'Corets, Eva',          'The Sundered Grail',                       5.95],
            ['1117', 'Randall, Cynthia',     'Lover Birds',                              4.95],
            ['1118', 'Thurman, Paula',       'Splish Splash',                            4.95],
            ['1119', 'Knorr, Stefan',        'Creepy Crawlies',                          4.95],
            ['1120', 'Kress, Peter',         'Paradox Lost',                             6.95],
            ['1121', "O'Brien, Tim",         'Microsoft .NET: The Programming Bible',   36.95],
            ['1122', "O'Brien, Tim",         'MSXML3: A Comprehensive Guide',           36.95],
            ['1123', 'Galos, Mike',          'Visual Studio 7: A Comprehensive Guide',  49.95],
        ];

        $stmt = $pdo->prepare("INSERT INTO `llibres` (`isbn`, `author`, `title`, `price`) VALUES (?, ?, ?, ?)");
        foreach ($registres as $fila) {
            $stmt->execute($fila);
        }
    }

    public function existDatabase() {
        try {
            $conn = $this->getBaseConnection();
            $stmt = $conn->prepare("SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?");
            $stmt->execute(['dam_llibres']);
            return $stmt->fetchColumn() !== false;
        } catch (PDOException $e) {
            return false;
        }
    }

    public function existDatatable() {
        try {
            if (self::$pdo === null) return false;
            $pdo = self::getConnection();
            $stmt = $pdo->prepare("SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?");
            $stmt->execute(['dam_llibres', 'llibres']);
            return $stmt->fetchColumn() !== false;
        } catch (PDOException $e) {
            return false;
        }
    }

    public function existData() {
        try {
            if (self::$pdo === null) return false;
            $pdo = self::getConnection();
            $stmt = $pdo->query("SELECT COUNT(*) FROM `llibres`");
            return $stmt->fetchColumn() > 0;
        } catch (PDOException $e) {
            return false;
        }
    }
}

?>
