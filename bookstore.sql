DROP TABLE IF EXISTS users;
CREATE TABLE users (
  user_id INT(10) NOT NULL AUTO_INCREMENT,
  username VARCHAR(20) NOT NULL,
  password VARCHAR(20) NOT NULL,
  email VARCHAR(50) DEFAULT NULL,
  user_type CHAR(8) NOT NULL,
  PRIMARY KEY (user_id),
  CHECK(user_type IN ('admin','customer','ban'))
);

DROP TABLE IF EXISTS books;
CREATE TABLE books (
  book_id INT(10) NOT NULL AUTO_INCREMENT,
  isbn VARCHAR(255) DEFAULT NULL,
  book_name VARCHAR(255) NOT NULL,
  author VARCHAR(255) DEFAULT NULL,
  origin_price INT(10) NOT NULL,
  price INT(10) NOT NULL,
  inventory INT(10) NOT NULL,
  description VARCHAR(2000) DEFAULT NULL,
  image_url VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (book_id)
);

DROP TABLE IF EXISTS orders;
CREATE TABLE orders (
    order_id INT(10) NOT NULL AUTO_INCREMENT,
  user_id INT(10) NOT NULL,
    order_date DATETIME NOT NULL,
  PRIMARY KEY (order_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

DROP TABLE IF EXISTS cart_items;
CREATE TABLE cart_items (
    cart_item_id INT(10) NOT NULL AUTO_INCREMENT,
  user_id INT(10) NOT NULL,
    book_id INT(10) NOT NULL,
  amount INT(10) NOT NULL,
  PRIMARY KEY (cart_item_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (book_id) REFERENCES books(book_id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS order_items;
CREATE TABLE order_items (
    order_item_id INT(10) NOT NULL AUTO_INCREMENT,
  order_id INT(10) NOT NULL,
    book_id INT(10) NOT NULL,
  amount INT(10) NOT NULL,
  price INT(10) NOT NULL,
  PRIMARY KEY (order_item_id),
    FOREIGN KEY (book_id) REFERENCES books(book_id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
);

INSERT INTO books VALUES('1','1','Life Force','Tony Robbins','3950','1950','1000','INSTANT #1 NEW YORK TIMES BESTSELLER\n\nTransform your life or the life of someone you love with Life Force—the newest breakthroughs in health technology to help maximize your energy and strength, prevent disease, and extend your health span—from Tony Robbins, author of the #1 New York Times bestseller Money: Master the Game.','https://images-na.ssl-images-amazon.com/images/I/41yzMkY-+vL._SX331_BO1,204,203,200_.jpg');
INSERT INTO books VALUES('2','2','Chicka Chicka Boom Boom','Bill Martin Jr.','2099','1099','1000','There is always enough room on your childs bookshelf for this Classic Board Book edition of the rollicking alphabet chant that has been a childrens favorite for over thirty years!\n\nA told B,\nand B told C,\nI will meet you at the\ntop of the coconut tree','https://images-na.ssl-images-amazon.com/images/I/51Uvw0rSDgL._SX377_BO1,204,203,200_.jpg');
INSERT INTO books VALUES('3','3','The Handmaids Tale','Margarret Atwood','3099','1499','1000',' An instant classic and eerily prescient cultural phenomenon, from “the patron saint of feminist dystopian fiction” (The New York Times). Now an award-winning Hulu series starring Elizabeth Moss.','https://images-na.ssl-images-amazon.com/images/I/41vgWYsM82L._SX323_BO1,204,203,200_.jpg');
INSERT INTO users VALUES('1','nzy','123456','0107nzy@sjtu.edu.cn','admin');
INSERT INTO users VALUES('2','customer','123456','customer@sjtu.edu.cn','customer');
INSERT INTO users VALUES('3','custumorban','123456','customerban@sjtu.edu.cn','ban');