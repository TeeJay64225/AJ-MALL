// Sample orders data (replace with actual API calls)
let orders = [
    {
        id: "ORD001",
        customer: {
            name: "John Smith",
            email: "john@example.com",
            phone: "123-456-7890"
        },
        date: "2025-01-30",
        total: 299.99,
        status: "new",
        items: [
            { name: "Product 1", quantity: 2, price: 99.99 },
            { name: "Product 2", quantity: 1, price: 100.01 }
        ]
    },
    {
        id: "ORD001",
        customer: {
            name: "John Smith",
            email: "john@example.com",
            phone: "123-456-7890"
        },
        date: "2025-01-30",
        total: 299.99,
        status: "new",
        items: [
            { name: "Product 1", quantity: 2, price: 99.99 },
            { name: "Product 2", quantity: 1, price: 100.01 }
        ]
    },
    {
        id: "ORD002",
        customer: {
            name: "Jane Doe",
            email: "jane@example.com",
            phone: "098-765-4321"
        },
        date: "2025-01-29",
        total: 199.99,
        status: "processing",
        items: [
            { name: "Product 3", quantity: 1, price: 199.99 }
        ]
    }
];

// Constants
const VALID_STATUSES = ['new', 'processing', 'shipped', 'delivered', 'cancelled'];
const STATUS_COLORS = {
    new: '#2196F3',
    processing: '#FF9800',
    shipped: '#4CAF50',
    delivered: '#8BC34A',
    cancelled: '#F44336'
};

// Pagination state
let currentPage = 1;
const itemsPerPage = 10;
let filteredOrders = [...orders];
let sortConfig = { field: 'date', direction: 'desc' };

// DOM Elements
const ordersTableBody = document.getElementById('ordersTableBody');
const orderModal = document.getElementById('orderModal');
const orderSearch = document.getElementById('orderSearch');
const statusFilter = document.getElementById('statusFilter');
const prevPageBtn = document.getElementById('prevPage');
const nextPageBtn = document.getElementById('nextPage');
const pageInfo = document.getElementById('pageInfo');
const sortButtons = document.querySelectorAll('.sort-btn');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeFilters();
    renderOrders();
    setupEventListeners();
});

// Initialize Filters
function initializeFilters() {
    // Populate status filter
    statusFilter.innerHTML = `
        <option value="">All Statuses</option>
        ${VALID_STATUSES.map(status => 
            `<option value="${status}">${capitalizeFirst(status)}</option>`
        ).join('')}
    `;
}

// Setup Event Listeners
function setupEventListeners() {
    // Search and Filter with debounce
    orderSearch.addEventListener('input', debounce(handleSearch, 300));
    statusFilter.addEventListener('change', handleFilter);

    // Pagination
    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderOrders();
        }
    });

    nextPageBtn.addEventListener('click', () => {
        if (currentPage < Math.ceil(filteredOrders.length / itemsPerPage)) {
            currentPage++;
            renderOrders();
        }
    });

    // Modal Close Button
    document.querySelector('.close-modal').addEventListener('click', closeModal);

    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === orderModal) {
            closeModal();
        }
    });

    // Escape key to close modal
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && orderModal.style.display === 'block') {
            closeModal();
        }
    });

    // Sort buttons
    sortButtons.forEach(button => {
        button.addEventListener('click', () => handleSort(button.dataset.field));
    });
}

// Handle Search
function handleSearch() {
    const searchTerm = orderSearch.value.toLowerCase().trim();
    filterOrders();
}

// Handle Filter
function handleFilter() {
    const statusValue = statusFilter.value;
    filterOrders();
}

// Handle Sort
function handleSort(field) {
    if (sortConfig.field === field) {
        sortConfig.direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
    } else {
        sortConfig.field = field;
        sortConfig.direction = 'asc';
    }
    updateSortButtons();
    filterOrders();
}

// Update Sort Buttons
function updateSortButtons() {
    sortButtons.forEach(button => {
        const icon = button.querySelector('i');
        if (button.dataset.field === sortConfig.field) {
            icon.className = `fas fa-sort-${sortConfig.direction === 'asc' ? 'up' : 'down'}`;
        } else {
            icon.className = 'fas fa-sort';
        }
    });
}

// Filter Orders
function filterOrders() {
    const searchTerm = orderSearch.value.toLowerCase().trim();
    const statusValue = statusFilter.value;

    filteredOrders = orders.filter(order => {
        const matchesSearch = 
            order.id.toLowerCase().includes(searchTerm) ||
            order.customer.name.toLowerCase().includes(searchTerm) ||
            order.customer.email.toLowerCase().includes(searchTerm);
        
        const matchesStatus = !statusValue || order.status === statusValue;

        return matchesSearch && matchesStatus;
    });

    // Sort filtered orders
    filteredOrders.sort((a, b) => {
        let aValue = a[sortConfig.field];
        let bValue = b[sortConfig.field];

        if (sortConfig.field === 'date') {
            aValue = new Date(aValue);
            bValue = new Date(bValue);
        }

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });

    currentPage = 1;
    renderOrders();
}

