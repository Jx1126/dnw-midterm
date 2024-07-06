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
  creation DATE DEFAULT CURRENT_TIMESTAMP,
  modified DATE DEFAULT CURRENT_TIMESTAMP,
  publication DATE,
  type TEXT CHECK(type IN ('draft', 'published')),
  FOREIGN KEY (author_id) REFERENCES Authors(author_id)
);

-- Table for comments
CREATE TABLE IF NOT EXISTS Comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  article_id INTEGER,
  commenter TEXT NOT NULL,
  comment TEXT NOT NULL,
  creation DATE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (article_id) REFERENCES Articles(id)
);

-- Entering some placeholder data for demonstration purposes 
INSERT INTO Authors (author_name, blog_title) VALUES ('Default Author', 'Default Title');

INSERT INTO Articles (title, content, reads, likes, author_id, creation, modified, publication, type) 
  VALUES ('Lorem Ipsum 1', 'Ut tellus velit, mattis sed massa vitae, auctor finibus lectus. Ut sollicitudin sem eget enim dignissim porta quis in sapien. Morbi ex justo, fringilla eu imperdiet ac, tincidunt sit amet turpis. In hac habitasse platea dictumst. In quis nibh libero. Praesent efficitur iaculis metus nec euismod. Suspendisse at elit quam.
           
           Ut sit amet metus at lacus vulputate dapibus et eget ante. Donec id pharetra enim, a malesuada lorem. Nullam faucibus imperdiet aliquam. Curabitur tristique vehicula risus id dignissim. Duis aliquam molestie enim, ac rutrum quam semper eget. Donec volutpat fermentum eros non tincidunt. Morbi et lacus leo. Aliquam tincidunt dui ipsum, id dapibus leo venenatis at. Sed finibus ornare pulvinar. Pellentesque egestas, enim dictum pharetra sagittis, mauris justo hendrerit nisl, nec sodales neque enim quis eros. Fusce maximus odio et enim lacinia, vel elementum lectus dictum. Suspendisse pulvinar turpis magna.
           
           Maecenas commodo erat quis tortor sodales pulvinar. Nunc id porta orci. Nunc quis nulla eget nisl consectetur tincidunt quis ac erat. Fusce lobortis sodales maximus. Praesent sagittis gravida vehicula. In blandit ex quis varius bibendum. Maecenas imperdiet rhoncus felis, nec varius mauris pharetra sit amet. Etiam ante nisi, fermentum vitae dignissim ac, pretium a elit. Nunc leo magna, laoreet in lacus in, pulvinar aliquam odio. Aliquam quis libero arcu.', 
           50, 30, 1, '2024-01-10', '2024-02-13', '2024-02 15', 'draft');

INSERT INTO Articles (title, content, reads, likes, author_id, creation, modified, publication, type)
  VALUES ('Lorem Ipsum 2', 'Sed elementum tincidunt nulla, ut elementum augue ultrices ac. Mauris ultricies mauris in odio tempus vehicula. Praesent nec aliquet purus. Pellentesque lacus ipsum, ultrices tincidunt dui vel, luctus finibus lorem. Phasellus lacinia vulputate nibh id consectetur. Curabitur nisl felis, condimentum sit amet malesuada at, pretium ac est. Vivamus eleifend metus ut tortor hendrerit, sed suscipit velit placerat. Mauris bibendum sapien eu felis scelerisque eleifend. Phasellus pellentesque nec lacus scelerisque scelerisque.
           
           Praesent faucibus metus a euismod feugiat. Phasellus rhoncus magna enim, tincidunt rhoncus sem ultrices vitae. Aenean viverra consectetur arcu non finibus. Morbi scelerisque fermentum magna vitae cursus. Ut ligula enim, feugiat nec vestibulum sit amet, dignissim non arcu. Integer at velit sapien. Phasellus blandit leo ut ex luctus auctor. Duis eu sem eget arcu efficitur hendrerit commodo at sapien. Vestibulum vehicula enim non sagittis vehicula.
           
           Maecenas quis porttitor leo. Aenean tempus leo condimentum metus consequat dapibus. Praesent eget quam non augue auctor facilisis in nec metus. Phasellus eget ex congue, sagittis erat a, facilisis est. Fusce feugiat justo vitae arcu ultrices tristique. Suspendisse sed metus interdum, tempor mi eu, ultricies orci. Pellentesque ut nibh eget velit accumsan blandit. Interdum et malesuada fames ac ante ipsum primis in faucibus. Maecenas ut fringilla elit, ac vestibulum purus. Nulla non rhoncus dolor.', 
           120, 50, 1, '2024-02-11', '2024-02-14', '2024-02-16', 'draft');

