document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const submitButton = document.querySelector('.contact-submit');
    const formMessage = document.getElementById('formMessage');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Simular envío del formulario
        setTimeout(function() {
            // Mostrar mensaje de éxito
            formMessage.textContent = 'Mensaje enviado, ¡muchas gracias!';
            formMessage.className = 'form-message success';
            
            // Resetear formulario
            contactForm.reset();
            
            // Ocultar mensaje después de 5 segundos
            setTimeout(function() {
                formMessage.style.display = 'none';
            }, 5000);
        }, 1000);
    });
});