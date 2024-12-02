const express = require('express');
const path = require('path');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3000;

// FatSecret API credentials
const CLIENT_ID = '31820bb71c9e4bba8c39322c54708840';
const CLIENT_SECRET = '26d4847a388e4fe3aefeeb7291c4df8d';

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve all .html files from the 'views' directory directly
app.use('/', express.static(path.join(__dirname, 'views')));



// Explicit routes for other HTML pages (optional)
const htmlPages = [
  'index',
  'calories',
  'login',
  'register',
  'profile',
  'tips',
  'main',
  'programs',
  'test',
  'news',
  'calorie',
  'nutrient-details',
];

htmlPages.forEach((page) => {
  app.get(`/${page}.html`, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', `${page}.html`));
  });
});

// Backend API endpoint for getting a token
app.post('/token', async (req, res) => {
  try {
    const response = await axios.post(
      'https://oauth.fatsecret.com/connect/token',
      new URLSearchParams({
        grant_type: 'client_credentials',
        scope: 'basic',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      }),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching token:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch token' });
  }
});

// Default fallback for unknown routes
app.use((req, res) => {
  res.status(404).send('Page Not Found');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
