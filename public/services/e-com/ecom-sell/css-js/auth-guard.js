// This function checks for the token and redirects if it's missing
function checkAuth() {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
        // If no token, kick the user out to login
        alert("You must be logged in to access this page.");
        window.location.href = '/services/e-com/login.html';
        return false;
    }
    return true;
}

// Run this immediately when the script is loaded
checkAuth();