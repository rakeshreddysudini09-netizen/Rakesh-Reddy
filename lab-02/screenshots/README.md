# Lab 02 - Screenshots Directory

Save your captured screenshots here using Google Chrome and PowerShell/Windows Terminal:

| Filename | Description | Source |
| :--- | :--- | :--- |
| `01-db-server-start.png` | Terminal showing SQLite DB connection and server start | PowerShell / Windows Terminal |
| `02-get-all-books.png` | `GET /books/` showing all 10 books | Google Chrome or PowerShell |
| `03-get-single-book.png` | `GET /books/1/` showing "Clean Code" | Google Chrome or PowerShell |
| `04-post-create-book.png` | `POST /books/` creating "Learning SQL" (201 Created) | PowerShell (`Invoke-RestMethod`) |
| `05-put-update-book.png` | `PUT /books/1/` updating to "Clean Code Updated" (200 OK) | PowerShell (`Invoke-RestMethod`) |
| `06-delete-book.png` | `DELETE /books/10/` deleting Book 10 (200 OK) | PowerShell (`Invoke-RestMethod`) |
| `07-404-not-found-error.png` | `GET /books/999/` showing 404 Not Found | Google Chrome or PowerShell |
| `08-400-bad-request-error.png` | `GET /books/invalid-id/` showing 400 Bad Request | Google Chrome or PowerShell |
