
<?php
    include 'inc/funciones/funciones.php';
    include 'inc/layout/header.php';
 ?>

<div class="contenedor-barra">
  <h1>Agenda de Contactos </h1>       
</div>
<div class="bg-amarillo contenedor sombra">
  <form id="contacto" action="#">
    <legend>
      Añada un Contacto <span>Todos los campos son abligatorios</span>
    </legend>
    <?php include 'inc/layout/formulario.php';?>
  </form>        
</div>

<div class="bg-blanco contenedor sombra contactos">
  <div class="contenedor-contactos">
    <h2>Contactos</h2>
    <input type="text" id="buscar" class ="buscador sombra" placeholder="Buscar contactos...">
    <p class="total-contactos "><span></span> contactos</p>

    <div class="contenedor-tabla">
      <table id="listado-contactos" class="listado-contactos">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Empresa</th>
            <th>Telefono</th>
            <th>Aciones</th>
          </tr>
        </thead>

        <tbody>
        
          <?php $contactos = obtenerContactos();
          // si hay algo en la base de datos muestre
            if($contactos->num_rows) {  
              foreach($contactos as $contacto) { ?>                   
          <!-- 27495533 -->                
              <tr>
                <td><?php echo $contacto['nombre'];?></td>
                <td><?php echo $contacto['empresa'];?></td>
                <td><?php echo $contacto['telefono'];?></td>
                <td>
                  <a  data-id="1" class="btn-editar btn" href="editar.php?id=<?php echo $contacto['id'];?>">
                    <i class="fas fa-pen-square"></i>
                  </a>
                  <button data-id="<?php echo $contacto['id']; ?>" type = "button" class="btn-borrar btn">
                  <i class="fas fa-trash-alt"></i>
                  </button>
                 </td>
              </tr>
             <?php }  
           }?> 

        </tbody>
      </table>
    </div>
  </div>
</div>

<?php include 'inc/layout/footer.php'; ?>