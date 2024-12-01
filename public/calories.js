// Function to fetch the access token from the backend proxy
const getToken = async () => {
    try {
      // Send a request to the backend proxy to get the access token
      const response = await fetch('http://localhost:3000/token', {
        method: 'POST',
      });
  
      // Check if the response is OK
      if (!response.ok) {
        throw new Error('Failed to fetch the token from the backend');
      }
  
      // Parse the response JSON
      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error('Error fetching token:', error);
      throw error;
    }
  };
  
  // Function to search for food data
  const searchFood = async (query) => {
    try {
      // Get the token from the backend
      const token = await getToken();
  
      // FatSecret API URL for food search
      const url = `https://platform.fatsecret.com/rest/server.api?method=foods.search&search_expression=${query}&format=json`;
  
      // Fetch food data using the token
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Check if the response is OK
      if (!response.ok) {
        throw new Error('Failed to fetch food data');
      }
  
      // Parse the response JSON
      const data = await response.json();
      return data.foods.food;
    } catch (error) {
      console.error('Error fetching food data:', error);
      throw error;
    }
  };
  
  // Event listener for the search button
  document.getElementById('search-btn').addEventListener('click', async () => {
    // Get the input value
    const input = document.getElementById('food-input').value.trim();
  
    // Validate the input
    if (!input) {
      alert('Please enter a food item.');
      return;
    }
  
    // Display a loading message
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '<p>Loading...</p>';
  
    try {
      // Fetch the food data
      const foods = await searchFood(input);
  
      // Check if there are any results
      if (!foods || foods.length === 0) {
        resultsContainer.innerHTML = '<p>No results found.</p>';
        return;
      }
  
      // Display the results
      resultsContainer.innerHTML = foods
        .map(
          (food) => `
          <div class="border p-2 mb-2 rounded shadow">
            <p class="font-bold">${food.food_name}</p>
            <p>${food.food_description}</p>
          </div>
        `
        )
        .join('');
    } catch (error) {
      resultsContainer.innerHTML =
        '<p>Error fetching data. Please try again later.</p>';
    }
  });
  