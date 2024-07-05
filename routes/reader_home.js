// Set up express, bodyparser and EJS
const express = require('express');
const router = express();
const { check, validationResult } = require('express-validator')
var bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false })
router.use(bodyParser.urlencoded({ extended: true }));
router.set('view engine', 'ejs'); // set the router to use ejs for rendering
router.use(express.static(__dirname + '/public')); // set location of static files

router.get('/home', (req, res) => {

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

  const getPublishedArticles = new Promise((resolve, reject) => {
    db.all(`SELECT * FROM Articles WHERE type = 'published'`, (err, rows) => {
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
      let obj = { author: getBlogInformation, published: getPublishedArticles }
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
