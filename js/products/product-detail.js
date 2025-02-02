// product-detail.js

// Sample product data (replace with actual backend data)
const productData = {
    id: "123",
    name: "Premium Product",
    brand: "Brand Name",
    sku: "SKU123",
    price: {
        current: 99.99,
        original: 129.99,
        discount: 23
    },
    rating: {
        average: 4.5,
        count: 128
    },
    images: [
        "../../assets/images/8.jpg",
        "../../assets/images/9.jpg",
        "../../assets/images/8.jpg",
        "../../assets/images/8.jpg"
    ],
    colors: [
        { name: "Red", code: "#FF0000" },
        { name: "Blue", code: "#0000FF" },
        { name: "Green", code: "#00FF00" }
    ],
    sizes: ["S", "M", "L", "XL"],
    description: "Product description goes here...",
    specifications: [
        { label: "Material", value: "Premium material" },
        { label: "Dimensions", value: "10 x 20 x 30 cm" },
        { label: "Weight", value: "500g" }
    ],
    reviews: [
        {
            id: 1,
            user: "John Doe",
            rating: 5,
            date: "2024-01-15",
            comment: "Great product!",
            likes: 10
        }
        // Add more reviews...
    ]
};

// DOM Elements
const mainImage = document.getElementById('mainImage');
const thumbnailContainer = document.getElementById('thumbnailContainer');
const productTitle = document.getElementById('productTitle');
const brandName = document.getElementById('brandName');
const skuNumber = document.getElementById('skuNumber');
const currentPrice = document.getElementById('currentPrice');
const originalPrice = document.getElementById('originalPrice');
const discountBadge = document.getElementById('discountBadge');
const productDescription = document.getElementById('productDescription');
const colorSection = document.getElementById('colorSection');
const sizeSection = document.getElementById('sizeSection');
const quantity = document.getElementById('quantity');
const decreaseQty = document.getElementById('decreaseQty');
const increaseQty = document.getElementById('increaseQty');
const addToCart = document.getElementById('addToCart');
const addToWishlist = document.getElementById('addToWishlist');
const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanes = document.querySelectorAll('.tab-pane');

// Initialize page
function initializeProductPage() {
    loadProductData();
    setupImageGallery();
    setupQuantityControls();
    setupTabSystem();
    setupAddToCart();
    loadReviews();
    loadRelatedProducts();
}

// Load product data
function loadProductData() {
    document.title = `${productData.name} - AJ Mall`;
    productTitle.textContent = productData.name;
    brandName.textContent = productData.brand;
    skuNumber.textContent = productData.sku;
    currentPrice.textContent = `$${productData.price.current.toFixed(2)}`;
    originalPrice.textContent = `$${productData.price.original.toFixed(2)}`;
    discountBadge.textContent = `${productData.price.discount}% OFF`;
    productDescription.textContent = productData.description;

    // Load colors
    productData.colors.forEach(color => {
        const colorOption = document.createElement('div');
        colorOption.className = 'color-option';
        colorOption.style.backgroundColor = color.code;
        colorOption.setAttribute('data-color', color.name);
        colorOption.addEventListener('click', () => selectColor(color.name));
        colorSection.querySelector('.color-options').appendChild(colorOption);
    });

    // Load sizes
    productData.sizes.forEach(size => {
        const sizeOption = document.createElement('div');
        sizeOption.className = 'size-option';
        sizeOption.textContent = size;
        sizeOption.addEventListener('click', () => selectSize(size));
        sizeSection.querySelector('.size-options').appendChild(sizeOption);
    });
}

