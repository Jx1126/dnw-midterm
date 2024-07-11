// Requiring the necessary modules
const express = require('express');
const app = express();
const port = 3000;
const session = require('express-session');
var bodyParser = require("body-parser");

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

// Session congifuration
app.use(session({
    secret: 'dnwmidterm',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Set up SQLite
const sqlite3 = require('sqlite3').verbose();
global.db = new sqlite3.Database('./database.db',function(err){
    if(err){
        console.error(err);
        process.exit(1);
    } else {
        console.log("Database connected");
        global.db.run("PRAGMA foreign_keys=ON");
    }
});

// Route to the home page 
app.get('/', (req, res) => {
    res.render('homepage');
});

// Author authentication middleware
const authenticationMiddleware = (req, res, next) => {
  // If the user is logged in, continue with the request, else redirect to the authentication page
  if(req.session.loggedin){
    next();
  } else {
    res.redirect('/register');
  }
};

// Route to the authentication page
const authentication = require('./routes/authentication');
app.use('/', authentication);

// Author routes, protected by the authentication middleware
const authorHome = require('./routes/author_home');
app.use('/author', authenticationMiddleware, authorHome);

const authorSettings = require('./routes/author_settings');
app.use('/author', authenticationMiddleware, authorSettings);

const authorEdit = require('./routes/author_edit');
app.use('/author', authenticationMiddleware, authorEdit);

// Reader routes, no authentication required
const readerHome = require('./routes/reader_home');
app.use('/reader', readerHome);

const readerArticles = require('./routes/reader_articles');
app.use('/reader', readerArticles);

// Start the server
app.listen(port, () => {
    console.log(`Blog page listening on port ${port}`)
})

