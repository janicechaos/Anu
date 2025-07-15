// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBUa47pQAbrHtCqsc3qE4XwK_-xy0RuYKQ",
  authDomain: "anu-app-31471.firebaseapp.com",
  projectId: "anu-app-31471",
  storageBucket: "anu-app-31471.firebasestorage.app",
  messagingSenderId: "368606208906",
  appId: "1:368606208906:web:239ec5a631f4d79f00de73",
  measurementId: "G-RSVPMME0YM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { analytics, app, firebaseConfig };
