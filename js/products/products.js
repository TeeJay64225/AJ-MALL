// products.js

// Sample product data (replace with actual backend data)
const products = [
    {
    id: 1,
    name: "Egg",
    price: 40.00,
    category: "electronics",
    brand: "brand1",
    rating: 4.5,
    image: "../../assets/images/egg.jpg",
    description: "..."
    },
    {
    id: 2,
    name: "Fresh Tomatoes",
    price: 20.00,
    category: "electronics",
    brand: "brand1",
    rating: 4.5,
    image: "../../assets/images/tomatoes.jpg",
    description: "..."
    },
    
    {
    id: 3,
    name: "Milo",
    price: 56.00,
    category: "electronics",
    brand: "brand1",
    rating: 4.5,
    image: "../../assets/images/milopacked.jpeg",
    description: "..."
    },
    {
    id: 4,
    name: "Nescafe",
    price: 78.70,
    category: "electronics",
    brand: "brand1",
    rating: 4.5,
    image: "../../assets/images/nes.jpeg",
    description: "...."
    },
    {
    id: 5,
    name: "English Rice",
    price: 43.98,
    category: "electronics",
    brand: "brand1",
    rating: 4.5,
    image: "../../assets/images/pack.jpg",
    description: "...."
    },
    {
    id: 6,
    name: "Toilet Roll",
    price: 75.09,
    category: "electronics",
    brand: "brand1",
    rating: 4.5,
    image: "../../assets/images/troll.jpeg",
    description: "..."
    },
    {
    id: 7,
    name: "Local Raw Rice",
    price: 57.00,
    category: "electronics",
    brand: "brand1",
    rating: 4.5,
    image: "../../assets/images/rice.jpg",
    description: "..."
    },
    {
    id: 8,
    name: "Adult Diaper",
    price: 67.90,
    category: "electronics",
    brand: "brand1",
    rating: 4.5,
    image: "../../assets/images/adult.jpeg",
    description: "...."
    },
    {
    id: 9,
    name: "Apple",
    price: 46.90,
    category: "electronics",
    brand: "brand1",
    rating: 4.5,
    image: "../../assets/images/apll.jpg",
    description: "..."
    },
    {
    id: 10,
    name: "Canned Drink",
    price: 34.90,
    category: "electronics",
    brand: "brand1",
    rating: 4.5,
    image: "../../assets/images/can.jpg",
    description: "..."
    },
    {
    id: 11,
    name: "tomatoes",
    price: 34.90,
    category: "electronics",
    brand: "brand1",
    rating: 4.5,
    image: "../../assets/images/tomatoes.jpg",
    description: "..."
    },
    {
    id: 12,
    name: "Coca cola",
    price: 67.90,
    category: "electronics",
    brand: "brand1",
    rating: 4.5,
    image: "../../assets/images/coca.jpg",
    description: "..."
    },
    {
    id: 13,
    name: "Strawberry",
    price: 69.05,
    category: "electronics",
    brand: "brand1",
    rating: 4.5,
    image: "../../assets/images/straw.jpg",
    description: "..."
    },
];

// DOM Elements
const productsGrid = document.getElementById("productsGrid");

// Render products
function renderProducts() {
    productsGrid.innerHTML = "";
    products.forEach(product => {
        const productElement = document.createElement("div");
        productElement.className = "product-card";
        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-price">GHS ${product.price.toFixed(2)}</p>
            <div class="rating">${createRatingStars(product.rating)}</div>
            <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
        `;
        productsGrid.appendChild(productElement);
    });
}

// Create rating stars
function createRatingStars(rating) {
    return "★".repeat(Math.floor(rating)) + (rating % 1 ? "☆" : "");
}

const shoppingCart = {
    getCart: () => JSON.parse(localStorage.getItem("cart")) || [],
    saveCart: (cart) => localStorage.setItem("cart", JSON.stringify(cart)),
    addToCart: (product) => {
        let cart = shoppingCart.getCart();
        let existingProduct = cart.find(item => item.id === product.id);
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        shoppingCart.saveCart(cart);
        alert("Product added to cart!");
        window.location.href = "/pages/cart.html"; // Redirect to the cart page
    }
};


// Add event listeners to "Add to Cart" buttons
document.addEventListener("click", (event) => {
    if (event.target.classList.contains("add-to-cart")) {
        const productId = parseInt(event.target.dataset.id);
        const product = products.find(p => p.id === productId);
        if (product) {
            shoppingCart.addToCart(product);
        }
    }
});

// Initialize product rendering
document.addEventListener("DOMContentLoaded", renderProducts);
