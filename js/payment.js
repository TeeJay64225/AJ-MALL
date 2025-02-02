document.addEventListener('DOMContentLoaded', function () {
    // DOM Elements
    const paymentMethods = document.querySelectorAll('.payment-method');
    const paymentForms = document.querySelectorAll('.payment-form');
    const cardNumberInput = document.getElementById('card-number');
    const expiryInput = document.getElementById('expiry');
    const cvvInput = document.getElementById('cvv');
    const payButton = document.querySelector('.pay-button');

    // Payment Method Selection
    paymentMethods.forEach((method) => {
        method.addEventListener('click', function () {
            // Remove active class from all methods
            paymentMethods.forEach((m) => m.classList.remove('active'));
            // Add active class to selected method
            this.classList.add('active');

            // Show corresponding form
            const selectedMethod = this.querySelector('input').id;
            paymentForms.forEach((form) => {
                form.classList.add('hidden');
                if (form.id === `${selectedMethod}-form`) {
                    form.classList.remove('hidden');
                }
            });
        });
    });

    // Card Number Formatting
    cardNumberInput?.addEventListener('input', function (e) {
        let value = e.target.value.replace(/\s/g, '');
        value = value.replace(/\D/g, '');

        // Add space after every 4 digits
        value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
        e.target.value = value;
    });

    // Expiry Date Formatting (MM/YY)
    expiryInput?.addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');

        if (value.length > 2) {
            value = value.slice(0, 2) + '/' + value.slice(2, 4);
        }
        e.target.value = value;
    });

    // CVV Validation (Only digits, max length 3 or 4)
    cvvInput?.addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');
        value = value.slice(0, 4); // Adjust max length for 3 or 4 digits CVV
        e.target.value = value;
    });

    // Payment Submission
    payButton?.addEventListener('click', function (e) {
        e.preventDefault();

        const selectedPaymentMethod = document.querySelector('.payment-method.active input');
        if (!selectedPaymentMethod) {
            alert('Please select a payment method.');
            return;
        }

        if (selectedPaymentMethod.id === 'card') {
            // Validate card inputs
            if (!cardNumberInput.value || !expiryInput.value || !cvvInput.value) {
                alert('Please fill in all card details.');
                return;
            }

            // Mock payment process
            alert('Processing card payment...');
            console.log({
                cardNumber: cardNumberInput.value,
                expiry: expiryInput.value,
                cvv: cvvInput.value,
            });
        } else if (selectedPaymentMethod.id === 'mobile') {
            // Handle mobile payment submission
            const mobileInput = document.getElementById('mobile-number');
            if (!mobileInput.value) {
                alert('Please enter your mobile number.');
                return;
            }

            alert('Processing mobile payment...');
            console.log({
                mobileNumber: mobileInput.value,
            });
        } else {
            alert('The payment integration will be added later');
            return;
        }

        // Redirect to payment confirmation page
        window.location.href = "payConfirmed.html";
    });
});

document.addEventListener('DOMContentLoaded', function () {
    // DOM Elements for order summary
    const subtotalElement = document.getElementById("paymentSubtotal");
    const shippingElement = document.getElementById("paymentShipping");
    const taxElement = document.getElementById("paymentTax");
    const totalElement = document.getElementById("paymentTotal");
    const payButton = document.querySelector('.pay-button');

    // Function to load order summary from localStorage
    function loadOrderSummary() {
        const orderSummary = JSON.parse(localStorage.getItem('orderSummary')) || {
            subtotal: 0,
            shipping: 0,
            tax: 0,
            total: 0
        };

        if (subtotalElement) subtotalElement.textContent = `GHS ${orderSummary.subtotal.toFixed(2)}`;
        if (shippingElement) shippingElement.textContent = `GHS ${orderSummary.shipping.toFixed(2)}`;
        if (taxElement) taxElement.textContent = `GHS ${orderSummary.tax.toFixed(2)}`;
        if (totalElement) {
            totalElement.textContent = `GHS ${orderSummary.total.toFixed(2)}`;
            payButton.innerHTML = `<i class="fas fa-lock"></i> Pay GHS ${orderSummary.total.toFixed(2)}`;
        }
    }

    // Load summary when page loads
    loadOrderSummary();
});
