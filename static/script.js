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

// Open and close the modal functionality
const modal = document.getElementById("addBookModal");
const openModalButton = document.getElementById("openModalButton");
const closeModalButton = document.getElementById("closeModalButton");

openModalButton.onclick = function () {
  modal.style.display = "block";
};

closeModalButton.onclick = function () {
  modal.style.display = "none";
};

window.onclick = function (event) {
  if (event.target === modal) {
    modal.style.display = "none";
  }
};

// Handle form submission
function submitBook(event) {
  event.preventDefault();

  // Fetch form inputs
  const bookTitle = document.getElementById("bookTitle").value;
  const author = document.getElementById("author").value;
  const publicationYear = document.getElementById("publicationYear").value;
  const coverPath = document.getElementById("coverPath").value;

  // Create book data object
  const bookData = {
    title: bookTitle,
    author: author,
    publication_year: parseInt(publicationYear),
    cover_path: coverPath,
  };

  // Send the data to the server
  fetch("/api/add_book", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bookData),
  })
    .then((response) => response.json())
    .then((data) => {
      alert("Book added successfully!");
      document.getElementById("addBookForm").reset();
      document.getElementById("addBookModal").style.display = "none";
      loadCategoryBooks();
    })
    .catch((error) => {
      console.error("Error adding book:", error);
    });
}

// Search functionality for books
document.getElementById("searchText").addEventListener("keyup", function () {
  searchBooks();
});

function searchBooks() {
  const searchText = document
    .getElementById("searchText")
    .value.trim()
    .toLowerCase();
  const searchResultsContainer = document.getElementById("searchResults");

  searchResultsContainer.innerHTML = "";

  if (!searchText) {
    searchResultsContainer.style.display = "none";
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
        listItem.textContent = book.title;
        searchResultsContainer.appendChild(listItem);
      });

      searchResultsContainer.style.display = "block";
    })
    .catch((error) => {
      console.error("Error fetching books for search:", error);
    });
}

// Scroll to top button
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

window.addEventListener("scroll", function () {
  const scrollToTopButton = document.getElementById("scrollToTopButton");
  if (window.scrollY > 200) {
    scrollToTopButton.classList.add("show");
  } else {
    scrollToTopButton.classList.remove("show");
  }
});

// Load books on page load
window.onload = function () {
  loadCategoryBooks();
};
