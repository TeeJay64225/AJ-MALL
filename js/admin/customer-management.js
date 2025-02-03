class CustomerManager {
    // Previous methods remain the same...

    deleteCustomer(customerId) {
        const confirmDelete = confirm('Are you sure you want to delete this customer?');
        if (confirmDelete) {
            this.customers = this.customers.filter(customer => customer.id !== customerId);
            this.renderCustomerTable();
            this.showNotification('Customer deleted successfully', 'success');
        }
    }

    deleteSelectedCustomers() {
        const selectedCheckboxes = document.querySelectorAll('.customer-checkbox:checked');
        if (selectedCheckboxes.length === 0) {
            this.showNotification('No customers selected', 'warning');
            return;
        }

        const confirmDelete = confirm(`Are you sure you want to delete ${selectedCheckboxes.length} customer(s)?`);
        if (confirmDelete) {
            const selectedIds = Array.from(selectedCheckboxes).map(cb => cb.dataset.id);
            this.customers = this.customers.filter(customer => !selectedIds.includes(customer.id));
            this.renderCustomerTable();
            this.showNotification(`${selectedCheckboxes.length} customers deleted successfully`, 'success');
        }
    }

    toggleSelectAll(event) {
        const checkboxes = document.querySelectorAll('.customer-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = event.target.checked;
        });
    }

    openAddCustomerModal() {
        document.getElementById('customerModalLabel').textContent = 'Add New Customer';
        document.getElementById('customerForm').reset();
        document.getElementById('customerModal').classList.add('show');
        document.getElementById('customerModal').style.display = 'block';
    }

    openEditCustomerModal(customerId) {
        const customer = this.customers.find(c => c.id === customerId);
        if (customer) {
            document.getElementById('customerModalLabel').textContent = 'Edit Customer';
            document.getElementById('firstName').value = customer.firstName;
            document.getElementById('lastName').value = customer.lastName;
            document.getElementById('email').value = customer.email;
            document.getElementById('phone').value = customer.phone;
            document.getElementById('customerType').value = customer.type;
            document.getElementById('customerModal').classList.add('show');
            document.getElementById('customerModal').style.display = 'block';
        }
    }

    saveCustomer(event) {
        event.preventDefault();
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const type = document.getElementById('customerType').value;

        const newCustomer = {
            id: `CUST-${this.customers.length + 1}`,
            firstName,
            lastName,
            email,
            phone,
            type,
            status: 'active',
            totalOrders: 0,
            registrationDate: new Date().toISOString().split('T')[0]
        };

        this.customers.push(newCustomer);
        this.renderCustomerTable();
        this.closeModal();
        this.showNotification('Customer saved successfully', 'success');
    }

    viewCustomerDetails(customerId) {
        const customer = this.customers.find(c => c.id === customerId);
        if (customer) {
            document.getElementById('detailsCustomerId').textContent = customer.id;
            document.getElementById('detailsName').textContent = `${customer.firstName} ${customer.lastName}`;
            document.getElementById('detailsEmail').textContent = customer.email;
            document.getElementById('detailsPhone').textContent = customer.phone;
            document.getElementById('detailsType').textContent = customer.type.toUpperCase();
            document.getElementById('detailsTotalOrders').textContent = customer.totalOrders;
            document.getElementById('detailsRegistrationDate').textContent = customer.registrationDate;
            document.getElementById('customerDetailsModal').classList.add('show');
            document.getElementById('customerDetailsModal').style.display = 'block';
        }
    }

    filterCustomers() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const typeFilter = document.getElementById('customerTypeFilter').value;
        const statusFilter = document.getElementById('customerStatusFilter').value;

        const filteredCustomers = this.customers.filter(customer => {
            const matchesSearch = 
                customer.firstName.toLowerCase().includes(searchTerm) ||
                customer.lastName.toLowerCase().includes(searchTerm) ||
                customer.email.toLowerCase().includes(searchTerm);
            
            const matchesType = typeFilter === 'all' || customer.type === typeFilter;
            const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;

            return matchesSearch && matchesType && matchesStatus;
        });

        this.renderFilteredCustomers(filteredCustomers);
    }

    renderFilteredCustomers(filteredCustomers) {
        const tableBody = document.getElementById('customerTableBody');
        tableBody.innerHTML = '';

        filteredCustomers.forEach(customer => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <input type="checkbox" class="customer-checkbox" data-id="${customer.id}">
                </td>
                <td>${customer.id}</td>
                <td>${customer.firstName} ${customer.lastName}</td>
                <td>${customer.email}</td>
                <td>${customer.phone}</td>
                <td>${customer.type.toUpperCase()}</td>
                <td>${customer.totalOrders}</td>
                <td>
                    <span class="status-badge status-${customer.status}">
                        ${customer.status.toUpperCase()}
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button onclick="customerManager.viewCustomerDetails('${customer.id}')" class="btn btn-info btn-sm">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button onclick="customerManager.openEditCustomerModal('${customer.id}')" class="btn btn-warning btn-sm">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="customerManager.deleteCustomer('${customer.id}')" class="btn btn-danger btn-sm">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    closeModal() {
        document.getElementById('customerModal').classList.remove('show');
        document.getElementById('customerModal').style.display = 'none';
    }

    closeDetailsModal() {
        document.getElementById('customerDetailsModal').classList.remove('show');
        document.getElementById('customerDetailsModal').style.display = 'none';
    }

    showNotification(message, type) {
        const notificationContainer = document.getElementById('notificationContainer');
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show`;
        notification.innerHTML = `
            ${message}
            <button type="button" class="close" data-dismiss="alert">&times;</button>
        `;
        notificationContainer.appendChild(notification);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notificationContainer.removeChild(notification), 150);
        }, 3000);
    }
}

// Instantiate the CustomerManager
const customerManager = new CustomerManager();