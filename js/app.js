// Sample product data (later this will come from a backend)
const products = [
    { id: 1, name: "Egg", price: 56.60, image: "assets/images/egg.jpg", description: "Product 1 description" },
    { id: 2, name: "Tomatoes", price: 46.90, image: "assets/images/tomatoes.jpg", description: "Product 1 description" },
    { id: 3, name: "Apple", price: 89.99, image: "assets/images/apll.jpg", description: "Product 1 description" },
    { id: 4, name: "Coca Cola", price: 39.99, image: "assets/images/can.jpg", description: "Product 1 description" },
];

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    }
}

// Load featured products dynamically
function loadFeaturedProducts() {
    const featuredProducts = document.getElementById('featuredProducts');
    if (!featuredProducts) return;

    featuredProducts.innerHTML = ''; // Clear existing products before adding new ones

    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'product-card';
        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h4>${product.name}</h4>
            <p>GHS ${product.price.toFixed(2)}</p>
            <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
        `;
        featuredProducts.appendChild(productElement);
    });

    // Attach event listeners to "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', function () {
            const productId = parseInt(this.getAttribute('data-id'));
            addToCart(productId);
        });
    });
}

// Add to cart functionality
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.productId === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ productId, quantity: 1, price: product.price });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();

    // Redirect to the cart page after adding an item
    window.location.href = "pages/products/list.html";
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadFeaturedProducts();
    updateCartCount();
});
