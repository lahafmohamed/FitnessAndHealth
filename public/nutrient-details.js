// Importing elements
const headerTitle = document.getElementById('header-title');
const servingQuantity = document.getElementById('serving-quantity');
const servingUnit = document.getElementById('serving-unit');
const servingWeight = document.getElementById('serving-weight');
const calorie = document.getElementById('calorie');
const fat = document.getElementById('fat');
const saturatedFat = document.getElementById('saturated-fat');
const cholesterol = document.getElementById('cholesterol');
const sodium = document.getElementById('sodium');
const carbohydrate = document.getElementById('carbohydrate');
const sugar = document.getElementById('sugar');
const proteins = document.getElementById('proteins');
const foodImage = document.getElementById('food-image'); // Element for food photo

// API base URL
const API_BASE_URL = "https://trackapi.nutritionix.com/v2";

// Calling the nutrition details
document.addEventListener('DOMContentLoaded', () => {
    const foodName = localStorage.getItem('foodName');

    if (!foodName) {
        alert('No food item found in localStorage.');
        return;
    }

    fetch(`${API_BASE_URL}/natural/nutrients`, {
        method: "POST",
        body: JSON.stringify({ query: foodName }),
        headers: {
            "Content-Type": "application/json",
            "x-app-id": "627e4a3e",
            "x-app-key": "a2a71cac01aa9c4f184786ccb9d56a60"
        }
    })
    .then(response => {
        if (response.status === 404) {
            return response.json().then(jsonResponse => {
                throw new Error(jsonResponse.message);
            });
        }
        return response.json();
    })
    .then(data => {
        const foodData = data.foods[0];
        headerTitle.innerHTML = `Nutrient Details for <span style="color:#ffd43b">${foodName}</span>`;

        // Setting the nutrient details into DOM.
        servingQuantity.innerText = foodData.serving_qty;
        servingUnit.innerText = foodData.serving_unit;
        servingWeight.innerText = `${foodData.serving_weight_grams} gm`;
        calorie.innerText = foodData.nf_calories;
        fat.innerText = foodData.nf_total_fat;
        saturatedFat.innerText = foodData.nf_saturated_fat;
        cholesterol.innerText = foodData.nf_cholesterol;
        sodium.innerText = foodData.nf_sodium;
        carbohydrate.innerText = foodData.nf_total_carbohydrate;
        sugar.innerText = foodData.nf_sugars;
        proteins.innerText = foodData.nf_protein;

        // Setting the food image
        foodImage.src = foodData.photo.thumb;
        foodImage.alt = foodName;
    })
    .catch(err => alert(`Error: ${err.message}`));
});
