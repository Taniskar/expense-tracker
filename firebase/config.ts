// firebase/config.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';  
import { getStorage } from 'firebase/storage'; 
const firebaseConfig = {
  apiKey: "AIzaSyC3B7kKXkdSDOOLw1-9ZndzF1gLcbHxjMY",
  authDomain: "expense-tracker-1d473.firebaseapp.com",
  projectId: "expense-tracker-1d473",
  storageBucket: "expense-tracker-1d473.firebasestorage.app",
  messagingSenderId: "454503583231",
  appId: "1:454503583231:web:8e66cb8f66e9c784d2ebca"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); 
const storage = getStorage(app);
export { storage };