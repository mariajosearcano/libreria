//script
document.addEventListener('DOMContentLoaded', function() {
    var btnSalir = document.getElementById('btnIniciosesion');
    btnSalir.addEventListener('click', function() {
      window.location.href = 'Login.html';
    });
  });

document.addEventListener('DOMContentLoaded', () => {
  const imgContenedor = document.querySelector('.imgContenedor');
  const buttons = document.querySelectorAll('.button');

  buttons.forEach(button => {
      button.addEventListener('click', (e) => {
          e.preventDefault(); // Prevenir el comportamiento predeterminado del enlace
          const imgNumber = button.id.replace('button', ''); // Extraer el número del ID del botón

          // Restablecer todas las imágenes y botones a los valores predeterminados
          document.querySelectorAll('.img').forEach(el => el.classList.remove('active'));
          document.querySelectorAll('.button').forEach(el => el.classList.remove('active'));

          // Aplicar la clase 'active' a la imagen y el botón seleccionados
          document.getElementById(`imgen${imgNumber}`).classList.add('active');
          button.classList.add('active');

          // Ajustar la posición del contenedor
          imgContenedor.style.left = `${(parseInt(imgNumber) -4.2) * -17}%`;
      });
  });
});

// Obtener el encabezado y el cuerpo de la página
const header = document.querySelector('header');

// Agregar evento de clic a las imágenes del carrusel
const carruselImages = document.querySelectorAll('.carrusel_div');
carruselImages.forEach(image => {
    image.addEventListener('click', () => {
        // Deshabilitar el desplazamiento de la página fijando el encabezado
        header.style.position = 'fixed';
        
        // Volver a la posición original del encabezado después de un corto retraso
        setTimeout(() => {
            header.style.position = 'relative';
        }, 0.8); 
    });
});

// JavaScript para la transición del carrusel




const hamburguer = document.querySelector('.hamburguer')
const menu = document.querySelector('.menu-navegacion')
hamburguer.addEventListener('click', ()=>{
    menu.classList.toggle("spread")
})
window.addEventListener('click', e =>{
    if(menu.classList.contains('spread') 
        && e.target != menu && e.target != hamburguer){
        console.log('cerrar')
        menu.classList.toggle("spread")
    }
})


fetch('../modelo/datos.json')
            .then(response => response.json())
            .then(data => {
                // Insertar datos en los elementos HTML correspondientes
                document.getElementById('imagen-corporativa').src = data.imagen;
                document.getElementById('input-mision').value = data.mision;
                document.getElementById('input-vision').value = data.vision;
            })
            .catch(error => console.error('Error al cargar los datos:', error));


            function guardarDatosJson() {
              // Obtener los valores de la misión y la visión desde los elementos HTML
              const nuevaMision = document.getElementById('input-mision').value;
              const nuevaVision = document.getElementById('input-vision').value;
          
              // Crear un objeto con los nuevos datos
              const nuevosDatos = {
                  imagen: "../assets/imagen-corporativa",
                  mision: nuevaMision,
                  vision: nuevaVision
              };
          
              // Convertir el objeto a JSON
              const jsonNuevosDatos = JSON.stringify(nuevosDatos);
          
              // Enviar los nuevos datos al servidor para que los guarde en el archivo datos.json
              fetch('/guardarDatosJson', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json'
                  },
                  body: jsonNuevosDatos
              })
              .then(response => {
                  if (!response.ok) {
                      throw new Error('Error al guardar los datos');
                  }
                  alert('Datos modificados correctamente');
              })
              .catch(error => console.error('Error al guardar los datos:', error));
          }
          
//Este es un archivo en js básico siplemente el lee un archivo en json y lo muestra
//en consola usted lo debe mostrar en el formulario