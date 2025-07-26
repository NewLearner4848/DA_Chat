import firebase from "firebase/compat/app";
import "firebase/compat/auth";

// IMPORTANT: Replace with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyD7r1XiA8TyyY7PWu0zovWolkMBVitOgcM",
  authDomain: "da-chat-edae4.firebaseapp.com",
  projectId: "da-chat-edae4",
  storageBucket: "da-chat-edae4.firebasestorage.app",
  messagingSenderId: "140730125164",
  appId: "1:140730125164:web:e59e406a218c9b4937c149",
  measurementId: "G-NT4MYPCEBZ"
};

// Initialize Firebase only if it hasn't been initialized yet
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const googleProvider = new firebase.auth.GoogleAuthProvider();
