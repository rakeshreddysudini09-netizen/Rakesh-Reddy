/**
 * Backend Development Fundamentals - Lab 02
 * Student Name: Rakesh Reddy
 * Registration Number: 252U1R8091
 * Section: CSE-QE-2B-S-13
 * College: Aurora
 *
 * File: server.js
 * Description: Express.js server with SQLite database integration.
 *              Implements complete CRUD operations for a 'books' resource
 *              using parameterized queries to prevent SQL injection.
 */

// Step 1: Import required modules
const express = require('express');
const path = require('path');
const { open } = require('sqlite');
const sqlite3 = require('sqlite3');

// Step 2: Initialize Express application
const app = express();

// Step 3: Configure Port and Database File Path
const PORT = process.env.PORT || 3000;
const dbPath = path.join(__dirname, 'books.db');

// Database connection reference
let db = null;

// Middleware: Parse incoming JSON request bodies
app.use(express.json());

// Middleware: Request and HTTP Status Code Logger
app.use((req, res, next) => {
  res.on('finish', () => {
    console.log(
      `[LOG] ${new Date().toLocaleTimeString()} | ${req.method} ${req.originalUrl} -> Status: ${res.statusCode}`
    );
  });
  next();
});

/**
 * 10 Sample Books data to seed into the database on first run
 */
const sampleBooks = [
  { title: 'Clean Code', author: 'Robert C. Martin', price: 650, pages: 464 },
  { title: 'The Pragmatic Programmer', author: 'Andrew Hunt, David Thomas', price: 750, pages: 352 },
  { title: 'JavaScript: The Good Parts', author: 'Douglas Crockford', price: 450, pages: 176 },
  { title: "You Don't Know JS: Scope & Closures", author: 'Kyle Simpson', price: 500, pages: 98 },
  { title: 'Eloquent JavaScript', author: 'Marijn Haverbeke', price: 600, pages: 472 },
  { title: 'Design Patterns', author: 'Erich Gamma et al.', price: 850, pages: 395 },
  { title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', price: 1200, pages: 1312 },
  { title: 'Node.js Design Patterns', author: 'Mario Casciaro, Luciano Mammino', price: 900, pages: 660 },
  { title: 'Cracking the Coding Interview', author: 'Gayle Laakmann McDowell', price: 800, pages: 708 },
  { title: 'Refactoring', author: 'Martin Fowler', price: 700, pages: 448 }
];

/**
 * Helper function to seed 10 sample books if table is empty
 */
async function seedDatabaseIfEmpty() {
  const countResult = await db.get(`SELECT COUNT(*) AS total FROM books;`);
  if (countResult.total === 0) {
    console.log('[DATABASE] Seeding 10 sample book records...');
    const insertSql = `
      INSERT INTO books (title, author, price, pages)
      VALUES (?, ?, ?, ?);
    `;
    for (const book of sampleBooks) {
      await db.run(insertSql, [book.title, book.author, book.price, book.pages]);
    }
    console.log('[DATABASE] 10 sample books inserted successfully.');
  } else {
    console.log(`[DATABASE] Database already contains ${countResult.total} book(s).`);
  }
}

/**
 * Step 4: initializeDBAndServer()
 * Connects to the SQLite database, creates table if needed, seeds data,
 * and only starts the Express server if the DB connection succeeds.
 */
const initializeDBAndServer = async () => {
  try {
    // Open connection to SQLite database
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });

    console.log(`[DATABASE] Connected successfully to SQLite database: ${dbPath}`);

    // Create the 'books' table if it does not already exist
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        price INTEGER NOT NULL,
        pages INTEGER NOT NULL
      );
    `;
    await db.exec(createTableQuery);
    console.log("[DATABASE] 'books' table verified / created.");

    // Seed 10 initial records if table is empty
    await seedDatabaseIfEmpty();

    // Start Express server after database connection is ready
    app.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(` Books CRUD API Server running!`);
      console.log(` Access URL: http://localhost:${PORT}`);
      console.log(` Press Ctrl + C to stop the server.`);
      console.log(`====================================================`);
    });
  } catch (error) {
    console.error(`[DATABASE ERROR] Failed to initialize DB or Server: ${error.message}`);
    process.exit(1);
  }
};

