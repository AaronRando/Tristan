window.onload = function () {
    const params = new URLSearchParams(window.location.search);
    const busqueda = decodeURIComponent(params.get("busqueda"));
    const buscador = document.getElementById("searchInput");
    buscador.value=busqueda;
    const contenedor = document.getElementById('recomendados-carrusel');
    const resultado = JSON.parse(sessionStorage.getItem('resultadosBusqueda'));
    if (!resultado || resultado === "null") {
        window.location.href = "index.html";
    }else {
        // Vaciar el sessionStorage
        for (let i = 0; i < resultado.length; i++) {
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
            imagen.src = resultado[i].imagen;// URL de la imagen
            imagen.alt = resultado[i].titulo;          // Texto alternativo por accesibilidad
            titulo.textContent = resultado[i].titulo;   // Nombre visible
            let partes = resultado[i].fecha_publicacion.split("-");
            año.textContent = "Año: "+ partes[0];

            // Añadir comportamiento al hacer clic en la carta
            carta.addEventListener("click", function () {
                window.location.href = "libro.html?id="+resultado[i].id;
            });
                
            // Agregar la imagen y el título dentro de la tarjeta
            carta.appendChild(imagen);
            carta.appendChild(titulo);
            carta.appendChild(año);

            // Agregar la tarjeta dentro de la ruta
            contenedor.appendChild(carta);
        }
    }
    
}