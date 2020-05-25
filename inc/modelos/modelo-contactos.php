<?php
//operador de fusion nula me permite inicializar la variable para evitar el error undefined index
$crear = $_POST['accion'] ?? '';
if($crear == 'crear'){
    // creara un nuevo registro en la base de datos

    require_once('../funciones/db.php');
    // Validar las entradas y limpiando 
    $nombre = filter_var($_POST['nombre'], FILTER_SANITIZE_STRING);
    $empresa = filter_var($_POST['empresa'], FILTER_SANITIZE_STRING);
    $telefono = filter_var($_POST['telefono'], FILTER_SANITIZE_STRING);
    //  echo json_encode($_POST); 
    try {
        $stmt = $conn->prepare("INSERT  INTO contactos (nombre, empresa, telefono) VALUES(?, ?, ?)");
        $stmt->bind_param("sss", $nombre, $empresa, $telefono); 
        $stmt->execute();
        // affected_rows es una forma de saber si hubo cambios en la base de datos
        // retorna 1 si lo hubo 
        if($stmt->affected_rows == 1){ 
            $respuesta = array(
                'respuesta' => 'correcto',
                'datos' => array(
                    'nombre' => $nombre,
                    'empresa' => $empresa,
                    'telefono' => $telefono,
                    'id_insertado' => $stmt->insert_id
                )
            );
        }
        $stmt->close();
        $conn->close();
    } catch (Exception $e) {
        $respuesta = array(
            'error' => $e->getMessage()
        );     
    }
    //respuesta enviada a el archivo de app.js
    echo json_encode($respuesta); 
    // echo json_encode($_POST); 
}

$borrar = $_GET['accion'] ?? '';
if( $borrar == 'borrar'){
    require_once('../funciones/db.php');//abre la conexion con la base de datos
    $id = filter_var($_GET['id'], FILTER_SANITIZE_NUMBER_INT);

    try {
        $stmt = $conn->prepare(" DELETE FROM contactos WHERE id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        if($stmt->affected_rows == 1){
            $respuesta = array(
                'respuesta' => 'correcto'
            );
        }
        $stmt->close();
        $conn->close();
    } catch (Exception $e) {
        $respuesta = array(
            'error' => $e->getMessage()
        );     
    }
    echo json_encode($respuesta);
}

$editar = $_POST['accion'] ?? '';
if( $editar == 'editar'){
   
    require_once('../funciones/db.php');
    // Validar las entradas y limpiando 
    $nombre = filter_var($_POST['nombre'], FILTER_SANITIZE_STRING);
    $empresa = filter_var($_POST['empresa'], FILTER_SANITIZE_STRING);
    $telefono = filter_var($_POST['telefono'], FILTER_SANITIZE_STRING);
    $id = filter_var($_POST['id'], FILTER_SANITIZE_NUMBER_INT);

    try {
         $stmt = $conn->prepare("UPDATE contactos SET nombre = ?, empresa = ?, telefono = ? WHERE id = ?");
         $stmt->bind_param("sssi", $nombre, $empresa, $telefono, $id );
         $stmt->execute();
         if($stmt->affected_rows == 1){
            $respuesta = array(
                'respuesta' => 'correcto'
            );
        }else{ 
            $respuesta = array(
                'respuesta' => 'error'
            );
        }
         $stmt->close();
         $conn->close();
    }catch (Exception $e) {
        $respuesta = array(
            'error' => $e->getMessage()
        );     
    }
    echo json_encode($respuesta);

}

?>