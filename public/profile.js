import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-storage.js";

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
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Function to update profile display
function updateDisplay(data) {
    document.getElementById("display-name").textContent = data.name || "N/A";
    document.getElementById("display-email").textContent = data.email || "N/A";
    document.getElementById("display-age").textContent = data.age || "N/A";
    document.getElementById("display-weight").textContent = data.weight || "N/A";
    document.getElementById("display-height").textContent = data.height || "N/A";
    document.getElementById("display-goal").textContent = data.goal || "N/A";
    document.getElementById("display-bmi").textContent = data.bmi || "N/A";
    if (data.photo) {
        document.getElementById("display-photo").src = data.photo;
    }
}

// Event listener for profile form submission
document.querySelector("form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const user = auth.currentUser ;
    if (!user) {
        alert("You must be logged in to update your profile.");
        return;
    }

    const userId = user.uid;
    const name = document.getElementById("name").value || user.displayName;
    const email = document.getElementById("email").value || user.email;
    const age = document.getElementById("age").value || "N/A";
    const weight = document.getElementById("weight").value || "N/A";
    const height = document.getElementById("height").value || "N/A";
    const goal = document.getElementById("goal").value || "N/A";
    const bmi = (weight && height) ? (weight / ((height / 100) ** 2)).toFixed(1) : "N/A";
    const bodyFat = document.getElementById("bodyFat").value || "N/A"; // Assuming you have an input for body fat
    const steps = document.getElementById("steps").value || "N/A"; // Assuming you have an input for steps
    const caloriesBurned = document.getElementById("caloriesBurned").value || "N/A"; // Assuming you have an input for calories burned
    const activeMinutes = document.getElementById("activeMinutes").value || "N/A"; // Assuming you have an input for active minutes

    const userProfile = { 
        name, 
        email, 
        age, 
        weight, 
        height, 
        goal, 
        bmi, bodyFat, 
        steps, 
        caloriesBurned, 
        activeMinutes 
    };

    try {
        await setDoc(doc(db, "users", userId), userProfile, { merge: true });
        alert("Profile updated!");
        updateDisplay(userProfile);
    } catch (err) {
        console.error("Error updating profile:", err);
    }
});

// Event listener for profile photo upload
document.getElementById("photo").addEventListener("change", async (e) => {
    const file = e.target.files[0];
    const user = auth.currentUser ;
    if (!user) {
        return;
    }

    const storageRef = ref(storage, `profile_photos/${user.uid}`);
    try {
        await uploadBytes(storageRef, file);
        const photoURL = await getDownloadURL(storageRef);
        await setDoc(doc(db, "users", user.uid), { photo: photoURL }, { merge: true });
        document.getElementById("display-photo").src = photoURL;
    } catch (err) {
        console.error("Error uploading photo:", err);
    }
});

// Check authentication state and load user data
onAuthStateChanged(auth, async (user) => {
    if (user) {
        try {
            const userId = user.uid;
            const docSnap = await getDoc(doc(db, "users", userId));
            if (docSnap.exists()) {
                updateDisplay(docSnap.data());
            } else {
                alert("No user profile found. Please update your information.");
            }
        } catch (err) {
            console.error("Error fetching user data:", err);
        }
    } else {
        alert("You are not logged in. Redirecting to login page...");
        window.location.href = "index.html";
    }
});

// Logout functionality
document.getElementById("logout").addEventListener("click", async () => {
    try {
        await signOut(auth);
        alert("Logged out successfully!");
        window.location.href = "index.html";
    } catch (err) {
        console.error("Error during logout:", err.message);
        alert("Logout failed: " + err.message);
    }
});