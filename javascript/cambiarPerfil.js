window.onload = function() {
    // Obtener datos del usuario guardados en localStorage
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    
    // Poner el nombre del usuario en el input con id "nombre"
    const nombre = document.getElementById("nombre");
    nombre.value = usuario.nombre;

    // Seleccionar todos los radio buttons de sexo
    const radios = document.querySelectorAll('input[name="sexo"]');
    if (usuario.sexo) {
        // Marcar el radio correspondiente al sexo guardado (minusculas para comparación)
        radios.forEach(radio => {
            if (radio.value === usuario.sexo.toLowerCase()) {
                radio.checked = true;
            }
        });
    }

    // Colocar la fecha de nacimiento en el input si existe
    const fecha = document.getElementById("fechaNacimiento");
    if (usuario.fecha_nacimiento) {
        fecha.value = usuario.fecha_nacimiento; 
    }

    // Poner el idioma seleccionado en el select si existe
    const idioma = document.getElementById("idioma");
    if (usuario.idioma) {
        idioma.value = usuario.idioma;
    }

    // Poner el país seleccionado en el select si existe
    const pais = document.getElementById("pais");
    if (usuario.pais) {
        pais.value = usuario.pais;
    }
    
    // Capturar el botón submit del formulario
    const boton = document.querySelector('button[type="submit"]');
    boton.addEventListener("click", function (e) {
        e.preventDefault();  // Prevenir el submit tradicional

        // Capturar el formulario y crear un objeto con los datos
        const form = document.querySelector('form');
        const formData = new FormData(form);
        const formulario = Object.fromEntries(formData);

        // Validar si se quiere cambiar la contraseña (hay datos en esos campos)
        if (formulario.nueva_contrasena || formulario.repetir_nueva_contrasena) {
            // Reglas: más de 5 caracteres, al menos un número y una letra
            const reglas_contrasena = 
                formulario.nueva_contrasena.length > 5 &&
                /[0-9]/.test(formulario.nueva_contrasena) &&
                /[a-zA-Z]/.test(formulario.nueva_contrasena);

            // Comprobar que las contraseñas nuevas coinciden y cumplen las reglas
            if (formulario.nueva_contrasena == formulario.repetir_nueva_contrasena && reglas_contrasena) {
                // Cifrar la contraseña actual para verificarla en backend
                formulario.contrasena = sha256(formulario.contrasena);

                // URL para verificar la contraseña actual en backend
                const url = "http://localhost/TRISTAN/Login-v2/Api/api.php?tabla=usuarios&correo=" + usuario.correo + "&contrasena=" + formulario.contrasena;

                // Petición para validar contraseña actual
                fetch(url)
                    .then(function (respuesta) {
                        if (!respuesta.ok) {
                            throw new Error("Error en el fetch: " + respuesta.status);
                        }
                        const contentType = respuesta.headers.get('Content-Type');
                        // Intentar parsear respuesta como JSON, si no devolver texto
                        if (contentType && contentType.includes('application/json')) {
                            return respuesta.json();
                        } else {
                            return respuesta.text();
                        }
                    })
                    .then(function (datos) {
                        // Si el backend confirma la contraseña actual correcta
                        if (datos && Object.keys(datos).length > 0) {
                            // Cifrar la nueva contraseña antes de enviar para actualizar
                            formulario.contrasena = sha256(formulario.nueva_contrasena);
                            actualizarUsuario(formulario);
                        } else {
                            alert("Contraseña actual incorrecta");
                        }
                    })
                    .catch(function (error) {
                        alert("Error accediendo a la url: " + error);
                    });
            }
            else if (!reglas_contrasena) {
                alert("La nueva contraseña tiene que tener más de 6 caracteres y al menos un número y una letra");
            }
            else {
                alert("Las dos nuevas contraseñas no coinciden");
            }
        }
        else {
            // Si no hay cambio de contraseña, eliminar ese campo para no enviarlo
            delete formulario['contrasena'];
            actualizarUsuario(formulario);
        }
    });

    // Función para actualizar usuario en backend y en localStorage
    function actualizarUsuario(formulario) {
        // Eliminar campos vacíos o con solo espacios para no enviar datos inválidos
        for (const key in formulario) {
            if (formulario[key] === null || formulario[key] === undefined || formulario[key].trim() === '') {
                delete formulario[key];
            }
        }
        // No enviar los campos de las nuevas contraseñas al backend
        delete formulario['nueva_contrasena'];
        delete formulario['repetir_nueva_contrasena'];

        // URL para actualizar el usuario (PUT)
        const urlActualizar = "http://localhost/TRISTAN/Login-v2/Api/api.php?tabla=usuarios&correo=" + usuario.correo;

        const options = {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formulario)
        };

        fetch(urlActualizar, options)
            .then(function (respuesta) {
                if (!respuesta.ok) {
                    throw new Error("Error al actualizar el usuario");
                }
                return respuesta.json();
            })
            .then(function (datos) {
                // Actualizar los datos guardados en localStorage solo con los nuevos valores no vacíos
                const usuario = JSON.parse(localStorage.getItem('usuario')) || {};

                for (const key in formulario) {
                    if (formulario[key] !== null && formulario[key] !== undefined && formulario[key].trim() !== '') {
                        usuario[key] = formulario[key];
                    }
                }

                // Guardar el usuario actualizado en localStorage
                localStorage.setItem('usuario', JSON.stringify(usuario));

                // Recargar la página de ajustes para ver cambios
                window.location.href = "ajustes.html";
            })
            .catch(function (error) {
                alert("Error al actualizar el usuario: " + error);
            });
    }

    // Botón para eliminar cuenta
    const eliminar = document.getElementById('eliminar-cuenta');
    eliminar.addEventListener('click', function() {
        // Confirmar que el usuario quiere eliminar la cuenta (acción irreversible)
        if (!confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.')) {
            return; // Salir si no confirma
        }

        // URL para eliminar el usuario (DELETE)
        const url = "http://localhost/TRISTAN/Login-v2/Api/api.php?tabla=usuarios&correo=" + usuario.correo;

        fetch(url, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) throw new Error('Error al eliminar la cuenta');
            return response.json();
        })
        .then(data => {
            alert('Cuenta eliminada correctamente.');
            // Eliminar usuario de localStorage
            localStorage.removeItem('usuario');
            // Redirigir a la página principal o login
            window.location.href = 'index.html';
        })
        .catch(error => {
            alert('Error al eliminar la cuenta: ' + error.message);
        });
    });
}