// Start DB connection and Express Server
initializeDBAndServer();

// ==========================================
// API ROUTES
// ==========================================

// Route 0: Welcome / API Information (GET /)
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Backend Development Fundamentals - Lab 02 Books CRUD API',
    student: {
      name: 'Rakesh Reddy',
      registrationNumber: '252U1R8091',
      section: 'CSE-QE-2B-S-13',
      college: 'Aurora'
    },
    endpoints: [
      { method: 'GET', path: '/books/', description: 'Get all books' },
      { method: 'GET', path: '/books/:bookId/', description: 'Get single book by ID' },
      { method: 'POST', path: '/books/', description: 'Add a new book' },
      { method: 'PUT', path: '/books/:bookId/', description: 'Update an existing book' },
      { method: 'DELETE', path: '/books/:bookId/', description: 'Delete a book by ID' }
    ]
  });
});

// Route 1: Get all books (GET /books/)
app.get('/books/', async (req, res) => {
  try {
    const getBooksQuery = `SELECT * FROM books ORDER BY id ASC;`;
    const books = await db.all(getBooksQuery);
    res.status(200).json({
      status: 'success',
      count: books.length,
      data: books
    });
  } catch (error) {
    console.error(`Error fetching books: ${error.message}`);
    res.status(500).json({
      status: 'error',
      statusCode: 500,
      message: 'Internal server error while fetching books'
    });
  }
});

// Route 2: Get a single book by ID (GET /books/:bookId/)
app.get('/books/:bookId/', async (req, res) => {
  try {
    const { bookId } = req.params;

    // Validate that bookId is a positive integer
    const parsedId = parseInt(bookId, 10);
    if (isNaN(parsedId) || parsedId <= 0) {
      return res.status(400).json({
        status: 'error',
        statusCode: 400,
        message: 'Invalid bookId. Book ID must be a positive integer.'
      });
    }

    // Parameterized SQL query using ? placeholder
    const getBookQuery = `SELECT * FROM books WHERE id = ?;`;
    const book = await db.get(getBookQuery, [parsedId]);

    // Check if book exists
    if (!book) {
      return res.status(404).json({
        status: 'error',
        statusCode: 404,
        message: `Book with ID ${parsedId} not found.`
      });
    }

    res.status(200).json({
      status: 'success',
      data: book
    });
  } catch (error) {
    console.error(`Error fetching book: ${error.message}`);
    res.status(500).json({
      status: 'error',
      statusCode: 500,
      message: 'Internal server error while fetching book'
    });
  }
});

// Route 3: Create a new book (POST /books/)
app.post('/books/', async (req, res) => {
  try {
    const { title, author, price, pages } = req.body;

    // Input validation
    if (!title || !author || price === undefined || pages === undefined) {
      return res.status(400).json({
        status: 'error',
        statusCode: 400,
        message: 'Missing required fields. Please provide title, author, price, and pages.'
      });
    }

    const parsedPrice = parseInt(price, 10);
    const parsedPages = parseInt(pages, 10);

    if (isNaN(parsedPrice) || parsedPrice < 0 || isNaN(parsedPages) || parsedPages <= 0) {
      return res.status(400).json({
        status: 'error',
        statusCode: 400,
        message: 'Price must be a non-negative number and pages must be a positive integer.'
      });
    }

    // Parameterized SQL query to prevent SQL injection
    const insertBookQuery = `
      INSERT INTO books (title, author, price, pages)
      VALUES (?, ?, ?, ?);
    `;
    const result = await db.run(insertBookQuery, [
      title.trim(),
      author.trim(),
      parsedPrice,
      parsedPages
    ]);

    const newBookId = result.lastID;

    // Fetch the newly created book
    const createdBook = await db.get(`SELECT * FROM books WHERE id = ?;`, [newBookId]);

    res.status(201).json({
      status: 'success',
      statusCode: 201,
      message: 'Book created successfully.',
      data: createdBook
    });
  } catch (error) {
    console.error(`Error adding book: ${error.message}`);
    res.status(500).json({
      status: 'error',
      statusCode: 500,
      message: 'Internal server error while creating book'
    });
  }
});

