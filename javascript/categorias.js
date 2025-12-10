window.onload = function () {
    // Esta función se ejecuta automáticamente cuando la página termina de cargar

    // Definimos la URL a la que se va a hacer la petición (consulta a la tabla 'categorias' de tu API)
    const url = "http://localhost/TRISTAN/Login-v2/Api/api.php?tabla=categorias";

    // Se hace una petición HTTP GET a la URL
    fetch(url)
        .then(function (respuesta) {
            // Si la respuesta del servidor no es "ok" (por ejemplo, error 404 o 500), se lanza un error
            if (!respuesta.ok) {
                throw new Error("Error en el fetch: " + respuesta.status);
            }
            // Si todo está bien, se convierte la respuesta en un objeto JSON
            return respuesta.json();
        })
        .then(function (datos) {
            // Se llama a la función que crea las tarjetas, pasándole los datos recibidos
            crearTarjetasCategorias(datos);
        })
        .catch(function (error) {
            // Si hay un error en cualquier punto del proceso, se muestra una alerta con el mensaje
            alert("Error accediendo a la url: " + error);
        });

    // Función para crear dinámicamente tarjetas a partir de las categorías recibidas
    function crearTarjetasCategorias(categorias) {
        // Se obtiene el contenedor donde se van a insertar las tarjetas
        const contenedor = document.getElementById('recomendados-carrusel');

        // Se recorre cada categoría recibida del servidor
        categorias.forEach(categoria => {
            // Crear un div para representar la tarjeta
            const carta = document.createElement("div"); 
            carta.classList.add("cards__card"); // Añadir clase para estilos

            // Crear una etiqueta img para mostrar la imagen de la categoría
            const imagen = document.createElement("img"); 
            imagen.classList.add("card__image"); // Añadir clase CSS a la imagen

            // Crear un título para la categoría
            const titulo = document.createElement("h3"); 
            titulo.classList.add("card__title"); // Añadir clase al título
            
            // Asignar la imagen y el texto correspondientes desde los datos
            imagen.src = categoria.imagen_categoria; // URL de la imagen
            imagen.alt = categoria.nombre;           // Texto alternativo por accesibilidad
            titulo.textContent = categoria.nombre;   // Nombre visible

            // Añadir comportamiento al hacer clic en la carta
            carta.addEventListener("click", function () {
                // Redirigir a otra página con el ID como parámetro en la URL
                window.location.href = "subcategorias.html?id="+categoria.id+"&nombre="+categoria.nombre;
            });

            // Agregar la imagen y el título dentro de la tarjeta
            carta.appendChild(imagen);
            carta.appendChild(titulo);

            // Agregar la tarjeta dentro del contenedor
            contenedor.appendChild(carta);
        });
    }
}
