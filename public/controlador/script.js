
//CARRITO Y CARDS

// Obtener elementos del DOM
const carritoDiv = document.getElementById('carrito');
const listaCarrito = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.getElementById('vaciar-carrito');
const botonesAgregar = document.querySelectorAll('.agregar-carrito');

// Variables
let carrito = [];

// Funciones
function agregarAlCarrito(elemento) {
    const e = elemento.target.parentElement.parentElement;
    // Aquí puedes agregar la lógica para obtener los detalles del libro desde tu base de datos o API
    const infoLibro = {
        imagen: e.querySelector('img').src,
        titulo: e.querySelector('h4').textContent,
        precio: e.querySelector('.precio').textContent,
        id: e.querySelector('button').getAttribute('data-id'),
        cantidad: 1
    }

    const libro = { imagen: infoLibro.imagen, nombre: infoLibro.titulo, precio: infoLibro.precio, id: infoLibro.id, cantidad: infoLibro.cantidad };
    const existeEnCarrito = carrito.some(item => item.id === libro.id);

    if (!existeEnCarrito) {
        carrito.push({ ...libro });
    } else {
        carrito = carrito.map(item => {
            if (item.id === libro.id) {
                item.cantidad++;
            }

            return item;
        });
    }

    renderizarCarrito();
}

function renderizarCarrito() {
    listaCarrito.innerHTML = '';

    carrito.forEach(item => {
        const fila = document.createElement('tr');

        fila.innerHTML = `
            <td>
                <img src="${item.imagen}" width="50">
            </td>
            <td>${item.nombre}</td>
            <td>${item.precio}</td>
            <td>${item.cantidad}</td>
            <td>
                <i class='bx bxs-x-circle borrar-libro' data-id="${item.id}"></i>
            </td>
        `;

        listaCarrito.appendChild(fila);
    });

    //mostrarCarrito();
    eliminarLibroCarrito(); 
}

function vaciarCarrito() {
  carrito = [];
  renderizarCarrito();
}

function eliminarLibroCarrito() {
    const botonesEliminar = document.querySelectorAll('.borrar-libro');
    botonesEliminar.forEach(boton => {
        boton.addEventListener('click', (e) => {
            const idLibro = e.target.getAttribute('data-id');
            carrito = carrito.filter(item => item.id !== idLibro);
            renderizarCarrito();
        });
    });
}

// Evento de click en botones "Agregar al carrito"
botonesAgregar.forEach(boton => {
  boton.addEventListener('click', agregarAlCarrito);
});

// Evento de click en botón "Vaciar carrito"
vaciarCarritoBtn.addEventListener('click', vaciarCarrito);


//CARRUSEL

document.addEventListener('DOMContentLoaded', () => {
    const imgContenedor = document.getElementById('imgContenedor');
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
            imgContenedor.style.left = `${(parseInt(imgNumber) - 4.2) * -17}%`;
        });
    });
});

// Obtener el encabezado y el cuerpo de la página
const contenedor = document.getElementById('contenedor-carrusel');

// Agregar evento de clic a las imágenes del carrusel
const carruselImages = document.querySelectorAll('.carrusel_div');
carruselImages.forEach(image => {
    image.addEventListener('click', () => {
        // Deshabilitar el desplazamiento de la página fijando el encabezado
        contenedor.style.position = 'fixed';
        
        // Volver a la posición original del encabezado después de un corto retraso
        setTimeout(() => {
            contenedor.style.position = 'relative';
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
        