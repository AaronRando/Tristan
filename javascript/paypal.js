window.onload = function() {
    document.querySelectorAll('.subscribe-button').forEach(button => {
        button.addEventListener('click', function() {
            const planPrice = this.getAttribute('data-plan'); // Obtiene el precio del plan

            // Abre el modal
            var myModal = new bootstrap.Modal(document.getElementById('paypalModal'));
            myModal.show();

            // Borrar cualquier botón de PayPal anterior
            const container = document.getElementById('paypal-button-container');
            container.innerHTML = ''; // Limpia el contenedor

            // Renderiza el botón de PayPal con el precio correspondiente
            paypal.Buttons({
                createOrder: function(data, actions) {
                    return actions.order.create({
                        purchase_units: [{
                            amount: {
                                value: planPrice // Precio del plan seleccionado
                            }
                        }]
                    });
                },
                onApprove: function(data, actions) {
                    return actions.order.capture().then(function(details) {
                        alert('Pago completado por: ' + details.payer.name.given_name);
                        // Cierra el modal después de la aprobación
                        myModal.hide();
                    });
                }
            }).render(container); // Renderiza el botón dentro del contenedor correspondiente
        });
    });
}
