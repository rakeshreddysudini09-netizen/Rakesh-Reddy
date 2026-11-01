/**
 * Backend Development Fundamentals - Lab 02
 * Student Name: Rakesh Reddy
 * Registration Number: 252U1R8091
 * Section: CSE-QE-2B-S-13
 * College: Aurora
 *
 * File: execute-sql.js
 * Description: Executes books.sql script to verify SQLite table creation and data insertion,
 *              simulating the SQLite CLI execution and verifying all 10 records.
 */

const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.join(__dirname, 'books.db');
const sqlFilePath = path.join(__dirname, 'books.sql');

console.log('================================================================');
console.log(' SQLite CLI Script Execution & Verification');
console.log(` Target Database: ${dbPath}`);
console.log(` SQL Source File: ${sqlFilePath}`);
console.log('================================================================');

// Read the SQL script from books.sql
const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');

// Open connection to SQLite database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error(`[ERROR] Failed to open SQLite database: ${err.message}`);
    process.exit(1);
  }
  console.log('[1] Connected to SQLite database successfully.');
});

// Execute the SQL script
db.serialize(() => {
  console.log('[2] Executing SQL statements from books.sql...');

  db.exec(sqlContent, (execErr) => {
    if (execErr) {
      console.error(`[ERROR] Failed to execute SQL script: ${execErr.message}`);
      process.exit(1);
    }
    console.log('[3] All SQL statements executed successfully!');

    // Query and display all records in the table
    console.log('\n[4] Querying "books" table (SELECT * FROM books):');
    console.log('-----------------------------------------------------------------------------------------------------');
    console.log('| ID | Title                                            | Author                     | Price | Pages |');
    console.log('-----------------------------------------------------------------------------------------------------');

    db.all('SELECT * FROM books ORDER BY id ASC;', [], (err, rows) => {
      if (err) {
        console.error(`[ERROR] Failed to query table: ${err.message}`);
        process.exit(1);
      }

      rows.forEach((row) => {
        const id = String(row.id).padEnd(2);
        const title = String(row.title).padEnd(48).substring(0, 48);
        const author = String(row.author).padEnd(26).substring(0, 26);
        const price = `Rs.${row.price}`.padEnd(6);
        const pages = String(row.pages).padEnd(5);
        console.log(`| ${id} | ${title} | ${author} | ${price} | ${pages} |`);
      });

      console.log('-----------------------------------------------------------------------------------------------------');
      console.log(`Total Records Verified: ${rows.length}`);
      console.log('================================================================');

      db.close(() => {
        console.log('Database connection closed safely.');
      });
    });
  });
});
