// login.js

// Sample user data (replace with actual backend authentication)
const users = [
    {
        email: 'customer@example.com',
        password: 'customer123',
        role: 'customer'
    },
    {
        email: 'staff@example.com',
        password: 'staff123',
        role: 'staff'
    },
    {
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin'
    }
];

// DOM Elements
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const togglePassword = document.querySelector('.toggle-password');
const errorMessage = document.getElementById('errorMessage');
const loginButton = document.querySelector('.login-button');

// Toggle password visibility
togglePassword.addEventListener('click', () => {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    togglePassword.classList.toggle('fa-eye');
    togglePassword.classList.toggle('fa-eye-slash');
});

// Handle login form submission
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Show loading state
    loginButton.classList.add('loading');
    errorMessage.style.display = 'none';

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Find user (replace with actual authentication logic)
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            // Store user data in localStorage (use secure session management in production)
            localStorage.setItem('user', JSON.stringify({
                email: user.email,
                role: user.role
            }));

            // Redirect based on role
            switch (user.role) {
                case 'customer':
                    window.location.href = '../customer/dashboard.html';
                    break;
                case 'staff':
                    window.location.href = '../staff/dashboard.html';
                    break;
                case 'admin':
                    window.location.href = '../admin/dashboard.html';
                    break;
                default:
                    throw new Error('Invalid user role');
            }
        } else {
            throw new Error('Invalid email or password');
        }
    } catch (error) {
        // Show error message
        errorMessage.textContent = error.message;
        errorMessage.style.display = 'block';
        loginButton.classList.remove('loading');
    }
});

// Remember me functionality
const rememberCheckbox = document.getElementById('remember');
const rememberedEmail = localStorage.getItem('rememberedEmail');

if (rememberedEmail) {
    emailInput.value = rememberedEmail;
    rememberCheckbox.checked = true;
}

rememberCheckbox.addEventListener('change', () => {
    if (rememberCheckbox.checked) {
        localStorage.setItem('rememberedEmail', emailInput.value);
    } else {
        localStorage.removeItem('rememberedEmail');
    }
});

// Add input validation
emailInput.addEventListener('input', () => {
    if (!emailInput.value.includes('@')) {
        emailInput.setCustomValidity('Please enter a valid email address');
    } else {
        emailInput.setCustomValidity('');
    }
});

passwordInput.addEventListener('input', () => {
    if (passwordInput.value.length < 6) {
        passwordInput.setCustomValidity('Password must be at least 6 characters long');
    } else {
        passwordInput.setCustomValidity('');
    }
});

// Check for existing session
document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        // Redirect to appropriate dashboard if already logged in
        switch (user.role) {
            case 'customer':
                window.location.href = '../customer/dashboard.html';
                break;
            case 'staff':
                window.location.href = '../staff/dashboard.html';
                break;
            case 'admin':
                window.location.href = '../admin/dashboard.html';
                break;
        }
    }
});