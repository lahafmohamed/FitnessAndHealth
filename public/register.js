import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD8r6lhcyRB9PNc42x7ViTf6UkFtcJgdu4",
  authDomain: "fitnessandhealth-e7c76.firebaseapp.com",
  projectId: "fitnessandhealth-e7c76",
  storageBucket: "fitnessandhealth-e7c76.appspot.com",
  messagingSenderId: "324371841104",
  appId: "1:324371841104:web:6c270e49a7b81e95f01155",
  measurementId: "G-3LNL1RLLV8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();
const db = getFirestore();

// Handle registration
document.getElementById('submit').addEventListener("click", async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const userData = {
            email: email,
            createdAt: new Date().toISOString()
        };

        await setDoc(doc(db, "users", user.uid), userData);

        alert("Registration successful!");
        // Redirect to main.html
        window.location.href = "main.html";
    } catch (error) {
        console.error("Error during registration:", error.code, error.message);
        alert("Error: " + error.message);
    }
});

// Handle Google Sign-In
document.getElementById('googleSignIn').addEventListener("click", async () => {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        const userData = {
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            createdAt: new Date().toISOString()
        };

        await setDoc(doc(db, "users", user.uid), userData, { merge: true });

        alert("Google sign-in successful!");
        // Redirect to main.html
        window.location.href = "main.html";
    } catch (error) {
        console.error("Error with Google sign-in:", error.code, error.message);
        alert("Error: " + error.message);
    }
});
