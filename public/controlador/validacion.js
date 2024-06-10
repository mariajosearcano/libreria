let personas;

const hamburguer = document.querySelector('.hamburguer')
const menu = document.querySelector('.menu-navegacion')
hamburguer.addEventListener('click', ()=>{
    menu.classList.toggle("spread") //toggle le quita o le pone una clase (spread) a un elemento HTML
})
window.addEventListener('click', e =>{
    if(menu.classList.contains('spread') 
        && e.target != menu && e.target != hamburguer){
        console.log('cerrar')
        menu.classList.toggle("spread")
    }
})

window.onload = async function() {
    await cargarDatosDesdeMONGO();
    actualizarTabla(personas, 'tabla-body');
    mostrarTabla();
}

const formularioC = document.getElementById('formulario-mostrar');
const tableC = document.getElementById('table-container');
const consultaC = document.getElementById('consulta-container');
const agregarBtn = document.getElementById('agregar-btn');
agregarBtn.addEventListener('click', function() { 
    mostrarFormulario();
});
const consultarBtn = document.getElementById('consultar-btn');
let inputConsulta = document.getElementById('emailConsulta');
consultarBtn.addEventListener('click', function() {
    inputConsulta.value = "";
    reiniciarTabla('consulta-body');
    mostrarConsulta();
});
const consultarBtn2 = document.getElementById('consultar-btn2');
consultarBtn2.addEventListener('click', function() {
    let email = inputConsulta.value;
    let personaFind = buscarPersona(email);
    actualizarTabla(personaFind, 'consulta-body');
});
const tablaBtn = document.getElementById('tablaBtn');
tablaBtn.addEventListener('click', function() {
        mostrarTabla();
});

const formulario = document.getElementById("formulario");
formulario.addEventListener("submit", async function (event) { //async: función asincrónica que permite esperar a que se complete otra ejecucion (palabra wait) y despues seguir sin perder el hilo del programa
    event.preventDefault(); // Prevenir el envío predeterminado del formulario

    //const regexNombreApellido = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/;
    const regexNombreApellido = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ ]{3,}$/;
    //const regexEdad = /^(?:1[01][0-9]|1[2-9]|[1-9][0-9]|[1-9])$/; //?: -> es para no recordar el grupo de captura
    const regexEdad = /^(?:1[01][0-9]|[1-9][0-9]?)$/;
    const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const REGEXCONTRASENA = /^(?=.*\d)[A-Za-z\d]{8,}$/;
    const REGEXUSUARIO= /^(?=.*\d)[A-Za-z\d]{5,}$/;
    const REGEXCEDULA= /^\d{6,15}$/;

    let contrasena = document.getElementById("contrasena").value;
    let cedula= document.getElementById("cedula").value;
    let nombreUsuario= document.getElementById("nombreUsuario").value;

    let nombre = document.getElementById("nombres").value;
    let apellido = document.getElementById("apellidos").value;
    let genero = document.getElementById("genero").value;
    let fechaNacimiento = document.getElementById("fechaNacimiento").value;
    let email = document.getElementById("email").value;

    let edad = calcularEdad(fechaNacimiento);
    if (isNaN(edad) || edad < 18) { //isNaN para verificar que la funcion calcular edad si devolvio un numero
    //isNaN(): verify if the value is Not a Number
        alert('La fecha de nacimiento es inválida');
        return; // Salir de la función si la fecha de nacimiento es inválida
    }

    if (!regexEmail.test(email) || !regexNombreApellido.test(nombre) || !regexNombreApellido.test(apellido) || !regexEdad.test(edad) || !REGEXCEDULA.test(cedula)|| !REGEXCONTRASENA.test(contrasena) || !REGEXUSUARIO.test(nombreUsuario)) {
       // alert('Los datos ingresados son inválidos');
       if(!regexNombreApellido.test(nombre)) {
            alert('nombre');
        }
       if(!regexEmail.test(email)) {
            alert('email');
        }
        if(!REGEXCEDULA.test(cedula)) {
            alert('cedula');
        }
        if(!REGEXCONTRASENA.test(contrasena)) {
            alert('contrasena');
        }
        if(!REGEXUSUARIO.test(nombreUsuario)) {
            alert('nombreUsuario');

        }
        return; // Salir de la función si los datos son inválidos
    }

    const emailExists = personas.some(persona => persona.email === email);
    if (emailExists) {
        alert('El correo electrónico ingresado ya existe');
        return; // Exit the function if email exists
    }

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

    // Agregar la nueva persona al array personas
    personas.push(persona);
    // Guardar los datos actualizados en el JSON
    await guardarDatos(persona); //await guardarDatos();
    alert('Datos guardados correctamente');
    formulario.reset(); // Reiniciar el formulario
    actualizarTabla(personas, 'tabla-body');
    mostrarTabla();
});

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

