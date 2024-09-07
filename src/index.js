// index.js

// Import the Express library
const express = require('express');

// Create an instance of the Express application
const app = express();

// Define a port for the server to listen on
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Define a basic route for the root URL
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Define a route for a sample API endpoint
app.get('/api/greet', (req, res) => {
  res.json({ message: 'Greetings from the API!' });
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
