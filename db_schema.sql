
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
    FOREIGN KEY (author_id) REFERENCES Authors(id)
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

INSERT INTO Authors (author_name, blog_title) VALUES ('Jinx', 'HELPP');

COMMIT;

