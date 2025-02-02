// Inventory Management JavaScript

// Sample inventory data
let inventory = [
    {
        id: "PRD001",
        name: "Wireless Headphones",
        category: "Electronics",
        stock: 25,
        price: 99.99,
        status: "in-stock",
        image: "../assets/images/product1.jpg"
    }
    // Add more items as needed
];

// DOM Elements
const inventoryTable = document.querySelector('.inventory-table tbody');
const addProductBtn = document.querySelector('.add-product-btn');
const searchInput = document.querySelector('.search-bar input');
const sidebarToggle = document.getElementById('sidebar-toggle');
const sidebar = document.querySelector('.sidebar');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderInventory();
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    // Sidebar Toggle
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });

    // Add Product Button
    addProductBtn.addEventListener('click', showAddProductModal);

    // Search Functionality
    searchInput.addEventListener('input', debounce((e) => {
        const searchTerm = e.target.value.toLowerCase();
        filterInventory(searchTerm);
    }, 300));

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 992 && 
            !e.target.closest('.sidebar') && 
            !e.target.closest('#sidebar-toggle')) {
            sidebar.classList.remove('active');
        }
    });
}

// Render Inventory Table
function renderInventory(items = inventory) {
    inventoryTable.innerHTML = items.map(item => `
        <tr>
            <td>${item.id}</td>
            <td><img src="${item.image}" alt="${item.name}" class="product-img"></td>
            <td>${item.name}</td>
            <td>${item.category}</td>
            <td>${item.stock}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td><span class="status-badge ${item.status}">${formatStatus(item.status)}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="edit-btn" onclick="editProduct('${item.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-btn" onclick="deleteProduct('${item.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Filter Inventory
function filterInventory(searchTerm) {
    const filtered = inventory.filter(item => 
        item.name.toLowerCase().includes(searchTerm) ||
        item.id.toLowerCase().includes(searchTerm) ||
        item.category.toLowerCase().includes(searchTerm)
    );
    renderInventory(filtered);
}

// Add Product Modal
function showAddProductModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Add New Product</h2>
                <button class="close-modal">&times;</button>
            </div>
            <form id="addProductForm">
                <div class="form-group">
                    <label for="productName">Product Name</label>
                    <input type="text" id="productName" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="productCategory">Category</label>
                    <select id="productCategory" class="form-control" required>
                        <option value="Electronics">Electronics</option>
                        <option value="Clothing">Clothing</option>
                        <option value="Books">Books</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="productStock">Stock</label>
                    <input type="number" id="productStock" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="productPrice">Price</label>
                    <input type="number" id="productPrice" step="0.01" class="form-control" required>
                </div>
                <button type="submit" class="add-product-btn">Add Product</button>
            </form>
        </div>
    `;

    document.body.appendChild(modal);
    modal.style.display = 'block';

    // Close Modal Events
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.onclick = () => {
        modal.remove();
    };

    window.onclick = (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    };

    // Form Submit
    const form = modal.querySelector('#addProductForm');
    form.onsubmit = (e) => {
        e.preventDefault();
        addProduct(form);
        modal.remove();
    };
}

// Add Product
function addProduct(form) {
    const newProduct = {
        id: generateProductId(),
        name: form.productName.value,
        category: form.productCategory.value,
        stock: parseInt(form.productStock.value),
        price: parseFloat(form.productPrice.value),
        status: form.productStock.value > 0 ? 'in-stock' : 'out-stock',
        image: '../assets/images/default-product.jpg'
    };

    inventory.unshift(newProduct);
    renderInventory();
    showNotification('Product added successfully');
}

// Edit Product
function editProduct(productId) {
    const product = inventory.find(p => p.id === productId);
    if (!product) return;

    // Similar to addProductModal but with pre-filled values
    // Implementation similar to showAddProductModal
}

// Delete Product
function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        inventory = inventory.filter(p => p.id !== productId);
        renderInventory();
        showNotification('Product deleted successfully');
    }
}

// Utility Functions
function generateProductId() {
    return 'PRD' + Math.random().toString(36).substr(2, 6).toUpperCase();
}

function formatStatus(status) {
    return status.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

function showNotification(message) {
    // Implementation of notification system
}

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