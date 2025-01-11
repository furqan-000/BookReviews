const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
    { username: "furqan-000", password: "admin" }
];

const isValid = (username)=>{ 
    return !users.find(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    const user = users.find(user => user.username === username && user.password === password);
    return !!user;

}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const { username, password } = req.body;
    if (!username || !password) {
    return res.status(400).json({message: "Username and password is required"});
    }

    if (!authenticatedUser(username, password)) {
    return res.status(401).json({message: "Invalid username or password"});
    }

    const token = jwt.sign({ username }, 'secret-key', {expiresIn:'1hr'});
    req.session.authorization = { token, username };

    return res.status(200).json({message: "Login Successful", token });

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.body.review;
    const username = req.user?.username; // Retrieved the JWT token
  
    if (!username) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    if (!review) {
        return res.status(400).json({ message: "Review is required" });
    }
  
    if (books[isbn]) {
      books[isbn].reviews[username] = review; // Add or modify the review for this user
      return res.status(200).json({ message: "Review added successfully" });
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.user?.username; // Retrieved the JWT token

    if (!username) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    if (books[isbn] && books[isbn].reviews[username]) {
        delete books[isbn].reviews[username]; // Remove the review for this user
        return res.status(200).json({ message: "Review deleted successfully" });
    } else {
        return res.status(404).json({ message: "Review not found or unauthorized" });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
