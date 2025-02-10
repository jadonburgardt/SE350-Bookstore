const bookCategories = {
  bestsellers: [
    "The Midnight Library",
    "Where the Crawdads Sing",
    "Verity",
    "It Ends With Us",
  ],
  fiction: [
    "The Night Circus",
    "The Seven Husbands of Evelyn Hugo",
    "A Court of Thorns and Roses",
    "Circe",
  ],
  nonfiction: [
    "Educated: A Memoir",
    "Sapiens: A Brief History of Humankind",
    "Becoming",
    "Atomic Habits",
  ],
};

// Array to store book data
const books = [];

function loadCategoryBooks() {
  fetch("/api/books")
    .then((response) => response.json())
    .then((data) => {
      const bestsellersContainer = document.getElementById("bestsellerBooks");
      const fictionContainer = document.getElementById("fictionBooks");
      const nonfictionContainer = document.getElementById("nonfictionBooks");

      // Clear existing book lists
      bestsellersContainer.innerHTML = "";
      fictionContainer.innerHTML = "";
      nonfictionContainer.innerHTML = "";

      data.books.forEach((book) => {
        // Book template with title, author, and publication year
        const bookHTML = `
            <div class="book">
                <img src="${book.cover_path}" alt="${book.title}" />
                <h3>${book.title}</h3>
                <p><strong>Author:</strong> ${book.author}</p>
                <p><strong>Publication Year:</strong> ${book.publication_year}</p>
            </div>
          `;

        // Categorize and display books in the correct section
        if (bookCategories.bestsellers.includes(book.title)) {
          bestsellersContainer.innerHTML += bookHTML;
        } else if (bookCategories.fiction.includes(book.title)) {
          fictionContainer.innerHTML += bookHTML;
        } else if (bookCategories.nonfiction.includes(book.title)) {
          nonfictionContainer.innerHTML += bookHTML;
        }
      });
    })
    .catch((error) => {
      console.error("Error loading category books:", error);
    });
}

// Function to add a book to the list and send it to the server
function addBook() {
  const bookTitle = document.getElementById("bookTitle").value;
  const publicationYear = document.getElementById("publicationYear").value;
  const coverPath = document.getElementById("coverPath").value;

  // Create a JSON object with book data
  const bookData = {
    title: bookTitle,
    publication_year: parseInt(publicationYear), // Ensure publication_year is an integer
    cover_path: coverPath,
  };

  // Send the book data to the server via POST request
  fetch("/api/add_book", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bookData),
  })
    .then((response) => response.json())
    .then((data) => {
      // Display a success message or handle errors if needed
      console.log(data.message);

      // Add the new book data to the books array
      books.push(bookData);
      console.log(books);

      // Refresh the book list
      displayBooks();
    })
    .catch((error) => {
      console.error("Error adding book:", error);
    });
}

// Function to display books in the list
function displayBooks(bookArray, sectionId) {
  const section = document.getElementById(sectionId);
  section.innerHTML = ""; // Clear existing book list

  bookArray.forEach((book) => {
    section.innerHTML += `
            <div class="book">
                <img src="${book.cover_path}" alt="${book.title}">
                <h3>${book.title}</h3>
                <p><strong>Author:</strong> ${book.author}</p>
                <p><strong>Publication Year:</strong> ${book.publication_year}</p>
            </div>
        `;
  });
}

// Function to fetch and display all books from the server
function showAllBooks() {
  fetch("/api/books")
    .then((response) => response.json())
    .then((data) => {
      const bookList = document.getElementById("allbooks");
      bookList.innerHTML = ""; // Clear existing book list
      console.log(data);
      data.books.forEach((book) => {
        const bookElement = document.createElement("div");
        bookElement.innerHTML = `
                    <h2>${book.title}</h2>
                    <p>Publication Year: ${book.publication_year}</p>
                    <img src="${book.cover_path}" alt="Cover Image">
                `;
        bookList.appendChild(bookElement);
      });
    })
    .catch((error) => {
      console.error("Error fetching all books:", error);
    });
}

document.getElementById("searchText").addEventListener("keyup", function () {
  searchBooks();
});

function searchBooks() {
  const searchText = document
    .getElementById("searchText")
    .value.trim()
    .toLowerCase();
  const searchResultsContainer = document.getElementById("searchResults");

  searchResultsContainer.innerHTML = ""; // Clear previous results

  if (!searchText) {
    searchResultsContainer.style.display = "none"; // Hide the dropdown if input is empty
    return;
  }

  fetch("/api/books")
    .then((response) => response.json())
    .then((data) => {
      // Filter books by title only
      const filteredBooks = data.books.filter((book) =>
        book.title.toLowerCase().includes(searchText)
      );

      if (filteredBooks.length === 0) {
        searchResultsContainer.innerHTML = `<li>No results found for "${searchText}"</li>`;
        searchResultsContainer.style.display = "block";
        return;
      }

      filteredBooks.forEach((book) => {
        const listItem = document.createElement("li");
        listItem.textContent = book.title; // Display only book title
        searchResultsContainer.appendChild(listItem);
      });

      searchResultsContainer.style.display = "block"; // Show the dropdown when results are available
    })
    .catch((error) => {
      console.error("Error fetching books for search:", error);
    });
}

// Call loadCategoryBooks on page load
window.onload = function () {
  loadCategoryBooks();
};
