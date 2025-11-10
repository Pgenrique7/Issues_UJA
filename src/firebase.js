import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCxNp7a2nnrUX0peV0MXlEl98wozMime0w",
  authDomain: "issues-uja.firebaseapp.com",
  projectId: "issues-uja",
  storageBucket: "issues-uja.firebasestorage.app",
  messagingSenderId: "742893767317",
  appId: "1:742893767317:web:e76c570a8d07836727699c"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
