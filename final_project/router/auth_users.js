const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    const user = user.find(user => user.username === username);
    return user ? user.password === password: false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({message: "Username and password is required"});
  }

  //Validate username and password
  if (isValid(username) && authenticatedUser(username, password)) {
    const token = jwt.sign({ username }, 'secret-key', {expiresIn:'1hr'});
    
    return res.status(200).json({message: "Login Successful", token});
  } else {
    return res.status(401).json({message: "Invalid username or password"});
  }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
