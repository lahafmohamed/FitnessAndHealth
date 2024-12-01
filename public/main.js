import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD8r6lhcyRB9PNc42x7ViTf6UkFtcJgdu4",
  authDomain: "fitnessandhealth-e7c76.firebaseapp.com",
  projectId: "fitnessandhealth-e7c76",
  storageBucket: "fitnessandhealth-e7c76.appspot.com",
  messagingSenderId: "324371841104",
  appId: "1:324371841104:web:6c270e49a7b81e95f01155",
  measurementId: "G-3LNL1RLLV8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Function to update stats dynamically
async function updateStats(uid) {
  const statsDoc = doc(db, "users", uid);
  const statsSnapshot = await getDoc(statsDoc);

  if (statsSnapshot.exists()) {
    const stats = statsSnapshot.data();

    // Update the stats section dynamically
    const statsSection = document.getElementById("your-stats").querySelector('div');
    if (statsSection) {
      statsSection.innerHTML = `
        <div class="bg-white p-4 rounded shadow">
          <h3 class="text-lg font-semibold">Weight</h3>
          <p class="text-2xl font-bold">${stats.weight || "N/A"} kg</p>
        </div>
        <div class="bg-white p-4 rounded shadow">
          <h3 class="text-lg font-semibold">BMI</h3>
          <p class="text-2xl font-bold">${stats.bmi || "N/A"}</p>
        </div>
        <div class="bg-white p-4 rounded shadow">
          <h3 class="text-lg font-semibold">Body Fat</h3>
          <p class="text-2xl font-bold">${stats.bodyFat || "N/A"}%</p>
        </div>
        <div class="bg-white p-4 rounded shadow">
          <h3 class="text-lg font-semibold">Steps</h3>
          <p class="text-2xl font-bold">${stats.steps || "N/A"}</p>
        </div>
        <div class="bg-white p-4 rounded shadow">
          <h3 class="text-lg font-semibold">Calories Burned</h3>
          <p class="text-2xl font-bold">${stats.caloriesBurned || "N/A"} kcal</p>
        </div>
        <div class="bg-white p-4 rounded shadow">
          <h3 class="text-lg font-semibold">Active Minutes</h3>
          <p class="text-2xl font-bold">${stats.activeMinutes || "N/A"} min</p>
        </div>`;
    }
  } else {
    console.log("No stats available for this user.");
  }
}

// Authentication state observer
onAuthStateChanged(auth, (user) => {
  if (user) {
    updateStats(user.uid);
  } else {
    location.href = "login.html";
  }
});

// Logout functionality
const logoutButton = document.getElementById("logout-button");
if (logoutButton) {
  logoutButton.addEventListener("click", () => {
    signOut(auth)
      .then(() => {
        alert("You have successfully logged out.");
        location.href = "index.html";
 })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  });
}