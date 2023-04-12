// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDFZ7HkOwgTSkoUTzGM_obmjTRDHO0Gu2c",
  authDomain: "fir-ac6bc.firebaseapp.com",
  projectId: "fir-ac6bc",
  storageBucket: "fir-ac6bc.appspot.com",
  messagingSenderId: "868045463754",
  appId: "1:868045463754:web:92696e436b2900123e1433"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth=getAuth(app)
export const db=getFirestore(app)