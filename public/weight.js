// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
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

// Get form and canvas elements
const weightForm = document.getElementById("weight-form");
const weightInput = document.getElementById("weight");
const dateInput = document.getElementById("date");
const weightChartCanvas = document.getElementById("weight-chart");

// Function to handle form submission
weightForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Get weight and date values
  const weight = parseFloat(weightInput.value);
  const date = dateInput.value;

  // Validate inputs
  if (!weight || !date) {
    alert("Please enter a valid weight and date.");
    return;
  }

  // Add data to Firestore
  try {
    await addDoc(collection(db, "weights"), { weight, date });
    alert("Weight entry added successfully!");
    weightForm.reset();
    loadWeightData(); // Refresh the chart with updated data
  } catch (error) {
    console.error("Error adding weight entry:", error);
    alert("Failed to add weight entry.");
  }
});

// Function to fetch weight data and render the chart
async function loadWeightData() {
  try {
    // Fetch data from Firestore
    const querySnapshot = await getDocs(collection(db, "weights"));
    const weights = [];
    const dates = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      weights.push(data.weight);
      dates.push(data.date);
    });

    // Sort data by date
    const sortedData = dates.map((date, index) => ({ date, weight: weights[index] }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    // Separate sorted data back into arrays
    const sortedDates = sortedData.map((entry) => entry.date);
    const sortedWeights = sortedData.map((entry) => entry.weight);

    // Render the chart
    renderChart(sortedDates, sortedWeights);
  } catch (error) {
    console.error("Error fetching weight data:", error);
  }
}

// Function to render the chart
function renderChart(dates, weights) {
  // Clear existing chart if it exists
  if (weightChartCanvas.chart) {
    weightChartCanvas.chart.destroy();
  }

  // Create a new chart
  weightChartCanvas.chart = new Chart(weightChartCanvas, {
    type: "line",
    data: {
      labels: dates,
      datasets: [{
        label: "Weight (kg)",
        data: weights,
        borderColor: "blue",
        backgroundColor: "rgba(0, 0, 255, 0.1)",
        tension: 0.4,
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "top" },
      },
      scales: {
        x: {
          title: { display: true, text: "Date" },
        },
        y: {
          title: { display: true, text: "Weight (kg)" },
        },
      },
    },
  });
}

// Initial load of weight data
loadWeightData();
