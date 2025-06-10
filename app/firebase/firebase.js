// firebase/clientApp.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBay7Mkf8xgD-UC2iYxwp17FRnGAnkYMOI",
  authDomain: "ghumma.firebaseapp.com",
  projectId: "ghumma",
  storageBucket: "ghumma.firebasestorage.app",
  messagingSenderId: "774001538222",
  appId: "1:774001538222:web:0bc533883c71360fe0693f",
  measurementId: "G-6TNLWZRH0N"
};

let app;
app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { auth,db };
