// app.js

// Sample product data (later this will come from a backend)
const products = [
    {
        id: 1,
        name: "Product 1",
        price: 99.99,
        image: "assets/images/8.jpg",
        description: "Product 1 description"
    },
    {
        id: 1,
        name: "Product 1",
        price: 99.99,
        image: "assets/images/8.jpg",
        description: "Product 1 description"
    },
    {
        id: 1,
        name: "Product 1",
        price: 99.99,
        image: "assets/images/8.jpg",
        description: "Product 1 description"
    },
    {
        id: 1,
        name: "Product 1",
        price: 99.99,
        image: "assets/images/8.jpg",
        description: "Product 1 description"
    },
    // Add more products...
];


// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    }
}

// Load featured products
function loadFeaturedProducts() {
    const featuredProducts = document.getElementById('featuredProducts');
    if (!featuredProducts) return;

    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'product-card';
        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h4>${product.name}</h4>
            <p>GHS${product.price}</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        featuredProducts.appendChild(productElement);
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
        cart.push({
            productId,
            quantity: 1,
            price: product.price
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadFeaturedProducts();
    updateCartCount();
});

