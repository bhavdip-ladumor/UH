const BACKEND_URL = window.location.origin;

// profile.js - Update your DOMContentLoaded and Address functions
document.addEventListener('DOMContentLoaded', () => {
  const savedUser = localStorage.getItem('uttamhub_user');
  if (!savedUser) { window.location.href = '/'; return; }
  const user = JSON.parse(savedUser);
  const userId = user.googleId;

  loadProfileHero(userId);
  loadPersonalInfo(userId);
  loadAddress(userId); // <--- Add this
});

// Update this function to match the IDs in your HTML
async function loadAddress(userId) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/user/address/${userId}`);
    const resJson = await res.json();
    if (resJson.success && resJson.data) {
      const a = resJson.data;
      // Fixed IDs to match profile.html
      document.getElementById('input-main-house').value = a.house || '';
      document.getElementById('input-main-society').value = a.society || '';
      document.getElementById('textarea-main-line').value = a.addressLine || '';
      document.getElementById('input-main-street').value = a.street || '';
      document.getElementById('input-main-landmark').value = a.landmark || '';
      document.getElementById('input-main-area').value = a.area || '';
      document.getElementById('input-main-district').value = a.district || '';
      document.getElementById('input-main-state').value = a.state || '';
      document.getElementById('input-main-country').value = a.country || '';
      document.getElementById('input-main-pincode').value = a.pincode || '';
    }
  } catch (err) { console.error('Error loading address:', err); }
}

// Update this function to match the IDs in your HTML
async function saveAddress(userId) {
  const payload = {
    userId: userId,
    addressData: {
      house: document.getElementById('input-main-house').value,
      society: document.getElementById('input-main-society').value,
      addressLine: document.getElementById('textarea-main-line').value,
      street: document.getElementById('input-main-street').value,
      landmark: document.getElementById('input-main-landmark').value,
      area: document.getElementById('input-main-area').value,
      district: document.getElementById('input-main-district').value,
      state: document.getElementById('input-main-state').value,
      country: document.getElementById('input-main-country').value,
      pincode: document.getElementById('input-main-pincode').value
    }
  };

  const response = await fetch(`${BACKEND_URL}/api/user/address`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  
  if (response.ok) alert('Address saved!');
  else alert('Failed to save address.');
}
async function loadProfileHero(userId) {
  const displayProfilePhoto = document.getElementById('display-profile-photo');
  const displayProfileFullname = document.getElementById('display-profile-fullname');

  try {
    const response = await fetch(`${BACKEND_URL}/api/user/profile/${userId}`);
    const result = await response.json();
    
    if (result.success && result.data && result.data.profile) {
      const p = result.data.profile;
      const fullName = `${p.name?.first || ''} ${p.name?.last || ''}`.trim();
      
      if (displayProfileFullname) displayProfileFullname.textContent = fullName || 'User';
      if (displayProfilePhoto && p.photoUrl) displayProfilePhoto.src = p.photoUrl;
    }
  } catch (error) {
    console.error('Error loading hero section:', error);
  }
}

/**
 * Toggle Edit Function for Partitions
 */
function toggleEdit(sectionId) {
  const section = document.getElementById(sectionId);
  const inputs = section.querySelectorAll('input, select, textarea');
  const btn = section.querySelector('.btn-edit');
  
  const isEditing = section.classList.toggle('is-editing');
  
  inputs.forEach(input => {
    input.disabled = !isEditing;
  });
  
  btn.textContent = isEditing ? 'Save' : 'Edit';
  
  // TRIGGER SAVE ONLY WHEN SWITCHING OFF EDIT MODE
  if (!isEditing) {
    const savedUser = JSON.parse(localStorage.getItem('uttamhub_user'));
    
    if (sectionId === 'personal-info-section') {
       savePersonalInfo(savedUser.googleId);
    } else if (sectionId === 'address-section') {
       saveAddress(savedUser.googleId);
    }
}
}
// Function to load Personal Info
// Function to load Personal Info
async function loadPersonalInfo(userId) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/user/profile/${userId}`);
    const resJson = await res.json();
    
    if (resJson.success && resJson.data) {
      const p = resJson.data;

      // 1. Update the Hero Section
      const fullName = `${p.name?.first || ''} ${p.name?.middle || ''} ${p.name?.last || ''}`.trim();
      document.getElementById('display-profile-fullname').textContent = fullName || 'User Name';
      
      if (p.photoUrl) {
        document.getElementById('display-profile-photo').src = p.photoUrl;
      }

      // 2. Existing code to update the Form Section
      document.getElementById('input-first-name').value = p.name?.first || '';
      document.getElementById('input-middle-name').value = p.name?.middle || '';
      document.getElementById('input-last-name').value = p.name?.last || '';
      document.getElementById('input-dob').value = p.dateOfBirth || '';
      document.getElementById('select-gender').value = p.gender || '';
      document.getElementById('input-mobile').value = p.mobileNumber || '';
      document.getElementById('input-email').value = p.emailId || '';
      document.getElementById('select-education').value = p.education || '';
    }
  } catch (err) { 
    console.error('Error loading personal info:', err); 
  }
}

// Function to handle "Save" (Update Firestore)
async function savePersonalInfo(userId) {
  try {
    const payload = {
      userId: userId,
      // Map these strings to the structure expected by updateUserProfile
      name: {
        first: document.getElementById('input-first-name').value,
        middle: document.getElementById('input-middle-name').value,
        last: document.getElementById('input-last-name').value
      },
      dateOfBirth: document.getElementById('input-dob').value,
      gender: document.getElementById('select-gender').value,
      mobileNumber: document.getElementById('input-mobile').value,
      education: document.getElementById('select-education').value
      // Note: emailId is usually persistent, but add it here if you need to update it
    };

    const response = await fetch(`${BACKEND_URL}/api/user/profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error('Save failed');
    
    alert('Personal info saved successfully!');
  } catch (error) {
    console.error(error);
    alert('Error saving data.');
  }
}
// Integrate into your toggleEdit:
// When toggleEdit changes to 'Edit' (saved state), call savePersonalInfo(userId);

// Function to load Address
// Load Address into Form
async function loadAddress(userId) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/user/address/${userId}`);
    const resJson = await res.json();
    if (resJson.success && resJson.data) {
      const a = resJson.data;
      document.getElementById('input-house').value = a.house || '';
      document.getElementById('input-society').value = a.society || '';
      document.getElementById('input-address-line').value = a.addressLine || '';
      document.getElementById('input-street').value = a.street || '';
      document.getElementById('input-landmark').value = a.landmark || '';
      document.getElementById('input-area').value = a.area || '';
      document.getElementById('input-district').value = a.district || '';
      document.getElementById('input-state').value = a.state || '';
      document.getElementById('input-country').value = a.country || '';
      document.getElementById('input-pincode').value = a.pincode || '';
    }
  } catch (err) { console.error('Error loading address:', err); }
}

// Save Address to Firestore
async function saveAddress(userId) {
  const payload = {
    userId: userId,
    addressData: {
      house: document.getElementById('input-house').value,
      society: document.getElementById('input-society').value,
      addressLine: document.getElementById('input-address-line').value,
      street: document.getElementById('input-street').value,
      landmark: document.getElementById('input-landmark').value,
      area: document.getElementById('input-area').value,
      district: document.getElementById('input-district').value,
      state: document.getElementById('input-state').value,
      country: document.getElementById('input-country').value,
      pincode: document.getElementById('input-pincode').value
    }
  };

  await fetch(`${BACKEND_URL}/api/user/address`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  alert('Address saved!');
}