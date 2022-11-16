// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAKx6ZQkVGtVqP26zMCvmT5r3ZhbQ2L6No",
    authDomain: "curso-vue-udemy-b927a.firebaseapp.com",
    projectId: "curso-vue-udemy-b927a",
    storageBucket: "curso-vue-udemy-b927a.appspot.com",
    messagingSenderId: "191022951676",
    appId: "1:191022951676:web:6cccaa02af32d49162bb79",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth()