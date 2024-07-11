// Set up express, bodyparser and EJS
const express = require('express');
const router = express();
const { check, validationResult } = require('express-validator')
var bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false })
router.use(bodyParser.urlencoded({ extended: true }));
router.set('view engine', 'ejs'); // set the router to use ejs for rendering
router.use(express.static(__dirname + '/public')); // set location of static files
const { convertTimeFormat } = require('../public/script.js');
const Filter = require('bad-words');
const filter = new Filter();

// Route: /reader/articles (GET)
// Purpose: Renders the article page
// Input: None
// Output: Renders the article page from reader_articles.ejs
router.get('/article', (req, res) => {
  // Purpose: Retrieve the author's name and blog title from the database
  // Input: None
  // Output: Author's name and blog title for the header
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

  // Purpose: Retrieve the selected published article from the database
  // Input: Request query parameter id
  // Output: Published article row
  const getPublishedArticle = new Promise((resolve, reject) => {
    const sql = `SELECT * FROM Articles WHERE id = '${req.query.id}';`;
    db.get(sql, (err, rows) => {
      if (err) {
        console.error('Error querying the database: ' + err.message);
        reject(err);
      } else {
        // Purpose: Update the view count of the article for each view
        // Input: Request query parameter id
        // Output: Update the views count of the article into the database
        const updateViews = `UPDATE Articles SET reads = reads + 1 WHERE id = '${req.query.id}';`;
        db.run(updateViews, (err) => {
          if (err) {
            console.error('Error updating views: ' + err.message);
          }
        });
        resolve(rows);
      }
    });
  });

  // Purpose: Retrieve all the comments of the selected published article from the database
  // Input: Request query parameter id
  // Output: All the comments of the selected published article
  const getComments = new Promise((resolve, reject) => {
    const sql = `SELECT * FROM Comments WHERE article_id = '${req.query.id}' ORDER BY creation DESC;`;
    db.all(sql, (err, rows) => {
      if (err) {
        console.error('Error querying the database: ' + err.message);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });

  Promise.all([getBlogInformation, getPublishedArticle, getComments])
    .then(([getBlogInformation, getPublishedArticle, getComments]) => {
      let obj = { author: getBlogInformation, published: getPublishedArticle, comments: getComments, req: req, convertTimeFormat}
      // Store toast messages to be displayed in the article page depending on the query parameters
      if (req.query.success) {
        obj.success = 'Comment posted successfully.'
      }
      if (req.query.errors) {
        obj.alert = decodeURIComponent(req.query.errors).split('||');
      }
      return res.render('reader_articles', obj);
    })
    .catch((err) => {
      console.error('Error querying the database: ' + err.message);
      return res.render('reader_articles', { author: { author_name: 'Default Author', blog_title: 'Default Blog' }, success: req.query.success ? 'Comment posted successfully.' : null, req: req});
    });
});

// Route: /reader/article/comment (POST)
// Purpose: Post a comment to the selected published article
// Input: Commenter name and the comment
// Output: Redirects to the article page with success message or alert
router.post('/article/comment', urlencodedParser, [
  [
    // Input validation for commenter name and comment
    check('commenter_name', 'Name cannot be empty.').notEmpty(),
    check('commenter_name', 'Name must be between 3 to 40 characters.').isLength({min: 3, max: 40}),
    check('comment', 'Comment cannot be empty.').notEmpty(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    const { commenter_name, comment } = req.body;
    // Purpose: Apply the bad-words profanity filter to the commenter name and comment
    // Reason: Prevent inappropriate content
    // Input: Commenter name and comment
    // Output: Filtered commenter name and comment
    filtered_name = filter.clean(commenter_name);
    filtered_comment = filter.clean(comment);
    if(!errors.isEmpty()) {
      const errorMessages = errors.array().map(error => error.msg);
      // Purpose: Redirect back to the article page and display the error messages
      // Reason: Unable to pass the error message directly beause redirect is not like render that can pass data
      // Solution: encodeURIComponent is used to encode the error messages to be passed as a query parameter
      return res.redirect(`/reader/article?id=${req.query.id}&errors=${encodeURIComponent(errorMessages.join('||'))}#new_comment`);
    }else{
      // Purpose: Insert the commenter name and comment into the database
      // Input: Profanity filtered commenter name and comment
      // Output: Insert the commenter name and comment of the respective article into the database
      const sql = `INSERT INTO Comments (article_id, commenter, comment) VALUES (${req.query.id}, ?, ?)`;
      db.run(sql, [filtered_name, filtered_comment], (err) => {
        if (err) {
          console.error('Error posting comment: ' + err.message);
          return res.status(500).send('Error posting comment');
        }
      });
      return res.redirect(`/reader/article?id=${req.query.id}&success=1#comments`)
    }
  }
])

// Route: /reader/article/like (GET)
// Purpose: Like or unlike the selected published article
// Input: Like or unlike query parameter and the request query article id parameter
router.get('/article/like', (req, res) => {
  const notLiked = req.query.like == '0';

  // Purpose: Retrieve the current likes count of the selected article from the database
  // Input: Request query parameter id
  // Output: Current likes count of the selected published article
  const getLikes = `SELECT likes FROM Articles WHERE id = ${req.query.id}`;
  db.get(getLikes, (err, row) => {
    if (err) {
      console.error('Error getting likes:', err);
      return res.status(500).send('Database error');
    }
    const currentLikes = row.likes;
    // Purpose: Update the likes count of the selected article
    // Input: The current likes count
    // Output: +1 like if the article is not liked yet, -1 like if the article is already liked
    // Reason: Math.max is used to prevent negative likes count
    const updateLikes = notLiked ? Math.max(0, currentLikes - 1) : currentLikes + 1;
    
    // Purpose: Update the likes count of the selected article int the database
    // Input: Updated likes count
    // Output: Update the likes count of the selected published article into the database
    const sql = `UPDATE Articles SET likes = ? WHERE id = ${req.query.id}`;
    db.run(sql, [updateLikes], (err) => {
      if (err) {
        console.error('Error updating likes:', err);
        return res.status(500).send('Database error');
      }
      
      // Redirect back to the article page with the appropriate query parameter
      res.redirect(`/reader/article?id=${req.query.id}${notLiked ? '#article' : '&like=1#article'}`);
    });
  });
});
module.exports = router;