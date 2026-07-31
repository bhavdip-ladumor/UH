let isErrorBoxOpen = false;
let lastFocusedFieldId = null; // Track which field had the error

// Function for Enter key navigation
function handleEnter(event, nextFieldId) {
    if (isErrorBoxOpen) return; 
    if (event.key === 'Enter') {
        event.preventDefault();
        if (nextFieldId === 'login') {
            handleLogin();
        } else {
            document.getElementById(nextFieldId).focus();
        }
    }
}

// Function to handle "Go Back" button
function goBack() {
    window.history.back();
}

async function handleLogin() {
    const emailInput = document.getElementById('email').value.trim();
    const passwordInput = document.getElementById('password').value;

    // Security & Validation with field tracking
    if (emailInput.length === 0) {
        showError("Email cannot be empty.", "email");
        return;
    }
    if (passwordInput.length === 0) {
        showError("Password cannot be empty.", "password");
        return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput)) {
        showError("Invalid email format.", "email");
        return;
    }

    try {
        const response = await fetch('/api/ecom/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: emailInput, password: passwordInput })
        });

        const data = await response.json();

        if (data.success) {
            localStorage.setItem('authToken', data.token);
            window.location.href = 'dashboard/dashboard.html';
        } else {
            showError(data.message || "Login failed.", "email");
        }
    } catch (err) {
        showError("Server error, please try again.", "email");
    }
}

function togglePassword() {
    const passwordField = document.getElementById("password");
    const toggleBtn = document.getElementById("toggle-password");
    
    if (passwordField.type === "password") {
        passwordField.type = "text";
        // Change these strings to your preferred icon
        toggleBtn.innerText = "Hide"; 
    } else {
        passwordField.type = "password";
        // Change these strings to your preferred icon
        toggleBtn.innerText = "Show";
    }
}

// Updated Error Box functions
function showError(message, fieldId) {
    isErrorBoxOpen = true;
    lastFocusedFieldId = fieldId; // Remember where to go back
    
    const errorBox = document.getElementById('error-box');
    const errorMsg = document.getElementById('error-message');
    errorMsg.innerText = message;
    errorBox.classList.remove('error-hidden');
    errorBox.classList.add('error-visible');
    
    document.addEventListener('keydown', closeOnErrorKey);
}

function closeError() {
    const errorBox = document.getElementById('error-box');
    errorBox.classList.remove('error-visible');
    errorBox.classList.add('error-hidden');
    document.removeEventListener('keydown', closeOnErrorKey);
    
    // Return focus to the specific field that had the error
    if (lastFocusedFieldId) {
        document.getElementById(lastFocusedFieldId).focus();
    }
    
    setTimeout(() => { isErrorBoxOpen = false; }, 200); 
}

function closeOnErrorKey(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        event.stopPropagation();
        closeError();
    }
}