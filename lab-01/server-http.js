/**
 * Backend Development Fundamentals - Lab 01
 * Student Name: Rakesh Reddy
 * Registration Number: 252U1R8091
 * Section: CSE-QE-2B-S-13
 * College: Aurora
 *
 * File: server-http.js
 * Description: Basic HTTP server built using Node.js built-in 'http' module.
 */

// Step 1: Import the built-in 'http' module from Node.js
const http = require('http');

// Step 2: Define the port number where the server will listen
const PORT = 3000;

// Step 3: Create the HTTP server using http.createServer()
// The callback function is invoked every time a request hits the server.
// 'req' (Request) represents the incoming client request.
// 'res' (Response) represents the outgoing server response.
const server = http.createServer((req, res) => {
  // Log the incoming request method and URL to the terminal
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} request received for: ${req.url}`);

  // Set the HTTP response status code to 200 (OK)
  res.statusCode = 200;

  // Set the Content-Type response header to plain text
  res.setHeader('Content-Type', 'text/plain');

  // Send the response body and finish the response
  res.end('Hello');
});

// Step 4: Start the server and listen for incoming connections on port 3000
server.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` HTTP Server running successfully!`);
  console.log(` Access URL: http://localhost:${PORT}`);
  console.log(` Press Ctrl + C to stop the server.`);
  console.log(`====================================================`);
});
