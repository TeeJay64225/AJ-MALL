class Checkout {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.orderSummary = {};
        this.shippingAddress = {};
        this.billingAddress = {};
        this.paymentMethod = '';
        this.init();
    }

    init() {
        this.loadOrderSummary();
        this.setupEventListeners();
        this.initializeFormValidation();
        this.updateOrderSummary();
    }

    setupEventListeners() {
        const checkoutForm = document.getElementById('checkoutForm');
        if (checkoutForm) {
            checkoutForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.processCheckout();
            });
        }

        const sameAsBilling = document.getElementById('sameAsBilling');
        if (sameAsBilling) {
            sameAsBilling.addEventListener('change', () => {
                this.toggleShippingAddress();
            });
        }

        document.querySelectorAll('input[name="paymentMethod"]').forEach(input => {
            input.addEventListener('change', (e) => {
                this.togglePaymentFields(e.target.value);
            });
        });

        // Listen for changes in localStorage (sync with cart)
        window.addEventListener("storage", (event) => {
            if (event.key === "cart") {
                this.loadOrderSummary();
                this.updateOrderSummary();
            }
        });
    }

    initializeFormValidation() {
        const forms = document.querySelectorAll('.needs-validation');
        forms.forEach(form => {
            form.addEventListener('submit', (event) => {
                if (!form.checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                form.classList.add('was-validated');
            });
        });
    }

    loadOrderSummary() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.orderSummary = {
            subtotal: this.calculateSubtotal(),
            shipping: this.calculateShipping(),
            tax: this.calculateTax(),
            total: 0
        };
        this.orderSummary.total = this.orderSummary.subtotal + 
                                 this.orderSummary.shipping + 
                                 this.orderSummary.tax;
    }

    calculateSubtotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    calculateShipping() {
        return this.calculateSubtotal() > 100 ? 0 : 10;
    }

    calculateTax() {
        return this.calculateSubtotal() * 0.15;
    }

    updateOrderSummary() {
        document.getElementById("checkoutSubtotal").textContent = `GHS ${this.orderSummary.subtotal.toFixed(2)}`;
        document.getElementById("checkoutShipping").textContent = `GHS ${this.orderSummary.shipping.toFixed(2)}`;
        document.getElementById("checkoutTax").textContent = `GHS ${this.orderSummary.tax.toFixed(2)}`;
        document.getElementById("checkoutTotal").textContent = `GHS ${this.orderSummary.total.toFixed(2)}`;
    }

    toggleShippingAddress() {
        const shippingSection = document.getElementById('shippingAddressSection');
        const sameAsBilling = document.getElementById('sameAsBilling');
        
        if (shippingSection && sameAsBilling) {
            shippingSection.style.display = sameAsBilling.checked ? 'none' : 'block';
        }
    }

    togglePaymentFields(paymentMethod) {
        document.getElementById('creditCardFields').style.display = paymentMethod === 'credit-card' ? 'block' : 'none';
        document.getElementById('paypalFields').style.display = paymentMethod === 'paypal' ? 'block' : 'none';
    }

    collectFormData() {
        this.billingAddress = {
            firstName: document.getElementById('billingFirstName').value,
            lastName: document.getElementById('billingLastName').value,
            email: document.getElementById('billingEmail').value,
            address: document.getElementById('billingAddress').value,
            city: document.getElementById('billingCity').value,
            state: document.getElementById('billingState').value,
            zip: document.getElementById('billingZip').value
        };

        const sameAsBilling = document.getElementById('sameAsBilling');
        this.shippingAddress = sameAsBilling.checked ? { ...this.billingAddress } : {
            firstName: document.getElementById('shippingFirstName').value,
            lastName: document.getElementById('shippingLastName').value,
            address: document.getElementById('shippingAddress').value,
            city: document.getElementById('shippingCity').value,
            state: document.getElementById('shippingState').value,
            zip: document.getElementById('shippingZip').value
        };

        this.paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    }

    async processCheckout() {
        try {
            this.collectFormData();
            if (!this.validateCheckoutData()) throw new Error('Please fill in all required fields');
            this.toggleLoadingState(true);

            const paymentResult = await this.processPayment();
            if (paymentResult.success) {
                const orderResult = await this.createOrder();
                if (orderResult.success) {
                    this.clearCart();
                    window.location.href = 'order-confirmation.html';
                } else throw new Error('Failed to create order');
            } else throw new Error('Payment processing failed');
        } catch (error) {
            this.showError(error.message);
        } finally {
            this.toggleLoadingState(false);
        }
    }

    validateCheckoutData() {
        return true; 
    }

    async processPayment() {
        return new Promise(resolve => setTimeout(() => resolve({ success: true }), 1500));
    }

    async createOrder() {
        return new Promise(resolve => setTimeout(() => resolve({ success: true }), 1000));
    }

    clearCart() {
        localStorage.removeItem('cart');
        this.cart = [];
    }

    toggleLoadingState(isLoading) {
        const submitButton = document.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = isLoading;
            submitButton.innerHTML = isLoading ? '<span class="spinner-border spinner-border-sm"></span> Processing...' : 'Place Order';
        }
    }

    showError(message) {
        const errorDiv = document.getElementById('checkoutError');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
            setTimeout(() => errorDiv.style.display = 'none', 5000);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.checkout = new Checkout();
});

document.addEventListener('DOMContentLoaded', () => {
    window.checkout = new Checkout();

    // Ensure order summary is saved before redirecting
    document.getElementById('proceedToPayment')?.addEventListener('click', function (e) {
        e.preventDefault(); // Prevent default anchor behavior

        // Save the order summary in localStorage
        localStorage.setItem('orderSummary', JSON.stringify(window.checkout.orderSummary));

        // Redirect to payment page
        window.location.href = "../pages/payment.html";
    });
});
