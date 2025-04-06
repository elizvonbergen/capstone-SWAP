import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDC5rstbGS2JQ0S7tW9FAuKXuvo_oNwGTg",
  authDomain: "cosc498-capstone.firebaseapp.com",
  projectId: "cosc498-capstone",
  storageBucket: "cosc498-capstone.firebasestorage.app",
  messagingSenderId: "737916400143",
  appId: "1:737916400143:web:4ea6a537329aaae1cbe97a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)