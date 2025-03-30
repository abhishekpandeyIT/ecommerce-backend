const { initializeApp, cert } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');

let firebaseAuth;

try {
  const serviceAccount = require('../firebase-service-account.json');
  
  initializeApp({
    credential: cert(serviceAccount)
  });

  firebaseAuth = getAuth();
} catch (error) {
  console.warn('Firebase service account not found. Firebase auth will be disabled.');
  console.warn('For production use, please add firebase-service-account.json');
  
  // Mock auth for development
  firebaseAuth = {
    verifyIdToken: () => Promise.reject('Firebase not configured'),
    createUser: () => Promise.reject('Firebase not configured'),
    // Add other methods you use
  };
}

module.exports = firebaseAuth;