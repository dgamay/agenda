
const formularioContactos =document.querySelector('#contacto'),
      listadoContactos = document.querySelector('#listado-contactos tbody'),
      inputBuscador = document.querySelector('#buscar');


eventListeners();

function eventListeners(){
    // cuando en el formulario se precione crear o editar se ejecuta
     formularioContactos.addEventListener('submit', leerFormulario);

    //  listener para eliminar contactos
    if (listadoContactos) {
        listadoContactos.addEventListener("click", eliminarContacto);
    }
    
    // Buscador
    inputBuscador.addEventListener('input', buscarContactos);
    // Actualizar numero de contactos 
    numeroContactos();
}



function leerFormulario(e){
    e.preventDefault();
    // console.log (' has presionado...')
    // leer los datos  inputs
    const nombre = document.querySelector('#nombre').value,
          empresa = document.querySelector('#empresa').value,
          telefono = document.querySelector('#telefono').value,
          accion  = document.querySelector('#accion').value;   

    if (nombre === '' ||empresa === '' || telefono === ''){
        // Dos parametros, texto y clase, eetos datos van entre comillas
        mostrarNotificacion( 'Todos los campos son obligatorios', 'error' );
    }else {
        // Passa la validacion crear llamado a ajaax
        const infoContacto = new FormData(); // FormData ES LA MEJOR MANERA DE LEER los datos del formulario
        infoContacto.append('nombre', nombre);
        infoContacto.append('empresa', empresa);
        infoContacto.append('telefono', telefono);
        infoContacto.append('accion', accion);
      // xpread operator crea una copia del objeto esta es lamanera de leer el objet
    //   console.log(...infoContacto);
        
        if (accion === 'crear'){
        	// creamos un nuevo contcto
        	insertarBD(infoContacto);
        }else{
            // editar el contcto
            const idRegistro = document.querySelector('#id').value;
            infoContacto.append('id', idRegistro);
            actualizarRegistro(infoContacto);
        }
    }
}

// inserta en la base de datos via Ajax
function insertarBD(infoContacto){
// 	//  Llamado a Ajax
//     // Crear el objeto.
    const xhr = new XMLHttpRequest();

// 	// Abrir la conexion. toma tres parametros  tipo peticion, de donde y si es asincrono (true o false)
    xhr.open('POST','inc/modelos/modelo-contactos.php', true);

//     // Pasar los datos.
    xhr.onload = function () {
        if(this.status === 200) { //conexion exitosa
            //  console.log (JSON.parse(xhr.responseText));
//             // leemos la respuesta de PHP
            const respuesta = JSON.parse(xhr.responseText);
            // console.log(respuesta);
            // Inserta un nuevo elemento a la  tabla
            const nuevoContacto = document.createElement('tr');

            nuevoContacto.innerHTML = `
                    <td>${respuesta.datos.nombre}</td>
                    <td>${respuesta.datos.empresa}</td>
                    <td>${respuesta.datos.telefono}</td>
               `;
               
             // crear contenedor para los botones
             const contenedorAcciones = document.createElement('td');

             // crear el icono de Editar
             const iconoEditar = document.createElement('i');
             iconoEditar.classList.add('fas', 'fa-pen-square');

             // crea el enlace para editar
             const btnEditar = document.createElement('a');
             btnEditar.appendChild(iconoEditar);
             btnEditar.href = `editar.php?id=${respuesta.datos.id_insertado}`;
             btnEditar.classList.add('btn', 'btn-editar');

             // agregarlo al padre
             contenedorAcciones.appendChild(btnEditar);

             // crear el icono de eliminar
             const iconoEliminar = document.createElement('i');
             iconoEliminar.classList.add('fas', 'fa-trash-alt');

             // crear el boton de eliminar
             const btnEliminar = document.createElement('button');
             btnEliminar.appendChild(iconoEliminar);
             btnEliminar.setAttribute('data-id', respuesta.datos.id_insertado);
             btnEliminar.classList.add('btn', 'btn-borrar');

             // agregarlo al padre
             contenedorAcciones.appendChild(btnEliminar);

             // Agregarlo al tr
             nuevoContacto.appendChild(contenedorAcciones);

             // agregarlo con los contactos
             listadoContactos.appendChild(nuevoContacto);       
             
             // Resetear el formulario
             document.querySelector('form').reset();

             // Mostrar la notificacion
             mostrarNotificacion('Contacto Creado Correctamente', 'correcto');

             // Actualizar el número de contactos
             numeroContactos();
        }
    }
    // Enviar los datos.
    xhr.send(infoContacto)
}

