
// Mock function to "fetch" account name from database
window.onload = function() {
    setTimeout(() => {
        document.getElementById('account-name').innerText = "Uttam User";
    }, 1000);
};

const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('sidebar-toggle');
const closeBtn = document.getElementById('sidebar-close'); // New Close Button

function openSidebar() {
    sidebar.classList.add('mobile-open');
    // Add a fake state to history so 'Back' button triggers a close
    history.pushState({ sidebarOpen: true }, '');
}

function closeSidebar() {
    sidebar.classList.remove('mobile-open');
    // If the sidebar was open, go back in history to remove that state
    if (history.state && history.state.sidebarOpen) {
        history.back();
    }
}

// 1. Toggle Button
toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    openSidebar();
});

// 2. Close Button
closeBtn.addEventListener('click', closeSidebar);

// 3. Click Outside to Close
document.addEventListener('click', (e) => {
    if (sidebar.classList.contains('mobile-open') && 
        !sidebar.contains(e.target) && 
        e.target !== toggleBtn) {
        closeSidebar();
    }
});

// 4. Handle Browser Back Button
window.addEventListener('popstate', () => {
    if (sidebar.classList.contains('mobile-open')) {
        sidebar.classList.remove('mobile-open');
    }
});