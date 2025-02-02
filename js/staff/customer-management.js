document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const selectAll = document.querySelector('.select-all');
    const checkboxes = document.querySelectorAll('tbody input[type="checkbox"]');
    const viewButtons = document.querySelectorAll('.view-btn');
    const modal = document.getElementById('customerDetailsModal');
    const closeModal = modal.querySelector('.close-modal');
    const filterSelect = document.querySelector('.filter-select');
    const exportBtn = document.querySelector('.export-btn');
    const searchInput = document.querySelector('.search-bar input');
    const viewOptions = document.querySelectorAll('.view-options button');
    const paginationButtons = document.querySelectorAll('.page-numbers button');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    // Table Selection
    selectAll.addEventListener('change', function() {
        checkboxes.forEach(checkbox => {
            checkbox.checked = this.checked;
        });
        updateBulkActions();
    });

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            updateSelectAllState();
            updateBulkActions();
        });
    });

    function updateSelectAllState() {
        const allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);
        const someChecked = Array.from(checkboxes).some(checkbox => checkbox.checked);
        selectAll.checked = allChecked;
        selectAll.indeterminate = someChecked && !allChecked;
    }

    function updateBulkActions() {
        const selectedCount = Array.from(checkboxes).filter(checkbox => checkbox.checked).length;
        exportBtn.textContent = selectedCount > 0 ? 
            `Export (${selectedCount})` : 'Export';
    }

    // Modal Handling
    function openModal(customerId) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        loadCustomerDetails(customerId);
    }

    function closeModalHandler() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    function loadCustomerDetails(customerId) {
        const modalBody = modal.querySelector('.modal-body');
        // Simulate API call
        setTimeout(() => {
            modalBody.innerHTML = `
                <div class="customer-profile">
                    <h4>Customer #${customerId}</h4>
                    <p>Loading customer details...</p>
                </div>
            `;
        }, 500);
    }

    viewButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const customerId = btn.closest('tr').dataset.customerId;
            openModal(customerId);
        });
    });

    closeModal.addEventListener('click', closeModalHandler);
    modal.addEventListener('click', e => {
        if (e.target === modal) closeModalHandler();
    });

    // Filter Functionality
    filterSelect.addEventListener('change', function() {
        const status = this.value;
        const rows = document.querySelectorAll('tbody tr');
        
        rows.forEach(row => {
            const statusBadge = row.querySelector('.status-badge');
            if (status === 'all' || statusBadge.classList.contains(status)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });

    // Search Functionality
    let searchTimeout;
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const searchTerm = this.value.toLowerCase();
            const rows = document.querySelectorAll('tbody tr');
            
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        }, 300);
    });

    // View Options
    viewOptions.forEach(btn => {
        btn.addEventListener('click', function() {
            viewOptions.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            // Implement view change logic here
        });
    });

    // Export Functionality
    exportBtn.addEventListener('click', function() {
        const selectedRows = Array.from(checkboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.closest('tr'));
            
        if (selectedRows.length === 0) {
            alert('Please select customers to export');
            return;
        }
        
        // Implement export logic here
        console.log('Exporting', selectedRows.length, 'customers');
    });

    // Pagination
    paginationButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.classList.contains('active')) return;
            
            paginationButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const page = this.textContent;
            loadPage(page);
            updatePaginationState(page);
        });
    });

    function loadPage(page) {
        // Implement page loading logic here
        console.log('Loading page', page);
    }

    function updatePaginationState(currentPage) {
        prevBtn.disabled = currentPage === '1';
        nextBtn.disabled = currentPage === '12'; // Assuming 12 is max pages
    }

    prevBtn.addEventListener('click', function() {
        const currentPage = document.querySelector('.page-numbers button.active');
        const prevPage = currentPage.previousElementSibling;
        if (prevPage) prevPage.click();
    });

    nextBtn.addEventListener('click', function() {
        const currentPage = document.querySelector('.page-numbers button.active');
        const nextPage = currentPage.nextElementSibling;
        if (nextPage && nextPage.tagName === 'BUTTON') nextPage.click();
    });
});