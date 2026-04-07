import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDP9TrLurt53v4dFAdCc60h0Dszitbym3w",
    authDomain: "sample-deals-app.firebaseapp.com",
    projectId: "sample-deals-app",
    storageBucket: "sample-deals-app.firebasestorage.app",
    messagingSenderId: "926143400812",
    appId: "1:926143400812:web:7aa6083d269e4298424149"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

window.saveMathProgress = async function(isCorrect, a, b, chosen, tries) {
    try {
        await addDoc(collection(db, "math_sessions"), {
            standard: "MA.K.NSO.1.4",
            success: isCorrect,
            countA: a,
            countB: b,
            choice: chosen,
            attempts: tries,
            timestamp: serverTimestamp(),
            userAgent: navigator.userAgent // Robustness: check what device they used
        });
    } catch (e) {
        console.error("Red Tape Sync Error:", e);
    }
};
