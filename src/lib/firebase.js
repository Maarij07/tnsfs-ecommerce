import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyD7dZ1mDvwz60yqv5OrdbfZoOg-FDFLMdE",
    authDomain: "siberkoza-e25a3.firebaseapp.com",
    projectId: "siberkoza-e25a3",
    storageBucket: "siberkoza-e25a3.appspot.com",
    messagingSenderId: "531673002001",
    appId: "1:531673002001:web:d6e88c0ff7e38e6ff981b0",
    measurementId: "G-ZZ9JQWM1QF"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app)
const provider = new GoogleAuthProvider();
const storage = getStorage(app);

export { auth, provider, storage };
export default db;