// Set up express, bodyparser and EJS
const express = require('express');
const router = express();
var bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({ extended: true }));
router.set('view engine', 'ejs'); // set the router to use ejs for rendering
router.use(express.static(__dirname + '/public')); // set location of static files
const { convertTimeFormat } = require('../public/script.js');


router.get('/home', (req, res) => {
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

router.get('/publish', (req, res) => {
  const sql = `UPDATE Articles SET publication = CURRENT_TIMESTAMP, type = 'published' WHERE id = '${req.query.id}'`;
  db.run(sql, (err) => {
    if (err) {
      console.error('Error publishing the article: ' + err.message);
    }
    return res.redirect('/author/home?publish=true');
  });
});

router.get('/delete', (req, res) => {
  const removeComments = `DELETE FROM Comments WHERE article_id = '${req.query.id}'`;
  db.run(removeComments, (err) => {
    if (err) {
      console.error('Error deleting comments: ' + err.message);
    }
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
