// firebase/config.ts - don't uncomment this
// import { initializeApp } from 'firebase/app';
// import { getAuth } from 'firebase/auth';
// import { getFirestore } from 'firebase/firestore';  
// import { getStorage } from 'firebase/storage'; 
// const firebaseConfig = {
//   apiKey: "AIzaSyC3B7kKXkdSDOOLw1-9ZndzF1gLcbHxjMY",
//   authDomain: "expense-tracker-1d473.firebaseapp.com",
//   projectId: "expense-tracker-1d473",
//   storageBucket: "expense-tracker-1d473.firebasestorage.app",
//   messagingSenderId: "454503583231",
//   appId: "1:454503583231:web:8e66cb8f66e9c784d2ebca"
// };

// const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);
// export const db = getFirestore(app); 
// const storage = getStorage(app);
// export { storage };
// firebase/config.ts

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';  
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_APP_ID!
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
