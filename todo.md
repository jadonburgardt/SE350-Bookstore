# Database Design Description

## Tables:

### Books
- `book_id` (Primary Key): Unique identifier for each book.
- `title`: Title of the book.
- `publication_year`: The year the book was published.
- Other relevant book information (e.g., ISBN, genre, etc.).

### Authors
- `author_id` (Primary Key): Unique identifier for each author.
- `name`: Name of the author.
- Other relevant author information (e.g., birthdate, nationality, etc.).

### Users
- `user_id` (Primary Key): Unique identifier for each user.
- `username`: User's username for authentication.
- `email`: User's email address.
- Other relevant user information (e.g., full name, date of birth, etc.).

### Reviews
- `review_id` (Primary Key): Unique identifier for each review.
- `book_id` (Foreign Key): References the book being reviewed.
- `user_id` (Foreign Key): References the user who wrote the review.
- `rating`: Rating given by the user for the book (e.g., 1 to 5 stars).
- `review_text`: The text content of the review.
- `review_date`: Date when the review was posted.

## Relationships:

- **Books and Authors (Many-to-Many):**
  - Each book can have multiple authors.
  - Each author can have written multiple books.
  - This relationship is represented by an intermediary table, typically called `book_author`, which stores pairs of `book_id` and `author_id`.

- **Books and Reviews (One-to-Many):**
  - Each book can have multiple reviews.
  - Each review belongs to a single book.
  - The `book_id` in the `Reviews` table serves as the foreign key.

- **Users and Reviews (One-to-Many):**
  - Each user can write multiple reviews.
  - Each review is written by a single user.
  - The `user_id` in the `Reviews` table serves as the foreign key.

---

## Create the Database
- Download sqlite (https://www.sqlite.org/download.html)
- Create a new folder and extract the database files (check the recording)
- Open the terminal and go to the folder that contains the sqlite3
- Create a new database: sqlite3 books.db
- Create the tables using:.read db\script.sql


## Run the webserver
- Install flask (https://flask.palletsprojects.com/en/2.3.x/installation/)
- While in the correct project path, type the following in the terminal: flask run
- Click on the server address (127.0.0.1) or type in the browser to open the webpage