INSERT INTO Articles (title, content, reads, likes, author_id, creation, modified, publication, type)
  VALUES ('Lorem Ipsum 3', 'Cras vel risus commodo, blandit felis vitae, hendrerit sapien. Pellentesque sit amet scelerisque urna, vel porttitor purus. Nam gravida eleifend urna, sed iaculis nunc aliquet vel. Praesent scelerisque lobortis commodo. Suspendisse in sapien nibh. Pellentesque lorem lorem, efficitur non varius sed, finibus eu eros. Vestibulum commodo lorem eu est semper gravida.
           
           Vivamus ac odio et tortor dapibus fringilla non ut purus. Suspendisse porta scelerisque sapien, nec auctor felis porta sit amet. Aenean rhoncus ut dui id fermentum. Quisque nisi metus, tristique sit amet mi finibus, luctus vehicula libero. Nam lectus metus, sagittis vel enim ac, tristique iaculis justo. Nulla a ipsum ut urna finibus pretium ut vitae massa. Quisque efficitur, lorem a suscipit ultrices, ante leo cursus sapien, id maximus massa augue vel purus. Integer quis massa eget enim scelerisque consectetur at eu quam. In et massa ac enim auctor pretium ultricies non eros.
           
           Duis placerat finibus ipsum. Ut pulvinar posuere arcu eget commodo. Praesent consequat porta ullamcorper. Praesent id est facilisis, porttitor massa a, interdum turpis. Nulla mattis iaculis eros non tincidunt. Fusce vestibulum dui vitae suscipit ornare. Praesent vel pretium mi. Nulla facilisi. Vestibulum et volutpat magna, quis pharetra leo. Aliquam et est et tortor viverra imperdiet. Fusce varius dolor dolor. Vivamus maximus tristique augue a lobortis. Etiam eu neque mollis, lacinia erat eget, cursus justo. Curabitur maximus nulla non dolor tristique, id ullamcorper nulla volutpat. Nam hendrerit malesuada arcu vel tristique. Donec a egestas massa.', 
           100, 30, 1, '2024-03-12', '2024-02-15', '2024-02-17', 'published');

