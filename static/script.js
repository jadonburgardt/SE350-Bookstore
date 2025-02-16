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
        <div class="book circular-book">
            <img src="${book.cover_path}" alt="${book.title}" />
            <h3>${book.title}</h3>
            <p class="book-author">${book.author}</p>
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
// Select the modal and close button
const modal = document.getElementById("addBookModal");
const closeModalButton = document.getElementById("closeModalButton");

// Open modal when clicking "Add Book" in the navbar
document
  .querySelector("nav a[href='#addBookSection']")
  .addEventListener("click", function (event) {
    event.preventDefault(); // Prevent scrolling
    modal.style.display = "block"; // Show the modal
  });

// Close the modal when clicking the close button
closeModalButton.onclick = function () {
  modal.style.display = "none";
};

// Close the modal when clicking outside of it
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
        listItem.style.display = "flex";
        listItem.style.alignItems = "center";
        listItem.style.padding = "8px";
        listItem.style.cursor = "pointer";
        listItem.style.borderBottom = "1px solid #333";
        listItem.style.transition = "background-color 0.2s ease-in-out";

        listItem.innerHTML = `
          <img src="${book.cover_path}" alt="${book.title}" style="width: 40px; height: 60px; margin-right: 10px; border-radius: 4px;">
          <div>
            <strong>${book.title}</strong>
            <br>
            <small>${book.author}</small>
          </div>
        `;

        listItem.onclick = () => {
          document.getElementById("searchText").value = book.title;
          searchResultsContainer.style.display = "none";
        };

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
