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
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory (e.g., CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Serve all .html files from the 'views' directory directly
app.use('/', express.static(path.join(__dirname, 'views')));

// Routes for individual HTML pages (optional but explicit)
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'views', 'index.html')));
app.get('/calories.html', (req, res) => res.sendFile(path.join(__dirname, 'views', 'calories.html')));
app.get('/login.html', (req, res) => res.sendFile(path.join(__dirname, 'views', 'login.html')));
app.get('/register.html', (req, res) => res.sendFile(path.join(__dirname, 'views', 'register.html')));
app.get('/profile.html', (req, res) => res.sendFile(path.join(__dirname, 'views', 'profile.html')));
app.get('/tips.html', (req, res) => res.sendFile(path.join(__dirname, 'views', 'tips.html')));
app.get('/main.html', (req, res) => res.sendFile(path.join(__dirname, 'views', 'main.html')));
app.get('/programs.html', (req, res) => res.sendFile(path.join(__dirname, 'views', 'programs.html')));
app.get('/test.html', (req, res) => res.sendFile(path.join(__dirname, 'views', 'test.html')));

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
    console.error('Error fetching token:', error);
    res.status(500).json({ error: 'Failed to fetch token' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
