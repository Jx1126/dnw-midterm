const express = require('express');
const router = express();
var bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false })
router.use(bodyParser.urlencoded({ extended: true }));
router.set('view engine', 'ejs'); // set the router to use ejs for rendering
router.use(express.static(__dirname + '/public')); // set location of static files

router.get('/home', (req, res) => {
  res.render('reader_home');
});

router.get('/article', (req, res) => {
    res.render('reader_articles');
});

module.exports = router;
