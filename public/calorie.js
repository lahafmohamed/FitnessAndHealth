const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const nutrientDetailContainer = document.getElementById('nutrient-details-container');
const nutrientDetailRow = document.getElementById('nutrient-details-row');

// Event listener for the search button
searchButton.addEventListener('click', () => {
    const query = searchInput.value.trim();

    if (!query) {
        alert("Input can't be empty");
        return;
    }

    // Clear previous results and show loader
    nutrientDetailRow.innerHTML = '<p>Loading...</p>';

    // Fetch data from the API
    fetchData('natural/nutrients', {
        method: 'POST',
        body: JSON.stringify({ query }),
    })
        .then((response) => {
            nutrientDetailRow.innerHTML = ''; // Clear loader
            if (!response.foods || response.foods.length === 0) {
                alert("No results found.");
                return;
            }

            // Loop through the foods and create cards
            response.foods.forEach((food) => {
                const cardDiv = createElement('div', {
                    classNames: 'p-6 bg-white shadow-md rounded-md flex flex-col items-center justify-center text-center space-y-4',
                });

                const image = createElement('img', {
                    src: food.photo.thumb,
                    classNames: 'w-32 h-32 object-cover rounded-md shadow-md',
                });

                const heading = createElement('h1', {
                    innerHtml: food.food_name,
                    classNames: 'text-xl font-bold text-green-600',
                });

                const servingUnit = createElement('p', {
                    innerHtml: `<b>Serving Unit:</b> ${food.serving_unit}`,
                    classNames: 'text-gray-600',
                });

                const servingQuantity = createElement('p', {
                    innerHtml: `<b>Serving Quantity:</b> ${food.serving_qty}`,
                    classNames: 'text-gray-600',
                });

                const button = createElement('button', {
                    classNames: 'btn py-3 px-6 text-xl font-semibold bg-green-600 text-white hover:bg-green-700 rounded-lg shadow-lg',
                    innerHtml: 'Know More',
                });

                // Append elements to card
                cardDiv.appendChild(image);
                cardDiv.appendChild(heading);
                cardDiv.appendChild(servingUnit);
                cardDiv.appendChild(servingQuantity);
                cardDiv.appendChild(button);

                // Add click listener to "Know More" button
                button.addEventListener('click', () => {
                    localStorage.setItem('foodName', food.food_name);
                    window.location.href = 'nutrient-details.html';
                });

                // Append card to row
                nutrientDetailRow.appendChild(cardDiv);
            });

            // Show the container
            nutrientDetailContainer.classList.remove('hidden');
            window.location.href = '#nutrient-details-container';
        })
        .catch((error) => {
            nutrientDetailRow.innerHTML = '<p class="text-red-500">Error loading data. Please try again later.</p>';
            alert(`Error: ${error}`);
        });
});

// Function to create DOM elements
function createElement(tag, attributes) {
    const element = document.createElement(tag);
    if (attributes.id) element.id = attributes.id;
    if (attributes.classNames) attributes.classNames.split(' ').forEach((cls) => element.classList.add(cls));
    if (attributes.innerHtml) element.innerHTML = attributes.innerHtml;
    if (attributes.src) element.src = attributes.src;
    return element;
}

// Fetch API data
async function fetchData(endpoint, options) {
    const API_BASE_URL = 'https://trackapi.nutritionix.com/v2';
    const defaultHeaders = {
        'Content-Type': 'application/json',
        'x-app-id': '627e4a3e',
        'x-app-key': 'a2a71cac01aa9c4f184786ccb9d56a60',
    };
    options.headers = { ...defaultHeaders, ...options.headers };

    try {
        const response = await fetch(`${API_BASE_URL}/${endpoint}`, options);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Something went wrong!');
        }
        return await response.json();
    } catch (error) {
        return Promise.reject(error.message || error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    nutrientDetailRow.innerHTML = '<p class="text-gray-600">No contents available.</p>';
});
