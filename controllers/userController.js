import db from '../config/firebase.js';

// Fetch profile info from Firestore
export const getUserProfile = async (req, res) => {
  const userId = req.params.id;

  try {
    // FIX: Point to the exact path where updateUserProfile saves data
    const personalProfileRef = db.collection('users')
                                 .doc(userId)
                                 .collection('Profile')
                                 .doc('personal');
                                 
    const userDoc = await personalProfileRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ success: false, message: 'Profile not found.' });
    }

    return res.status(200).json({ success: true, data: userDoc.data() });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error retrieving data.' });
  }
};

// Create or Update profile info using the new nested profile object rule
// userController.js - Update this function
export const updateUserProfile = async (req, res) => {
  const { userId, email, name, middleName, lastName, picture, dateOfBirth, gender, mobileNumber, education } = req.body;

  if (!userId) {
    return res.status(400).json({ success: false, message: 'Missing userId.' });
  }

  try {
    const personalProfileRef = db.collection('users').doc(userId).collection('Profile').doc('personal');
    const docSnapshot = await personalProfileRef.get();
    
    let currentProfile = docSnapshot.exists ? docSnapshot.data() : {};

    const profileData = {
      photoUrl: picture || currentProfile.photoUrl || '',
      name: {
        first: (name && typeof name === 'object' ? name.first : name) || currentProfile.name?.first || '',
        middle: middleName || (name && typeof name === 'object' ? name.middle : '') || currentProfile.name?.middle || '',
        last: lastName || (name && typeof name === 'object' ? name.last : '') || currentProfile.name?.last || ''
      },
      emailId: email || currentProfile.emailId || '',
      dateOfBirth: dateOfBirth || currentProfile.dateOfBirth || '',
      gender: gender || currentProfile.gender || '',
      mobileNumber: mobileNumber || currentProfile.mobileNumber || '',
      education: education || currentProfile.education || '',
      updatedAt: new Date().toISOString()
    };

    await personalProfileRef.set(profileData, { merge: true });

    return res.status(200).json({ success: true, message: 'Profile synchronized successfully.' });
  } catch (error) {
    console.error('Update Error:', error);
    return res.status(500).json({ success: false, message: 'Server error updating profile.' });
  }
};
// Add this helper to userController.js
export const updateUserAddress = async (req, res) => {
  const { userId, addressData } = req.body;
  try {
    // Save to users/{userId}/address/main
    await db.collection('users').doc(userId).collection('address').doc('main').set(addressData, { merge: true });
    return res.status(200).json({ success: true, message: 'Address saved.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserAddress = async (req, res) => {
  try {
    const doc = await db.collection('users').doc(req.params.id).collection('address').doc('main').get();
    if (!doc.exists) {
      return res.status(404).json({ success: false, message: 'Address not found.' });
    }
    return res.status(200).json({ success: true, data: doc.data() });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};