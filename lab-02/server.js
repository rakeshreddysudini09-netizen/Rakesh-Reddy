/**
 * Backend Development Fundamentals - Lab 02 / Lab 03
 * Student Name: Rakesh Reddy
 * Registration Number: 252U1R8091
 * Section: CSE-QE-2B-S-13
 * College: Aurora
 *
 * File: server.js
 * Description: Express.js server with SQLite database integration.
 *              Lab 3 upgrades: query parameters, search, filtering,
 *              sorting, pagination, enhanced validation, and debugging notes.
 */

// ============================================================
// DEBUGGING NOTE 1 - EADDRINUSE (Port Already in Use)
// ============================================================
// Bug example:   const PORT = 3000; // another process already using 3000
// Fix:           Kill the other process, or use a different PORT number.
// How to find:   On Windows run: netstat -ano | findstr :3000
//                Then kill it:   taskkill /PID <pid> /F
// In this code we use process.env.PORT so you can change it easily.
// ============================================================

// ============================================================
// DEBUGGING NOTE 2 - Wrong require() Path
// ============================================================
// Bug example:   const { open } = require('sqlit3');   // typo in module name
//                const { open } = require('./sqlite');  // wrong local path
// Fix:           Use the exact installed package name: require('sqlite')
//                Check package.json > dependencies to confirm the name.
// ============================================================

// ============================================================
// DEBUGGING NOTE 3 - Wrong Table Name in SQL Query
// ============================================================
// Bug example:   const rows = await db.all('SELECT * FROM book');
//                // Error: no such table: book
// Fix:           Use the exact table name: SELECT * FROM books
//                You can verify table names by running:
//                SELECT name FROM sqlite_master WHERE type='table';
// ============================================================

// ============================================================
// DEBUGGING NOTE 4 - Missing await on Async DB Call
// ============================================================
// Bug example:   const book = db.get('SELECT * FROM books WHERE id = ?', [id]);
//                // book is a Promise object, NOT the actual row data!
// Fix:           Always use await: const book = await db.get(...)
//                Without await, res.json(book) sends a Promise instead of data.
// ============================================================

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

// Database connection reference (set after DB opens successfully)
let db = null;

// Middleware: Parse incoming JSON request bodies
app.use(express.json());

// Middleware: Request and HTTP Status Code Logger
// Logs every request with method, URL, and response status code
app.use((req, res, next) => {
  res.on('finish', () => {
    console.log(
      `[LOG] ${new Date().toLocaleTimeString()} | ${req.method} ${req.originalUrl} -> Status: ${res.statusCode}`
    );
  });
  next();
});

// ============================================================
// ALLOWED VALUES FOR QUERY PARAMETER VALIDATION
// ============================================================

// Whitelist for order_by column names
// IMPORTANT: Column names CANNOT be parameterized with ? in SQLite.
// We use a whitelist to prevent SQL injection for column names.
const ALLOWED_ORDER_BY_COLUMNS = ['id', 'title', 'author', 'price', 'pages'];

// Whitelist for sort direction
const ALLOWED_ORDER_DIRECTIONS = ['ASC', 'DESC'];

// ============================================================
// 10 Sample Books — seeded if database table is empty
// ============================================================
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
 * seedDatabaseIfEmpty()
 * Inserts 10 sample books only when the books table is empty.
 */
async function seedDatabaseIfEmpty() {
  const countResult = await db.get(`SELECT COUNT(*) AS total FROM books;`);
  if (countResult.total === 0) {
    console.log('[DATABASE] Seeding 10 sample book records...');
    const insertSql = `INSERT INTO books (title, author, price, pages) VALUES (?, ?, ?, ?);`;
    for (const book of sampleBooks) {
      await db.run(insertSql, [book.title, book.author, book.price, book.pages]);
    }
    console.log('[DATABASE] 10 sample books inserted successfully.');
  } else {
    console.log(`[DATABASE] Database already contains ${countResult.total} book(s). Skipping seed.`);
  }
}

/**
 * initializeDBAndServer()
 * Opens the SQLite database, creates the books table if it does not exist,
 * seeds 10 sample books if the table is empty, and then starts Express.
 */
