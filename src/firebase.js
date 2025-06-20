// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {

  apiKey: "AIzaSyA4_z_1ht331uFF7-ckWoU-awoqVMOWARA",

  authDomain: "smart-expense-tracker-ca2c7.firebaseapp.com",

  projectId: "smart-expense-tracker-ca2c7",

  storageBucket: "smart-expense-tracker-ca2c7.firebasestorage.app",

  messagingSenderId: "759611929047",

  appId: "1:759611929047:web:1f7b5cb53f37326031db92",

  measurementId: "G-R5VZD3BNEZ"

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