// Render Orders Table
function renderOrders() {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageOrders = filteredOrders.slice(start, end);

    if (pageOrders.length === 0) {
        ordersTableBody.innerHTML = `
            <tr>
                <td colspan="6" class="no-results">
                    <i class="fas fa-search"></i>
                    <p>No orders found matching your criteria</p>
                </td>
            </tr>
        `;
    } else {
        ordersTableBody.innerHTML = pageOrders.map(order => `
            <tr>
                <td>${order.id}</td>
                <td>
                    <div class="customer-info">
                        <div class="customer-name">${order.customer.name}</div>
                        <div class="customer-email">${order.customer.email}</div>
                    </div>
                </td>
                <td>${formatDate(order.date)}</td>
                <td>$${order.total.toFixed(2)}</td>
                <td>
                    <span class="status-badge status-${order.status}" 
                          style="background-color: ${STATUS_COLORS[order.status]}">
                        ${capitalizeFirst(order.status)}
                    </span>
                </td>
                <td class="actions">
                    <button onclick="viewOrderDetails('${order.id}')" class="action-btn view-btn" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button onclick="updateOrderStatus('${order.id}')" class="action-btn edit-btn" title="Update Status">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="exportOrderDetails('${order.id}')" class="action-btn export-btn" title="Export">
                        <i class="fas fa-download"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    updatePagination();
}

// Update Pagination Controls
function updatePagination() {
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    const totalItems = filteredOrders.length;
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(start + itemsPerPage - 1, totalItems);

    pageInfo.textContent = `Showing ${start}-${end} of ${totalItems} orders`;
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages;
}

// View Order Details
function viewOrderDetails(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) {
        showNotification('Order not found', 'error');
        return;
    }

    const orderDetails = document.getElementById('orderDetails');
    orderDetails.innerHTML = `
        <div class="order-info">
            <div class="order-header">
                <h3>Order Details - ${order.id}</h3>
                <span class="status-badge status-${order.status}" 
                      style="background-color: ${STATUS_COLORS[order.status]}">
                    ${capitalizeFirst(order.status)}
                </span>
            </div>

            <div class="order-section">
                <h4>Customer Information</h4>
                <div class="info-grid">
                    <div class="info-item">
                        <label>Name:</label>
                        <span>${order.customer.name}</span>
                    </div>
                    <div class="info-item">
                        <label>Email:</label>
                        <span>${order.customer.email}</span>
                    </div>
                    <div class="info-item">
                        <label>Phone:</label>
                        <span>${order.customer.phone}</span>
                    </div>
                    <div class="info-item">
                        <label>Order Date:</label>
                        <span>${formatDate(order.date)}</span>
                    </div>
                </div>
            </div>

            <div class="order-section">
                <h4>Order Items</h4>
                <table class="order-items-table">
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${order.items.map(item => `
                            <tr>
                                <td>${item.name}</td>
                                <td>${item.quantity}</td>
                                <td>$${item.price.toFixed(2)}</td>
                                <td>$${(item.quantity * item.price).toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="3" class="text-right"><strong>Total:</strong></td>
                            <td><strong>$${order.total.toFixed(2)}</strong></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    `;

    orderModal.style.display = 'block';
}

// Update Order Status
function updateOrderStatus(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) {
        showNotification('Order not found', 'error');
        return;
    }

    const currentStatus = order.status;
    const statusSelect = document.createElement('select');
    statusSelect.innerHTML = VALID_STATUSES.map(status => 
        `<option value="${status}" ${status === currentStatus ? 'selected' : ''}>
            ${capitalizeFirst(status)}
        </option>`
    ).join('');

    Swal.fire({
        title: 'Update Order Status',
        html: `
            <div class="status-update-form">
                <p>Current Status: 
                    <span class="status-badge status-${currentStatus}" 
                          style="background-color: ${STATUS_COLORS[currentStatus]}">
                        ${capitalizeFirst(currentStatus)}
                    </span>
                </p>
                <div class="form-group">
                    <label>New Status:</label>
                    ${statusSelect.outerHTML}
                </div>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Update',
        cancelButtonText: 'Cancel',
        preConfirm: () => {
            return document.querySelector('.swal2-content select').value;
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const newStatus = result.value;
            if (newStatus !== currentStatus) {
                order.status = newStatus;
                renderOrders();
                showNotification('Order status updated successfully', 'success');
            }
        }
    });
}

// Export Order Details
function exportOrderDetails(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) {
        showNotification('Order not found', 'error');
        return;
    }

    const orderData = {
        orderId: order.id,
        customerName: order.customer.name,
        customerEmail: order.customer.email,
        customerPhone: order.customer.phone,
        orderDate: formatDate(order.date),
        status: order.status,
        items: order.items.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            total: item.quantity * item.price
        })),
        total: order.total
    };

    const blob = new Blob([JSON.stringify(orderData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `order-${order.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('Order details exported successfully', 'success');
}

// Show Notification
function showNotification(message, type = 'info') {
    Swal.fire({
        text: message,
        icon: type,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true
    });
}

// Close Modal
function closeModal() {
    orderModal.style.display = 'none';
}

// Utility Functions
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function capitalizeFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
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