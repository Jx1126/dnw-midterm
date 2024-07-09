// Set up express, bodyparser and EJS
const express = require('express');
const router = express();
var bodyParser = require("body-parser");
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
      let obj = { author: getBlogInformation, draft: getDraftArticle }
      return res.render('author_edit', obj);
    })
    .catch((err) => {
      console.error('Error querying the database: ' + err.message);
      return res.render('author_edit', { author: { author_name: 'Default Author', blog_title: 'Default Blog' }});
    });
});

router.post('/edit', (req, res) => {
  const { edit_title, edit_content, article_id } = req.body;

  let saveDraft;
  
  if (article_id && article_id != 'new') {
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