function actualizarRegistro(infoContacto){
    // console.log(...infoContacto);
    // crear el objeto
    const xhr = new XMLHttpRequest();

    // // abrir la conexion
    xhr.open('POST','inc/modelos/modelo-contactos.php', true);

    // // leer la respuesta
    xhr.onload = function(){
        if(this.status === 200){
            const respuesta = JSON.parse(xhr.responseText);
            if(respuesta.respuesta === 'correcto'){
                mostrarNotificacion('Actualizacion correcta', 'correcto');
            }else{
                mostrarNotificacion('Hubo un error...','error');
            } 
            // despuesde 3 segundod redireecciona
            setTimeout(() => {
                window.location.href = 'index.php';
            }, 4000);
        }
    }
    // enviar la paticion
    xhr.send(infoContacto);
}

// eliminae el contacto
function eliminarContacto(e){
    // la linea siguiente es para identificar a que se le da clik  
    if( e.target.parentElement.classList.contains('btn-borrar') ) {
        // tomar el ID
        const id = e.target.parentElement.getAttribute('data-id');
        // console.log(id);
        // solicitar confirmacion
        const respuesta = confirm('Estas deguro(a)?');
        if (respuesta){
            // alert();
            // llamado a ajax
            // Crear el objeto
            const xhr = new XMLHttpRequest();

            // Abrir la conexion
            xhr.open('GET', `inc/modelos/modelo-contactos.php?id=${id}&accion=borrar`, true);
            //Leer la respuesta
            xhr.onload = function() {
                if(this.status === 200) {
                   const resultado = JSON.parse(xhr.responseText);
                //    console.log(resultado);
                   if(resultado.respuesta === 'correcto'){
                    //    eliminar registro del DOM
                   e.target.parentElement.parentElement.parentElement.remove();
                        //  Mostrar la notificacion
                        mostrarNotificacion('Contacto eliminado', 'correcto');
                        // Actualizar numero de contactos
                        numeroContactos();
                   }else{
                       mostrarNotificacion
                    mostrarNotificacion('hubo un error...', 'error');                 
                   }
                }
            }
            // Enviar la respuesta
            xhr.send();
        }
    } 
}

// Notificaciones en pantalla
function mostrarNotificacion( mensaje, clase){
    const notificacion = document.createElement('div'); //variable que guarda esa funcion
    notificacion.classList.add(clase, 'notificacion', 'sombra');  
    notificacion.textContent= mensaje;
    
    // formularios, insertBefore inserta la nootificacion antes del legend
    formularioContactos.insertBefore(notificacion, document.querySelector('form legend'))
    // Ocultar y mostrar la notificacion
    setTimeout(() => {
        notificacion.classList.add('visible');  
        
        setTimeout(() => {
            notificacion.classList.remove('visible');

            setTimeout(() => {
                notificacion.remove()
            },500);
            
        }, 3000);
    }, 100);
} 
// Buscador de registros.
function buscarContactos(e){
    // console.log(e.target.value);
    const expresion = new RegExp(e.target.value, "i"),
          registros = document.querySelectorAll('tbody tr');
    
          registros.forEach(registro => {
              registro.style.display = 'none';
              console.log(registro.childNodes[1]);
              if(registro.childNodes[1].textContent.replace(/\s/g, " ").search(expresion) != -1 ){
                registro.style.display = 'table-row';
              }
              numeroContactos();
          })
    
}

//Muestra el Numero de contactos.
function numeroContactos(){
    const totalContactos = document.querySelectorAll('tbody tr'),
    contenedorNumero = document.querySelector('.total-contactos span');
    ;

    let total = 0;

     totalContactos.forEach( contacto => {
         if(contacto.style.display === '' || contacto.style.display === 'table-row'){
             total++;
         }
     })
     contenedorNumero.textContent = total;
}
