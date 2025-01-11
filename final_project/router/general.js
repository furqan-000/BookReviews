const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({message: "Username and Password is required"});
  }

  if (users[username]) {
    return res.status(409).json({message: "Username already exists"});
  }

  users[username] = {password: password};

  return res.status(200).json({message: "User successfully registered"});
});

// Get the book list available in the shop ( Task # 10 - Using Promises )
public_users.get('/', function (req, res) {
    new Promise((resolve, reject) => {
        if (books) {
          resolve(books);
        } else {
          reject("Error: Books not available");
        }
      })
        .then(books => res.status(200).json({ message: "List of books available in the shop:", books }))
        .catch(err => res.status(500).json({ message: err }));
});

// Get book details based on ISBN ( Task # 11 - ISBN using Async/Await )
public_users.get('/isbn/:isbn', async function (req, res) {
  //Write your code here
  try {
    const isbn = req.params.isbn;
    if (books[isbn]) {
      res.status(200).json({ message: "Book details:", book: books[isbn] });
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "An error occurred", error: err.message });
  }
 });
  
// Get book details based on author ( Task # 12 - Details based on author using Promises)
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  new Promise((resolve, reject) => {
    const author = req.params.author;
    const matchingBooks = Object.values(books).filter(book => book.author === author);
    if (matchingBooks.length > 0) {
      resolve(matchingBooks);
    } else {
      reject("No books found by this author");
    }
  })
    .then(matchingBooks => res.status(200).json({ message: `Books by author: ${req.params.author}`, books: matchingBooks }))
    .catch(err => res.status(404).json({ message: err }));
});

// Get all books based on title ( Task # 13 - Book details on title using Async/Await)
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  try {
    const title = req.params.title;
    const matchingBooks = Object.values(books).filter(book => book.title === title);
    if (matchingBooks.length > 0) {
      res.status(200).json({ message: `Books with title: ${title}`, books: matchingBooks });
    } else {
      res.status(404).json({ message: "No books found with this title" });
    }
  } catch (err) {
    res.status(500).json({ message: "An error occurred", error: err.message });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here

  const isbn = req.params.isbn;

  const book = books[isbn];

  if (book) {
    res.status(200).json({reviews: book.reviews});
  } else {
    res.status(404).json({message: "Book with ISBN not found"});
  }

  
});

module.exports.general = public_users;
