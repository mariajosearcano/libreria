// validacionRegistro.js

let personas; // Variable para almacenar los datos de personas
const cancelarBtn = document.getElementById('cancelar-btn');

// Evento que se ejecuta cuando se carga la página
window.onload = async function() {
    await cargarDatosDesdeMongo(); // Cargar los datos de personas desde MongoDB
};

// Función para cargar datos desde MongoDB
async function cargarDatosDesdeMongo() {
    try {
        const response = await fetch('/verificarDatos'); // Endpoint para obtener datos de MongoDB
        if (response.ok) {
            const data = await response.json();
            if (data.contieneDatos) {
                personas = data.personas;
            } else {
                personas = []; // Si no hay datos, inicializar como un array vacío
            }
        } else {
            throw new Error('Error al verificar los datos');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un error al cargar los datos desde MongoDB');
    }
}

// Función para validar el formulario y procesar el registro
const formulario = document.getElementById('formulario');
formulario.addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevenir el envío predeterminado del formulario

    // Obtener los valores del formulario
    let cedula = document.getElementById('cedula').value;
    let nombre = document.getElementById('nombres').value;
    let apellido = document.getElementById('apellidos').value;
    let nombreUsuario = document.getElementById('nombreUsuario').value;
    let contrasena = document.getElementById('contrasena').value;
    let genero = document.getElementById('genero').value;
    let fechaNacimiento = document.getElementById('fechaNacimiento').value;
    let email = document.getElementById('email').value;

    // Realizar validaciones (puedes usar las mismas expresiones regulares que en el otro formulario)
    const regexNombreApellido = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ ]{3,}$/;
    const regexEdad = /^(?:1[01][0-9]|[1-9][0-9]?)$/;
    const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const regexContrasena = /^(?=.*\d)[A-Za-z\d]{8,}$/;
    const regexUsuario = /^(?=.*\d)[A-Za-z\d]{5,}$/;
    const regexCedula = /^\d{6,15}$/;

    let edad = calcularEdad(fechaNacimiento);

    if (isNaN(edad) || edad < 18) {
        alert('La fecha de nacimiento es inválida o menor de edad');
        return;
    }

    if (!regexEmail.test(email) || !regexNombreApellido.test(nombre) || !regexNombreApellido.test(apellido) || !regexEdad.test(edad) || !regexCedula.test(cedula) || !regexContrasena.test(contrasena) || !regexUsuario.test(nombreUsuario)) {
        alert('Por favor, verifique los campos ingresados');
        return;
    }

    const emailExists = personas.some(persona => persona.email === email);
    if (emailExists) {
        alert('El correo electrónico ya está registrado');
        return;
    }

    // Crear objeto persona
    let persona = {
        cedula,
        nombreUsuario,
        contrasena,
        nombre,
        apellido,
        genero,
        edad,
        fechaNacimiento,
        email
    };

    // Guardar los datos en MongoDB
    await guardarDatos(persona);

    // Mostrar mensaje de éxito
    alert('Registro exitoso');
    window.location.href = 'Login.html';

    // Limpiar el formulario
    formulario.reset();
});

// Función para calcular la edad
function calcularEdad(fecha) {
    let hoy = new Date();
    let cumpleanos = new Date(fecha);
    let edad = hoy.getFullYear() - cumpleanos.getFullYear();
    let mes = hoy.getMonth() - cumpleanos.getMonth();

    if (mes < 0 || (mes === 0 && hoy.getDate() < cumpleanos.getDate())) {
        edad--;
    }

    return edad;
}

// Función para guardar los datos en MongoDB
async function guardarDatos(datos) {
    try {
        const response = await fetch('/guardarDatos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });

        if (!response.ok) {
            throw new Error('Error al guardar los datos');
        }

        console.log('Datos guardados correctamente en MongoDB');
    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un error al guardar los datos en MongoDB');
    }

    


cancelarBtn.addEventListener('click', function() {
    // Redirigir a index.html
    window.location.href = 'index.html';
});
}
