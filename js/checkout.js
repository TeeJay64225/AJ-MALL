// checkout.js

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
        // Form submission
        const checkoutForm = document.getElementById('checkoutForm');
        if (checkoutForm) {
            checkoutForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.processCheckout();
            });
        }

        // Same as billing address checkbox
        const sameAsBilling = document.getElementById('sameAsBilling');
        if (sameAsBilling) {
            sameAsBilling.addEventListener('change', () => {
                this.toggleShippingAddress();
            });
        }

        // Payment method selection
        document.querySelectorAll('input[name="paymentMethod"]').forEach(input => {
            input.addEventListener('change', (e) => {
                this.togglePaymentFields(e.target.value);
            });
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
        return this.calculateSubtotal() * 0.1; // 10% tax
    }

    updateOrderSummary() {
        const summaryElement = document.getElementById('orderSummary');
        if (!summaryElement) return;

        summaryElement.innerHTML = `
            <div class="summary-item">
                <span>Subtotal</span>
                <span>$${this.orderSummary.subtotal.toFixed(2)}</span>
            </div>
            <div class="summary-item">
                <span>Shipping</span>
                <span>$${this.orderSummary.shipping.toFixed(2)}</span>
            </div>
            <div class="summary-item">
                <span>Tax</span>
                <span>$${this.orderSummary.tax.toFixed(2)}</span>
            </div>
            <div class="summary-item total">
                <span>Total</span>
                <span>$${this.orderSummary.total.toFixed(2)}</span>
            </div>
        `;
    }

    toggleShippingAddress() {
        const shippingSection = document.getElementById('shippingAddressSection');
        const sameAsBilling = document.getElementById('sameAsBilling');
        
        if (shippingSection && sameAsBilling) {
            shippingSection.style.display = sameAsBilling.checked ? 'none' : 'block';
        }
    }

    togglePaymentFields(paymentMethod) {
        const creditCardFields = document.getElementById('creditCardFields');
        const paypalFields = document.getElementById('paypalFields');

        if (creditCardFields && paypalFields) {
            creditCardFields.style.display = paymentMethod === 'credit-card' ? 'block' : 'none';
            paypalFields.style.display = paymentMethod === 'paypal' ? 'block' : 'none';
        }
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
        if (sameAsBilling && sameAsBilling.checked) {
            this.shippingAddress = { ...this.billingAddress };
        } else {
            this.shippingAddress = {
                firstName: document.getElementById('shippingFirstName').value,
                lastName: document.getElementById('shippingLastName').value,
                address: document.getElementById('shippingAddress').value,
                city: document.getElementById('shippingCity').value,
                state: document.getElementById('shippingState').value,
                zip: document.getElementById('shippingZip').value
            };
        }

        this.paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    }

    async processCheckout() {
        try {
            this.collectFormData();
            
            // Validate all required fields
            if (!this.validateCheckoutData()) {
                throw new Error('Please fill in all required fields');
            }

            // Show loading state
            this.toggleLoadingState(true);

            // Process payment (mock API call)
            const paymentResult = await this.processPayment();
            
            if (paymentResult.success) {
                // Create order
                const orderResult = await this.createOrder();
                
                if (orderResult.success) {
                    // Clear cart and redirect to success page
                    this.clearCart();
                    window.location.href = 'order-confirmation.html';
                } else {
                    throw new Error('Failed to create order');
                }
            } else {
                throw new Error('Payment processing failed');
            }
        } catch (error) {
            this.showError(error.message);
        } finally {
            this.toggleLoadingState(false);
        }
    }

    validateCheckoutData() {
        // Add validation logic
        return true; // Placeholder
    }

    async processPayment() {
        // Mock payment processing
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({ success: true });
            }, 1500);
        });
    }

    async createOrder() {
        // Mock order creation
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({ success: true });
            }, 1000);
        });
    }

    clearCart() {
        localStorage.removeItem('cart');
        this.cart = [];
    }

    toggleLoadingState(isLoading) {
        const submitButton = document.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = isLoading;
            submitButton.innerHTML = isLoading ? 
                '<span class="spinner-border spinner-border-sm"></span> Processing...' : 
                'Place Order';
        }
    }

    showError(message) {
        const errorDiv = document.getElementById('checkoutError');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
            setTimeout(() => {
                errorDiv.style.display = 'none';
            }, 5000);
        }
    }
}

// Initialize checkout
document.addEventListener('DOMContentLoaded', () => {
    const checkout = new Checkout();
});