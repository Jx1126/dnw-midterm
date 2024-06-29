// Set up express, bodyparser and EJS
const express = require('express');
const router = express();
const { check, validationResult } = require('express-validator')
var bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false })
router.use(bodyParser.urlencoded({ extended: true }));
router.set('view engine', 'ejs'); // set the router to use ejs for rendering
router.use(express.static(__dirname + '/public')); // set location of static files

router.get('/home', (req, res) => {
  res.render('reader_home');
});

router.get('/article', (req, res) => {
  if(req.query.success) {
    return res.render('reader_articles', {success: 'Comment posted successfully.'});
  }
  res.render('reader_articles');
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
