// products.js
// Sample product data (replace with actual data from backend)
const products = [
    {
        id: 1,
        name: "Egg",
        price: 40.00,
        category: "electronics",
        brand: "brand1",
        rating: 4.5,
        image: "../../assets/images/egg.jpg",
        description: "Fresh Eggs Premium farm-fresh eggs with bright yellow yolks. Perfect for breakfast, baking, or cooking. Packed carefully to ensure quality and freshness. Available in cartons of 6, 12, and 30."
    },
    {
        id: 2,
        name: "Fresh Tomatoes",
        price: 20.00,
        category: "electronics",
        brand: "brand1",
        rating: 4.5,
        image: "../../assets/images/tomatoes.jpg",
        description: "Fresh Tomatoes Plump, juicy tomatoes picked at peak ripeness. Rich red color and firm texture. Ideal for salads, cooking, or sauces. Naturally grown and carefully selected.."
    },
    
    {
        id: 3,
        name: "Milo",
        price: 56.00,
        category: "electronics",
        brand: "brand1",
        rating: 4.5,
        image: "../../assets/images/milopacked.jpeg",
        description: "Milo Chocolate Malt Drink Rich chocolate malt beverage packed with essential vitamins and minerals. Made with natural cocoa for that classic Milo taste. Perfect hot or cold, provides energy for your active lifestyle.."
    },
    {
        id: 4,
        name: "Nescafe",
        price: 78.70,
        category: "electronics",
        brand: "brand1",
        rating: 4.5,
        image: "../../assets/images/nes.jpeg",
        description: "Nescafe Classic Coffee Premium instant coffee made from carefully selected coffee beans. Rich aroma and full-bodied taste. Quick and easy to prepare - just add hot water for your perfect cup of coffee."
    },
    {
        id: 5,
        name: "English Rice",
        price: 43.98,
        category: "electronics",
        brand: "brand1",
        rating: 4.5,
        image: "../../assets/images/pack.jpg",
        description: "English Rice Premium long-grain rice with a fluffy texture when cooked. Clean, uniform grains that don't stick together. Perfect for side dishes and main courses. Comes in convenient resealable packaging."
    },
    {
        id: 6,
        name: "Toilet Roll",
        price: 75.09,
        category: "electronics",
        brand: "brand1",
        rating: 4.5,
        image: "../../assets/images/troll.jpeg",
        description: "Toilet Roll Soft, absorbent toilet tissue that's gentle on skin. Double-ply for extra strength and comfort. Each roll provides long-lasting use. Available in convenient multi-packs.."
    },
    {
        id: 7,
        name: "Local Raw Rice",
        price: 57.00,
        category: "electronics",
        brand: "brand1",
        rating: 4.5,
        image: "../../assets/images/rice.jpg",
        description: "Local Raw Rice Unpolished, locally sourced rice with natural nutrients intact.Traditional flavor and hearty texture. Perfect for authentic local dishes. Available in various quantities."
    },
    {
        id: 8,
        name: "Adult Diaper",
        price: 67.90,
        category: "electronics",
        brand: "brand1",
        rating: 4.5,
        image: "../../assets/images/adult.jpeg",
        description: "Adult Diaper Comfortable, highly absorbent adult diapers with secure fit. Features moisture-wicking technology and leak guards. Discrete design with adjustable tabs for custom fit."
    },
    {
        id: 9,
        name: "Apple",
        price: 46.90,
        category: "electronics",
        brand: "brand1",
        rating: 4.5,
        image: "../../assets/images/apll.jpg",
        description: "Fresh Apples Crisp, sweet apples with bright skin and juicy flesh. Hand-picked at peak ripeness. Perfect for snacking, baking, or cooking. Available individually or by the bag."
    },
    {
        id: 10,
        name: "Canned Drink",
        price: 34.90,
        category: "electronics",
        brand: "brand1",
        rating: 4.5,
        image: "../../assets/images/can.jpg",
        description: "Canned Drinks Variety of refreshing beverages in convenient canned format. Long shelf life while maintaining taste. Perfect for storage or on-the-go refreshment."
    },
    {
        id: 11,
        name: "tomatoes",
        price: 34.90,
        category: "electronics",
        brand: "brand1",
        rating: 4.5,
        image: "../../assets/images/tomatoes.jpg",
        description: "Fresh Tomatoes Plump, juicy tomatoes picked at peak ripeness. Rich red color and firm texture. Ideal for salads, cooking, or sauces. Naturally grown and carefully selected.."
    },
    {
        id: 12,
        name: "Coca cola",
        price: 67.90,
        category: "electronics",
        brand: "brand1",
        rating: 4.5,
        image: "../../assets/images/coca.jpg",
        description: "Coca-Cola Classic carbonated soft drink with its signature refreshing taste. Ice-cold satisfaction in every sip. Available in various sizes for any occasion.."
    },
    {
        id: 13,
        name: "Strawberry",
        price: 69.05,
        category: "electronics",
        brand: "brand1",
        rating: 4.5,
        image: "../../assets/images/straw.jpg",
        description: "Fresh Strawberries Sweet, vibrant red strawberries bursting with flavor. Hand-selected for quality and ripeness. Perfect for snacking, desserts, or smoothies. Packed carefully to maintain freshness."
    },
    // Add more products...
];

// DOM Elements
const productsGrid = document.getElementById('productsGrid');
const sortSelect = document.getElementById('sortSelect');
const viewButtons = document.querySelectorAll('.view-btn');
const filterBtn = document.querySelector('.filter-btn');
const mobileFiltersModal = document.getElementById('mobileFiltersModal');
const searchInput = document.getElementById('searchInput');
const priceRange = document.getElementById('priceRange');
const minPrice = document.getElementById('minPrice');
const maxPrice = document.getElementById('maxPrice');

