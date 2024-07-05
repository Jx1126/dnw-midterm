// Set up express, bodyparser and EJS
const express = require('express');
const router = express();
const { check, validationResult } = require('express-validator')
var bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false })
router.use(bodyParser.urlencoded({ extended: true }));
router.set('view engine', 'ejs'); // set the router to use ejs for rendering
router.use(express.static(__dirname + '/public')); // set location of static files

router.get('/edit', (req, res) => {
  const getBlogInformation = new Promise((resolve, reject) => {
    const sql = `SELECT author_name, blog_title FROM Authors WHERE author_id = 1`;
    db.get(sql, (err, row) => {
      if (err) {
        console.error('Error querying the database: ' + err.message);
        reject(err);
      } else {
        resolve(row);
      }
    });
  });

  const getDraftArticle = new Promise((resolve, reject) => {
    const sql = `SELECT * FROM Articles WHERE id = '${req.query.id}'`;
    db.get(sql, (err, row) => {
      if (err) {
        console.error('Error querying the database: ' + err.message);
        reject(err);
      } else {
        resolve(row);
      }
    });
  });

  Promise.all([getBlogInformation, getDraftArticle])
    .then(([getBlogInformation, getDraftArticle]) => {
      let obj = { author: getBlogInformation, draft: getDraftArticle }
      return res.render('author_edit', obj);
    })
    .catch((err) => {
      console.error('Error querying the database: ' + err.message);
      return res.render('author_edit', { author: { author_name: 'Default Author', blog_title: 'Default Blog' }});
    });
});

module.exports = router;
