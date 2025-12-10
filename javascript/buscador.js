// Elementos del DOM
const searchButton = document.getElementById('searchButton');
const searchInput = document.getElementById('searchInput');

// Función para realizar la búsqueda
searchButton.addEventListener('click', function () {
  const consulta = encodeURIComponent(searchInput.value);
  
  if (consulta) {
    const url = "http://localhost/TRISTAN/Login-v2/Api/api.php?tabla=libros&titulo=" + consulta;
    console.log(url);
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
            console.log(datos);
            
            sessionStorage.setItem('resultadosBusqueda', JSON.stringify(datos));  // Guarda los resultados como JSON
            window.location.href = "busqueda.html?busqueda="+searchInput.value;
        })
        .catch(function (error) {
            alert("Error accediendo a la url: " + error);
        });
  }
});