// State
let currentView = 'grid';
let filteredProducts = [...products];
let currentFilters = {
    search: '',
    minPrice: 0,
    maxPrice: 1000,
    category: 'all',
    brand: 'all'
};

// Initialize
function init() {
    renderProducts();
    setupEventListeners();
    updatePriceRange();
}

// Event Listeners
function setupEventListeners() {
    // Sort functionality
    sortSelect.addEventListener('change', (e) => {
        sortProducts(e.target.value);
    });

    // View switching
    viewButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            currentView = btn.dataset.view;
            updateViewButtons();
            renderProducts();
        });
    });

    // Search functionality
    searchInput.addEventListener('input', debounce((e) => {
        currentFilters.search = e.target.value.toLowerCase();
        applyFilters();
    }, 300));

    // Price range
    priceRange.addEventListener('input', (e) => {
        const [min, max] = e.target.value.split(',');
        minPrice.value = min;
        maxPrice.value = max;
        currentFilters.minPrice = Number(min);
        currentFilters.maxPrice = Number(max);
        applyFilters();
    });

    // Mobile filters
    filterBtn.addEventListener('click', () => {
        mobileFiltersModal.classList.toggle('hidden');
    });
}

// Render products
function renderProducts() {
    productsGrid.innerHTML = '';
    const template = currentView === 'grid' ? createGridTemplate : createListTemplate;
    
    filteredProducts.forEach(product => {
        productsGrid.appendChild(template(product));
    });
}

// Create grid view template
function createGridTemplate(product) {
    const div = document.createElement('div');
    div.className = 'product-card';
    div.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="product-image">
        <h3>${product.name}</h3>
        <p class="price">GHS ${product.price.toFixed(2)}</p>
        <div class="rating">${createRatingStars(product.rating)}</div>
        <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
    `;
    return div;
}

// Create list view template
function createListTemplate(product) {
    const div = document.createElement('div');
    div.className = 'product-list-item';
    div.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="product-image">
        <div class="product-details">
            <h3>${product.name}</h3>
            <p class="description">${product.description}</p>
            <p class="price">$${product.price.toFixed(2)}</p>
            <div class="rating">${createRatingStars(product.rating)}</div>
            <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
        </div>
    `;
    return div;
}

// Create rating stars
function createRatingStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<span class="star full">⭐️</span>';
    }
    if (hasHalfStar) {
        stars += '<span class="star half">⭐️</span>';
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<span class="star empty">⭐️</span>';
    }
    
    return stars;
}

// Sort products
function sortProducts(sortBy) {
    switch (sortBy) {
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            filteredProducts.sort((a, b) => b.rating - a.rating);
            break;
        case 'name':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
    }
    renderProducts();
}

// Apply filters
function applyFilters() {
    filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(currentFilters.search) ||
                            product.description.toLowerCase().includes(currentFilters.search);
        const matchesPrice = product.price >= currentFilters.minPrice &&
                           product.price <= currentFilters.maxPrice;
        const matchesCategory = currentFilters.category === 'all' ||
                              product.category === currentFilters.category;
        const matchesBrand = currentFilters.brand === 'all' ||
                           product.brand === currentFilters.brand;
        
        return matchesSearch && matchesPrice && matchesCategory && matchesBrand;
    });
    
    renderProducts();
}

// Update price range
function updatePriceRange() {
    const prices = products.map(p => p.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    
    priceRange.setAttribute('min', min);
    priceRange.setAttribute('max', max);
    minPrice.value = min;
    maxPrice.value = max;
    currentFilters.minPrice = min;
    currentFilters.maxPrice = max;
}

// Update view buttons
function updateViewButtons() {
    viewButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === currentView);
    });
}

// Debounce helper function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize the application
init();


// Cart functionality
const cartKey = "shoppingCart";

// Function to get cart from localStorage
function getCart() {
    return JSON.parse(localStorage.getItem(cartKey)) || [];
}

// Function to save cart to localStorage
function saveCart(cart) {
    localStorage.setItem(cartKey, JSON.stringify(cart));
}

// Function to add product to cart
// Function to add product to cart
function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let existingProduct = cart.find(item => item.id === product.id);
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart)); // Save updated cart
    alert("Product added to cart!");
}


// Add event listeners to "Add to Cart" buttons
document.addEventListener("click", function(event) {
    if (event.target.classList.contains("add-to-cart")) {
        const productId = parseInt(event.target.dataset.id);
        const product = products.find(p => p.id === productId);
        if (product) {
            addToCart({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image
            });
        }
    }
});

// Load cart items in cart.html
function loadCart() {
    const cartContainer = document.getElementById("cartContainer");
    if (!cartContainer) return;
    
    const cart = getCart();
    cartContainer.innerHTML = "";
    
    if (cart.length === 0) {
        cartContainer.innerHTML = "<p>Your cart is empty.</p>";
        return;
    }
    
    cart.forEach(item => {
        const div = document.createElement("div");
        div.className = "cart-item";
        div.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-image">
            <div>
                <h3>${item.name}</h3>
                <p class="cart-price">GHS ${item.price.toFixed(2)}</p>
                <p>Quantity: ${item.quantity}</p>
                <button class="remove-from-cart" data-id="${item.id}">Remove</button>
            </div>
        `;
        cartContainer.appendChild(div);
    });
}

// Remove item from cart
document.addEventListener("click", function(event) {
    if (event.target.classList.contains("remove-from-cart")) {
        const productId = parseInt(event.target.dataset.id);
        let cart = getCart();
        cart = cart.filter(item => item.id !== productId);
        saveCart(cart);
        loadCart();
    }
});

// Initialize cart on cart.html
if (window.location.pathname.includes("../pagescart.html")) {
    loadCart();
}