// Route 4: Update an existing book (PUT /books/:bookId/)
app.put('/books/:bookId/', async (req, res) => {
  try {
    const { bookId } = req.params;
    const { title, author, price, pages } = req.body;

    // Validate bookId
    const parsedId = parseInt(bookId, 10);
    if (isNaN(parsedId) || parsedId <= 0) {
      return res.status(400).json({
        status: 'error',
        statusCode: 400,
        message: 'Invalid bookId. Book ID must be a positive integer.'
      });
    }

    // Check if the book exists first
    const checkQuery = `SELECT * FROM books WHERE id = ?;`;
    const existingBook = await db.get(checkQuery, [parsedId]);

    if (!existingBook) {
      return res.status(404).json({
        status: 'error',
        statusCode: 404,
        message: `Book with ID ${parsedId} not found.`
      });
    }

    // Validate fields provided in request body
    if (!title || !author || price === undefined || pages === undefined) {
      return res.status(400).json({
        status: 'error',
        statusCode: 400,
        message: 'All fields (title, author, price, pages) are required for update.'
      });
    }

    const parsedPrice = parseInt(price, 10);
    const parsedPages = parseInt(pages, 10);

    if (isNaN(parsedPrice) || parsedPrice < 0 || isNaN(parsedPages) || parsedPages <= 0) {
      return res.status(400).json({
        status: 'error',
        statusCode: 400,
        message: 'Price must be a non-negative number and pages must be a positive integer.'
      });
    }

    // Parameterized SQL query for update
    const updateQuery = `
      UPDATE books
      SET title = ?, author = ?, price = ?, pages = ?
      WHERE id = ?;
    `;
    await db.run(updateQuery, [
      title.trim(),
      author.trim(),
      parsedPrice,
      parsedPages,
      parsedId
    ]);

    // Fetch the updated book from the database to confirm change
    const updatedBook = await db.get(checkQuery, [parsedId]);

    res.status(200).json({
      status: 'success',
      statusCode: 200,
      message: `Book with ID ${parsedId} updated successfully.`,
      data: updatedBook
    });
  } catch (error) {
    console.error(`Error updating book: ${error.message}`);
    res.status(500).json({
      status: 'error',
      statusCode: 500,
      message: 'Internal server error while updating book'
    });
  }
});

// Route 5: Delete a book by ID (DELETE /books/:bookId/)
app.delete('/books/:bookId/', async (req, res) => {
  try {
    const { bookId } = req.params;

    // Validate bookId
    const parsedId = parseInt(bookId, 10);
    if (isNaN(parsedId) || parsedId <= 0) {
      return res.status(400).json({
        status: 'error',
        statusCode: 400,
        message: 'Invalid bookId. Book ID must be a positive integer.'
      });
    }

    // Check if the book exists before attempting deletion
    const checkQuery = `SELECT * FROM books WHERE id = ?;`;
    const existingBook = await db.get(checkQuery, [parsedId]);

    if (!existingBook) {
      return res.status(404).json({
        status: 'error',
        statusCode: 404,
        message: `Book with ID ${parsedId} not found.`
      });
    }

    // Parameterized SQL query for deletion
    const deleteQuery = `DELETE FROM books WHERE id = ?;`;
    await db.run(deleteQuery, [parsedId]);

    res.status(200).json({
      status: 'success',
      statusCode: 200,
      message: `Book with ID ${parsedId} deleted successfully.`,
      deletedBook: existingBook
    });
  } catch (error) {
    console.error(`Error deleting book: ${error.message}`);
    res.status(500).json({
      status: 'error',
      statusCode: 500,
      message: 'Internal server error while deleting book'
    });
  }
});

// 404 Handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    statusCode: 404,
    message: `Cannot ${req.method} ${req.originalUrl}. Route does not exist.`
  });
});

module.exports = app;
