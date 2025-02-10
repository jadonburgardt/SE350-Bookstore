// Array to store book data
const books = [];

// Function to add a book to the list and send it to the server
function addBook() {
    const bookTitle = document.getElementById('bookTitle').value;
    const publicationYear = document.getElementById('publicationYear').value;
    const coverPath = document.getElementById('coverPath').value;

    // Create a JSON object with book data
    const bookData = {
        title: bookTitle,
        publication_year: parseInt(publicationYear), // Ensure publication_year is an integer
        cover_path: coverPath
    };

    // Send the book data to the server via POST request
    fetch('/api/add_book', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookData)
    })
        .then(response => response.json())
        .then(data => {
            // Display a success message or handle errors if needed
            console.log(data.message);

            // Add the new book data to the books array
            books.push(bookData);
            console.log(books);

            // Refresh the book list
            displayBooks();
        })
        .catch(error => {
            console.error('Error adding book:', error);
        });
}

// Function to display books in the list
function displayBooks() {
    const bookList = document.getElementById('bookList');
    bookList.innerHTML = ''; // Clear existing book list

    books.forEach(book => {
        const bookElement = document.createElement('div');
        bookElement.innerHTML = `
            <h2>${book.title}</h2>
            <p>Publication Year: ${book.publication_year}</p>
            <img src="${book.cover_path}" alt="Cover Image">
        `;
        bookList.appendChild(bookElement);
    });
}

// Function to fetch and display all books from the server
function showAllBooks() {
    fetch('/api/books')
        .then(response => response.json())
        .then(data => {
            const bookList = document.getElementById('allbooks');
            bookList.innerHTML = ''; // Clear existing book list
            console.log(data);
            data.books.forEach(book => {
                const bookElement = document.createElement('div');
                bookElement.innerHTML = `
                    <h2>${book.title}</h2>
                    <p>Publication Year: ${book.publication_year}</p>
                    <img src="${book.cover_path}" alt="Cover Image">
                `;
                bookList.appendChild(bookElement);
            });
        })
        .catch(error => {
            console.error('Error fetching all books:', error);
        });
}

function searchBooks() {
    const searchText = document.getElementById('searchText').value;

    // Send the search text to the server via POST request
    fetch('/api/search_books', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ search_text: searchText })
    })
        .then(response => response.json())
        .then(data => {
            const bookList = document.getElementById('bookList');
            bookList.innerHTML = ''; // Clear existing book list

            data.books.forEach(book => {
                const bookElement = document.createElement('div');
                bookElement.innerHTML = `
                    <h2>${book.title}</h2>
                    <p>Publication Year: ${book.publication_year}</p>
                    <img src="${book.cover_path}" alt="Cover Image">
                `;
                bookList.appendChild(bookElement);
            });
        })
        .catch(error => {
            console.error('Error searching books:', error);
        });
}
