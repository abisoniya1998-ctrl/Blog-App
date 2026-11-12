
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyCVj9SFQWPjqZbKvxUaeoavY-4FpDk-TiI",
  authDomain: "blog-app-8372c.firebaseapp.com",
  projectId: "blog-app-8372c",
  storageBucket: "blog-app-8372c.firebasestorage.app",
  messagingSenderId: "635937030017",
  appId: "1:635937030017:web:f6c9997230eb8dc4cb7280",
  measurementId: "G-3QTLRJTMM8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export {auth};
