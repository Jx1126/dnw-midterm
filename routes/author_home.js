// Set up express, bodyparser and EJS
const express = require('express');
const router = express();
const bodyParser = require("body-parser");
const { convertTimeFormat } = require('../public/script.js');

// Middleware setup
router.use(bodyParser.urlencoded({ extended: true }));
router.set('view engine', 'ejs');
router.use(express.static(__dirname + '/public'));

// Route: /author/home (GET)
// Purpose: Renders the author home page
// Input: None
// Output: Renders the author home page from author_home.ejs
router.get('/home', (req, res) => {
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

  // Purpose: Retrieve all the published articles from the database
  // Input: None
  // Output: All the published article rows
  const getPublishedArticles = new Promise((resolve, reject) => {
    const sql = `SELECT * FROM Articles WHERE type = 'published'`;
    db.all(sql, (err, rows) => {
      if (err) {
        console.error('Error querying the database: ' + err.message);
        reject(err);
      } else {
        resolve(rows || []);
      }
    });
  });

  // Purpose: Retrieve all the draft articles from the database
  // Input: None
  // Output: All the draft article rows
  const getDraftArticles = new Promise((resolve, reject) => {
    const sql = `SELECT * FROM Articles WHERE type = 'draft'`;
    db.all(sql, (err, rows) => {
      if (err) {
        console.error('Error querying the database: ' + err.message);
        reject(err);
      } else {
        resolve(rows || []);
      }
    });
  });

  Promise.all([getBlogInformation, getPublishedArticles, getDraftArticles])
    .then(([getBlogInformation, getPublishedArticles, getDraftArticles]) => {
      let obj = { author: getBlogInformation, published: getPublishedArticles, draft: getDraftArticles, convertTimeFormat }
      // Store toast messages to be displayed in the author homepage depending on the query parameters
      if (req.query.success) {
        obj.success = 'Settings saved successfully.'
      }
      if(req.query.changes == 'saved') {
        obj.changes = 'Draft updated successfully.'
      }
      if(req.query.deleted == 'true') {
        obj.deleted = 'Article deleted successfully.'
      }
      if(req.query.publish == 'true') {
        obj.publish = 'Article published successfully.'
      }
      if(req.query.login == 'success') {
        obj.login = 'Login successful. Welcome!'
      }
      return res.render('author_home', obj);
    })
    .catch((err) => {
      console.error('Error querying the database: ' + err.message);
      return res.render('author_home', { author: { author_name: 'Default Author', blog_title: 'Default Blog' }, success: req.query.success ? 'Settings saved successfully.' : null });
    });
});

// Route: /author/publish (GET)
// Purpose: Publish the draft article 
// Input: Article id
// Output: Redirect to author home page
router.get('/publish', (req, res) => {
  // Purpose: Update the article from draft to published in the database and set the publication time
  // Input: Article id
  // Output: Update the article information in the database
  const sql = `UPDATE Articles SET publication = CURRENT_TIMESTAMP, type = 'published' WHERE id = '${req.query.id}'`;
  db.run(sql, (err) => {
    if (err) {
      console.error('Error publishing the article: ' + err.message);
    }
    return res.redirect('/author/home?publish=true');
  });
});

// Route: /author/delete (GET)
// Purpose: Delete the article
// Input: Article id
// Output: Redirect to author home page
router.get('/delete', (req, res) => {
  // Purpose: Delete all the comments from the selected article from the database
  // Reason: If comments are not deleted before the selected article is deleted, it will cause a foreign key constraint error
  // Input: Article id
  // Output: Delete all the comments from the selected article
  const removeComments = `DELETE FROM Comments WHERE article_id = '${req.query.id}'`;
  db.run(removeComments, (err) => {
    if (err) {
      console.error('Error deleting comments: ' + err.message);
    }
    // Purpose: Delete the selected article from the database
    // Input: Article id
    // Output: Delete the selected article
    const sql = `DELETE FROM Articles WHERE id = '${req.query.id}'`;
    db.run(sql, (err) => {
      if (err) {
        console.error('Error deleting the article: ' + err.message);
      }
      return res.redirect('/author/home?deleted=true');
    });
  });

});

module.exports = router;
