// Set up express, bodyparser and EJS
const express = require('express');
const router = express();
const { check, validationResult } = require('express-validator')
const bcrypt = require('bcrypt');
var bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false })
router.use(bodyParser.urlencoded({ extended: true }));
router.set('view engine', 'ejs'); // set the router to use ejs for rendering
router.use(express.static(__dirname + '/public')); // set location of static files

router.get("/register", (req, res) => {
  res.render("authentication", {author: { author_name: 'Default Author', blog_title: 'Default Blog' }, req: req});
});

router.post("/register/auth", urlencodedParser, [
  [
    check('email', 'Please enter a valid email.').isEmail().normalizeEmail(),
    check('password', 'Password cannot be empty.').notEmpty(),
    check('confirm_password', 'Passwords do not match.').custom((value, { req }) => value === req.body.password)
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const alert = errors.array();
      return res.render('authentication', { alert, req: req});
    } else {
      const { email, password } = req.body;
      const sql = `UPDATE Authors SET email = ?, password = ? WHERE author_id = 1`;
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
          console.error("Error hashing password: " + err.message);
        }
        db.run(sql, [email, hash], (err) => {
          if (err) {
            console.error("Error registering: " + err.message);
            return res.status(500).send("Internal server error");
          }
          return res.redirect("/login?register=success");
        });
      });
    }
  }
]);

router.get("/login", (req, res) => {
  res.render("authentication", {author: { author_name: 'Default Author', blog_title: 'Default Blog' }, req: req});
});

router.post("/login/auth", (req, res) => {
  const { login_email, login_password } = req.body;
  const sql = `SELECT * FROM Authors WHERE author_id = 1`;
  db.get(sql, [], (err, row) => {
    if (err) {
      console.error("Error querying the database: " + err.message);
      return res.status(500).send("Internal server error");
    }
    if (row && row.email == login_email) {
      bcrypt.compare(login_password, row.password, (err, result) => {
        if (result) {
          req.session.loggedin = true;
          req.session.email = login_email;
          req.session.author_id = row.author_id;
          return res.redirect("/author/home");
        } else {
          return res.render("authentication", { alert: [{ msg: "Incorrect email or password." }], req: req});
        }
      });
    } else {
      return res.render("authentication", { alert: [{ msg: "Incorrect email or password." }], req: req });
    }
  });
});

module.exports = router