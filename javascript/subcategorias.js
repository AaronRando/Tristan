window.onload = function () {
    const params = new URLSearchParams(window.location.search);
    const id = decodeURIComponent(params.get("id"));
    const texto_nombre = decodeURIComponent(params.get("nombre"));
    if (!id || id === "null" || !texto_nombre || texto_nombre === "null") {
        window.location.href = "categorias.html";
    }
    else {
        const nombre=document.getElementById("nombre_categoria");
        nombre.textContent=texto_nombre;
        const url = "http://localhost/TRISTAN/Login-v2/Api/api.php?tabla=libros&id_categoria="+id;
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
                const contenedor = document.getElementById('recomendados-carrusel');
                añadirLibros(datos, 4, contenedor);
                const busqueda = document.getElementById("resultados");
                añadirLibros(datos, datos.length, busqueda);
                
            })
            .catch(function (error) {
                alert("Error accediendo a la url: " + error);
            });
    }

}

function añadirLibros(datos, vueltas, ruta) {
    // Se recorre cada categoría recibida del servidor
    for (let i = 0; i < vueltas; i++) {
        // Crear un div para representar la tarjeta
        const carta = document.createElement("div"); 
        carta.classList.add("cards__card"); // Añadir clase para estilos

        // Crear una etiqueta img para mostrar la imagen de la categoría
        const imagen = document.createElement("img"); 
        imagen.classList.add("card__image"); // Añadir clase CSS a la imagen

        // Crear un título para la categoría
        const titulo = document.createElement("h3"); 
        titulo.classList.add("card__title"); // Añadir clase al título

        const año = document.createElement("h5");
        año.classList.add("card__title"); 
        
        // Asignar la imagen y el texto correspondientes desde los datos
        imagen.src = datos[i].imagen;// URL de la imagen
        imagen.alt = datos[i].titulo;          // Texto alternativo por accesibilidad
        titulo.textContent = datos[i].titulo;   // Nombre visible
        let partes = datos[i].fecha_publicacion.split("-");
        año.textContent = "Año: "+ partes[0];

        // Añadir comportamiento al hacer clic en la carta
        carta.addEventListener("click", function () {
            window.location.href = "libro.html?id="+datos[i].id;
        });
            
        // Agregar la imagen y el título dentro de la tarjeta
        carta.appendChild(imagen);
        carta.appendChild(titulo);
        carta.appendChild(año);

        // Agregar la tarjeta dentro de la ruta
        ruta.appendChild(carta);
    }
}