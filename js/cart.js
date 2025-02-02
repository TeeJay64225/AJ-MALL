
class ShoppingCart {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.cartTotal = 0;
        this.shippingCost = 0;
        this.tax = 0;
        this.addDemoItems(); // Ensure demo items are added if cart is empty
        this.init();
    }

    addDemoItems() {
        if (this.cart.length === 0) {
            this.cart = [
                {
                    id: 1,
                    name: "Wireless Headphones",
                    price: 50.00,
                    quantity: 7,
                    image: "../assets/images/can.jpg"
                },
                {
                    id: 2,
                    name: "Smart Watch",
                    price: 120.00,
                    quantity: 1,
                    image: "../assets/images/logo.png"
                }
            ];
            this.saveCart();
        }
    }

    init() {
        this.updateCartDisplay();
        this.setupEventListeners();
        this.updateCartCount();
    }

    updateCartDisplay() {
        const cartContainer = document.getElementById('cartItemsList');
        const cartCountElement = document.getElementById('cartCount');

        if (!cartContainer) return;

        if (this.cart.length === 0) {
            cartContainer.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Your cart is empty</p>
                    <a href="pages/products/list.html" class="continue-shopping">Continue Shopping</a>
                </div>
            `;
            return;
        }

        cartContainer.innerHTML = this.cart.map(item => this.generateCartItemHTML(item)).join('');
        this.updateCartSummary();
        cartCountElement.textContent = this.cart.length; // Update cart count in UI
    }

    generateCartItemHTML(item) {
        return `
            <div class="cart-item" data-product-id="${item.id}">
                <div class="item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p class="item-price">GHS ${item.price.toFixed(2)}</p>
                    <div class="quantity-controls">
                        <button class="quantity-btn" data-action="decrease">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn" data-action="increase">+</button>
                    </div>
                    <button class="remove-item">
                        <i class="fas fa-trash"></i> Remove
                    </button>
                </div>
                <div class="item-total">
                    GHS ${(item.price * item.quantity).toFixed(2)}
                </div>
            </div>
        `;
    }

    updateCartCount() {
        const cartCountElement = document.getElementById('cartCount');
        const count = this.cart.reduce((total, item) => total + item.quantity, 0);
        if (cartCountElement) cartCountElement.textContent = count;
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }
}

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', () => {
    new ShoppingCart();
});
