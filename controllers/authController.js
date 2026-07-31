import { OAuth2Client } from 'google-auth-library';
import pool from '../config/db.js'; // Your Postgres pool
import db from '../config/firebase.js'; // Your Firestore instance


const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const handleGoogleLogin = async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ success: false, message: 'Missing Google ID token.' });
  }

  try {
    // 1. Verify the token with Google
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    console.log(`🔐 Google Token verified for user: ${email}`);

    // 2. [Next Step Action] Check/Insert user into Postgres & Firestore
    // We will write the user creation/sync queries right here next.

    return res.status(200).json({
      success: true,
      message: 'Authentication successful',
      user: { googleId, email, name, picture }
    });

  } catch (error) {
    console.error('❌ Auth Verification Error:', error.message);
    return res.status(401).json({ success: false, message: 'Invalid Google Token.' });
  }
};
