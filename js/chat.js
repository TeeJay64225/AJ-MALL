// chat.js

document.addEventListener('DOMContentLoaded', () => {
    const messageInput = document.getElementById('messageInput');
    const chatMessages = document.getElementById('chatMessages');
    const sendBtn = document.querySelector('.send-btn');
    const orderSidebar = document.getElementById('orderSidebar');
    const orderBtn = document.querySelector('[title="View Order Details"]');
    const closeSidebarBtn = document.querySelector('.close-btn');

    // Send message function
    function sendMessage(message, type = 'sent') {
        if (!message.trim()) return;

        const messageElement = document.createElement('div');
        messageElement.className = `message ${type}`;

        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        if (type === 'received') {
            messageElement.innerHTML = `
                <img src="../../assets/images/support-avatar.png" alt="Support Agent" class="avatar small">
                <div class="message-content">
                    <div class="message-info">
                        <span class="sender">Support Agent</span>
                        <span class="time">${currentTime}</span>
                    </div>
                    <p>${message}</p>
                </div>
            `;
        } else {
            messageElement.innerHTML = `
                <div class="message-content">
                    <div class="message-info">
                        <span class="time">${currentTime}</span>
                    </div>
                    <p>${message}</p>
                </div>
            `;
        }

        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Send message event listener
    sendBtn.addEventListener('click', () => {
        const message = messageInput.value;
        sendMessage(message, 'sent');
        messageInput.value = '';

        // Simulate a response from the support agent
        setTimeout(() => {
            sendMessage("Thank you for reaching out! How can I assist you today?", 'received');
        }, 1000);
    });

    // Allow sending messages with Enter key
    messageInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            sendBtn.click();
        }
    });

    // Open order sidebar
    orderBtn.addEventListener('click', () => {
        orderSidebar.classList.add('open');
    });

    // Close order sidebar
    closeSidebarBtn.addEventListener('click', () => {
        orderSidebar.classList.remove('open');
    });

    // Close sidebar when clicking outside of it
    document.addEventListener('click', (event) => {
        if (!orderSidebar.contains(event.target) && event.target !== orderBtn) {
            orderSidebar.classList.remove('open');
        }
    });
});
