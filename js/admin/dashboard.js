document.addEventListener('DOMContentLoaded', () => {
    // Sidebar Toggle for Mobile
    const toggleSidebarBtn = document.querySelector('.toggle-sidebar');
    const sidebar = document.querySelector('.sidebar');

    toggleSidebarBtn?.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });

    // Status Update Modal
    const updateStatusBtns = document.querySelectorAll('.update-status-btn');
    const modal = document.getElementById('updateStatusModal');
    const closeModalBtns = document.querySelectorAll('.close-modal, .cancel-btn');

    updateStatusBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            modal.style.display = 'flex';
        });
    });

    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    });

    // Form Submission
    const updateStatusForm = document.getElementById('updateStatusForm');
    updateStatusForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Collect form data
        const status = document.querySelector('select[name="status"]').value;
        const message = document.querySelector('textarea').value;
        const estimatedDeliveryTime = document.querySelector('input[type="datetime-local"]').value;

        // Simulate status update (replace with actual API call)
        const orderRow = document.querySelector('tr');
        const statusBadge = orderRow.querySelector('.status-badge');
        
        // Update status badge
        statusBadge.textContent = status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
        statusBadge.className = `status-badge ${status.replace('_', '-')}`;

        // Show success notification
        showNotification('Delivery status updated successfully', 'success');

        // Close modal
        modal.style.display = 'none';
    });

    // Notification Function
    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        // Add to body
        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Refresh Button
    const refreshBtn = document.querySelector('.refresh-btn');
    refreshBtn?.addEventListener('click', () => {
        // Simulate data refresh (replace with actual data fetch)
        showNotification('Delivery data refreshed', 'info');
    });

    // Filter Select
    const filterSelect = document.querySelector('.filter-select');
    filterSelect?.addEventListener('change', (e) => {
        const selectedStatus = e.target.value;
        const tableRows = document.querySelectorAll('.delivery-table tbody tr');

        tableRows.forEach(row => {
            const statusBadge = row.querySelector('.status-badge');
            
            if (selectedStatus === 'all' || 
                statusBadge.textContent.toLowerCase().replace(' ', '-') === selectedStatus) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });

    // Add Additional Styles for Notifications
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem;
            border-radius: 4px;
            color: white;
            z-index: 1100;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .notification.success {
            background-color: var(--success);
        }
        .notification.info {
            background-color: var(--info);
        }
        .notification.warning {
            background-color: var(--warning);
        }
        .notification.danger {
            background-color: var(--danger);
        }
    `;
    document.head.appendChild(styleSheet);
});