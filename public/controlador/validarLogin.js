document.addEventListener('DOMContentLoaded', function() {
  var btnSalir = document.getElementById('btnHome');
  btnSalir.addEventListener('click', function() {
    window.location.href = 'index.html';
  });
});


async function validarCredenciales(nombreUsuario, contrasena) {
    try {
      const response = await fetch('/validarUsuario', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombreUsuario, contrasena })
      });
  
      if (response.ok) {
        const resultado = await response.json();
        return resultado.esValido;
      } else {
        throw new Error('Error al validar las credenciales');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Hubo un error al validar las credenciales');
      return false;
    }
  }
  
  // Uso de la función validarCredenciales
  formulario.addEventListener('submit', async function (event) {
    event.preventDefault();
  
    // ... código existente ...
  
    let nombreUsuario = document.getElementById('username').value;
    let contrasena = document.getElementById('password').value;
  
    const credencialesValidas = await validarCredenciales(nombreUsuario, contrasena);
    if (!credencialesValidas) {
      alert('El nombre de usuario o la contraseña son incorrectos');
      return;
    }
  

  });
  