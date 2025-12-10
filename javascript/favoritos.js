document.addEventListener('DOMContentLoaded', function() {
    const favoritoBtn = document.getElementById('favorito-btn');
    const corazon = favoritoBtn.querySelector('.corazon');
    
    // Verificar si el usuario está logueado
    const usuario = localStorage.getItem('usuario') === 'true';
    const id = usuario.id;
    
    // Obtener ID del libro de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const libroId = urlParams.get('id');
    
    if (!libroId) {
      console.error('No se encontró ID de libro en la URL');
      favoritoBtn.style.display = 'none';
      return;
    }
  
    if (!usuario || !id) {
      // Mostrar botón pero con funcionalidad limitada
      favoritoBtn.onclick = function() {
        mostrarNotificacion('Debes iniciar sesión para usar favoritos');
      };
      return;
    }
    
    // Cargar favoritos del usuario
    let favoritos = JSON.parse(localStorage.getItem(`favoritos_${id}`)) || [];
    
    // Verificar si el libro actual está en favoritos
    const esFavorito = favoritos.includes(libroId);
    if (esFavorito) {
      corazon.classList.add('favorito');
      corazon.textContent = '♥';
    } else {
      corazon.textContent = '♡';
    }
    
    // Manejar clic en el botón de favoritos
    favoritoBtn.addEventListener('click', function() {
      const index = favoritos.indexOf(libroId);
      
      if (index === -1) {
        // Añadir a favoritos
        favoritos.push(libroId);
        corazon.classList.add('favorito');
        corazon.textContent = '♥';
        mostrarNotificacion('Libro añadido a favoritos');
      } else {
        // Quitar de favoritos
        favoritos.splice(index, 1);
        corazon.classList.remove('favorito');
        corazon.textContent = '♡';
        mostrarNotificacion('Libro eliminado de favoritos');
      }
      
      // Guardar en localStorage
      localStorage.setItem(`favoritos_${id}`, JSON.stringify(favoritos));
    });
    
    function mostrarNotificacion(mensaje) {
      const notificacion = document.createElement('div');
      notificacion.className = 'notificacion-favorito';
      notificacion.textContent = mensaje;
      
      // Estilos para la notificación
      notificacion.style.position = 'fixed';
      notificacion.style.bottom = '20px';
      notificacion.style.right = '20px';
      notificacion.style.backgroundColor = '#5a3c2e';
      notificacion.style.color = 'white';
      notificacion.style.padding = '12px 24px';
      notificacion.style.borderRadius = '4px';
      notificacion.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
      notificacion.style.zIndex = '1000';
      notificacion.style.animation = 'fadeIn 0.3s, fadeOut 0.3s 2.7s';
      
      document.body.appendChild(notificacion);
      
      setTimeout(() => {
        notificacion.remove();
      }, 3000);
    }
  });
  
  // Asegurarse de que las animaciones estén definidas
  if (!document.querySelector('style[data-favoritos-animations]')) {
    const style = document.createElement('style');
    style.setAttribute('data-favoritos-animations', 'true');
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes fadeOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(20px); }
      }
    `;
    document.head.appendChild(style);
  }