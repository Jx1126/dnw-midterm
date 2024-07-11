// Set up express, bodyparser and EJS
const express = require('express');
const router = express();
const { check, validationResult } = require('express-validator')
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
var bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false })
router.use(bodyParser.urlencoded({ extended: true }));
router.set('view engine', 'ejs'); // set the router to use ejs for rendering
router.use(express.static(__dirname + '/public')); // set location of static files

dotenv.config();

// Route: /register (GET)
// Purpose: Renders the registration page
// Input: None
// Output: Renders the registration page from authentication.ejs
router.get("/register", (req, res) => {
  res.render("authentication", {author: { author_name: 'Default Author', blog_title: 'Default Blog' }, req: req, login: false});
});


// Route: /register/auth (POST)
// Purpose: Validate and register the author with the provided email and password
// Input: Email and password from the registration form
// Output: Redirects to login page if successful, else renders the registration page with an alert
router.post("/register/auth", urlencodedParser, [
  [
    // Validate email and password
    check('email', 'Please enter a valid email.').isEmail().normalizeEmail(),
    check('password', 'Password cannot be empty.').notEmpty(),
    check('confirm_password', 'Passwords do not match.').custom((value, { req }) => value === req.body.password)
  ],
  (req, res) => {
    // Render the registration page with the alert if there are errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const alert = errors.array();
      return res.render('authentication', { alert, req: req, author: { author_name: 'Default Author', blog_title: 'Default Blog'}, login: false });
    } else {
      // Get the email and password from the request body
      const { email, password } = req.body;

      // Purpose: Update the author's email in the database
      // Input: Email
      // Output: Updates the author's email in the database
      const sql = `UPDATE Authors SET email = ? WHERE author_id = 1`;
      // Hashing the password
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
          console.error("Error hashing password: " + err.message);
        }
        // Update the .env file with the hashed password
        const pathToEnv = path.resolve(__dirname, '../.env');
        let readEnv = fs.readFileSync(pathToEnv, 'utf8');
        let modifyEnv = readEnv.replace(/AUTHOR_PASSWORD=.*$/m, `AUTHOR_PASSWORD=${hash}`);
        fs.writeFileSync(pathToEnv, modifyEnv);

        dotenv.config();

        // Database interaction: Update the author's email in the database
        db.run(sql, [email], (err) => {
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

// Route: /login (GET)
// Purpose: Renders the login page
// Input: None
// Output: Renders the login page from authentication.ejs
router.get("/login", (req, res) => {
  res.render("authentication", {author: { author_name: 'Default Author', blog_title: 'Default Blog' }, req: req, login: true});
});

// Route: /login/auth (POST)
// Purpose: Validate the author's email and password and log them in
// Input: Email and password from the login form
// Output: Redirects to author home page if successful, else renders the login page with an alert
router.post("/login/auth", (req, res) => {
  const { login_email, login_password } = req.body;
  // Purpose: Get the author's email from the database
  // Input: None
  // Output: Author row from the database
  const sql = `SELECT * FROM Authors WHERE author_id = 1`;
  // Database interaction: Get the author's email from the database
  db.get(sql, [], (err, row) => {
    if (err) {
      console.error("Error querying the database: " + err.message);
      return res.status(500).send("Internal server error");
    }
    // Compare the email from the database with the input email
    if (row && row.email == login_email) {
      // Compare the hashed password from the .env file with the input password
      bcrypt.compare(login_password, process.env.AUTHOR_PASSWORD, (err, result) => {
        if (result) {
          // Set the session to logged in if the email and password matches
          req.session.loggedin = true;
          return res.redirect("/author/home?login=success");
        } else {
          return res.render("authentication", { alert: [{ msg: "Incorrect email or password." }], req: req, author: { author_name: 'Default Author', blog_title: 'Default Blog'}, login: true});
        }
      });
    } else {
      return res.render("authentication", { alert: [{ msg: "Incorrect email or password." }], req: req, author: { author_name: 'Default Author', blog_title: 'Default Blog'}, login: true});
    }
  });
});

module.exports = router