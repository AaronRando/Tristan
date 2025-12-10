<?php
$_servidor = "localhost";
$_usuario = "estudiante";
$_contrasena = "estudiante";
$_bd = "tristanbehindthebooks";

try {
    $_conexion = new PDO("mysql:host=$_servidor;dbname=$_bd", $_usuario, $_contrasena);
    $_conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    throw new PDOException("Error de conexión: " . $e->getMessage()); // Lanza excepción
}
?>