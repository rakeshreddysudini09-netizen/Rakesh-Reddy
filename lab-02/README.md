# BDF Lab 3 – REST API, Query Parameters, Validation and Debugging

## 1. Project Title

BDF Lab 3 – REST API, Query Parameters, Validation and Debugging

## 2. Student and Course Details

- Student Name: Rakesh Reddy
- Registration Number: 252U1R8091
- Section: CSE-QE-2B-S-13
- College: Aurora deemed to be university
- Course: Backend Development Fundamentals
- GitHub Repository: [Rakesh-Reddy](https://github.com/rakeshreddysudini09-netizen/Rakesh-Reddy)

## 3. Project Overview

This project is a Node.js and Express-based backend application that manages a SQLite database of books. It extends the basic CRUD functionality from the earlier lab by adding query parameters, input validation, pagination, filtering, sorting, debugging explanations, and API testing through Postman.

The application exposes REST API endpoints for retrieving, creating, updating, and deleting book records. It also demonstrates secure query-building practices, validation against invalid input, and proper HTTP status handling.

## 4. Objectives of Lab 3

The main objectives of this lab were to:

- Build and test a REST API using Express.js
- Work with a SQLite database for persistent data storage
- Implement `GET` query parameters for search, sorting, filtering, and pagination
- Validate user input for required and optional fields
- Handle correct HTTP status responses for success and error conditions
- Debug common backend issues related to server ports, module imports, database errors, and async queries
- Test the API using Postman and document the outcomes clearly

## 5. Technologies Used

- Node.js
- Express.js
- SQLite database
- JavaScript
- Postman for API testing
- npm for dependency management

## 6. Project Folder Structure

```text
lab-02/
├── books.db
├── books.sql
├── debugging.js
├── execute-sql.js
├── lab3-postman-collection.json
├── package-lock.json
├── package.json
├── README.md
├── server.js
└── screenshots/
    ├── 01-get-all-books.png
    ├── 02-search-books.png
    ├── 03-get-single-book.png
    ├── 04-sort-books.png
    ├── 05-pagination.png
    ├── 06-price-filter.png
    ├── 07-combined-query.png
    ├── 08-invalid-query.png
    ├── 09-invalid-limit.png
    ├── 10-created-book-verification.png
    ├── 11-missing-title-validation.png
    ├── 12-final-book-verification.png
    ├── 13-invalid-book-id.png
    ├── 14-book-not-found.png
    ├── 15-invalid-price-validation.png
    ├── 15-post-create-book.png
    ├── 16-missing-price-validation.png
    ├── 17-invalid-pages-validation.png
    ├── 18-empty-title-validation.png
    ├── 19-empty-author-validation.png
    ├── 20-final-api-verification.png
    └── README.md
```

## 7. Installation Requirements

To run this project successfully, the system must have:

- Node.js installed
- npm installed
- A local terminal such as Windows PowerShell or Command Prompt
- Access to the project directory

Required dependencies are defined in `package.json` and installed using npm.

## 8. Installation and Execution Commands

Use the following commands in Windows PowerShell:

```powershell
cd "C:\Users\RAKES\OneDrive\New folder\BDF LAB\lab-02"
npm install
node server.js
```

Alternative:

```powershell
npm start
```

The API runs at:

```text
http://localhost:3000
```

## 9. REST API Endpoints with HTTP Methods

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Returns API welcome information and endpoint overview |
| GET | `/books` | Returns all books with optional query-filtering |
| GET | `/books/:bookId` | Returns a single book by ID |
| POST | `/books` | Creates a new book record |
| PUT | `/books/:bookId` | Updates an existing book |
| DELETE | `/books/:bookId` | Deletes a book by ID |
| GET | `/unknown-route` | Returns 404 for undefined routes |

### Example base URL

```text
http://localhost:3000
```

## 10. GET Query Parameters

The `GET /books` endpoint supports the following query parameters:

| Query Parameter | Type | Default | Description |
|---|---|---:|---|
| `search_q` | string | empty | Searches the title field for a keyword |
| `order_by` | string | `id` | Sort column: `id`, `title`, `author`, `price`, `pages` |
| `order` | string | `ASC` | Sort direction: `ASC` or `DESC` |
| `limit` | integer | `10` | Maximum number of books returned |
| `offset` | integer | `0` | Number of records to skip for pagination |
| `min_price` | number | `0` | Minimum allowed book price |
| `max_price` | number | `999999` | Maximum allowed book price |

### Example `GET` requests

```text
GET http://localhost:3000/books
GET http://localhost:3000/books?search_q=JavaScript
GET http://localhost:3000/books?order_by=price&order=DESC
GET http://localhost:3000/books?limit=3&offset=3
GET http://localhost:3000/books?min_price=500&max_price=800
GET http://localhost:3000/books?search_q=code&order_by=price&order=ASC&limit=5
```

## 11. POST, PUT and DELETE Operations with Example JSON Requests

### POST /books - Create a Book

```json
{
  "title": "REST API Testing",
  "author": "Rakesh Reddy",
  "price": 450,
  "pages": 250
}
```

### PUT /books/:bookId - Update a Book

```json
{
  "title": "Learning Node.js Updated",
  "author": "Rakesh Reddy",
  "price": 650,
  "pages": 400
}
```

### DELETE /books/:bookId - Delete a Book

```http
DELETE http://localhost:3000/books/13
```

## 12. Input Validation and Error Handling

The API validates all incoming data before writing or reading from the SQLite database.

### Validation rules for `POST /books`

- `title`: required, non-empty string
- `author`: required, non-empty string
- `price`: required, non-negative numeric value
- `pages`: optional, but if provided, must be a positive integer

### Validation rules for `PUT /books/:bookId`

- `bookId` must be a positive integer
- `title`, `author`, and `price` are required
- `pages` is optional and must be a positive integer when supplied

### Validation rules for `GET /books`

- `order_by` must be one of: `id`, `title`, `author`, `price`, `pages`
- `order` must be `ASC` or `DESC`
- `limit` must be between `1` and `100`
- `offset` must be a non-negative integer
- `min_price` must be a non-negative number
- `max_price` must be a non-negative number and cannot be less than `min_price`

### Error examples

- Missing title: `400 Bad Request`
- Missing price: `400 Bad Request`
- Invalid `order_by`: `400 Bad Request`
- `min_price > max_price`: `400 Bad Request`
- Invalid book ID: `400 Bad Request`
- Book not found: `404 Not Found`
- Undefined route: `404 Not Found`
- Server/database failure: `500 Internal Server Error`

## 13. HTTP Status Codes

| Status Code | Meaning | Used For |
|---|---|---|
| 200 | OK | Successful GET, PUT, DELETE |
| 201 | Created | Successful POST creation |
| 400 | Bad Request | Invalid input or validation failure |
| 404 | Not Found | Missing book or undefined route |
| 500 | Internal Server Error | Unexpected server or DB error |

## 14. Debugging Exercises and Solutions

The debugging file demonstrates four common backend mistakes and the correct fix for each one.

### 1. EADDRINUSE — Port Already in Use

Problem:

```text
Error: listen EADDRINUSE: address already in use :::3000
```

Solution:

- Stop the currently running process, or
- Use an environment variable such as `process.env.PORT`

Example:

```powershell
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### 2. Wrong Module Import

Problem:

```text
Error: Cannot find module 'sqlit3'
```

Solution:

- Use the installed package name exactly as listed in `package.json`
- Correct imports include:

```js
const { open } = require('sqlite');
const sqlite3 = require('sqlite3');
```

### 3. Wrong Table Name in SQL

Problem:

```text
SQLITE_ERROR: no such table: book
```

Solution:

- Ensure the query uses the exact table name `books`

```js
const rows = await db.all('SELECT * FROM books');
```

### 4. Missing `await` on Async Database Calls

Problem:

```js
const book = db.get('SELECT * FROM books WHERE id = ?', [id]);
```

Solution:

```js
const book = await db.get('SELECT * FROM books WHERE id = ?', [id]);
```

This is critical because without `await`, the code handles a Promise instead of the actual database row.

## 15. Postman Testing and Results

The project includes a Postman collection named:

```text
lab3-postman-collection.json
```

This collection contains 28 structured API tests covering valid and invalid requests.

### Manual API test summary

| # | Test Case | Expected Result |
|---:|---|---|
| 1 | GET `/` | 200 |
| 2 | GET `/books` | 200 |
| 3 | GET `/books?search_q=JavaScript` | 200 |
| 4 | GET `/books?order_by=price&order=ASC` | 200 |
| 5 | GET `/books?order_by=price&order=DESC` | 200 |
| 6 | GET `/books?order_by=title&order=ASC` | 200 |
| 7 | GET `/books?limit=3&offset=0` | 200 |
| 8 | GET `/books?limit=3&offset=3` | 200 |
| 9 | GET `/books?min_price=500&max_price=800` | 200 |
| 10 | GET `/books?search_q=code&order_by=price&order=ASC&limit=5` | 200 |
| 11 | GET `/books/1` | 200 |
| 12 | GET `/books/5` | 200 |
| 13 | POST `/books` with pages | 201 |
| 14 | POST `/books` without pages | 201 |
| 15 | PUT `/books/11` | 200 |
| 16 | DELETE `/books/11` | 200 |
| 17 | GET `/books?order_by=invalid` | 400 |
| 18 | GET `/books?order=RANDOM` | 400 |
| 19 | GET `/books?min_price=900&max_price=500` | 400 |
| 20 | GET `/books/abc` | 400 |
| 21 | GET `/books/9999` | 404 |
| 22 | POST `/books` with missing title | 400 |
| 23 | POST `/books` with missing price | 400 |
| 24 | POST `/books` with negative price | 400 |
| 25 | PUT `/books/9999` | 404 |
| 26 | DELETE `/books/9999` | 404 |
| 27 | GET `/books?limit=200` | 400 |
| 28 | GET `/unknown-route` | 404 |

### Final database verification

The database was checked during the final audit and the live SQLite database currently shows a total of 15 records in the `books` table. The exact book count is not assumed to stay fixed because the database has been used for earlier validation and lab testing.

The verified record set includes the created record with ID 13, and the final live database count at audit time was 15 entries.

## 16. Screenshots and Evidence

The project includes screenshot evidence for the lab tasks. The screenshots folder currently contains exactly 20 image files plus the folder README:

- screenshots/01-get-all-books.png
- screenshots/02-search-books.png
- screenshots/03-get-single-book.png
- screenshots/04-sort-books.png
- screenshots/05-pagination.png
- screenshots/06-price-filter.png
- screenshots/07-combined-query.png
- screenshots/08-invalid-query.png
- screenshots/09-invalid-limit.png
- screenshots/10-created-book-verification.png
- screenshots/11-missing-title-validation.png
- screenshots/12-final-book-verification.png
- screenshots/13-invalid-book-id.png
- screenshots/14-book-not-found.png
- screenshots/15-invalid-price-validation.png
- screenshots/15-post-create-book.png
- screenshots/16-missing-price-validation.png
- screenshots/17-invalid-pages-validation.png
- screenshots/18-empty-title-validation.png
- screenshots/19-empty-author-validation.png
- screenshots/20-final-api-verification.png
- screenshots/README.md

These screenshots provide visual evidence of server startup, query validation, error handling, and final API verification.

## 17. Conclusion

This lab successfully demonstrated the implementation of a complete Node.js backend API using Express.js and SQLite. The project covers essential backend fundamentals such as CRUD operations, query parameter handling, input validation, pagination, sorting, filtering, error handling, and debugging techniques.

The application was tested through a comprehensive Postman collection and validated against expected HTTP responses. The project also preserved the working database and data integrity while demonstrating correct backend behavior and professional documentation standards.

This lab is a strong example of how Node.js backend services can be built, validated, and debugged in a real-world development workflow.

---

Prepared for submission by: Rakesh Reddy
Registration: 252U1R8091
Section: CSE-QE-2B-S-13
College: Aurora
Course: Backend Development Fundamentals
