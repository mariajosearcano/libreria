const hamburguer = document.querySelector('.hamburguer')
const menu = document.querySelector('.menu-navegacion')
hamburguer.addEventListener('click', () => {
    menu.classList.toggle("spread")
})
window.addEventListener('click', e => {
    if (menu.classList.contains('spread')
        && e.target != menu && e.target != hamburguer) {
        console.log('cerrar')
        menu.classList.toggle("spread")
    }
})

//Actualización de misión y visión
function guardarCambios(event) {
    // Evitar que la página se recargue
    event.preventDefault();

    // Llamar a las funciones para actualizar la misión y la visión
    actualizarMision();
    actualizarVision();
}

function actualizarMision() {
    var nuevoTexto = document.getElementById("mision").value;
    document.getElementById("misionTxt").textContent = nuevoTexto;
}

function actualizarVision() {
    var nuevaVision = document.getElementById("vision").value;
    document.getElementById("visionTxt").textContent = nuevaVision;
}

fetch('modelo/datos.json')
    .then(response => response.json())
    .then(data => {
        console.log(data); // Aquí puedes hacer lo que quieras con los datos
        //defino las variables y sus valores
        const mision = data.mision;
        const vision = data.vision;
        const rutaImagen = data.imagen_corporativa;

        //mostrar mision en <p>
        const parrafoMision = document.getElementById('misionTxt');
        parrafoMision.textContent = mision;

        //mostrar vision en <p>
        const parrafoVision = document.getElementById('visionTxt');
        parrafoVision.textContent = vision;

        //mostrar imagen en <img>
        const imagenDiv = document.getElementById('imagen');
        const imagen = document.createElement('img');
        imagen.src = rutaImagen;
        imagenDiv.appendChild(imagen);
    })
    .catch(error => console.error('Error cargando el archivo JSON:', error));

//Formulario agregar libro
document.addEventListener('DOMContentLoaded', function () {
    const agregarLibroBtn = document.getElementById('agregarLibroBtn');
    const formularioLibro = document.getElementById('formularioLibro');

    agregarLibroBtn.addEventListener('click', function () {
        if (formularioLibro.style.display === 'none' || formularioLibro.style.display === '') {
            formularioLibro.style.display = 'block';
        } else {
            formularioLibro.style.display = 'none';
        }
    });

    const libroForm = document.getElementById('libroForm');
    libroForm.addEventListener('submit', function (event) {
        event.preventDefault();
        // Aquí puedes añadir el código para manejar el envío del formulario
        alert('Datos guardados');

        // Limpiar los campos del formulario
        libroForm.reset();

        // Ocultar el formulario
        formularioLibro.style.display = 'none';
    });
});