// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBG7AFkP1Pf1ngYzU3xHeB_vuyVI2IAh9I",
  authDomain: "ecommerceapp-77b9d.firebaseapp.com",
  projectId: "ecommerceapp-77b9d",
  storageBucket: "ecommerceapp-77b9d.firebasestorage.app",
  messagingSenderId: "974092492168",
  appId: "1:974092492168:web:c6384c6912b8f33ad36e3d",
  measurementId: "G-MSPNHXW18S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);