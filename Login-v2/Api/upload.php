<?php
require_once __DIR__ . '/conexion.php';

// Ruta de destino
$uploadDir = realpath(__DIR__ . '/../../img/usuarios/') . '/';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['foto_perfil'])) {
    $file = $_FILES['foto_perfil'];
    $nombreArchivo = $_POST['nombre_archivo'] ?? null;
    $archivoAntiguo = $_POST['archivo_antiguo'] ?? null;
    $correo = $_GET['correo'] ?? null;

    if (!$nombreArchivo || !$correo) {
        http_response_code(400);
        echo json_encode(['error' => 'Faltan datos requeridos (correo o nombre de archivo)']);
        exit;
    }

    $rutaFinal = $uploadDir . basename($nombreArchivo);

    // Intentar mover el archivo
    if (move_uploaded_file($file['tmp_name'], $rutaFinal)) {
        $url = 'http://localhost/TRISTAN/img/usuarios/' . basename($nombreArchivo);

        try {
            // Actualizar la base de datos
            $stmt = $_conexion->prepare("UPDATE usuarios SET foto_perfil = :foto WHERE correo = :correo");
            $stmt->bindParam(':foto', $url);
            $stmt->bindParam(':correo', $correo);
            $stmt->execute();

            // Solo eliminar la imagen antigua si no es la por defecto
            if ($archivoAntiguo && basename($archivoAntiguo) !== 'usuarios.webp') {
                $rutaAntigua = $uploadDir . basename($archivoAntiguo);
                if (file_exists($rutaAntigua)) {
                    unlink($rutaAntigua);
                }
            }

            echo json_encode(['url' => $url]);
        } catch (PDOException $e) {
            // Si falla la BD, elimina la nueva imagen para no dejar basura
            if (file_exists($rutaFinal)) {
                unlink($rutaFinal);
            }
            http_response_code(500);
            echo json_encode(['error' => 'Error al actualizar en la base de datos: ' . $e->getMessage()]);
        }
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'No se pudo guardar el archivo']);
    }
} else {
    http_response_code(400);
    echo json_encode(['error' => 'No se recibió ningún archivo']);
}
?>
