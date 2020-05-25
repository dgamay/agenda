<?php 
  include 'inc/funciones/funciones.php';
  include 'inc/layout/header.php'; 
  
  $id = filter_var($_GET['id'], FILTER_VALIDATE_INT);

  if(!$id) {
    die('No es válido');
  }

  $resultado = obtenerContacto($id);
  $contacto = $resultado->fetch_assoc(); //trae los resultados y los almacena en la variable contacto como arreglo

?>

<!-- <pre>
<?php// var_dump($contacto);?>
</pre> -->

<div class="contenedor-barra">
    <div class="contenedeor barra">
        <a href="index.php" class="btn volver">Volver</a>
        <h1>Editar contactos</h1>
    </div>
</div>

<div class="bg-amarillo contenedor sombra">
  <form id="contacto" action="#">
    <legend>
      Edite el Contacto 
    </legend>
         <?php include 'inc/layout/formulario.php';?>
    </form>
</div>

<?php include 'inc/layout/footer.php';?> 