INSERT INTO Articles (title, content, reads, likes, author_id, creation, modified, publication, type)
  VALUES ('Lorem Ipsum 4', 'Vivamus rhoncus augue ex, non bibendum velit rutrum vel. Phasellus sit amet ligula eget purus blandit tempor. Vestibulum vel sollicitudin nisi, nec porta nisi. Cras eget feugiat tellus, et posuere justo. Nullam dignissim lobortis iaculis. Phasellus imperdiet, leo in volutpat dignissim, justo nisl sodales dolor, at interdum justo lacus in lorem. Sed a ligula auctor, lacinia leo vitae, pharetra felis. Praesent varius lorem non tellus pharetra, quis malesuada ex gravida. Sed et ante consequat dolor consequat tincidunt.
           
           Suspendisse rhoncus sem tortor, eu porttitor libero cursus et. In hac habitasse platea dictumst. Maecenas nulla turpis, volutpat quis felis sit amet, lobortis semper orci. Etiam scelerisque eu urna quis interdum. Vivamus eu consequat ligula. Duis nec mattis dolor, et imperdiet libero. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed posuere vitae lacus et iaculis. Ut rutrum hendrerit efficitur. Nam augue dui, volutpat vel nisl sed, faucibus lacinia velit. Integer eleifend justo ipsum, eget consequat tellus aliquam vitae. Curabitur euismod elit id sem congue, nec ornare mi blandit. Nullam dignissim purus et nisl sodales tempus.
           
           Suspendisse posuere molestie ipsum a condimentum. In sed urna ante. Aliquam in nunc dignissim, venenatis massa eget, feugiat mi. Aenean tempor congue quam, nec pellentesque leo. Suspendisse dui augue, porttitor eu nulla sed, rutrum pharetra dui. Donec eros urna, sollicitudin at augue blandit, porta tempus nulla. Ut nunc elit, feugiat et arcu tristique, semper elementum risus. Proin est ex, sagittis ac nulla pellentesque, maximus semper neque. Proin rhoncus leo non mattis tempor. Phasellus luctus sapien nec ultrices rutrum. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Pellentesque rhoncus, libero vitae ullamcorper dignissim, nulla ante scelerisque nibh, et aliquet lectus nibh sit amet justo. Proin eu justo et erat posuere varius.', 
           50, 20, 1,  '2024-04-14',  '2024-02-17', '2024-02-19', 'published');

INSERT INTO Articles (title, content, reads, likes, author_id, creation, modified, publication, type)
  VALUES ('Lorem Ipsum 5', 'Vestibulum iaculis vestibulum nunc, sit amet hendrerit ex tristique ac. Quisque eget faucibus orci, id ullamcorper mi. Quisque sit amet iaculis enim. Aliquam erat volutpat. Sed elementum iaculis nulla bibendum vehicula. Donec congue lectus nec auctor consequat. Suspendisse ut convallis leo, et ornare tortor. Curabitur ornare, lectus et lobortis volutpat, massa erat luctus ipsum, ac posuere risus neque eget nulla. Nullam accumsan, lectus sit amet ornare rhoncus, leo libero tincidunt felis, sit amet tincidunt lorem dui nec mi. Morbi lectus lorem, ultricies sit amet erat in, sollicitudin viverra enim. Integer vitae sagittis odio, eu fermentum dui. Integer vitae tortor magna. Cras quis urna molestie, ultrices odio sit amet, facilisis ligula. Mauris quis semper felis, ut posuere nisi.
           
           Maecenas ac dictum tellus. Curabitur volutpat felis lobortis libero dignissim molestie quis egestas tellus. Mauris augue odio, mollis sed odio eu, scelerisque hendrerit mi. In fringilla, nisl at sodales vestibulum, sapien nisl convallis quam, et ullamcorper sapien mauris ac odio. Cras lacinia sed nunc eget molestie. Nullam sem urna, scelerisque vel auctor in, interdum eget eros. Sed gravida tincidunt tristique.
           
           Etiam fermentum sagittis dui, vitae efficitur magna hendrerit ut. Curabitur tempor at diam nec dapibus. Proin ac risus nec eros dignissim pretium. Pellentesque elementum, mi ac sollicitudin posuere, nibh magna vestibulum purus, ut pellentesque leo ipsum sed augue. Phasellus a sem non massa aliquet egestas sed at mi. Fusce varius, leo non dictum suscipit, est augue porta mauris, sit amet egestas tortor eros cursus justo. Mauris hendrerit consectetur mauris nec mattis. Donec vel nibh sit amet mauris tristique rutrum et vel tortor. Cras vitae eros et libero lobortis rutrum. Donec sit amet nisl quis ex volutpat gravida. Donec et risus sem.', 
           70, 30, 1,  '2024-05-16',  '2024-02-19', '2024-02-21', 'published');


COMMIT;

