// firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; // ✅ Import Firestore

const firebaseConfig = {
  apiKey: 'AIzaSyDQiK6cwNZs4_NagG6AqRgk3XvfVl_q4N4',
  authDomain: 'mfixapp-f6673.firebaseapp.com',
  projectId: 'mfixapp-f6673',
  storageBucket: 'mfixapp-f6673.appspot.com',
  messagingSenderId: '75538998920',
  appId: '1:75538998920:web:b766509181e411a3faa13d', // ✅ Remove space before `:web:`
  measurementId: 'G-2KNNQTQEF1',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // ✅ Initialize Firestore

export { auth, db }; // ✅ Export both
