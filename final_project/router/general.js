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

  return res.status(201).json({message: "User successfully registered"});
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  const bookList = Object.values(books);
  res.status(200).json(bookList);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  const book = books[isbn];

  if (book) {
    res.status(200).json(book);
  } else {
    res.status(404).json({message: "Book with ISBN not found"});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author.toLowerCase();

  const booksByAuthor = [];

  for (const key in books) {
    if (books[key].author.toLowerCase() === author) {
        booksByAuthor.push(books[key]);
    }
  }

  if (booksByAuthor.length > 0) {
    res.status(200).json(booksByAuthor);

  } else {
    res.status(404).json({message: "Books not found by author"});
  }

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title.toLowerCase();

  const booksByTitle = [];

  for (const key in books) {
    if (books[key].title.toLowerCase() === title) {
        booksByTitle.push(books[key]);
    }
  }

  if (booksByTitle.length > 0) {
    res.status(200).json(booksByTitle);

  } else {
    res.status(404).json({message: "No books found with given title"});
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
