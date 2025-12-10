window.addEventListener('load', function() {
  let ruta;
  setTimeout(() => {
      ruta=window.ruta;
      abrir=document.getElementById("abrir_modal");
      abrir.addEventListener("click", abrirModal);
      function abrirModal() {
          document.getElementById('visorPDF').src = ruta;
          document.getElementById('modal').style.display = 'block';
      }
    }, 100);
  let cerrar=document.getElementsByClassName("cerrando");
  cerrar[0].addEventListener("click", cerrarModal);
  cerrar[1].addEventListener("click", cerrarModal);
  function cerrarModal() {
      document.getElementById('modal').style.display = 'none';
      document.getElementById('visorPDF').src = ''; // Limpia el visor
    }
    
    // Cerrar con ESC
    document.addEventListener('keydown', function(e) {
      if (e.key === "Escape") cerrarModal();
    });
});

  