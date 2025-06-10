import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDlR38LqpUEv6JG7YS7BT_epKoOUsmTrdw",
  authDomain: "alertify-c924c.firebaseapp.com",
  databaseURL: "https://alertify-c924c-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "alertify-c924c",
  storageBucket: "alertify-c924c.firebasestorage.app",
  messagingSenderId: "932004856653",
  appId: "1:932004856653:web:20f2d63c2ddb21c18f6d04",
  measurementId: "G-DSSPQRS2ZT"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

// Initialize Firestore
const db = getFirestore(app);

export { app, db, auth };
