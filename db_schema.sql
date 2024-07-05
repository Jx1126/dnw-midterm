-- This makes sure that foreign_key constraints are observed and that errors will be thrown for violations
PRAGMA foreign_keys=ON;

BEGIN TRANSACTION;

-- Create your tables with SQL commands here (watch out for slight syntactical differences with SQLite vs MySQL)
-- Table for authors to set up the blog
CREATE TABLE IF NOT EXISTS Authors (
  author_id INTEGER PRIMARY KEY AUTOINCREMENT,
  author_name TEXT NOT NULL,
  blog_title TEXT NOT NULL
);

-- Table for articles
CREATE TABLE IF NOT EXISTS Articles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT,
  reads INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  author_id INTEGER,
  creation DATETIME DEFAULT CURRENT_TIMESTAMP,
  modified DATETIME DEFAULT CURRENT_TIMESTAMP,
  publication DATETIME,
  type TEXT CHECK(type IN ('draft', 'published')),
  FOREIGN KEY (author_id) REFERENCES Authors(author_id)
);

-- Table for comments
CREATE TABLE IF NOT EXISTS Comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  article_id INTEGER,
  commenter TEXT NOT NULL,
  comment TEXT NOT NULL,
  creation DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (article_id) REFERENCES Articles(id)
);

-- Entering some placeholder data for demonstration purposes 
INSERT INTO Authors (author_name, blog_title) VALUES ('Default Author', 'Default Title');
INSERT INTO Articles (title, content, reads, likes, author_id, creation, modified, publication, type) VALUES ('Example Title', 'Example Content', 50, 30, 1, '2024-01-10', '2024-02-13', '2024-02-15', 'draft');
INSERT INTO Articles (title, content, reads, likes, author_id, creation, modified, publication, type) VALUES ('Example Title 2', 'Example Content 2', 150, 130, 1, '2024-02-11', '2024-02-14', '2024-02-16', 'draft');
INSERT INTO Articles (title, content, reads, likes, author_id, creation, modified, publication, type) VALUES ('Example Title 3', 'Example Content 3', 100, 50, 1, '2024-03-12', '2024-02-15', '2024-02-17', 'published');
INSERT INTO Articles (title, content, reads, likes, author_id, creation, modified, publication, type) VALUES ('Example Title 4', 'Example Content 4', 50, 10, 1, '2024-04-14', '2024-02-17', '2024-02-19', 'published');
INSERT INTO Articles (title, content, reads, likes, author_id, creation, modified, publication, type) VALUES ('Example Title 5', 'Example Content 5', 70, 20, 1, '2024-05-16', '2024-02-19', '2024-02-21', 'published');

COMMIT;

