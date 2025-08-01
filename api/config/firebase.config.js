

// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyBvKrUNNXVGEq5IpBxLZWNktlLQ13GiRkA",
//   authDomain: "ariba-4a8aa.firebaseapp.com",
//   projectId: "ariba-4a8aa",
//   storageBucket: "ariba-4a8aa.firebasestorage.app",
//   messagingSenderId: "548191550259",
//   appId: "1:548191550259:web:f94c4f0b514c6c3cacdc46",
//   measurementId: "G-CRW4PQ9LMR"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);
// export const db = getFirestore(app);


// berndtdennis209@gmail.com

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCmBjSFatJ6a8VIkH5grtafdCJD6qknGxk",
  authDomain: "ariba-d40cc.firebaseapp.com",
  projectId: "ariba-d40cc",
  storageBucket: "ariba-d40cc.firebasestorage.app",
  messagingSenderId: "171583954238",
  appId: "1:171583954238:web:2923d72e2d622d9129a06f",
  measurementId: "G-4WJCBYD6TR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);