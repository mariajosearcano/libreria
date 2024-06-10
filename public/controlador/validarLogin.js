document.addEventListener('DOMContentLoaded', function() {
  var btnSalir = document.getElementById('btnHome');
  btnSalir.addEventListener('click', function() {
    window.location.href = 'index.html';
  });
});


document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    form.addEventListener("submit", async function (event) {
        event.preventDefault();
  
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
  
        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
  
            const result = await response.text();
  
            if (response.ok) {
                // Redirigir a la página correspondiente después de iniciar sesión
                if (result === 'usuario') {
                    window.location.href = 'index.html';
                } else if (result === 'administrador') {
                    window.location.href = 'admin.html';
                }
            } else {
                alert(result); // Mensaje de error
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al iniciar sesión. Por favor, inténtelo de nuevo más tarde.');
        }
    });
  });
  

  