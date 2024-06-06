
//INICIO SESION

document.addEventListener('DOMContentLoaded', function() {
    var btnSalir = document.getElementById('btnIniciosesion');
    btnSalir.addEventListener('click', function() {
      window.location.href = 'Login.html';
    });
});

//CARRITO Y CARDS

//Variables
const carrito = document.querySelector('#carrito');
const listaCursos = document.querySelector('#lista-cursos');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');
let articulosCarrito = [];

//Listeners *****
cargarEventListeners();

function cargarEventListeners () {
    //Cuando agregas un curso presionando 'Agregar al carrito'
    listaCursos.addEventListener('click', agregarCurso);
    //Elimina cursos del carrito
    carrito.addEventListener("click",eliminarCurso);

    //muestra los cursos del storage
    document.addEventListener('DOMContentLoaded', () => {
        //recuerda si no hay productos en el carrito se agrega un array vácio para que no de error.
        articulosCarrito = JSON.parse(localStorage.getItem("carrito")) || [];
        carritoHTML();
    })
    //Vaciar carrito
    vaciarCarritoBtn.addEventListener("click", () => {
        articulosCarrito = [];
        limpiarHTML();
    });
}

// Funciones ****************************************

function agregarCurso (e) {
    e.preventDefault();
    // Delegation para agregar-carrito
    if (e.target.classList.contains('agregar-carrito')) {

        const curso = e.target.parentElement.parentElement;
        // Enviamos el curso seleccionado para tomar sus datos
        console.log(curso);
        leerDatosCurso(curso);
        productoAgregado(curso);
    }
}
function productoAgregado(curso){
    //Crear una alerta
    const alert = document.createElement("H4");
    alert.style.cssText = "background-color: red; color: white; text-align: center;";
    alert.style.margin = "5px 20px";
    alert.textContent = 'Añadido al carrito'
    curso.appendChild(alert);
    setTimeout(() => {
        alert.remove();
    }, 2000);
}

function eliminarCurso (e) {
    if (e.target.classList.contains('borrar-curso')) {
        const cursoId = e.target.getAttribute("data-id");

        //Elimina del arreglo por el data-id
        articulosCarrito = articulosCarrito.filter(curso => curso.id !== cursoId);
        carritoHTML();
    }
}

//Lee el contenido del HTML al que le dimos click y extrae la información del curso.
function leerDatosCurso (curso) {
    console.log(curso);
    //Crear un objeto con el contenido del curso actual
    const infoCurso = {
        imagen: curso.querySelector('img').src,
        titulo: curso.querySelector('h4').textContent,
        precio: curso.querySelector('.precio span').textContent,
        id: curso.querySelector('a').getAttribute('data-id'),
        cantidad: 1
    }
    //Revisa si un elemento ya existe en el carrito
    const existe = articulosCarrito.some(curso => curso.id === infoCurso.id);
    if (existe) {
        //Creamos una copia del arreglo
        const cursos = articulosCarrito.map(curso => {

            if (curso.id === infoCurso.id) {
                curso.cantidad++;
                return curso; // este retorna el objeto actualizado
            } else {
                return curso;// retorna los que no son duplicados
            }
        });
        articulosCarrito = [ ...cursos ];

    } else {
        articulosCarrito = [ ...articulosCarrito, infoCurso ];
    }

    //Agregar elementos al carrito  
    carritoHTML();
}

// Muestra el carrito de compras en el HTML
function carritoHTML () {

    limpiarHTML();

    articulosCarrito.forEach(curso => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>  
                <img src="${ curso.imagen }" width=100>
            </td>
            <td>${ curso.titulo }</td>
            <td>${ curso.precio }</td>
            <td>${ curso.cantidad } </td>
            <td>
                <a href="#" class="borrar-curso" data-id="${ curso.id }">X</a>
            </td>
        `;
        contenedorCarrito.appendChild(row);
    });
    //Agregar el carrito de compras al storage
    sincronizarStorage();

}
function sincronizarStorage() {
    localStorage.setItem("carrito", JSON.stringify(articulosCarrito));
}
// Elimina los cursos del tbody
function limpiarHTML () {
    //forma lenta
    //:contenedorCarrito.innerHTML = '';
    while (contenedorCarrito.firstChild) {
        contenedorCarrito.removeChild(contenedorCarrito.firstChild)
    }
}

//CARRUSEL

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

//MENU HAMBURGUESA

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

//BARRA

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
                  imagen: "../assets/imagen-corporativa.svg",
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
        