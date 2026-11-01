# Backend Development Fundamentals - Lab 01
## Node.js HTTP Server & Express.js REST API

### Student Information
- **Student Name:** Rakesh Reddy
- **Registration Number:** 252U1R8091
- **Section:** CSE-QE-2B-S-13
- **College:** Aurora
- **GitHub Repository:** [https://github.com/rakeshreddysudini09-netizen/Rakesh-Reddy](https://github.com/rakeshreddysudini09-netizen/Rakesh-Reddy)

---

## 1. Overview and Objectives
In this laboratory assignment, we explore the core building blocks of Node.js backend development:
1. Initializing and configuring a Node.js project using `package.json`.
2. Building a foundational HTTP server using Node.js's native `http` module (`server-http.js`).
3. Transitioning to **Express.js**, an industry-standard minimalist web framework, to create maintainable and scalable REST routes (`server.js`).
4. Implementing status code logging middleware.
5. Handling 404 (Not Found) errors gracefully for undefined routes.

---

## 2. Explanation of `package.json` Fields

The `package.json` file is the manifest of any Node.js project. It holds metadata about the project, scripts to run tasks, and a list of dependencies. Here is the explanation of each key field used in this lab:

| Field | Description | Example in this project |
| :--- | :--- | :--- |
| **`name`** | The unique identifier or package name of the project. Must be lowercase and URL-safe. | `"lab-01-node-express"` |
| **`version`** | The current release version of the project following Semantic Versioning (SemVer: `MAJOR.MINOR.PATCH`). | `"1.0.0"` |
| **`description`** | A brief explanation of the project's purpose, helping developers quickly understand what the package does. | `"Backend Development Fundamentals Lab 01..."` |
| **`main`** | The entry point of the application. When someone requires or imports this module, this file is loaded. | `"server.js"` |
| **`scripts`** | A dictionary of command shortcuts executed via `npm run <script-name>`. For instance, `"start"` runs `node server.js`. | `{"start": "node server.js", ...}` |
| **`keywords`** | An array of keywords that categorize and index the project for searchability. | `["nodejs", "express", "backend"]` |
| **`author`** | The creator or maintainer of the project. Contains the student's name, ID, and section. | `"Rakesh Reddy (252U1R8091)"` |
| **`license`** | The legal license governing how the code may be used, modified, and distributed. | `"ISC"` |
| **`dependencies`** | Packages required for the application to function in production (e.g., `express`). | `{"express": "^4.19.2"}` |

---

## 3. Project Structure

```text
lab-01/
├── node_modules/         # Third-party packages (ignored by git)
├── screenshots/          # Evidence screenshots of terminal and browser/Postman
│   └── README.md         # Guide on what screenshots to take
├── package.json          # Project manifest and dependency declarations
├── package-lock.json     # Exact dependency lockfile
├── server-http.js        # Native Node.js HTTP server (port 3000)
├── server.js             # Express.js server with routes and middleware (port 3000)
└── README.md             # Complete lab documentation and viva notes
```

---

## 4. Installation and Setup Instructions

### Step 1: Open Terminal in `lab-01`
Navigate into the `lab-01` folder:
```bash
cd "lab-01"
```

### Step 2: Install Dependencies
Run the npm install command to download Express:
```bash
npm install
```
*(This creates the `node_modules` directory and `package-lock.json`.)*

---

## 5. Execution Instructions

### A. Running the Native HTTP Server (`server-http.js`)
To run the server created using Node.js's native `http.createServer()`:
```bash
node server-http.js
```
*or using npm script:*
```bash
npm run start:http
```

- **Port:** `3000`
- **URL:** `http://localhost:3000/`
- **Output:** Returns plain text: `Hello`

---

### B. Running the Express.js Server (`server.js`)
To run the Express server:
```bash
node server.js
```
*or using npm script:*
```bash
npm start
```

- **Port:** `3000`
- **URL:** `http://localhost:3000/`

---

## 6. Endpoints Specification and Testing

### 1. `GET /`
- **Description:** Root route welcoming the user and listing available endpoints.
- **HTTP Status Code:** `200 OK`
- **Response Format:** JSON
- **Sample Output:**
```json
{
  "status": "success",
  "message": "Welcome to Backend Development Fundamentals - Lab 01 Express Server",
  "availableRoutes": {
    "root": "GET /",
    "about": "GET /about",
    "time": "GET /time"
  }
}
```

---

### 2. `GET /about`
- **Description:** Returns the student's profile details.
- **HTTP Status Code:** `200 OK`
- **Response Format:** JSON
- **Sample Output:**
```json
{
  "name": "Rakesh Reddy",
  "section": "CSE-QE-2B-S-13",
  "registrationNumber": "252U1R8091",
  "college": "Aurora"
}
```

---

### 3. `GET /time`
- **Description:** Returns the current date and time using JavaScript's `new Date()` object.
- **HTTP Status Code:** `200 OK`
- **Response Format:** JSON
- **Sample Output:**
```json
{
  "currentTime": "Sun Nov 01 2026 18:40:00 GMT+0530 (India Standard Time)",
  "isoString": "2026-11-01T13:10:00.000Z",
  "epochMilliseconds": 1793538600000,
  "localDate": "1/11/2026",
  "localTime": "6:40:00 pm"
}
```

---

### 4. `GET /invalid-route` (404 Error Handling)
- **Description:** Any route that is not explicitly registered triggers the fallback 404 middleware.
- **HTTP Status Code:** `404 Not Found`
- **Response Format:** JSON
- **Sample Output:**
```json
{
  "status": "error",
  "statusCode": 404,
  "error": "Not Found",
  "message": "Cannot GET /invalid-route. The requested route does not exist."
}
```

---

## 7. Status Code Logging Mechanism

The application includes a custom logging middleware:
```javascript
app.use((req, res, next) => {
  res.on('finish', () => {
    console.log(
      `[LOG] ${new Date().toLocaleTimeString()} | Method: ${req.method} | Path: ${req.originalUrl} | Status Code: ${res.statusCode}`
    );
  });
  next();
});
```
When requests are made, the server console prints:
```text
[LOG] 6:40:15 pm | Method: GET | Path: / | Status Code: 200
[LOG] 6:40:22 pm | Method: GET | Path: /about | Status Code: 200
[LOG] 6:40:29 pm | Method: GET | Path: /time | Status Code: 200
[LOG] 6:40:35 pm | Method: GET | Path: /random-test | Status Code: 404
```

---

## 8. How to Capture Required Screenshots

Save screenshots in the `lab-01/screenshots/` folder with these recommended names:

1. `01-http-server-terminal.png`: Terminal showing `node server-http.js` running.
2. `02-http-server-browser.png`: Browser window at `http://localhost:3000/` showing "Hello".
3. `03-express-root.png`: Browser/Postman showing `GET http://localhost:3000/`.
4. `04-express-about.png`: Browser/Postman showing `GET http://localhost:3000/about` with student details.
5. `05-express-time.png`: Browser/Postman showing `GET http://localhost:3000/time` with current timestamp.
6. `06-express-404.png`: Browser/Postman showing `GET http://localhost:3000/invalid-url` with 404 status.
7. `07-express-terminal-logs.png`: Terminal output displaying the status code logs for each request.

---

## 9. Viva Preparation Notes (Frequently Asked Questions)

1. **Why do we need Express if Node.js has a built-in `http` module?**
   - The built-in `http` module is low-level. Handling route parameters, parsing request bodies, setting headers, and organizing middleware manually requires a lot of repetitive boilerplate code. Express simplifies this with intuitive routing, middleware support, and helper methods like `res.json()`.

2. **What does `res.on('finish', callback)` do?**
   - The `'finish'` event is emitted by Node's HTTP response stream after the response headers and body have been fully transmitted to the client. This allows us to accurately capture and log the final `res.statusCode`.

3. **Why must the 404 middleware be placed at the end?**
   - In Express, middleware functions are executed sequentially in the order they are defined. If the 404 handler were placed at the top, it would catch and terminate every request before it reached any route handler.
