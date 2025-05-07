// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyApAtV_07Z5J2rqlz250wQtodoTG-RioKY",
  authDomain: "unipar-9731a.firebaseapp.com",
  projectId: "unipar-9731a",
  storageBucket: "unipar-9731a.firebasestorage.app",
  messagingSenderId: "760588347789",
  appId: "1:760588347789:web:5a7f0fbd5ec4458911b5c4",
  measurementId: "G-62QK3CMPGZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)
