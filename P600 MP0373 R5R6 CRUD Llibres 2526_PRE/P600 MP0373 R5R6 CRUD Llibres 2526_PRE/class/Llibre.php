<?php

class Llibre {
    public $isbn;
    public $title;
    public $author;
    public $price;
    private $pdo;

    public function __construct() {
        require_once './config/pdo_connect.php';
        $this->pdo = $pdo;
    }

    public function index() {
        $stmt = $this->pdo->query("SELECT * FROM `llibres` ORDER BY `isbn`");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function show($isbn) {
        $stmt = $this->pdo->prepare("SELECT * FROM `llibres` WHERE `isbn` = ?");
        $stmt->execute([$isbn]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function store() {
        $stmt = $this->pdo->prepare(
            "INSERT INTO `llibres` (`isbn`, `title`, `author`, `price`) VALUES (?, ?, ?, ?)"
        );
        return $stmt->execute([$this->isbn, $this->title, $this->author, $this->price]);
    }

    public function update() {
        $stmt = $this->pdo->prepare(
            "UPDATE `llibres` SET `title` = ?, `author` = ?, `price` = ? WHERE `isbn` = ?"
        );
        return $stmt->execute([$this->title, $this->author, $this->price, $this->isbn]);
    }

    public function destroy($isbn) {
        $stmt = $this->pdo->prepare("DELETE FROM `llibres` WHERE `isbn` = ?");
        return $stmt->execute([$isbn]);
    }
}
?>
