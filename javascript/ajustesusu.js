// Verificar si el usuario está logueado al cargar la página
document.addEventListener('DOMContentLoaded', function() {
  checkLoginStatus();
  if (window.location.pathname.split("/").pop()=="ajustes.html") {
    loadCurrentProfilePic();
  }
});

function checkLoginStatus() {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const authButtons = document.getElementById('auth-buttons');
  const userSection = document.getElementById('user-section');
  const userAvatar = document.getElementById('user-avatar');
  
  if (usuario) {
    // Ocultar botones de login/registro y mostrar sección de usuario
    authButtons.style.display = 'none';
    userSection.style.display = 'flex'; // Cambiado a flex para alinear bien
    
    // Mostrar la imagen del usuario si existe, sino la default
    if (usuario.foto_perfil) {
      userAvatar.src = usuario.foto_perfil;
    } else {
      userAvatar.src = 'img/usuarios/usuarios.webp'; // Corregí la extensión (.webp)
    }
  } else {
    // Mostrar botones de login/registro y ocultar sección de usuario
    authButtons.style.display = 'block';
    userSection.style.display = 'none';
  }
}

// Manejar el cierre de sesión
document.getElementById('logout-btn')?.addEventListener('click', function(e) {
  e.preventDefault();
  localStorage.removeItem('usuario');
  checkLoginStatus();
  window.location.href = 'index.html'; // Redirigir a la página principal
});

/*******************
 * NUEVO CÓDIGO AÑADIDO *
 *******************/
function loadCurrentProfilePic() {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const profilePic = document.getElementById('current-profile-pic');
  
  if (usuario && usuario.foto_perfil) {
      profilePic.src = usuario.foto_perfil;
  } else {
      profilePic.src = 'img/usuarios/usuarios.webp'; // Imagen por defecto
  }
}

document.getElementById('profile-pic-upload')?.addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (!file) return;
  
  if (file.size > 2 * 1024 * 1024) {
      alert('El archivo es demasiado grande. Máximo 2MB permitidos.');
      return;
  }
  
  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!validTypes.includes(file.type)) {
      alert('Formato no soportado. Solo JPG, PNG y WEBP.');
      return;
  }
  
  const usuario = JSON.parse(localStorage.getItem('usuario')) || {};
  
  
  // Crear nombre archivo: id_nombre.ext
  const extension = file.name.split('.').pop();
  let nombreArchivo;
  if(usuario.id){
    nombreArchivo = `${usuario.id}_${usuario.nombre.replace(/\s+/g, '_')}.${extension}`;
  }
  else {
    nombreArchivo = `${usuario.google_sub}_${usuario.nombre.replace(/\s+/g, '_')}.${extension}`;
  }
  
  const formData = new FormData();
  formData.append('foto_perfil', file);
  formData.append('nombre_archivo', nombreArchivo);
  formData.append('archivo_antiguo', usuario.foto_perfil || 'usuarios.webp'); // para borrar
  
  fetch('http://localhost/TRISTAN/Login-v2/Api/upload.php?correo='+usuario.correo, {
      method: 'POST',
      body: formData
  })
  .then(res => {
      if (!res.ok) throw new Error('Error subiendo imagen');
      return res.json();
  })
  .then(data => {
      if (data.url) {
          const imgElement = document.getElementById('current-profile-pic');
          imgElement.src = data.url;
          
          usuario.foto_perfil = data.url;
          localStorage.setItem('usuario', JSON.stringify(usuario));
          
          const navAvatar = document.getElementById('user-avatar');
          if (navAvatar) navAvatar.src = data.url;
          alert('Foto de perfil actualizada correctamente');
      } else {
          throw new Error(data.error || 'Error desconocido');
      }
  })
  .catch(error => {
      alert('Error al subir la imagen: ' + error.message);
  });
});
