// Initialize Charts
document.addEventListener('DOMContentLoaded', function() {
    // Delivery Volume Chart
    const deliveryVolumeCtx = document.getElementById('deliveryVolumeChart').getContext('2d');
    const deliveryVolumeChart = new Chart(deliveryVolumeCtx, {
        type: 'line',
        data: {
            labels: ['Jan 1', 'Jan 2', 'Jan 3', 'Jan 4', 'Jan 5', 'Jan 6', 'Jan 7'],
            datasets: [{
                label: 'Deliveries',
                data: [65, 59, 80, 81, 56, 55, 40],
                borderColor: '#2E8B57',
                tension: 0.4,
                fill: true,
                backgroundColor: 'rgba(46, 139, 87, 0.1)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Status Distribution Chart
    const statusDistributionCtx = document.getElementById('statusDistributionChart').getContext('2d');
    const statusDistributionChart = new Chart(statusDistributionCtx, {
        type: 'doughnut',
        data: {
            labels: ['Completed', 'In Transit', 'Pending', 'Delayed'],
            datasets: [{
                data: [65, 20, 10, 5],
                backgroundColor: [
                    '#28a745',
                    '#007bff',
                    '#ffc107',
                    '#dc3545'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right'
                }
            }
        }
    });

    // Event Listeners
    document.getElementById('dateRange').addEventListener('change', function(e) {
        updateReports(e.target.value);
    });

    document.getElementById('reportType').addEventListener('change', function(e) {
        updateTableData(e.target.value);
    });

    // Chart filters
    const chartFilters = document.querySelectorAll('.chart-filter');
    chartFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            // Remove active class from all filters
            chartFilters.forEach(f => f.classList.remove('active'));
            // Add active class to clicked filter
            this.classList.add('active');
            // Update chart data based on filter
            updateChartData(this.dataset.period);
        });
    });

    // Update Status functionality
    const updateStatusBtns = document.querySelectorAll('.update-status-btn');
    updateStatusBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const orderId = this.closest('tr').querySelector('td:first-child').textContent;
            openUpdateModal(orderId);
        });
    });

    // Modal functionality
    const modal = document.getElementById('updateStatusModal');
    const closeModal = document.querySelector('.close-modal');
    const cancelBtn = document.querySelector('.cancel-btn');

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Form submission
    const updateStatusForm = document.getElementById('updateStatusForm');
    if (updateStatusForm) {
        updateStatusForm.addEventListener('submit', function(e) {
            e.preventDefault();
            updateDeliveryStatus(this);
        });
    }
});

// Function to update reports based on date range
function updateReports(dateRange) {
    // Simulate API call
    const data = fetchReportData(dateRange);
    
    // Update charts with new data
    updateChartData(data);
    
    // Update summary statistics
    updateSummaryStats(data);
}

// Function to update table data based on report type
function updateTableData(reportType) {
    // Simulate API call
    const data = fetchTableData(reportType);
    
    // Update table with new data
    const tableBody = document.querySelector('.delivery-table tbody');
    tableBody.innerHTML = generateTableRows(data);
}

// Function to update chart data based on time period
function updateChartData(period) {
    // Simulate API call
    const data = fetchChartData(period);
    
    // Update charts with new data
    deliveryVolumeChart.data.labels = data.labels;
    deliveryVolumeChart.data.datasets[0].data = data.values;
    deliveryVolumeChart.update();
    
    statusDistributionChart.data.datasets[0].data = data.statusData;
    statusDistributionChart.update();
}

// Function to open update status modal
function openUpdateModal(orderId) {
    const modal = document.getElementById('updateStatusModal');
    const orderIdInput = modal.querySelector('input[readonly]');
    orderIdInput.value = orderId;
    modal.style.display = 'block';
}

// Function to update delivery status
function updateDeliveryStatus(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Simulate API call
    fetch('/api/update-status', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        // Show success message
        showNotification('Status updated successfully', 'success');
        
        // Close modal
        document.getElementById('updateStatusModal').style.display = 'none';
        
        // Refresh table data
        updateTableData(document.getElementById('reportType').value);
    })
    .catch(error => {
        showNotification('Error updating status', 'error');
    });
}

// Utility function to show notifications
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Simulated API calls
function fetchReportData(dateRange) {
    // Simulate API response
    return {
        labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'],
        values: [45, 52, 38, 65, 42],
        statusData: [70, 15, 10, 5]
    };
}

function fetchTableData(reportType) {
    // Simulate API response
    return [
        {
            orderId: '#ORD-2025002',
            customer: 'John Smith',
            items: '2 items',
            location: '456 Main St',
            status: 'In Transit'
        },
        // Add more mock data as needed
    ];
}

function fetchChartData(period) {
    // Simulate API response
    return {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        values: [120, 150, 180, 140],
        statusData: [60, 25, 10, 5]
    };
}

// Generate table rows from data
function generateTableRows(data) {
    return data.map(row => `
        <tr>
            <td>${row.orderId}</td>
            <td>
                <div class="customer-info">
                    <img src="assets/images/customer-default.jpg" alt="Customer">
                    <span>${row.customer}</span>
                </div>
            </td>
            <td>${row.items}</td>
            <td>${row.location}</td>
            <td><span class="status-badge ${row.status.toLowerCase()}">${row.status}</span></td>
            <td><button class="update-status-btn">Update Status</button></td>
        </tr>
    `).join('');
}