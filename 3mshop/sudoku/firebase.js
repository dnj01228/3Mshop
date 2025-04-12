import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDuqDgA4PuS5KZEGSJWTek-6IEcNyC1Jws",
  authDomain: "mshop-cbe04.firebaseapp.com",
  projectId: "mshop-cbe04",
  storageBucket: "mshop-cbe04.firebasestorage.app",
  messagingSenderId: "341787310581",
  appId: "1:341787310581:web:a0545b8ed35ec5033f08bc"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };