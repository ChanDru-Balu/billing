CREATE TABLE IF NOT EXISTS songtable(
    id VARCHAR(11) PRIMARY KEY ,
    artistName TEXT UNIQUE, 
    songName TEXT
);

CREATE TABLE IF NOT EXISTS categorytable(
    id VARCHAR(11) PRIMARY KEY ,
    categoryName TEXT UNIQUE
);

CREATE TABLE IF NOT EXISTS producttable(
    id VARCHAR(11) PRIMARY KEY ,
    categoryId TEXT,
    productName TEXT UNIQUE,
    gst INTEGER,
    price FLOAT,
    quantity INTEGER(7)
);

CREATE TABLE IF NOT EXISTS customertable(
    id VARCHAR(11) PRIMARY KEY ,
    customerName TEXT UNIQUE,
    mobile TEXT UNIQUE,
    address1 TEXT
);

CREATE TABLE IF NOT EXISTS sellertable(
    id VARCHAR(11) PRIMARY KEY ,
    sellerName TEXT UNIQUE,
    mobile TEXT UNIQUE,
    gst TEXT,
    address1 TEXT
);

CREATE TABLE IF NOT EXISTS purchasetable(
    id VARCHAR(11) PRIMARY KEY ,
    purchaseDate TEXT,
    invoice TEXT UNIQUE,
    total INTEGER,
    discount INTEGER,
    grandTotal INTEGER,
    sellerId TEXT,
    items VARCHAR
);

CREATE TABLE IF NOT EXISTS salestable(
    id VARCHAR(11) PRIMARY KEY ,
    sellDate TEXT,
    invoice TEXT UNIQUE,
    total INTEGER,
    discount INTEGER,
    grandTotal INTEGER,
    customerId TEXT,
    items VARCHAR
);