const initializeDBAndServer = async () => {
  try {
    // Open connection to the SQLite database file
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });

    console.log(`[DATABASE] Connected successfully to: ${dbPath}`);

    // Create books table if it does not already exist
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS books (
        id     INTEGER PRIMARY KEY AUTOINCREMENT,
        title  TEXT    NOT NULL,
        author TEXT    NOT NULL,
        price  INTEGER NOT NULL,
        pages  INTEGER NOT NULL
      );
    `;
    await db.exec(createTableQuery);
    console.log("[DATABASE] 'books' table is ready.");

    // Seed 10 records if table is empty
    await seedDatabaseIfEmpty();

    // Start the Express server only after DB is ready
    app.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(` BDF Lab 3 - Books API Server Running`);
      console.log(` URL: http://localhost:${PORT}`);
      console.log(` Student: Rakesh Reddy | 252U1R8091`);
      console.log(` Press Ctrl + C to stop.`);
      console.log(`====================================================`);
    });
  } catch (error) {
    console.error(`[DATABASE ERROR] ${error.message}`);
    process.exit(1);
  }
};

// Connect to DB and start server
initializeDBAndServer();

// ============================================================
// API ROUTES
// ============================================================

// -------------------------------------------------------
// Route 0: Welcome / API Info  GET /
// -------------------------------------------------------
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Backend Development Fundamentals - Lab 03 Books API',
    lab: 'Lab 3: REST API, Query Parameters, Validation and Debugging',
    student: {
      name: 'Rakesh Reddy',
      registrationNumber: '252U1R8091',
      section: 'CSE-QE-2B-S-13',
      college: 'Aurora'
    },
    endpoints: [
      {
        method: 'GET',
        path: '/books',
        description: 'Get all books (supports query parameters)',
        queryParams: {
          search_q:  'Search by title keyword (e.g. ?search_q=JavaScript)',
          order_by:  'Sort column: id | title | author | price | pages (default: id)',
          order:     'Sort direction: ASC | DESC (default: ASC)',
          limit:     'Number of results per page (default: 10, max: 100)',
          offset:    'Number of results to skip for pagination (default: 0)',
          min_price: 'Minimum price filter (default: 0)',
          max_price: 'Maximum price filter (default: 999999)'
        }
      },
      { method: 'GET',    path: '/books/:bookId', description: 'Get a single book by ID' },
      { method: 'POST',   path: '/books',         description: 'Add a new book (title, author, price required; pages optional)' },
      { method: 'PUT',    path: '/books/:bookId', description: 'Update a book (title, author, price required; pages optional)' },
      { method: 'DELETE', path: '/books/:bookId', description: 'Delete a book by ID' }
    ]
  });
});

