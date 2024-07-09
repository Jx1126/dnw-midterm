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

  const getPublishedArticle = new Promise((resolve, reject) => {
    const sql = `SELECT * FROM Articles WHERE id = '${req.query.id}';`;
    db.get(sql, (err, rows) => {
      if (err) {
        console.error('Error querying the database: ' + err.message);
        reject(err);
      } else {
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
      let obj = { author: getBlogInformation, published: getPublishedArticle, comments: getComments, req: req}
      if (req.query.success) {
        obj.success = 'Comment posted successfully.'
      }
      return res.render('reader_articles', obj);
    })
    .catch((err) => {
      console.error('Error querying the database: ' + err.message);
      return res.render('reader_articles', { author: { author_name: 'Default Author', blog_title: 'Default Blog' }, success: req.query.success ? 'Comment posted successfully.' : null, req: req});
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
            alert,
            published: {}
        })
    }else{
      const { commenter_name, comment } = req.body;
      const article_id = req.query.id;
      const sql = `INSERT INTO Comments (article_id, commenter, comment) VALUES (?, ?, ?)`;
      db.run(sql, [article_id, commenter_name, comment], (err) => {
        if (err) {
          console.error('Error posting comment: ' + err.message);
          return res.status(500).send('Error posting comment');
        }
      });
      return res.redirect(`/reader/article?id=${article_id}&success=1#comments`)
    }
  }
])

router.get('/article/like', (req, res) => {
  const notLiked = req.query.like == '0';

  // First, get the current likes count
  const getLikes = `SELECT likes FROM Articles WHERE id = ${req.query.id}`;
  db.get(getLikes, (err, row) => {
    if (err) {
      console.error('Error getting likes:', err);
      return res.status(500).send('Database error');
    }
    
    const currentLikes = row.likes;
    const updateLikes = notLiked ? Math.max(0, currentLikes - 1) : currentLikes + 1;
    
    // Update the likes count
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