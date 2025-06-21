    // src/firebase.js
    import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

    const firebaseConfig = {
    apiKey: "AIzaSyBXNHKaC2eXBoqvyGDROpCGsbPos_0-JiI",
    authDomain: "budget-planner-25a34.firebaseapp.com",
    projectId: "budget-planner-25a34",
    storageBucket: "budget-planner-25a34.appspot.com",
    messagingSenderId: "933196767297",
    appId: "1:933196767297:web:2ca7ead8f4591b8c4ea6c0"
    }

    const app = initializeApp(firebaseConfig)

    export const auth = getAuth(app)
    export const db = getFirestore(app)
