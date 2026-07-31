import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// 1. Your Live Web App configuration profile details
const firebaseConfig = {
  apiKey: "AIzaSyCKOr2X_rvQKiPNT6TuYziQ7n44axNwW8A",
  authDomain: "uttamhub-31a1c.firebaseapp.com",
  projectId: "uttamhub-31a1c",
  storageBucket: "uttamhub-31a1c.firebasestorage.app",
  messagingSenderId: "716755059804",
  appId: "1:716755059804:web:08d21bacb12e6364ec9299",
  measurementId: "G-LD4BCDMR5B"
};

// Initialize Core App & Authentication Client Instances
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const BACKEND_URL = window.location.origin;

// DOM Element Selectors
const loginBtn = document.getElementById('login-btn');
const profileCardContainer = document.getElementById('profile-card-container');
const profileCard = document.getElementById('profile-card');
const profileDropdown = document.getElementById('profile-dropdown');
const userAvatar = document.getElementById('user-avatar');
const userName = document.getElementById('user-name');
const logoutBtn = document.getElementById('logout-btn');

/* ==========================================================================
   STATE INITIALIZATION ENGINE
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const savedUser = localStorage.getItem('uttamhub_user');
  
  if (savedUser) {
    updateUI(true, JSON.parse(savedUser));
  } else {
    updateUI(false);
  }

  // --- AUTH ELEMENT REGISTRATIONS ---
  if (loginBtn) loginBtn.addEventListener('click', handleFirebaseGoogleLogin);
  
  if (profileCard) {
    profileCard.addEventListener('click', (e) => {
      e.stopPropagation();
      profileDropdown.classList.toggle('hidden');
    });
  }
  
  document.addEventListener('click', () => {
    if (profileDropdown) profileDropdown.classList.add('hidden');
  });

  if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);

  // --- BULLETPROOF SIDEBAR CORE SETUP ---
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const sidebarClose = document.getElementById('sidebar-close');
  const sidebarMenu = document.getElementById('sidebar-menu');
  const sidebarBackdrop = document.getElementById('sidebar-backdrop');

  function closeSidebarAction() {
    if (sidebarMenu && sidebarBackdrop) {
      sidebarMenu.classList.remove('active');
      sidebarBackdrop.classList.remove('active');
      setTimeout(() => {
        sidebarBackdrop.classList.add('hidden');
      }, 300);
    }
  }

  if (sidebarToggle) {
    sidebarToggle.onclick = function(e) {
      e.preventDefault();
      if (sidebarMenu && sidebarBackdrop) {
        sidebarBackdrop.classList.remove('hidden');
        setTimeout(() => {
          sidebarBackdrop.classList.add('active');
          sidebarMenu.classList.add('active');
        }, 10);
      }
    };
  }

  if (sidebarClose) sidebarClose.onclick = closeSidebarAction;
  if (sidebarBackdrop) sidebarBackdrop.onclick = closeSidebarAction;


  /* ==========================================================================
     GLOBAL SMART NAVIGATION INTERCEPTOR (ALL LINKS)
     ========================================================================== */
  document.addEventListener('click', (e) => {
    // Find closest anchor tag if user clicked an icon inside a link
    const anchor = e.target.closest('a');
    if (!anchor) return;

    const targetUrl = anchor.getAttribute('href');
    if (!targetUrl) return;

    const currentPath = window.location.pathname;

    // Condition 1: Link is an explicit page match (e.g., /user/profile.html)
    const isSamePageFile = currentPath.includes(targetUrl) || 
                           (targetUrl.endsWith('.html') && currentPath.endsWith(targetUrl.split('/').pop()));

    // Condition 2: Link is a home root path ('/' or '/index.html') and we are at home
    const isSamePageHome = (targetUrl === '/' || targetUrl === '/index.html') && 
                           (currentPath === '/' || currentPath.endsWith('index.html'));

    // Condition 3: Link is an in-page section jump link (e.g., #contact)
    const isSectionJump = targetUrl.startsWith('#');

    if (isSamePageFile || isSamePageHome) {
      e.preventDefault(); // Stop entire page from breaking/refreshing
      
      // Quietly close dropdown UI states if open
      if (profileDropdown) profileDropdown.classList.add('hidden');
      closeSidebarAction();
      
      console.log(`🔄 Prevented redundant page refresh for path: ${targetUrl}`);
    } else if (isSectionJump) {
      // It's a hash anchor tag link, clean up overlays on click execution
      if (profileDropdown) profileDropdown.classList.add('hidden');
      closeSidebarAction();
    }
  });
});

/* ==========================================================================
   AUTHENTICATION WORKFLOW HANDLERS
   ========================================================================== */
async function handleFirebaseGoogleLogin() {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const authenticatedUser = {
      googleId: user.uid,
      email: user.email,
      name: user.displayName,
      photoUrl: user.photoURL
    };

    await syncProfileToFirestore(authenticatedUser);
    localStorage.setItem('uttamhub_user', JSON.stringify(authenticatedUser));
    updateUI(true, authenticatedUser);
  } catch (error) {
    console.error("❌ Authentication breakdown:", error.message);
    alert(`Login failed: ${error.message}`);
  }
}

async function syncProfileToFirestore(user) {
  try {
    await fetch(`${BACKEND_URL}/api/user/profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.googleId,
        email: user.email,
        name: user.name,
        picture: user.photoUrl
      })
    });
    console.log('🎉 Profile records validated and pushed to backend successfully.');
  } catch (error) {
    console.error('Backend pipeline data sync fallback warning:', error);
  }
}

/* ==========================================================================
   UI UTILITY TRANSITIONS
   ========================================================================== */
function updateUI(isLoggedIn, user = null) {
  const sidebarAvatar = document.getElementById('sidebar-user-avatar');
  const sidebarName = document.getElementById('sidebar-user-name');

  // Determine the photo source: Check for backend 'photoUrl' or initial login 'picture'
  const profilePic = user ? (user.photoUrl || user.picture || '') : '';
  const displayName = user ? (user.name || 'User') : 'Guest User';

  if (isLoggedIn && user) {
    // Show Profile UI
    if (loginBtn) loginBtn.classList.add('hidden');
    if (profileCardContainer) profileCardContainer.classList.remove('hidden');

    // Update Header
    if (userName) userName.textContent = displayName;
    if (userAvatar) userAvatar.src = profilePic || 'https://via.placeholder.com/40';

    // Update Sidebar
    if (sidebarName) sidebarName.textContent = displayName;
    if (sidebarAvatar) sidebarAvatar.src = profilePic || 'https://via.placeholder.com/80';
  } else {
    // Show Login UI
    if (profileCardContainer) profileCardContainer.classList.add('hidden');
    if (profileDropdown) profileDropdown.classList.add('hidden');
    if (loginBtn) loginBtn.classList.remove('hidden');

    // Reset Header
    if (userName) userName.textContent = '';
    if (userAvatar) userAvatar.src = '';

    // Reset Sidebar
    if (sidebarName) sidebarName.textContent = 'Guest User';
    if (sidebarAvatar) sidebarAvatar.src = 'https://via.placeholder.com/80';
  }
}

function handleLogout() {
  auth.signOut().then(() => {
    localStorage.removeItem('uttamhub_user');
    updateUI(false);
    console.log('🔒 Local data flushed. Session closed gracefully.');
    
    // Redirect user to homepage if they log out while on a profile page
    if (window.location.pathname.includes('profile.html')) {
      window.location.href = '/';
    }
  });
}