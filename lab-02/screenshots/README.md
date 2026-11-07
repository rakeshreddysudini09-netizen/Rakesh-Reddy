# Lab 02 / Lab 03 - Screenshots Directory

Save your captured screenshots here using Postman, Google Chrome, and PowerShell / Windows Terminal:

| Filename | Description | Source / Method |
| :--- | :--- | :--- |
| `01-server-start.png` | Terminal showing SQLite DB connection & server running | PowerShell / Terminal |
| `02-get-all-books.png` | `GET /books` default response (10 books) | Postman / Chrome |
| `03-search-books.png` | `GET /books?search_q=JavaScript` | Postman / Chrome |
| `04-sort-by-price-asc.png` | `GET /books?order_by=price&order=ASC` | Postman / Chrome |
| `05-sort-by-price-desc.png` | `GET /books?order_by=price&order=DESC` | Postman / Chrome |
| `06-pagination.png` | `GET /books?limit=3&offset=0` | Postman / Chrome |
| `07-price-filter.png` | `GET /books?min_price=500&max_price=800` | Postman / Chrome |
| `08-combined-query.png` | Combined query: search + order_by + limit | Postman / Chrome |
| `09-get-single-book.png` | `GET /books/1` returning single book record | Postman / Chrome |
| `10-create-book.png` | `POST /books` with all fields (201 Created) | Postman |
| `11-create-book-no-pages.png` | `POST /books` without optional pages field | Postman |
| `12-update-book.png` | `PUT /books/:bookId` updating a book (200 OK) | Postman |
| `13-delete-book.png` | `DELETE /books/:bookId` deleting a book (200 OK) | Postman |
| `14-error-invalid-order.png` | `GET /books?order_by=invalid` returning 400 Bad Request | Postman |
| `15-error-404-not-found.png` | `GET /books/9999` returning 404 Not Found | Postman |
| `16-debugging-results.png` | Terminal output of `node debugging.js` | PowerShell / Terminal |
