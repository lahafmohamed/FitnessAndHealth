const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve all .html files from the 'views' directory directly
app.use('/', express.static(path.join(__dirname, 'views')));

// Google Generative AI credentials
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// --- Chatbot Route ---

// Route for chatbot
app.post('/chat', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const chat = model.startChat({
      history: [],
      generationConfig: {
        maxOutputTokens: 500,
      },
    });

    const response = await chat.sendMessage(message);
    const reply = response.response.candidates[0].content.parts[0].text;

    res.json({ reply });
  } catch (error) {
    console.error('Error processing chat message:', error.message);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

// --- Static HTML Routes ---

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
  'weight',
  'chat',
  'yogaBeginner',
];

htmlPages.forEach((page) => {
  app.get(`/${page}.html`, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', `${page}.html`));
  });
});

// --- Default Fallback for Unknown Routes ---

app.use((req, res) => {
  res.status(404).send('Page Not Found');
});

// --- Start Server ---

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
