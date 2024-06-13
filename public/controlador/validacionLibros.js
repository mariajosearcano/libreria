const tableCont = document.getElementById('table-container');
//mostrar cuando seleccionemos botón agregar
const addBtn = document.getElementById('addBtn');
addBtn.addEventListener('click', function () {
    showForm();
});

let bookData;

const form = document.getElementById("libroForm");
form.addEventListener("submit", async function (event) { //función asincrónica 
    event.preventDefault(); // Prevenir el envío predeterminado
    const regexNombreLibro = /^[A-Z][a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ ]+$/;
    const regexNombreEditorial = /^[A-Z][a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ ]+$/;
    const regexAutor = /^[A-ZÁÉÍÓÚÑÜ][a-zA-ZáéíóúÁÉÍÓÚñÑüÜ ]+$/;
    const regexPrecio = /^\$\d+(\.\d{2})?$/;

    let bookName = document.getElementById("nombreLibro").value;
    let editorialName = document.getElementById("editorialLibro").value;
    let autorName = document.getElementById("autorLibro").value;
    let bookPrice = document.getElementById("precioLibro").value;
    let bookImage = document.getElementById("imagenLibro").value;

    if (!regexNombreLibro.test(bookName) || !regexNombreEditorial.test(editorialName) || !regexAutor.test(autorName) || !regexPrecio.test(bookPrice)) {
        // alert('Los datos ingresados son inválidos');
        if (!regexNombreEditorial.test(editorialName)) {
            alert('nombre del editorial');
        }
        if (!regexPrecio.test(bookPrice)) {
            alert('precio del libro con $ al inicio');
        }
        if (!regexNombreLibro.test(bookName)) {
            alert('nombre del libro');
        }
        if (!regexAutor.test(autorName)) {
            alert('autor del libro');
        }
        return; // Salir de la función si los datos son inválidos
    }
    //Uncaught (in promise) TypeError: Cannot read properties of undefined (reading 'some')
    const bookExists = bookData.some(book => book.bookName === bookName);
    if (bookExists) {
        alert('El nombre de este libro ya ha sido ingresado en la BD');
        return;
    }


    let libro = {
        nombreLib: bookName,
        editorial: editorialName,
        autor: autorName,
        precio: bookPrice,
        imagenLib: bookImage,
    };

    // push = add
    bookData.push(libro);
    // Guardar los datos actualizados en el JSON
    await saveData(libro);
    alert('Libro guardado correctamente');
    form.reset();
    updateBookTable(bookData, 'tabla-body');
    showTable();
});


async function MONGOData() {
    try {
        const response = await fetch('/verificarDatos');

        if (response.ok) {
            const data = await response.json(); //datos en Mongo = JSON

            if (data.contieneDatos) {
                bookData = data.datosPersona;
            } else {
                bookData = []; // array vacío
            }
        } else {
            throw new Error('Error al verificar los datos');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un error al actualizar el array');
    }
}

async function deleteData(book) {
    try {
        const response = await fetch('/borrarDatos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombreLib: book.nombreLib}) //división de los distintos componentes (datos).
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

async function saveData(data) {
    try {
        const response = await fetch('/guardarDatos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
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

async function deleteUser(user, id) { //id se refiere al id de un componente html
    try {
        await deleteData(user);
        let libroActualizado = bookData.filter(dl => dl.nombreLib !== user.nombreLib);
        libros = libroActualizado;
        updateBookTable(bookData, id);
        console.log('Datos del libro eliminados correctamente');
    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un error al eliminar los datos del libro');
    }
}

function updateBookTable(data, id) { //id se refiere al id de un componente html
    const tablaBody = document.getElementById(id);
    tablaBody.innerHTML = '';

    data.forEach(bookData => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${bookData.nombreLib}</td>
            <td>${bookData.editorial}</td>
            <td>${bookData.autor}</td>
            <td>${bookData.precio}</td>
            <td>${bookData.imagenLib}</td>
            <td>
            <button class="eliminar-btn"><i class='bx bx-trash' style='color:#fb070b'  ></i></button>
            <button class="modificar-btn"><i class='bx bxs-edit' style='color:#1007fb'  ></i></button>
            </td>
        `;

        tablaBody.appendChild(row);
        //botones para eliminar o modificar luego de agregar o cargar los usuarios en la BD
        const deleteBtn = row.querySelector('.eliminar-btn');
        deleteBtn.addEventListener('click', () => {
            deleteUser(bookData, id);
            showTable();
        });
        const modifyBtn = row.querySelector('.modificar-btn');
        modifyBtn.addEventListener('click', () => {
            deleteUser(bookData, id);
            modifyBook(bookData);
        });
    });
}

function searchBook(findName) {

    let bookFound = bookData.filter(book => findName == book.nombreLib);
    if (bookFound.length) {
        return bookFound;//retornamos datos del libro
    } else {
        alert('Libro no encontrado');
    }
}

function modifyBook(bookData) {
    let bookNameMod = document.getElementById('nombreLibro');
    let editorialNameMod = document.getElementById('editorialLibro');
    let autorNameMod = document.getElementById('autorLibro');
    let bookPriceMod = document.getElementById('precioLibro');
    let bookImageMod = document.getElementById('imagenLibro');

    //asignación
    bookNameMod.value = bookData.nombreLib;
    editorialNameMod.value = bookData.editorial;
    autorNameMod.value = bookData.autor;
    bookPriceMod.value = bookData.precio;
    bookImageMod.value = bookData.bookImage;
    showForm();
}
