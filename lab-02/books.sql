-- ======================================================================
-- Backend Development Fundamentals - Lab 02
-- Student Name: Rakesh Reddy
-- Registration Number: 252U1R8091
-- Section: CSE-QE-2B-S-13
-- College: Aurora
--
-- File: books.sql
-- Description: SQLite CLI script for table creation and sample data insertion.
--
-- How to execute via SQLite CLI:
--   sqlite3 books.db < books.sql
-- or via Node.js SQLite runner:
--   node execute-sql.js
-- ======================================================================

-- 1. Create the 'books' table with appropriate columns and constraints
CREATE TABLE IF NOT EXISTS books (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  price INTEGER NOT NULL,
  pages INTEGER NOT NULL
);

-- 2. Clear table and reset autoincrement sequence for clean seeding
DELETE FROM books;
DELETE FROM sqlite_sequence WHERE name = 'books';

-- 3. Insert the 10 initial sample book records with explicit IDs (1 to 10)
INSERT INTO books (id, title, author, price, pages) VALUES (1, 'Clean Code', 'Robert C. Martin', 650, 464);
INSERT INTO books (id, title, author, price, pages) VALUES (2, 'The Pragmatic Programmer', 'Andrew Hunt, David Thomas', 750, 352);
INSERT INTO books (id, title, author, price, pages) VALUES (3, 'JavaScript: The Good Parts', 'Douglas Crockford', 450, 176);
INSERT INTO books (id, title, author, price, pages) VALUES (4, 'You Don''t Know JS: Scope & Closures', 'Kyle Simpson', 500, 98);
INSERT INTO books (id, title, author, price, pages) VALUES (5, 'Eloquent JavaScript', 'Marijn Haverbeke', 600, 472);
INSERT INTO books (id, title, author, price, pages) VALUES (6, 'Design Patterns', 'Erich Gamma et al.', 850, 395);
INSERT INTO books (id, title, author, price, pages) VALUES (7, 'Introduction to Algorithms', 'Thomas H. Cormen', 1200, 1312);
INSERT INTO books (id, title, author, price, pages) VALUES (8, 'Node.js Design Patterns', 'Mario Casciaro, Luciano Mammino', 900, 660);
INSERT INTO books (id, title, author, price, pages) VALUES (9, 'Cracking the Coding Interview', 'Gayle Laakmann McDowell', 800, 708);
INSERT INTO books (id, title, author, price, pages) VALUES (10, 'Refactoring', 'Martin Fowler', 700, 448);
