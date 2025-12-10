window.handleCredentialResponse = function (response) {
  const redireccion = "../../index.html";
  const jwt = response.credential;

  // Decodificar el JWT (solo el payload, no verifica firma, pero útil para frontend)
  const payload = JSON.parse(atob(jwt.split('.')[1]));
  const google_sub = payload.sub;

  // Primero intentamos buscar el usuario por google_sub
  const url = "http://localhost/TRISTAN/Login-v2/Api/api.php?tabla=usuarios&google_sub=" + google_sub;
  let options;
  
  fetch(url)
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
      if (datos.length > 0) {
        // Usuario ya existe, redirigir
        console.log("Usuario ya registrado");
        const usuario = datos[0];  // Suponemos que la respuesta es un array con el usuario
        localStorage.setItem('usuario', JSON.stringify({
          id: usuario.id,
          nombre: usuario.nombre,
          correo: usuario.correo,
          idioma: usuario.idioma,
          foto_perfil: usuario.foto_perfil,
          pais: usuario.pais,
          rol: usuario.rol,
          sexo: usuario.sexo,
        }));
        if (!datos.error){
          window.location.href = redireccion;
        }
      } else {
        // Usuario no existe, buscar por correo en lugar de google_sub
        const correo = payload.email;
        const urlCorreo = "http://localhost/TRISTAN/Login-v2/Api/api.php?tabla=usuarios&correo=" + correo;

        fetch(urlCorreo)
          .then(function (respuesta) {
            if (!respuesta.ok) {
              throw new Error("Error al buscar el usuario por correo: " + respuesta.status);
            }
            const contentType = respuesta.headers.get('Content-Type');
            if (contentType && contentType.includes('application/json')) {
              return respuesta.json(); // Es un JSON
            } else {
              return respuesta.text(); // Es HTML o algo diferente
            }
          })
          .then(function (datosCorreo) {
            if (datosCorreo.length > 0) {
              // El usuario ya existe, actualizar google_sub
              const usuarioExistente = datosCorreo[0];
              const urlActualizar = "http://localhost/TRISTAN/Login-v2/Api/api.php?tabla=usuarios&correo="+correo;
              const nuevoSub = { google_sub: google_sub };

              options = {
                method: "PUT", // Usamos PUT para actualizar
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(nuevoSub)
              };

              fetch(urlActualizar, options)
                .then(function (respuesta) {
                  if (!respuesta.ok) {
                    throw new Error("Error al actualizar el usuario con google_sub");
                  }
                  return respuesta.json();
                })
                .then(function (respuesta) {
                  localStorage.setItem('usuario', JSON.stringify({
                    id: usuarioExistente.id,
                    nombre: usuarioExistente.nombre,
                    correo: usuarioExistente.correo,
                    idioma: usuarioExistente.idioma,
                    foto_perfil: usuarioExistente.foto_perfil,
                    pais: usuarioExistente.pais,
                    rol: usuarioExistente.rol,
                    sexo: usuarioExistente.sexo,
                  }));
                  if (!respuesta.error){
                    window.location.href = redireccion;
                  }
                })
                .catch(function (error) {
                  alert("Error al actualizar el usuario: " + error);
                });
            } else {
              // Si el usuario no existe, creamos un nuevo usuario
              const nombre = payload.name;
              const fecha_creacion = new Date().toISOString().split('T')[0]; // Solo YYYY-MM-DD
              const idioma = payload.locale;
              const contrasena = sha256("");
              const nuevoUsuario = {
                google_sub: google_sub,
                nombre: nombre,
                contrasena: contrasena,
                correo: correo,
                fecha_creacion: fecha_creacion,
                idioma: idioma,
                proveedor_autenticacion: "google"
              };

              options = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(nuevoUsuario)
              };

              const urlCreacion = "http://localhost/TRISTAN/Login-v2/Api/api.php?tabla=usuarios";
              fetch(urlCreacion, options)
                .then(function (respuesta) {
                  if (!respuesta.ok) {
                    throw new Error("Error en el fetch: " + respuesta.status);
                  }
                  return respuesta.json();
                })
                .then(function (respuesta) {
                  console.log("Usuario creado:", respuesta);
                  localStorage.setItem('usuario', JSON.stringify({
                    google_sub: google_sub,
                    nombre: nombre,
                    correo: correo,
                    idioma: idioma,
                  }));
                  if (!respuesta.error){
                    window.location.href = redireccion;
                  }
                })
                .catch(function (error) {
                  alert("Error creando el usuario: " + error);
                });
            }
          })
          .catch(function (error) {
            alert("Error accediendo a la URL para verificar el correo: " + error);
          });
      }
    })
    .catch(function (error) {
      alert("Error accediendo a la URL: " + error);
    });
};

