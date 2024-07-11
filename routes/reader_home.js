// Set up express, bodyparser and EJS
const express = require('express');
const router = express();
var bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({ extended: true }));
router.set('view engine', 'ejs'); // set the router to use ejs for rendering
router.use(express.static(__dirname + '/public')); // set location of static files
const { convertTimeFormat } = require('../public/script.js');

// Route: /reader/home (GET)
// Purpose: Renders the reader home page
// Input: None
// Output: Renders the reader home page from reader_home.ejs
router.get('/home', (req, res) => {
  // Purpose: Retrieve the author's name and blog title from the database
  // Input: None
  // Output: Author's name and blog title for the header
  const getBlogInformation = new Promise((resolve, reject) => {
    db.get(`SELECT author_name, blog_title FROM Authors WHERE author_id = 1`, (err, row) => {
      if (err) {
        console.error('Error querying the database: ' + err.message);
        reject(err);
      } else {
        resolve(row);
      }
    });
  });

  // Purpose: Retrieve all the published articles from the database
  // Input: None
  // Output: All the published article rows
  const getPublishedArticles = new Promise((resolve, reject) => {
    const sort = req.query.sort;
    let sort_query = '';

    // Purpose: Sort the articles based on the query parameter
    // Input: Request query parameter sort
    switch (sort) {
      case 'like':
        sort_query = 'ORDER BY likes DESC';
        break;
      case 'read':
        sort_query = 'ORDER BY reads DESC';
        break;
      default:
        sort_query = 'ORDER BY publication DESC';
        break;
    }

    // Purpose: Retrieve all the published articles from the database and sort them based on the query parameter
    // Input: Request query parameter sort
    // Output: All the published article rows
    db.all(`SELECT * FROM Articles WHERE type = 'published' ${sort_query}`, (err, rows) => {
      if (err) {
        console.error('Error querying the database: ' + err.message);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });

  Promise.all([getBlogInformation, getPublishedArticles])
    .then(([getBlogInformation, getPublishedArticles]) => {
      let obj = { author: getBlogInformation, published: getPublishedArticles, sort: req.query.sort, convertTimeFormat}
      if (req.query.success) {
        obj.success = 'Settings saved successfully.'
      }
      return res.render('reader_home', obj);
    })
    .catch((err) => {
      console.error('Error querying the database: ' + err.message);
      return res.render('reader_home', { author: { author_name: 'Default Author', blog_title: 'Default Blog' } });
    });
});

module.exports = router;
