let inventoryData = [
    {
        id: 1,
        name: "Smartphone X",
        category: "electronics",
        sku: "TECH001",
        price: 699.99,
        stock: 50,
        status: "instock"
    },
    {
        id: 2,
        name: "Laptop Pro",
        category: "electronics",
        sku: "TECH002",
        price: 1199.99,
        stock: 10,
        status: "lowstock"
    },
    {
        id: 3,
        name: "Cotton T-Shirt",
        category: "fashion",
        sku: "FASH001",
        price: 19.99,
        stock: 0,
        status: "outofstock"
    }
];

let filteredInventory = [...inventoryData];
let currentPage = 1;
const itemsPerPage = 5;

// Initialize inventory table
function initializeInventory() {
    const tableBody = document.getElementById('inventoryTableBody');
    tableBody.innerHTML = '';

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedData = filteredInventory.slice(start, end);

    paginatedData.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="checkbox" data-id="${item.id}"></td>
            <td>${item.name}</td>
            <td>${item.category}</td>
            <td>${item.sku}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>${item.stock}</td>
            <td><span class="status ${item.status}">${item.status}</span></td>
            <td>
                <button class="edit-btn" onclick="openEditProductModal(${item.id})">Edit</button>
                <button class="delete-btn" onclick="deleteProduct(${item.id})">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
    updatePaginationControls();
}

// Search products
const searchInput = document.getElementById('searchProduct');
searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    filteredInventory = inventoryData.filter(item => 
        item.name.toLowerCase().includes(searchTerm) ||
        item.sku.toLowerCase().includes(searchTerm)
    );
    currentPage = 1;
    initializeInventory();
});

// Filter by category and stock
const categoryFilter = document.getElementById('categoryFilter');
const stockFilter = document.getElementById('stockFilter');

categoryFilter.addEventListener('change', applyFilters);
stockFilter.addEventListener('change', applyFilters);

function applyFilters() {
    const category = categoryFilter.value;
    const stock = stockFilter.value;

    filteredInventory = inventoryData.filter(item => 
        (category === "" || item.category === category) &&
        (stock === "" || item.status === stock)
    );
    currentPage = 1;
    initializeInventory();
}

// Pagination controls
const prevPageBtn = document.querySelector('.pagination .fa-chevron-left');
const nextPageBtn = document.querySelector('.pagination .fa-chevron-right');

prevPageBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        initializeInventory();
    }
});

nextPageBtn.addEventListener('click', () => {
    if (currentPage * itemsPerPage < filteredInventory.length) {
        currentPage++;
        initializeInventory();
    }
});

function updatePaginationControls() {
    prevPageBtn.parentElement.disabled = currentPage === 1;
    nextPageBtn.parentElement.disabled = currentPage * itemsPerPage >= filteredInventory.length;
}

// Open Add Product Modal
function openAddProductModal() {
    document.getElementById('productForm').reset();
    document.getElementById('productModal').style.display = 'block';
}

// Open Edit Product Modal
function openEditProductModal(productId) {
    const product = inventoryData.find(p => p.id === productId);
    if (!product) return;
    
    document.getElementById('productForm').productName.value = product.name;
    document.getElementById('productForm').category.value = product.category;
    document.getElementById('productForm').price.value = product.price;
    document.getElementById('productForm').stock.value = product.stock;
    document.getElementById('productModal').style.display = 'block';
}

// Close Modal
function closeModal() {
    document.getElementById('productModal').style.display = 'none';
}

// Delete Product
function deleteProduct(productId) {
    inventoryData = inventoryData.filter(item => item.id !== productId);
    applyFilters();
}

// Initialize page
initializeInventory();
