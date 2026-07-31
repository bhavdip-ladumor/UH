import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let db;

try {
  // Looks for "firebase-service-account.json" up one level from the config directory
  const serviceAccountPath = path.join(__dirname, '../firebase-service-account.json');
  const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));

  initializeApp({
    credential: cert(serviceAccount),
    projectId: process.env.FIREBASE_PROJECT_ID
  });

  db = getFirestore();
  console.log(`✅ Firebase Firestore Admin SDK connected via Service Account.`);
} catch (error) {
  console.error("❌ Firebase Admin initialization failed:", error.message);
  
  initializeApp({
    projectId: process.env.FIREBASE_PROJECT_ID
  });
  db = getFirestore();
}

export default db;