async function cargarDatosDesdeMONGO() {
    try {
        const response = await fetch('/verificarDatos');
  
        if (response.ok) {
            const data = await response.json(); //cuando extraes datos de MongoDB, los datos se entregan en formato JSON por defecto
    
            if (data.contieneDatos) {
            personas = data.personas;
            } else {
            personas = []; // Si no hay datos, inicializar personas como un array vacío
            }
        } else {
            throw new Error('Error al verificar los datos');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un error al actualizar el array');
    }
}

async function borrarDatos(persona) {
    try {
        const response = await fetch('/borrarDatos', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: persona.email }) //Mongo parsea los datos a JSON para su respectivo almacenamiento
        });
  
        if (!response.ok) {
            throw new Error('Error al borrar los datos');
        }
    
        console.log('Datos borrados correctamente');
    } catch (error) {
        console.error('Error:', error);
        throw new Error('Hubo un error al borrar los datos');
    }
}
  
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
    
        console.log('Datos guardados correctamente');
    } catch (error) {
        console.error('Error:', error);
        throw new Error('Hubo un error al guardar los datos');
    }
  }
  
async function eliminarPersona(persona, id) {
    try {
        await borrarDatos(persona);
        let personasActualizadas = personas.filter(p => p.email !== persona.email);
        personas = personasActualizadas;
        actualizarTabla(personas, id);
        console.log('Persona eliminada correctamente');
    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un error al eliminar la persona');
    }
}

function actualizarTabla(datos, id) {
    const tablaBody = document.getElementById(id);
    tablaBody.innerHTML = ''; // Limpiamos el contenido existente de la tabla
  
    datos.forEach(persona => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${persona.cedula}</td>
            <td>${persona.nombreUsuario}</td>
            <td>${persona.nombre}</td>
            <td>${persona.apellido}</td>
            <td>${persona.genero}</td>
            <td>${persona.edad}</td>
            <td>${persona.fechaNacimiento}</td>
            <td>${persona.email}</td>
            <td>
            <button class="eliminar-btn"><i class='bx bx-trash' style='color:#fb070b'  ></i></button>
            <button class="modificar-btn"><i class='bx bxs-edit' style='color:#1007fb'  ></i></button>
            </td>
        `;
        tablaBody.appendChild(row);
    
        const eliminarBtn = row.querySelector('.eliminar-btn');
            eliminarBtn.addEventListener('click', () => {
                eliminarPersona(persona, id);
                mostrarTabla();
        });
        const modificarBtn = row.querySelector('.modificar-btn');
            modificarBtn.addEventListener('click', () => {
                eliminarPersona(persona, id);
                modificarPersona(persona);
        });
    });
}

function modificarPersona(persona) {
    let cedulaMod= document.getElementById('cedula');
    let nombreUsuarioMod= document.getElementById('nombreUsuario');
    let nombreMod = document.getElementById('nombres');
    let apellidoMod = document.getElementById('apellidos');
    let generoMod = document.getElementById('genero');
    let fechaNacimientoMod = document.getElementById('fechaNacimiento');
    let emailMod = document.getElementById('email');
    let contrasenaMod = document.getElementById('contrasena');

    
    cedulaMod.value = persona.cedula;
    nombreMod.value = persona.nombre;
    apellidoMod.value = persona.apellido;  
    nombreUsuarioMod.value=persona.nombreUsuario;
    contrasenaMod.value=persona.contrasena;
    generoMod.value = persona.genero;
    fechaNacimientoMod.value = persona.fechaNacimiento;
    emailMod.value = persona.email;

    mostrarFormulario();
   
}

function buscarPersona(emailBuscar) {
    
    let personaEncontrada = personas.filter(persona => emailBuscar == persona.email);
  
    // Si se encuentra la persona, mostrar sus datos
    if (personaEncontrada.length) {
        //alert('Persona encontrada con exito') 
        return personaEncontrada;// Función para mostrar los datos de la persona
    } else {
      // Si no se encuentra la persona, mostrar un mensaje de no encontrado
        alert('Persona no encontrada');
    }
}

function reiniciarTabla(id){
    let tablaBody = document.getElementById(id);
    tablaBody.innerHTML = '';
}

function mostrarTabla(){
    actualizarTabla(personas, 'tabla-body');
    formularioC.style.display = 'none';
    tableC.style.display = 'block';
    consultaC.style.display = 'none';
}

function mostrarFormulario(){
    formularioC.style.display = 'block';
    tableC.style.display = 'none';
    consultaC.style.display = 'none';
}

function mostrarConsulta(){
    formularioC.style.display = 'none';
    tableC.style.display = 'none';
    consultaC.style.display = 'block';
}

