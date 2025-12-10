window.onload = function(){
    const url = "http://localhost/TRISTAN/Login-v2/Api/api.php?tabla=autor";
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
            if (datos && Object.keys(datos).length > 0) {
                // Extraer IDs de los datos (por ejemplo: datos = [{id: 1}, {id: 2}, ...])
                const ids = datos.map(item => item.id);
                
                // Crear parámetro de IDs separados por comas
                const idParam = ids.join(',');

                // Segundo fetch: obtener autores con esos IDs
                const url = `http://localhost/TRISTAN/Login-v2/Api/api.php?tabla=usuarios&id=${idParam}`;
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
                    .then(function (respuesta) {
                        if (respuesta && Object.keys(respuesta).length > 0) {
                            const contenedor = document.getElementById('recomendados-carrusel');

                            // Se recorre cada categoría recibida del servidor
                            respuesta.forEach(autor => {
                                // Crear un div para representar la tarjeta
                                const carta = document.createElement("div"); 
                                carta.classList.add("carta_producto"); // Añadir clase para estilos

                                // Crear una etiqueta img para mostrar la imagen de la categoría
                                const imagen = document.createElement("img"); 
                                imagen.classList.add("imgautor"); // Añadir clase CSS a la imagen

                                // Crear un título para la categoría
                                const titulo = document.createElement("h3"); 
                                titulo.classList.add("card__title"); // Añadir clase al título
                                
                                // Asignar la imagen y el texto correspondientes desde los datos
                                imagen.src = autor.imagen; // URL de la imagen
                                imagen.alt = autor.nombre;           // Texto alternativo por accesibilidad
                                titulo.textContent = autor.nombre;   // Nombre visible

                                // Añadir comportamiento al hacer clic en la carta
                                carta.addEventListener("click", function () {
                                    // Redirigir a otra página con el ID como parámetro en la URL
                                    window.location.href = "autor.html?id="+autor.id;
                                });

                                // Agregar la imagen y el título dentro de la tarjeta
                                carta.appendChild(imagen);
                                carta.appendChild(titulo);

                                // Agregar la tarjeta dentro del contenedor
                                contenedor.appendChild(carta);
                            });
                        } else {
                            alert("Error al cargar los autores");
                        }
                    })
                    .catch(function (error) {
                        alert("Error accediendo a la url: " + error);
                    });
            } else {
                alert("Error al cargar los autores");
            }
        })
        .catch(function (error) {
            alert("Error accediendo a la url: " + error);
        });
}
