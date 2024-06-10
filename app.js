const express = require("express"); //framework de node.js
const app = express();
const path = require("path"); //modulo de node.js para manejar rutas de archivos
const fs = require("fs"); //modulo de node.js para manejar archivos
const MongoClient = require('mongodb').MongoClient;

const rutaArchivo = path.join( //join: toma cualquier numero de segmentos de ruta (a archivos) y los une mediante (\|/ dependiendo del sistema operativo)
// //basicamente join se encarga de unir los segmentos de ruta en una sola ruta de archivo de manera multiplataforma
    __dirname, //variable de entorno proporcionada por Node.js que contiene la ruta absoluta del directorio actual desde el que se esta ejecutando el script
     "public",
     "modelo",
     "datos.json"
)

const datosVacios = [];

// Ruta para guardar los datos en el archivo datos.json

; //ruta del archivo JSON donde se guardan los datos*/

// Configurar el directorio de archivos estáticos
app.use(express.static(path.join(__dirname, "public"))); //se configura public de directorio para archivos estaticos (HTML, CSS, JS, etc)
app.use(express.json()); // Middleware para analizar solicitudes con cuerpo JSON
/*
En resumen, un middleware es una función que se ejecuta entre la recepción de la solicitud (req) y la finalización de la respuesta (res). Puede realizar tareas como:

1. Ejecutar cualquier código
2. Realizar cambios en los objetos de solicitud (req) y respuesta (res)
3. Finalizar el ciclo de solicitud-respuesta
4. Invocar la siguiente función middleware en la pila
*/
// parsear el cuerpo de la solicitud que viene como application/json a JavaScript (asi parseara todas las solicitudes entrantes)

// Ruta para la página principal
app.get("/", function (req, res) { //funcion de Express que define una ruta para manejar las solicitudes tipo HTTP GET
    res.sendFile(path.join(__dirname, "public", "vista", "index.html"));
}); //se activa cuando se hace una solicitud GET a la raiz del servidor ("/")
//o sea que se ejecutara cuando se acceda a la URL base de la aplicacion (http://localhost:3000/)
//sendFile: envia el archivo especificado al cliente

// Ruta para otra página HTML
app.get("/dtoPersonal.html", function (req, res) {
    res.sendFile(path.join(__dirname, "public", "vista", "dtoPersonal.html"));
});

app.get("/Login.html", function (req, res) {
    res.sendFile(path.join(__dirname, "public", "vista", "Login.html"));
});
app.get("/admin.html", function (req, res) {
    res.sendFile(path.join(__dirname, "public", "vista", "Login.html"));
});

app.get('/index.html', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'vista', 'index.html'));
}); //no es necesario, ya con especificar la ruta raiz, eso vasta

const uri = 'mongodb://127.0.0.1:27017'; // Reemplaza con la URI de tu instancia de MongoDB

async function connectToMongoDB() {
    const client = new MongoClient(uri);
    await client.connect();
    return client.db('dbAgenda'); // Reemplaza 'dbAgenda' con el nombre de tu base de datos
}
//Crear administrador
async function createAdminCollection() {
    try {
        const db = await connectToMongoDB();
        const adminCollection = db.collection('Administradores');
        const adminExists = await adminCollection.findOne({ correo: 'admin@gmail.com' });

        if (!adminExists) {
            await adminCollection.insertOne({
                correo: 'admin@gmail.com',
                contrasena: '1234@'
            });
            console.log('Administrador creado correctamente');
        } else {
            console.log('El administrador ya existe');
        }
    } catch (error) {
        console.error('Error al crear la colección de administradores:', error);
    }
}

createAdminCollection();


// Obtener todas las personas
app.get('/verificarDatos', async (req, res) => {
    try {
        const db = await connectToMongoDB();
        const personas = await db.collection('Personas').find().toArray();
        res.status(200).json({ contieneDatos: personas.length > 0, personas });
    } catch (error) {
        console.error('Error al obtener los datos:', error);
        res.status(500).send('Error al verificar los datos');
    }
});


  
// Agregar una nueva persona
app.post('/guardarDatos', async (req, res) => {
    try {
        const db = await connectToMongoDB();
        const persona = req.body;
        await db.collection('Personas').insertOne(persona);
        res.status(200).send('Datos guardados correctamente');
    } catch (error) {
        console.error('Error al guardar los datos:', error);
        res.status(500).send('Error al guardar los datos');
    }
});

app.post('/guardarDatosJson', (req, res) => {
    try {
        // Obtener los nuevos datos del cuerpo de la solicitud
        const nuevosDatos = req.body;

        // Convertir los nuevos datos a formato JSON
        const jsonNuevosDatos = JSON.stringify(nuevosDatos, null, 2); // El segundo argumento 'null' es para opciones de formato JSON y el tercer argumento '2' es para la indentación de dos espacios

        // Escribir los nuevos datos en el archivo datos.json
        fs.writeFile('public/modelo/datos.json', jsonNuevosDatos, (err) => {
            if (err) {
                console.error('Error al guardar los datos en el archivo:', err);
                res.status(500).send('Error al guardar los datos');
            } else {
                console.log('Datos guardados en el archivo correctamente');
                res.status(200).send('Datos guardados correctamente');
                
            }
        });
    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        res.status(500).send('Error al procesar la solicitud');
    }
});



// Eliminar una persona
app.post('/borrarDatos', async (req, res) => {
    try {
        const db = await connectToMongoDB();
        const { email } = req.body; //se extrae la propiedad email del objeto req.body y se asigna a una constante llamada email
        await db.collection('Personas').deleteOne({ email }); //La función deleteOne busca un documento en la colección Personas donde el campo email coincida con el valor de la constante email. Si encuentra un documento coincidente, lo elimina
        res.status(200).send('Datos borrados correctamente');
    } catch (error) {
        console.error('Error al borrar los datos:', error);
        res.status(500).send('Error al borrar los datos');
    }
});
  
// Actualizar una persona
app.put('/actualizarDatos', async (req, res) => {
    try {
        const db = await connectToMongoDB();
        const personaActualizada = req.body;
        const { email } = personaActualizada;
        await db.collection('Personas').updateOne({ email }, { $set: personaActualizada });
        res.status(200).send('Datos actualizados correctamente');
    } catch (error) {
        console.error('Error al actualizar los datos:', error);
        res.status(500).send('Error al actualizar los datos');
    }
});

// Ruta para manejar el inicio de sesión
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const db = await connectToMongoDB();
        const user = await db.collection('Personas').findOne({ email: username });

        if (user && user.contrasena === password) {
            // Usuario normal
            return res.status(200).send('usuario');
        }

        const admin = await db.collection('Administradores').findOne({ correo: username });

        if (admin && admin.contrasena === password) {
            // Administrador
            return res.status(200).send('administrador');
        }

        // Credenciales incorrectas
        res.status(401).send('Correo electrónico o contraseña incorrectos.');
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).send('Error al iniciar sesión');
    }
});





// Iniciar el servidor en el puerto 3000
const PORT = process.env.PORT || 3000;//verifica si la variable de entorno PORT esta definida, si no, se asigna el valor 3000
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

