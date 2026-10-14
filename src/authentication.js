//Firebase authentication
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBQX_xdizXpmwTWCR71i65DPnxYK4_dPRo",
  authDomain: "goalgetter-app-e0378.firebaseapp.com",
  projectId: "goalgetter-app-e0378",
  storageBucket: "goalgetter-app-e0378.firebasestorage.app",
  messagingSenderId: "1013511064142",
  appId: "1:1013511064142:web:78e72c7a9e2e5bad7fd11f",
  measurementId: "G-MZR61S8K9X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

