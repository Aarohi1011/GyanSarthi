// Import the http module
const http = require("http");

// Define the port
const port = 3000;

// Create the server
const server = http.createServer((req, res) => {
  res.statusCode = 200;  // success code
  res.setHeader("Content-Type", "text/plain");
  res.end("Hello, this is my girlfriend server 🚀");
});

// Start the server
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
