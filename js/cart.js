

class ShoppingCart {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem("cart")) || [];
        this.cartTotal = 0;
        this.shippingCost = 10.00; // Example flat-rate shipping
        this.taxRate = 0.15; // Example 15% tax
        this.init();
    }

    // Load cart from localStorage
    loadCartFromStorage() {
        this.cart = JSON.parse(localStorage.getItem("cart")) || [];
    }

    // Initialize the cart functionalities
    init() {
        this.loadCartFromStorage();
        this.updateCartDisplay();
        this.setupEventListeners();
        this.updateCartCount();
    }

    // Update cart items display
    updateCartDisplay() {
        const cartContainer = document.getElementById("cartItemsList");
        const emptyCartMessage = document.getElementById("emptyCartMessage");
        if (!cartContainer) return;

        if (this.cart.length === 0) {
            cartContainer.innerHTML = "";
            emptyCartMessage.classList.remove("hidden");
            return;
        } else {
            emptyCartMessage.classList.add("hidden");
        }

        cartContainer.innerHTML = this.cart.map(item => this.generateCartItemHTML(item)).join("");
        this.updateCartSummary();
    }

    // Generate cart item HTML
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
                        <button class="quantity-btn" data-action="decrease" data-id="${item.id}">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn" data-action="increase" data-id="${item.id}">+</button>
                    </div>
                    <button class="remove-item" data-id="${item.id}">
                        <i class="fas fa-trash"></i> Remove
                    </button>
                </div>
                <div class="item-total">
                    GHS ${(item.price * item.quantity).toFixed(2)}
                </div>
            </div>
        `;
    }

    // Update cart count
    updateCartCount() {
        const cartCountElement = document.getElementById("cartCount");
        const count = this.cart.reduce((total, item) => total + item.quantity, 0);
        if (cartCountElement) cartCountElement.textContent = count;
    }

    // Save cart to localStorage
    saveCart() {
        localStorage.setItem("cart", JSON.stringify(this.cart));
        this.updateCartCount();
        this.updateCartDisplay();
    }

    // Add item to cart (called from product.js)
    addToCart(product) {
        let existingProduct = this.cart.find(item => item.id === product.id);
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            this.cart.push({ ...product, quantity: 1 });
        }
        this.saveCart();
    }

    // Remove item from cart
    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
    }

    // Update quantity of item
    updateQuantity(productId, action) {
        let item = this.cart.find(product => product.id === productId);
        if (item) {
            if (action === "increase") {
                item.quantity += 1;
            } else if (action === "decrease" && item.quantity > 1) {
                item.quantity -= 1;
            } else {
                this.removeFromCart(productId);
                return;
            }
            this.saveCart();
        }
    }

    // Update cart summary
    updateCartSummary() {
        const subtotal = this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const tax = subtotal * this.taxRate;
        const total = subtotal + this.shippingCost + tax;

        document.getElementById("subtotal").textContent = `GHS ${subtotal.toFixed(2)}`;
        document.getElementById("shipping").textContent = `GHS ${this.shippingCost.toFixed(2)}`;
        document.getElementById("tax").textContent = `GHS ${tax.toFixed(2)}`;
        document.getElementById("total").textContent = `GHS ${total.toFixed(2)}`;
    }

    // Set up event listeners
    setupEventListeners() {
        document.addEventListener("click", (event) => {
            const target = event.target;
            if (target.classList.contains("remove-item")) {
                const productId = parseInt(target.dataset.id);
                this.removeFromCart(productId);
            } else if (target.classList.contains("quantity-btn")) {
                const productId = parseInt(target.dataset.id);
                const action = target.dataset.action;
                this.updateQuantity(productId, action);
            }
        });
    }
}

// Initialize cart on page load
document.addEventListener("DOMContentLoaded", () => {
    window.shoppingCart = new ShoppingCart();
});