document.addEventListener("DOMContentLoaded", function () {
    // Highlight active menu item in sidebar
    const menuItems = document.querySelectorAll(".sidebar-nav a");
    menuItems.forEach(item => {
        item.addEventListener("click", function () {
            menuItems.forEach(link => link.classList.remove("active"));
            this.classList.add("active");
        });
    });

    // Dynamic notifications count (example logic)
    const notificationBtn = document.querySelector(".notification-btn .badge");
    let notifications = 3; // Example value
    if (notificationBtn) {
        notificationBtn.textContent = notifications;
    }

    // Process Orders - Change status dynamically
    const orderButtons = document.querySelectorAll(".orders-table .action-btn");
    orderButtons.forEach(button => {
        button.addEventListener("click", function () {
            let row = this.closest("tr");
            let statusCell = row.querySelector(".status");
            
            if (statusCell.classList.contains("pending")) {
                statusCell.textContent = "Processing";
                statusCell.classList.remove("pending");
                statusCell.classList.add("processing");
            } else if (statusCell.classList.contains("processing")) {
                statusCell.textContent = "Completed";
                statusCell.classList.remove("processing");
                statusCell.classList.add("completed");
                this.textContent = "View"; // Change button text
            }
        });
    });

    // Search functionality for orders
    const searchInput = document.querySelector(".search-container input");
    searchInput.addEventListener("keyup", function () {
        let filter = searchInput.value.toLowerCase();
        let rows = document.querySelectorAll(".orders-table tbody tr");
        
        rows.forEach(row => {
            let orderId = row.cells[0].textContent.toLowerCase();
            let customer = row.cells[1].textContent.toLowerCase();
            let products = row.cells[2].textContent.toLowerCase();
            
            if (orderId.includes(filter) || customer.includes(filter) || products.includes(filter)) {
                row.style.display = "";
            } else {
                row.style.display = "none";
            }
        });
    });
});
