// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

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
const db = getFirestore(app);
const auth = getAuth(app);

// Get form and canvas elements
const weightForm = document.getElementById("weight-form");
const weightInput = document.getElementById("weight");
const dateInput = document.getElementById("date");
const weightChartCanvas = document.getElementById("weight-chart");

// Authenticate and fetch user data
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log(`Logged in as ${user.email}`);
    loadWeightData(user.email); // Load weight history for the logged-in user
  } else {
    alert("You must be logged in to access this page.");
    window.location.href = "/login.html"; // Redirect to login page
  }
});

// Handle form submission
weightForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const weight = parseFloat(weightInput.value);
  const date = dateInput.value;

  if (!weight || !date) {
    alert("Please enter valid weight and date.");
    return;
  }

  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User is not logged in.");

    await addDoc(collection(db, "weights"), {
      email: user.email,
      weight,
      date,
    });
    alert("Weight entry added successfully!");
    weightForm.reset();
    loadWeightData(user.email); // Refresh data
  } catch (error) {
    console.error("Error adding weight entry:", error);
    alert("Failed to add weight entry.");
  }
});

// Fetch and display weight data
async function loadWeightData(userEmail) {
  try {
    const querySnapshot = await getDocs(collection(db, "weights"));
    const weights = [];
    const dates = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.email === userEmail) {
        weights.push(data.weight);
        dates.push(data.date);
      }
    });

    const sortedData = dates.map((date, index) => ({ date, weight: weights[index] }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    const sortedDates = sortedData.map((entry) => entry.date);
    const sortedWeights = sortedData.map((entry) => entry.weight);

    renderChart(sortedDates, sortedWeights);
  } catch (error) {
    console.error("Error fetching weight data:", error);
  }
}

// Render chart
function renderChart(dates, weights) {
  if (weightChartCanvas.chart) {
    weightChartCanvas.chart.destroy();
  }

  weightChartCanvas.chart = new Chart(weightChartCanvas, {
    type: "line",
    data: {
      labels: dates,
      datasets: [
        {
          label: "Weight (kg)",
          data: weights,
          borderColor: "blue",
          backgroundColor: "rgba(0, 0, 255, 0.1)",
          tension: 0.4,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: { legend: { position: "top" } },
      scales: {
        x: { title: { display: true, text: "Date" } },
        y: { title: { display: true, text: "Weight (kg)" } },
      },
    },
  });
}