// Image gallery functionality
function setupImageGallery() {
    mainImage.src = productData.images[0];
    
    productData.images.forEach((image, index) => {
        const thumbnail = document.createElement('div');
        thumbnail.className = 'thumbnail';
        thumbnail.innerHTML = `<img src="${image}" alt="Product image ${index + 1}">`;
        thumbnail.addEventListener('click', () => {
            mainImage.src = image;
            document.querySelectorAll('.thumbnail').forEach(thumb => thumb.classList.remove('active'));
            thumbnail.classList.add('active');
        });
        if (index === 0) thumbnail.classList.add('active');
        thumbnailContainer.appendChild(thumbnail);
    });
}

// Quantity controls
function setupQuantityControls() {
    decreaseQty.addEventListener('click', () => {
        const currentValue = parseInt(quantity.value);
        if (currentValue > 1) {
            quantity.value = currentValue - 1;
        }
    });

    increaseQty.addEventListener('click', () => {
        const currentValue = parseInt(quantity.value);
        if (currentValue < 99) {
            quantity.value = currentValue + 1;
        }
    });

    quantity.addEventListener('change', () => {
        let value = parseInt(quantity.value);
        if (isNaN(value) || value < 1) value = 1;
        if (value > 99) value = 99;
        quantity.value = value;
    });
}

// Tab system
function setupTabSystem() {
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');
            
            // Update buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Update content
            tabPanes.forEach(pane => {
                pane.classList.remove('active');
                if (pane.id === tabName) {
                    pane.classList.add('active');
                }
            });
        });
    });
}

// Add to cart functionality
function setupAddToCart() {
    addToCart.addEventListener('click', () => {
        const selectedColor = document.querySelector('.color-option.selected');
        const selectedSize = document.querySelector('.size-option.selected');
        
        if (!selectedColor || !selectedSize) {
            alert('Please select color and size');
            return;
        }

        const cartItem = {
            productId: productData.id,
            quantity: parseInt(quantity.value),
            color: selectedColor.getAttribute('data-color'),
            size: selectedSize.textContent,
            price: productData.price.current
        };

        // Add to cart (implement your cart logic here)
        console.log('Adding to cart:', cartItem);
        updateCart(cartItem);
    });
}

// Color selection
function selectColor(colorName) {
    document.querySelectorAll('.color-option').forEach(option => {
        option.classList.remove('selected');
        if (option.getAttribute('data-color') === colorName) {
            option.classList.add('selected');
        }
    });
}

// Size selection
function selectSize(size) {
    document.querySelectorAll('.size-option').forEach(option => {
        option.classList.remove('selected');
        if (option.textContent === size) {
            option.classList.add('selected');
        }
    });
}

// Load reviews
function loadReviews() {
    const reviewsContainer = document.querySelector('.reviews-list');
    productData.reviews.forEach(review => {
        const reviewElement = createReviewElement(review);
        reviewsContainer.appendChild(reviewElement);
    });
}

// Create review element
function createReviewElement(review) {
    const reviewDiv = document.createElement('div');
    reviewDiv.className = 'review-item';
    reviewDiv.innerHTML = `
        <div class="review-header">
            <span class="review-author">${review.user}</span>
            <div class="review-rating">
                ${createStarRating(review.rating)}
            </div>
            <span class="review-date">${formatDate(review.date)}</span>
        </div>
        <div class="review-content">${review.comment}</div>
        <div class="review-actions">
            <button class="like-btn" data-review-id="${review.id}">
                <i class="fas fa-thumbs-up"></i>
                <span>${review.likes}</span>
            </button>
        </div>
    `;
    return reviewDiv;
}

// Create star rating
function createStarRating(rating) {
    return Array(5).fill(0).map((_, index) => 
        `<i class="fas fa-star${index < rating ? '' : '-o'}"></i>`
    ).join('');
}

// Format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Load related products
function loadRelatedProducts() {
    // Implement related products loading logic
}

// Update cart
function updateCart(item) {
    // Implement cart update logic
    // Update cart count in header
    const cartCount = document.querySelector('.cart-count');
    const currentCount = parseInt(cartCount.textContent);
    cartCount.textContent = currentCount + item.quantity;
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeProductPage);