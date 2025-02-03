// register.js

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');

    // Password visibility toggle
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });

    // Form validation
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            // If validation passes, collect form data
            const formData = {
                fullName: this.fullName.value,
                email: this.email.value,
                password: this.password.value,
                phone: this.phone.value
            };

            // Here you would typically send the data to your backend
            console.log('Form data:', formData);
            
            // Simulate successful registration
            showSuccessMessage();
        }
    });

    // Real-time validation
    const inputs = registerForm.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
    });
});

function validateForm() {
    let isValid = true;
    
    // Validate full name
    const fullName = document.getElementById('fullName');
    if (!fullName.value.trim()) {
        showError(fullName, 'Full name is required');
        isValid = false;
    } else if (fullName.value.length < 2) {
        showError(fullName, 'Name must be at least 2 characters long');
        isValid = false;
    } else {
        clearError(fullName);
    }

    // Validate email
    const email = document.getElementById('email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim()) {
        showError(email, 'Email is required');
        isValid = false;
    } else if (!emailRegex.test(email.value)) {
        showError(email, 'Please enter a valid email address');
        isValid = false;
    } else {
        clearError(email);
    }

    // Validate password
    const password = document.getElementById('password');
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!password.value) {
        showError(password, 'Password is required');
        isValid = false;
    } else if (!passwordRegex.test(password.value)) {
        showError(password, 'Password must be at least 8 characters long and include both letters and numbers');
        isValid = false;
    } else {
        clearError(password);
    }

    // Validate confirm password
    const confirmPassword = document.getElementById('confirmPassword');
    if (!confirmPassword.value) {
        showError(confirmPassword, 'Please confirm your password');
        isValid = false;
    } else if (confirmPassword.value !== password.value) {
        showError(confirmPassword, 'Passwords do not match');
        isValid = false;
    } else {
        clearError(confirmPassword);
    }

    // Validate phone
    const phone = document.getElementById('phone');
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    if (!phone.value.trim()) {
        showError(phone, 'Phone number is required');
        isValid = false;
    } else if (!phoneRegex.test(phone.value)) {
        showError(phone, 'Please enter a valid phone number');
        isValid = false;
    } else {
        clearError(phone);
    }

    // Validate terms acceptance
    const terms = document.getElementById('terms');
    if (!terms.checked) {
        showError(terms, 'You must accept the Terms of Service and Privacy Policy');
        isValid = false;
    } else {
        clearError(terms);
    }

    return isValid;
}

function validateField(field) {
    // Trigger validation for individual field
    validateForm();
}

function showError(input, message) {
    const errorElement = document.getElementById(`${input.id}Error`);
    errorElement.textContent = message;
    input.classList.add('error');
}

function clearError(input) {
    const errorElement = document.getElementById(`${input.id}Error`);
    errorElement.textContent = '';
    input.classList.remove('error');
}

function showSuccessMessage() {
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.textContent = 'Registration successful! Redirecting...';

    document.body.appendChild(successMessage);

    // Automatically remove the message after a few seconds
    setTimeout(() => {
        successMessage.remove();
        // Redirect to login or another page after registration
        window.location.href = 'login.html';
    }, 3000);
}
