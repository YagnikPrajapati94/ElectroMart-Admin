import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDj0tyimR51Kq54-Yr8CTFgtx9YQwMyXPU",
    authDomain: "electromart-56f5c.firebaseapp.com",
    projectId: "electromart-56f5c",
    storageBucket: "electromart-56f5c.firebasestorage.app",
    messagingSenderId: "14882996342",
    appId: "1:14882996342:web:69f5992bfb2f620a6ddf57"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);