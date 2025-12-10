document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Cerrar otros items
            faqItems.forEach(otherItem => {
                if(otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle item actual
            item.classList.toggle('active');
        });
    });
});