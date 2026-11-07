# Backend Development Fundamentals - Laboratory Assignments

### Student Profile
- **Student Name:** Rakesh Reddy
- **Registration Number:** 252U1R8091
- **Section:** CSE-QE-2B-S-13
- **College:** Aurora
- **GitHub Repository:** [https://github.com/rakeshreddysudini09-netizen/Rakesh-Reddy](https://github.com/rakeshreddysudini09-netizen/Rakesh-Reddy)

---

## Repository Structure

```text
BDF LAB/
├── .gitignore            # Git ignore file for dependencies and environments
├── README.md             # Root repository documentation
├── lab-01/               # Lab 01: Node.js HTTP & Express.js REST API
│   ├── screenshots/      # Screenshots directory for Lab 01 outputs
│   ├── package.json      # Lab 01 package configuration
│   ├── server-http.js    # Built-in Node.js HTTP server (port 3000)
│   ├── server.js         # Express server with routes, 404, & status logger
│   └── README.md         # Detailed Lab 01 documentation & viva prep
└── lab-02/               # Lab 02 & Lab 03: SQLite CRUD REST API, Query Parameters, Validation & Debugging
    ├── screenshots/      # Screenshots directory for Lab 02 / Lab 03 outputs
    ├── package.json      # Package configuration and dependencies
    ├── server.js         # Express + SQLite CRUD server with Query Parameters & Validation
    ├── debugging.js      # 4 common backend debugging exercises & fixes
    ├── lab3-postman-collection.json # 28 automated test cases for Postman
    ├── books.db          # Embedded SQLite database
    ├── books.sql         # Database schema & initial seed scripts
    ├── execute-sql.js    # Direct SQLite CLI script runner
    └── README.md         # Comprehensive Lab 02 & Lab 03 documentation
```

---

## Lab Summaries

### [Lab 01: Node.js and Express Server](./lab-01/)
- **Native HTTP Server:** Created with `http.createServer()` returning `"Hello"`.
- **Express Server:**
  - `GET /` -> Welcome message and route directory.
  - `GET /about` -> Student details (`Name`, `Section`, `Registration Number`, `College`) in JSON.
  - `GET /time` -> Current system date and time using `new Date()`.
  - Fallback 404 handler for unregistered endpoints.
  - Status code logging middleware.

### [Lab 02 & Lab 03: SQLite Database, Query Parameters, Validation and Debugging](./lab-02/)
- **SQLite Database:** Local embedded database `books.db` with `books` table:
  - Columns: `id` (PK AUTOINCREMENT), `title`, `author`, `price`, `pages`.
  - Automatically seeded with 10 sample books on first launch.
- **Asynchronous Startup:** `initializeDBAndServer()` ensures DB connection before starting Express.
- **CRUD Endpoints:**
  - `GET /books` -> Retrieve books with query parameters (search, filter, sort, paginate).
  - `GET /books/:bookId` -> Retrieve single book by ID.
  - `POST /books` -> Insert a new book (`pages` is optional).
  - `PUT /books/:bookId` -> Update an existing book.
  - `DELETE /books/:bookId` -> Remove a book by ID.
- **Lab 3 Query Parameters (`GET /books`):**
  - `search_q` (title keyword search)
  - `order_by` (sort column: id, title, author, price, pages)
  - `order` (ASC or DESC)
  - `limit` & `offset` (pagination)
  - `min_price` & `max_price` (price range filtering)
- **Validation & Security:** Whitelisted sort columns, sanitized parameterized queries (`?`), strict type checks.
- **Debugging Module:** `debugging.js` covering EADDRINUSE, bad require paths, table name mismatches, and unawaited async promises.
- **Postman Collection:** `lab3-postman-collection.json` containing 28 test cases.

---

## Quick Start Guide

### Lab 01
```bash
cd "lab-01"
npm install
node server-http.js    # Runs native HTTP server at http://localhost:3000
# or
node server.js         # Runs Express server at http://localhost:3000
```

### Lab 02 & Lab 03
```bash
cd "lab-02"
npm install
node server.js         # Starts DB and Express CRUD API at http://localhost:3000
node debugging.js      # Runs the 4 debugging exercises
```
