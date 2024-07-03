// Set up express, bodyparser and EJS
const express = require('express');
const router = express();
const { check, validationResult } = require('express-validator')
var bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false })
router.use(bodyParser.urlencoded({ extended: true }));
router.set('view engine', 'ejs'); // set the router to use ejs for rendering
router.use(express.static(__dirname + '/public')); // set location of static files

router.get('/article', (req, res) => {
  // Query the database row with id = 1 for the author's name and blog title
  db.get('SELECT author_name, blog_title FROM Authors WHERE author_id = 1', (err, row) => {
    if (err) {
      // If there is an error, render the page with default values
      console.error('Error querying the database: ' + err.message);
      return res.render('reader_articles', { author: { author_name: 'Default Author', blog_title: 'Default Blog' }});
    } else {
      // Create object to pass in the author's name and blog title
      let obj = { author: row }
      return res.render('reader_articles', obj);
    }
  });
});

router.post('/article', urlencodedParser, [
  [
    check('commenter_name', 'Name cannot be empty.').notEmpty(),
    check('commenter_name', 'Name must be between 3 to 40 characters.').isLength({min: 3, max: 40}),
    check('comment', 'Comment cannot be empty.').notEmpty(),
  ],
  (req, res) => {
      const errors = validationResult(req);
      if(!errors.isEmpty()) {
          const alert = errors.array()
          res.render('reader_articles', {
              alert
          })
      }else{
          return res.redirect('/reader/article?success=1')
      }
  }
])

module.exports = router;