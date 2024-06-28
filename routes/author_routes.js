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
  if(req.query.success) {
    return res.render('author_home', {success: 'Settings saved successfully.'});
  }
  res.render('author_home');
});

router.get('/settings', (req, res) => {
  res.render('author_settings');
});

router.get('/edit', (req, res) => {
  res.render('author_edit');
});

router.post('/settings', urlencodedParser, [
  [
    check('author_name', 'Author name cannot be empty.').notEmpty(),
    check('author_name', 'Author name must be between 3 to 50 characters.').isLength({min: 3, max: 40}),
    check('blog_title', 'Blog title cannot be empty.').notEmpty(),
    check('blog_title', 'Blog title must be between 3 to 100 characters.').isLength({min: 3, max: 100})
  ],
  (req, res) => {
      const errors = validationResult(req);
      if(!errors.isEmpty()) {
          // return res.status(422).jsonp(errors.array())
          const alert = errors.array()
          res.render('author_settings', {
              alert
          })
      }else{
          // res.send('Successfully registered for '+req.body.username)
          return res.redirect('/author/home?success=1')
      }
  }
])

module.exports = router;