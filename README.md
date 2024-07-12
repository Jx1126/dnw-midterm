# CM2040 - Databases, Network and the Web Midterm Coursework
## Libraries used:
- [`Node.JS`](https://nodejs.org/en) - Javascript runtime environment
- [`NPM`](https://www.npmjs.com/) - Package manager
- [`Express`](https://expressjs.com/) - Web application framework
- [`Express Validator`](https://express-validator.github.io/docs/) - Validation middleware
- [`Express Session`](https://www.npmjs.com/package/express-session) - Session middleware
- [`SQLite3`](https://www.npmjs.com/package/sqlite3) - Database engine
- [`Bcrypt`](https://www.npmjs.com/package/bcrypt) - Password handling and hashing
- [`Dotenv`](https://www.npmjs.com/package/dotenv) - Environment variable management
- [`Bad Words`](https://www.npmjs.com/package/bad-words) - Profanity filter
- [`TailwindCSS`](https://tailwindcss.com/) - CSS framework
- [`DaisyUI`](https://daisyui.com/) - Component library for TailwindCSS
- [`Autoprefixer`](https://www.npmjs.com/package/autoprefixer) - CSS vendor fixing
  
## Getting Started
### Prerequisite
- Node.JS installed
- NPM installed

### Installation
#### 1. Install the required node modules:
```
npm install
```

#### 2. Build the database:
- For Mac and Linux users: 
```
npm run build-db
```
- For Window users: 
```
npm run build-db-win
```

#### 3. Start the application
```
npm run start
```

### Development
**Important:** This step is optional. It should only be ran when developing CSS for the website. Otherwise, just ignore.

- Run the CLI tool to scan your template files for classes and build your CSS.
  
```
npm run build-css
```
