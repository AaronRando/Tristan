window.onload = function () {
    const boton = document.querySelector('button[type="submit"]'); // Arreglado
    const form = document.querySelector('form');
    form.addEventListener('input', () => boton.disabled = !form.checkValidity());

    boton.addEventListener("click", function (e) {
        e.preventDefault(); // Evita que el formulario recargue la página
        let errores =[...document.getElementsByClassName("error")];
        
        // Obtener el token del reCAPTCHA v2 (checkbox)
        const token = grecaptcha.getResponse();
        if (!token) {
            alert("Por favor verifica el reCAPTCHA.");
            return;
        }

        if (form.checkValidity()&&!errores.some(e => !e.hidden)) {
            // Obtener datos del formulario
            const formData = new FormData(form);
            const formObject = {}; 

            // Añadir el token al objeto de datos
            formObject.recaptchaToken = token;

            // Convertir los FormData a un objeto plano (para convertirlo fácilmente a JSON)
            formData.forEach((value, key) => {
                // Excluir campos de confirmación
                if (key !== "confirmar_correo" && key !== "confirmar_contrasena") {
                    formObject[key] = value;
                }
            });
            formObject.Fecha_creacion = new Date().toISOString().slice(0, 19).replace('T', ' ');

            // Hashear la contraseña
            formObject.contrasena = sha256(formObject.contrasena);

            // Eliminar los campos no deseados antes de enviar
            delete formObject['confirmar_correo'];
            delete formObject['confirmar_contrasena'];

            // Crear opciones para la solicitud fetch
            const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formObject) // Enviar el objeto formateado como JSON
            };

            // Construir URL con parámetros (aunque no necesitamos parámetros en la URL si estamos usando JSON)
            const url = "http://localhost/TRISTAN/Login-v2/Api/api.php?tabla=usuarios";

            fetch(url, options)
                .then(function (respuesta) {
                    if (!respuesta.ok) {
                        throw new Error("Error en el fetch: " + respuesta.status);
                    }

                    const contentType = respuesta.headers.get('Content-Type');
                    if (contentType && contentType.includes('application/json')) {
                        return respuesta.json(); // Es un JSON
                    } else {
                        return respuesta.text(); // Es HTML o algo diferente
                    }
                })
                .then(function (datos) {
                      if (datos.error){
                        console.log(datos.error);
                      }
                      else {
                        const usuario = formObject;
                        localStorage.setItem('usuario', JSON.stringify({
                        nombre: usuario.nombre,
                        correo: usuario.correo,
                        idioma: usuario.idioma,
                        foto_perfil: usuario.foto_perfil,
                        pais: usuario.pais,
                        rol: usuario.rol,
                        sexo: usuario.sexo,
                        }));
                        window.location.href = "../../index.html";
                      }
                })
                .catch(function (error) {
                    console.log("Error accediendo a la url: " + error);
                });
        }
    });

    //Comprobacion nombre
    let inputs=document.getElementsByTagName("input");
    inputs[0].addEventListener("blur",  function(e){
        let error_nombre=document.getElementById("name-error");
        if (form.nombre.value.length<3) {
            error_nombre.hidden = false;
        }
        else{
            error_nombre.hidden = true;
        }
    });

    //comprobar correo 
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let error_correo=document.getElementById("confirm-email-error");
    inputs[1].addEventListener("blur",  function(e){
        if (form.confirmar_correo.value!=form.correo.value) {
            error_correo.hidden = false;
        }
        else{
            error_correo.hidden = true;
        }
        let correo_invalido=document.getElementById("email-invalido");
        if (!regex.test(form.correo.value)) {
            correo_invalido.hidden= false;
        }
        else {
            correo_invalido.hidden= true;
        }
    });
    inputs[2].addEventListener("blur",  function(e){
        if (form.confirmar_correo.value!=form.correo.value) {
            error_correo.hidden = false;
        }
        else{
            error_correo.hidden = true;
        }
        let correo_invalido=document.getElementById("confirm-email-invalido");
        if (!regex.test(form.correo.value)) {
            correo_invalido.hidden= false;
        }
        else {
            correo_invalido.hidden= true;
        }
    });

    //comprobar contraseña correcta
    let error_confirmar_contrasena=document.getElementById("confirm-password-error");
    inputs[3].addEventListener("blur",  function(e){
        let error_contrasena=document.getElementById("password-error");
        if (form.contrasena.value.length<6||!/[0-9]/.test(form.contrasena.value)||!/[a-zA-Z]/.test(form.contrasena.value)) {
            error_contrasena.hidden = false;
        }
        else{
            error_contrasena.hidden = true;
        }
        if(form.contrasena.value!=form.confirmar_contrasena.value) {
            error_confirmar_contrasena.hidden=false;
        }
        else {
            error_confirmar_contrasena.hidden=true;
        }
    });

    //comprobar que las contraseñas sean iguales
    inputs[4].addEventListener("blur",  function(e){
        if(form.contrasena.value!=form.confirmar_contrasena.value) {
            error_confirmar_contrasena.hidden=false;
        }
        else {
            error_confirmar_contrasena.hidden=true;
        }
    });
}
