// payment-confirmation.js

// Sample order data (replace with actual data from backend)
const orderData = {
    orderId: 'AJ12345',
    date: 'January 29, 2025',
    paymentMethod: 'Credit Card (**** 1234)',
    shippingAddress: {
        street: '123 Street Name',
        city: 'City',
        state: 'State',
        zip: '12345',
        country: 'Country'
    },
    items: [
        {
            id: 1,
            name: 'Product 1',
            price: 49.99,
            quantity: 1,
            image: '../../assets/images/product1.jpg'
        },
        {
            id: 2,
            name: 'Product 2',
            price: 29.99,
            quantity: 2,
            image: '../../assets/images/product2.jpg'
        }
    ],
    subtotal: 99.99,
    shipping: 5.00,
    tax: 8.50,
    total: 113.49
};

// Function to format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Function to load order details
function loadOrderDetails() {
    // Update order information
    document.getElementById('orderId').textContent = `#${orderData.orderId}`;
    document.getElementById('orderDate').textContent = orderData.date;
    document.getElementById('paymentMethod').textContent = orderData.paymentMethod;
    
    // Update shipping address
    const address = orderData.shippingAddress;
    document.getElementById('shippingAddress').innerHTML = `
        ${address.street}<br>
        ${address.city}, ${address.state} ${address.zip}<br>
        ${address.country}
    `;

    // Load order items
    const itemsList = document.getElementById('itemsList');
    itemsList.innerHTML = orderData.items.map(item => `
        <div class="item-card">
            <img src="${item.image}" alt="${item.name}" class="item-image">
            <div class="item-details">
                <div class="item-name">${item.name}</div>
                <div class="item-quantity">Quantity: ${item.quantity}</div>
                <div class="item-price">${formatCurrency(item.price)}</div>
            </div>
        </div>
    `).join('');

    // Update price breakdown
    document.getElementById('subtotal').textContent = formatCurrency(orderData.subtotal);
    document.getElementById('shipping').textContent = formatCurrency(orderData.shipping);
    document.getElementById('tax').textContent = formatCurrency(orderData.tax);
    document.getElementById('total').textContent = formatCurrency(orderData.total);
}

// Function to show payment status animation
function showStatusAnimation() {
    const statusIcon = document.querySelector('.status-icon');
    statusIcon.style.animation = 'scaleIn 0.5s ease-out';
}

// Function to handle print receipt
function printReceipt() {
    window.print();
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    loadOrderDetails();
    showStatusAnimation();

    // Clear cart data from localStorage
    localStorage.removeItem('cart');

    // Add event listener for print button
    document.querySelector('.primary-button').addEventListener('click', printReceipt);
});

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
    @keyframes scaleIn {
        0% {
            transform: scale(0);
            opacity: 0;
        }
        100% {
            transform: scale(1);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);