// Set up express, bodyparser and EJS
const express = require('express');
const router = express();
const { check, validationResult } = require('express-validator')
var bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false })
router.use(bodyParser.urlencoded({ extended: true }));
router.set('view engine', 'ejs'); // set the router to use ejs for rendering
router.use(express.static(__dirname + '/public')); // set location of static files

router.get('/settings', (req, res) => {
  // Query the database row with id = 1 for the author's name and blog title
  db.get('SELECT author_name, blog_title FROM Authors WHERE author_id = 1', (err, row) => {
    if (err) {
      // If there is an error, render the page with default values
      console.error('Error querying the database: ' + err.message);
      return res.render('author_settings', { author: { author_name: 'Default Author', blog_title: 'Default Blog' }});
    } else {
      // Create object to pass in the author's name and blog title
      let obj = { author: row }
      return res.render('author_settings', obj);
    }
  });
});

router.post('/settings', urlencodedParser, [
  [
    check('author_name', 'Author name cannot be empty.').notEmpty(),
    check('author_name', 'Author name must be between 3 to 50 characters.').isLength({ min: 3, max: 40 }),
    check('blog_title', 'Blog title cannot be empty.').notEmpty(),
    check('blog_title', 'Blog title must be between 3 to 100 characters.').isLength({ min: 3, max: 100 })
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const alert = errors.array()
      res.render('author_settings', { alert })
    } else {
      const { author_name, blog_title } = req.body;
      const sql = `UPDATE Authors SET author_name = ?, blog_title = ? WHERE author_id = 1;`;
      db.get(sql, [author_name, blog_title], (err, data) => {
        if (err) {
          console.log(err)
          return res.status(500).send('Internal server error')
        } else {
          return res.redirect('/author/home?success=1')
        }
      })
    }
  }
])

module.exports = router;
