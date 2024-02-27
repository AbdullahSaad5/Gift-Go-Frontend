// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBrcNQjxCpJa_qEO8hidwGAs3-wf84XfKo",
  authDomain: "giftgo-fc8c6.firebaseapp.com",
  projectId: "giftgo-fc8c6",
  storageBucket: "giftgo-fc8c6.appspot.com",
  messagingSenderId: "370468905959",
  appId: "1:370468905959:web:c7eb1d1a620d8e23d91342",
  measurementId: "G-KRN471GCED",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const storage = getStorage(app);
