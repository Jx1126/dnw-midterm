const express = require('express');
const app = express();
const port = 3000;
const session = require('express-session');
const bcrypt = require('bcrypt');
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.use(session({
    secret: 'dnwmidterm',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Set up SQLite
// Items in the global namespace are accessible throught out the node application
const sqlite3 = require('sqlite3').verbose();
global.db = new sqlite3.Database('./database.db',function(err){
    if(err){
        console.error(err);
        process.exit(1); // bail out we can't connect to the DB
    } else {
        console.log("Database connected");
        global.db.run("PRAGMA foreign_keys=ON"); // tell SQLite to pay attention to foreign key constraints
    }
});

// Handle requests to the home page 
app.get('/', (req, res) => {
    res.render('homepage');
});

// Add all the route handlers in usersRoutes to the app under the path /users
const authorHome = require('./routes/author_home');
app.use('/author', (req, res, next) => {
  if (req.session.loggedin) {
    next();
  } else {
    res.redirect('/register');
  }
}, authorHome);

const authentication = require('./routes/authentication');
app.use('/', authentication);

const authorSettings = require('./routes/author_settings');
app.use('/author', authorSettings);

const authorEdit = require('./routes/author_edit');
app.use('/author', authorEdit);

const readerHome = require('./routes/reader_home');
app.use('/reader', readerHome);

const readerArticles = require('./routes/reader_articles');
app.use('/reader', readerArticles);

// Make the web application listen for HTTP requests
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