// -------------------------------------------------------
// Route 1: Get all books  GET /books  (Lab 3 upgrade)
//
// Supported Query Parameters:
//   search_q  — filter books where title contains this keyword
//   order_by  — column to sort by (whitelist validated)
//   order     — ASC or DESC
//   limit     — max rows to return (1–100, default 10)
//   offset    — rows to skip for pagination (default 0)
//   min_price — minimum price filter
//   max_price — maximum price filter
// -------------------------------------------------------
app.get('/books', async (req, res) => {
  try {
    // ---- Read and validate query parameters ----

    const search_q  = req.query.search_q  || '';
    const orderBy   = req.query.order_by  || 'id';
    const orderDir  = (req.query.order    || 'ASC').toUpperCase();
    const limitRaw  = req.query.limit     || '10';
    const offsetRaw = req.query.offset    || '0';
    const minPriceRaw = req.query.min_price || '0';
    const maxPriceRaw = req.query.max_price || '999999';

    // Validate order_by against whitelist (column names cannot be parameterized)
    if (!ALLOWED_ORDER_BY_COLUMNS.includes(orderBy)) {
      return res.status(400).json({
        status: 'error',
        statusCode: 400,
        message: `Invalid order_by value: "${orderBy}". Allowed values: ${ALLOWED_ORDER_BY_COLUMNS.join(', ')}.`
      });
    }

    // Validate order direction
    if (!ALLOWED_ORDER_DIRECTIONS.includes(orderDir)) {
      return res.status(400).json({
        status: 'error',
        statusCode: 400,
        message: `Invalid order value: "${req.query.order}". Use ASC or DESC.`
      });
    }

    // Validate limit
    const limit = parseInt(limitRaw, 10);
    if (isNaN(limit) || limit < 1 || limit > 100) {
      return res.status(400).json({
        status: 'error',
        statusCode: 400,
        message: 'Invalid limit value. Must be an integer between 1 and 100.'
      });
    }

    // Validate offset
    const offset = parseInt(offsetRaw, 10);
    if (isNaN(offset) || offset < 0) {
      return res.status(400).json({
        status: 'error',
        statusCode: 400,
        message: 'Invalid offset value. Must be a non-negative integer.'
      });
    }

    // Validate min_price
    const minPrice = parseFloat(minPriceRaw);
    if (isNaN(minPrice) || minPrice < 0) {
      return res.status(400).json({
        status: 'error',
        statusCode: 400,
        message: 'Invalid min_price. Must be a non-negative number.'
      });
    }

    // Validate max_price
    const maxPrice = parseFloat(maxPriceRaw);
    if (isNaN(maxPrice) || maxPrice < 0) {
      return res.status(400).json({
        status: 'error',
        statusCode: 400,
        message: 'Invalid max_price. Must be a non-negative number.'
      });
    }

    // Validate min_price <= max_price
    if (minPrice > maxPrice) {
      return res.status(400).json({
        status: 'error',
        statusCode: 400,
        message: `min_price (${minPrice}) cannot be greater than max_price (${maxPrice}).`
      });
    }

    // ---- Build SQL Query ----
    // NOTE: order_by column name is injected from the WHITELIST (not via ?).
    // All other user inputs go through ? parameterized placeholders.
    const getBooksQuery = `
      SELECT * FROM books
      WHERE title LIKE '%' || ? || '%'
        AND price >= ?
        AND price <= ?
      ORDER BY ${orderBy} ${orderDir}
      LIMIT ? OFFSET ?;
    `;

    const queryParams = [search_q, minPrice, maxPrice, limit, offset];
    const books = await db.all(getBooksQuery, queryParams);

    // Also get total count for pagination info
    const countQuery = `
      SELECT COUNT(*) AS total FROM books
      WHERE title LIKE '%' || ? || '%'
        AND price >= ?
        AND price <= ?;
    `;
    const countResult = await db.get(countQuery, [search_q, minPrice, maxPrice]);
    const totalCount = countResult.total;

    res.status(200).json({
      status: 'success',
      count: books.length,
      total: totalCount,
      pagination: {
        limit,
        offset,
        hasMore: offset + books.length < totalCount
      },
      filters: {
        search_q: search_q || null,
        order_by: orderBy,
        order: orderDir,
        min_price: minPrice,
        max_price: maxPrice === 999999 ? null : maxPrice
      },
      data: books
    });
  } catch (error) {
    console.error(`Error fetching books: ${error.message}`);
    res.status(500).json({
      status: 'error',
      statusCode: 500,
      message: 'Internal server error while fetching books.'
    });
  }
});

// Support trailing slash alias for /books/
app.get('/books/', async (req, res, next) => {
  req.url = '/books';
  next('route');
});

// -------------------------------------------------------
// Route 2: Get a single book by ID  GET /books/:bookId
// -------------------------------------------------------
app.get('/books/:bookId', async (req, res) => {
  try {
    const { bookId } = req.params;

    // Validate bookId is a positive integer
    const parsedId = parseInt(bookId, 10);
    if (isNaN(parsedId) || parsedId <= 0) {
      return res.status(400).json({
        status: 'error',
        statusCode: 400,
        message: 'Invalid bookId. Book ID must be a positive integer.'
      });
    }

    // Parameterized query — ? prevents SQL injection
    const getBookQuery = `SELECT * FROM books WHERE id = ?;`;
    const book = await db.get(getBookQuery, [parsedId]);

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
      message: 'Internal server error while fetching book.'
    });
  }
});

