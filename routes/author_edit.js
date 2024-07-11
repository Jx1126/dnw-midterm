// Requiring the necessary modules
const express = require('express');
const router = express();
const bodyParser = require("body-parser");
const { convertTimeFormat } = require('../public/script.js');

// Middleware setup
router.use(bodyParser.urlencoded({ extended: true }));
router.set('view engine', 'ejs');
router.use(express.static(__dirname + '/public'));

// Route: /author/edit (GET)
// Purpose: Renders the author edit page
// Input: None
// Output: Renders the author edit page from author_edit.ejs
router.get('/edit', (req, res) => {
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

  // Purpose: Retrieve all the draft articles from the database
  // Input: Request query parameter id
  // Output: All the draft article rows
  const getDraftArticle = new Promise((resolve, reject) => {
    if (req.query.id != 'new') {
      const sql = `SELECT * FROM Articles WHERE id = '${req.query.id}'`;
      db.get(sql, (err, row) => {
        if (err) {
          console.error('Error querying the database: ' + err.message);
          reject(err);
        } else {
          resolve(row);
        }
      });
    } 
  });

  Promise.all([getBlogInformation, getDraftArticle])
    .then(([getBlogInformation, getDraftArticle]) => {
      let obj = { author: getBlogInformation, draft: getDraftArticle, convertTimeFormat }
      return res.render('author_edit', obj);
    })
    .catch((err) => {
      console.error('Error querying the database: ' + err.message);
      return res.render('author_edit', { author: { author_name: 'Default Author', blog_title: 'Default Blog' }});
    });
});

// Route: /author/edit (POST)
// Purpose: Save the draft article to the database
// Input: Draft article title, content and article id type
// Output: Redirect to author home page
router.post('/edit', (req, res) => {
  const { edit_title, edit_content, article_id } = req.body;

  let saveDraft;
  // Check if the article is a new draft or an existing draft
  if (article_id && article_id != 'new') {
    // Purpose: Update the existing draft article in the database with the latest changes
    // Input: Draft article title, content and article id
    // Output: Updated draft article
    saveDraft = new Promise((resolve, reject) => {
      const sql = `UPDATE Articles SET title = ?, content = ?, modified = CURRENT_TIMESTAMP WHERE id = ?`;
      db.run(sql, [edit_title, edit_content, article_id], (err) => {
          if (err) {
            console.error('Error querying the database: ' + err.message);
            reject(err);
          } else {
            resolve();
          }
        });
    });
  } else {
    // Purpose: Save the new draft article to the database
    // Input: Draft article title and content
    // Output: Inserted new draft article into the database
    saveDraft = new Promise((resolve, reject) => {
      const sql = `INSERT INTO Articles (author_id, title, content, type) VALUES (1, ?, ?, 'draft')`;
      db.run(sql, [edit_title, edit_content], (err) => {
        if (err) {
          console.error('Error querying the database: ' + err.message);
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  saveDraft.then(() => {
      return res.redirect('/author/home?changes=saved');
    })
    .catch((err) => {
      console.error('Error querying the database: ' + err.message);
      return res.status(500).send('Internal server error');
    });
});

module.exports = router;
