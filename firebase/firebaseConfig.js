// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js"; // Import Firestore
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-storage.js"; // Import Storage

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDjH0uqfBxGk77cR8PdQDiVlsUHJONpQ7Q",
  authDomain: "empbp-30d83.firebaseapp.com",
  projectId: "empbp-30d83",
  storageBucket: "empbp-30d83.appspot.com",
  messagingSenderId: "156904269108",
  appId: "1:156904269108:web:4353b68e4c7ff5359f3161",
  measurementId: "G-KYFY9P6LKH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app); // Initialize Firestore
const storage = getStorage(app); // Initialize Storage

export { auth, db, storage }; // Export Storage instance along with other Firebase services
