/**
 * Backend Development Fundamentals - Lab 01
 * Student Name: Rakesh Reddy
 * Registration Number: 252U1R8091
 * Section: CSE-QE-2B-S-13
 * College: Aurora
 *
 * File: server.js
 * Description: Express.js server implementing custom REST endpoints,
 *              HTTP status code logging, and 404 handling.
 */

// Step 1: Import the Express framework
const express = require('express');

// Step 2: Initialize the Express application
const app = express();

// Step 3: Define the port number
const PORT = 3000;

// Middleware 1: Built-in middleware to parse incoming JSON payloads
app.use(express.json());

// Middleware 2: Status Code Logger Middleware
// This middleware logs the HTTP method, request path, and the resulting response status code
app.use((req, res, next) => {
  // Capture response finish event to log the final status code sent to the client
  res.on('finish', () => {
    console.log(
      `[LOG] ${new Date().toLocaleTimeString()} | Method: ${req.method} | Path: ${req.originalUrl} | Status Code: ${res.statusCode}`
    );
  });
  next();
});

// Route 1: Root route (GET /)
// Returns a welcome message and links to available routes
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to Backend Development Fundamentals - Lab 01 Express Server',
    availableRoutes: {
      root: 'GET /',
      about: 'GET /about',
      time: 'GET /time'
    }
  });
});

// Route 2: Student details route (GET /about)
// Returns student details in JSON format as required by the lab specification
app.get('/about', (req, res) => {
  res.status(200).json({
    name: 'Rakesh Reddy',
    section: 'CSE-QE-2B-S-13',
    registrationNumber: '252U1R8091',
    college: 'Aurora'
  });
});

// Route 3: Current date and time route (GET /time)
// Uses JavaScript's new Date() object to get and return the current system date and time
app.get('/time', (req, res) => {
  const now = new Date();
  res.status(200).json({
    currentTime: now.toString(),
    isoString: now.toISOString(),
    epochMilliseconds: now.getTime(),
    localDate: now.toLocaleDateString(),
    localTime: now.toLocaleTimeString()
  });
});

// Step 4: 404 Handler Middleware for any unregistered / unknown routes
// This must be placed after all defined route handlers
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    statusCode: 404,
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.originalUrl}. The requested route does not exist.`
  });
});

// Step 5: Start the Express server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` Express Server running successfully!`);
  console.log(` Access URL: http://localhost:${PORT}`);
  console.log(` Press Ctrl + C to stop the server.`);
  console.log(`====================================================`);
});