// -------------------------------------------------------
// Route 3: Create a new book  POST /books
//
// Required fields: title (string), author (string), price (number >= 0)
// Optional fields: pages (positive integer)
// -------------------------------------------------------
app.post('/books', async (req, res) => {
  try {
    const { title, author, price, pages } = req.body;

    // --- Validate required fields ---

    // title: must be a non-empty string
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({
        status: 'error',
        statusCode: 400,
        message: 'Missing or invalid field: "title" is required and must be a non-empty string.'
      });
    }

    // author: must be a non-empty string
    if (!author || typeof author !== 'string' || author.trim() === '') {
      return res.status(400).json({
        status: 'error',
        statusCode: 400,
        message: 'Missing or invalid field: "author" is required and must be a non-empty string.'
      });
    }

    // price: required, must be a non-negative number
    if (price === undefined || price === null || price === '') {
      return res.status(400).json({
        status: 'error',
        statusCode: 400,
        message: 'Missing required field: "price" is required.'
      });
    }
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      return res.status(400).json({
        status: 'error',
        statusCode: 400,
        message: 'Invalid field: "price" must be a non-negative number.'
      });
    }

    // --- Validate optional field ---

    // pages: optional, but if provided must be a positive integer
    let parsedPages = null;
    if (pages !== undefined && pages !== null && pages !== '') {
      parsedPages = parseInt(pages, 10);
      if (isNaN(parsedPages) || parsedPages <= 0) {
        return res.status(400).json({
          status: 'error',
          statusCode: 400,
          message: 'Invalid field: "pages" must be a positive integer when provided.'
        });
      }
    }

    // --- Insert into database ---
    let insertBookQuery;
    let insertParams;

    if (parsedPages !== null) {
      // pages was provided
      insertBookQuery = `INSERT INTO books (title, author, price, pages) VALUES (?, ?, ?, ?);`;
      insertParams = [title.trim(), author.trim(), parsedPrice, parsedPages];
    } else {
      // pages not provided — use 0 as default (column is NOT NULL)
      insertBookQuery = `INSERT INTO books (title, author, price, pages) VALUES (?, ?, ?, ?);`;
      insertParams = [title.trim(), author.trim(), parsedPrice, 0];
    }

    const result = await db.run(insertBookQuery, insertParams);
    const newBookId = result.lastID;

    // Fetch the newly created book to return it
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
      message: 'Internal server error while creating book.'
    });
  }
});

// -------------------------------------------------------
// Route 4: Update an existing book  PUT /books/:bookId
//
// Required fields: title, author, price
// Optional fields: pages
// -------------------------------------------------------
app.put('/books/:bookId', async (req, res) => {
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

    // Check if book exists
    const existingBook = await db.get(`SELECT * FROM books WHERE id = ?;`, [parsedId]);
    if (!existingBook) {
      return res.status(404).json({
        status: 'error',
        statusCode: 404,
        message: `Book with ID ${parsedId} not found.`
      });
    }

    // Validate title
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({
        status: 'error',
        statusCode: 400,
        message: 'Missing or invalid field: "title" is required and must be a non-empty string.'
      });
    }

    // Validate author
    if (!author || typeof author !== 'string' || author.trim() === '') {
      return res.status(400).json({
        status: 'error',
        statusCode: 400,
        message: 'Missing or invalid field: "author" is required and must be a non-empty string.'
      });
    }

    // Validate price
    if (price === undefined || price === null || price === '') {
      return res.status(400).json({
        status: 'error',
        statusCode: 400,
        message: 'Missing required field: "price" is required.'
      });
    }
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      return res.status(400).json({
        status: 'error',
        statusCode: 400,
        message: 'Invalid field: "price" must be a non-negative number.'
      });
    }

    // Validate optional pages
    let parsedPages = existingBook.pages; // keep existing value if not provided
    if (pages !== undefined && pages !== null && pages !== '') {
      parsedPages = parseInt(pages, 10);
      if (isNaN(parsedPages) || parsedPages <= 0) {
        return res.status(400).json({
          status: 'error',
          statusCode: 400,
          message: 'Invalid field: "pages" must be a positive integer when provided.'
        });
      }
    }

    // Parameterized update query
    const updateQuery = `
      UPDATE books
      SET title = ?, author = ?, price = ?, pages = ?
      WHERE id = ?;
    `;
    await db.run(updateQuery, [title.trim(), author.trim(), parsedPrice, parsedPages, parsedId]);

    // Return the updated book
    const updatedBook = await db.get(`SELECT * FROM books WHERE id = ?;`, [parsedId]);

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
      message: 'Internal server error while updating book.'
    });
  }
});

// -------------------------------------------------------
// Route 5: Delete a book  DELETE /books/:bookId
// -------------------------------------------------------
app.delete('/books/:bookId', async (req, res) => {
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

    // Check book exists before deletion
    const existingBook = await db.get(`SELECT * FROM books WHERE id = ?;`, [parsedId]);
    if (!existingBook) {
      return res.status(404).json({
        status: 'error',
        statusCode: 404,
        message: `Book with ID ${parsedId} not found.`
      });
    }

    // Parameterized delete query
    await db.run(`DELETE FROM books WHERE id = ?;`, [parsedId]);

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
      message: 'Internal server error while deleting book.'
    });
  }
});

// -------------------------------------------------------
// 404 Handler — catches all undefined routes
// -------------------------------------------------------
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    statusCode: 404,
    message: `Cannot ${req.method} ${req.originalUrl}. Route does not exist.`
  });
});

module.exports = app;
