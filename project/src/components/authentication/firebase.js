import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDeM0sEIm_TIFvFDUQvDozq0rdJTZFyhjg",
    authDomain: "codingninja-96464.firebaseapp.com",
    projectId: "codingninja-96464",
    storageBucket: "codingninja-96464.appspot.com",
    messagingSenderId: "795467338957",
    appId: "1:795467338957:web:40ed13cd421f99c0ee0584",
    measurementId: "G-R2FRBV350K"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, provider, db };