// Set up express, bodyparser and EJS
const express = require('express');
const router = express();
const { check, validationResult } = require('express-validator')
var bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false })
router.use(bodyParser.urlencoded({ extended: true }));
router.set('view engine', 'ejs'); // set the router to use ejs for rendering
router.use(express.static(__dirname + '/public')); // set location of static files

// Route: /author/settings (GET)
// Purpose: Renders the author settings page
// Input: None
// Output: Renders the author settings page from author_settings.ejs
router.get('/settings', (req, res) => {
  // Purpose: Retrieve the author's name and blog title from the database
  // Input: None
  // Output: Author's name and blog title for the header
  db.get('SELECT author_name, blog_title FROM Authors WHERE author_id = 1', (err, row) => {
    if (err) {
      console.error('Error querying the database: ' + err.message);
      return res.render('author_settings', { author: { author_name: 'Default Author', blog_title: 'Default Blog' }});
    } else {
      let obj = { author: row }
      return res.render('author_settings', obj);
    }
  });
});

// Route: /author/settings (POST)
// Purpose: Update the author settings to the database
// Input: Author name and blog title
// Output: Redirects to author home page with success message, or renders the author settings page with alert
router.post('/settings', urlencodedParser, [
  [
    // Input validation for author name and blog title
    check('author_name', 'Author name cannot be empty.').notEmpty(),
    check('author_name', 'Author name must be between 3 to 50 characters.').isLength({ min: 3, max: 40 }),
    check('blog_title', 'Blog title cannot be empty.').notEmpty(),
    check('blog_title', 'Blog title must be between 3 to 100 characters.').isLength({ min: 3, max: 100 })
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const alert = errors.array();
      // Purpose: Get current author name and blog title from the database
      // Reason: Revert the input value back to the last valid author name and blog title into the input field
      // Input: None
      // Output: Author's name and blog title for the header
      db.get('SELECT author_name, blog_title FROM Authors WHERE author_id = 1', (err, row) => {
        if (err) {
          console.error('Error querying the database: ' + err.message);
          return res.render('author_settings', { alert, author: { author_name: 'Default Author', blog_title: 'Default Blog' }});
        } else {
          return res.render('author_settings', { alert, author: row });
        }
      });
    } else {
      const { author_name, blog_title } = req.body;
      // Purpose: Update the author name and blog title to the database
      // Input: Author name and blog title
      // Output: Update the settings into the database and redirect to author home page
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
