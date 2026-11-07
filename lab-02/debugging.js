/**
 * Backend Development Fundamentals - Lab 03
 * Student Name: Rakesh Reddy
 * Registration Number: 252U1R8091
 * Section: CSE-QE-2B-S-13
 * College: Aurora
 *
 * File: debugging.js
 * Description: Demonstrates 4 common Node.js / Express / SQLite bugs
 *              and their fixes. This file is for learning purposes only.
 *              It does NOT start an actual server.
 */

console.log('='.repeat(60));
console.log(' BDF Lab 3 - Debugging Exercises');
console.log(' Student: Rakesh Reddy | 252U1R8091');
console.log('='.repeat(60));

// ============================================================
// BUG 1: EADDRINUSE - Port Already in Use
// ============================================================
console.log('\n--- Bug 1: EADDRINUSE (Port Already in Use) ---');
console.log(`
PROBLEM:
  When you try to start the server, you get:
  Error: listen EADDRINUSE: address already in use :::3000

  This happens when another process (or a previous run of your
  server) is already listening on port 3000.

BUGGY CODE:
  app.listen(3000, () => console.log('Server running'));
  // If port 3000 is busy -> EADDRINUSE crash

FIX:
  Option 1 - Use an environment variable for the port:
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, ...);

  Option 2 - Kill the existing process (Windows):
    netstat -ano | findstr :3000
    taskkill /PID <PID_NUMBER> /F

  Option 3 - Use a different port:
    app.listen(4000, ...);

WHY THIS MATTERS:
  Using process.env.PORT lets you change the port without
  editing code — just set the PORT environment variable.
`);

// ============================================================
// BUG 2: Wrong require() Path / Module Name
// ============================================================
console.log('--- Bug 2: Wrong require() Path or Module Name ---');
console.log(`
PROBLEM:
  The server crashes immediately at startup with:
  Error: Cannot find module 'sqlit3'
  or
  Error: Cannot find module './sqlite'

BUGGY CODE:
  const { open } = require('sqlit3');    // typo: missing 'e'
  const { open } = require('./sqlite');  // wrong: local path, not installed package
  const sqlite3 = require('Sqlite3');    // wrong case on some systems

FIX:
  Use the exact package name as listed in package.json:
  const { open }  = require('sqlite');   // correct
  const sqlite3   = require('sqlite3');  // correct

HOW TO CHECK:
  1. Open package.json and look at "dependencies"
  2. Make sure you ran: npm install
  3. Check node_modules folder for the package folder name
`);

// ============================================================
// BUG 3: Wrong Table Name in SQL Query
// ============================================================
console.log('--- Bug 3: Wrong Table Name in SQL Query ---');
console.log(`
PROBLEM:
  An API request returns a 500 error with:
  Error: SQLITE_ERROR: no such table: book

BUGGY CODE:
  // Table was created as 'books' but query uses 'book' (missing 's')
  const rows = await db.all('SELECT * FROM book');

  // Another example: wrong name entirely
  const rows = await db.all('SELECT * FROM Books'); // case matters in some DBs

FIX:
  Use the exact table name from your CREATE TABLE statement:
  const rows = await db.all('SELECT * FROM books'); // correct

HOW TO VERIFY TABLE NAMES:
  Run this SQL to list all tables in the database:
  SELECT name FROM sqlite_master WHERE type='table';

  Or open books.db with DB Browser for SQLite and
  check the "Database Structure" tab.
`);

// ============================================================
// BUG 4: Missing await on Async Database Call
// ============================================================
console.log('--- Bug 4: Missing await on Async DB Call ---');
console.log(`
PROBLEM:
  The API returns an empty response, null, or a weird object
  like { _promise: [Promise] } instead of actual book data.

BUGGY CODE:
  // Forgot to write 'await' before db.get()
  const book = db.get('SELECT * FROM books WHERE id = ?', [id]);
  // 'book' is now a Promise object, NOT the actual row!
  res.json({ data: book }); // sends Promise, not data

ANOTHER EXAMPLE:
  const books = db.all('SELECT * FROM books');
  // 'books' is a Promise, not an array
  console.log(books.length); // undefined — Promises don't have .length

FIX:
  Always use await when calling async database methods:
  const book  = await db.get('SELECT * FROM books WHERE id = ?', [id]);
  const books = await db.all('SELECT * FROM books');

RULE OF THUMB:
  Any function that returns a Promise must be awaited.
  In this project, all db.get(), db.all(), db.run(), db.exec()
  calls are async and MUST be awaited.
`);

console.log('='.repeat(60));
console.log(' Debugging exercises complete.');
console.log(' These 4 bugs are the most common mistakes in Lab 3.');
console.log('='.repeat(60));
