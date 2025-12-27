import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDY_DQLp7m-NNsGeJUzazdPSqPVWPNGdXI",
    authDomain: "atselectricals-a7dc5.firebaseapp.com",
    projectId: "atselectricals-a7dc5",
    storageBucket: "atselectricals-a7dc5.firebasestorage.app",
    messagingSenderId: "147309609922",
    appId: "1:147309609922:web:f8acdb03050fbc10a80c5b",
    measurementId: "G-Y9FVQSSBFR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
