const Database = require("better-sqlite3");
const path = require("node:path");
const fs = require("node:fs");
const { hashPassword } = require("./passwords");

const DB_PATH =
  process.env.DB_PATH || path.join(__dirname, "..", "..", "data", "app.db");

// const db = new Database(DB_PATH);
let db;
function getDb(){
  if(!db){
    db=new Database(DB_PATH)
  }
  return db;
}
function closeDb(){
  if(db){
    db.close();
    db=null;
  }
}

function initDb() {
  db=getDb();
  const schemaPath = path.join(__dirname, "..", "..", "data", "schema.sql");
  const schema = fs.readFileSync(schemaPath, "utf8");
  db.exec(schema);

  const userCount = db.prepare("SELECT COUNT(*) AS count FROM users").get().count;
  if (userCount === 0) {
    const passwordHash = hashPassword("admin123");
    db.prepare(
      "INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)"
    ).run("admin@example.com", passwordHash, "admin");
  }

  const categoryCount = db
    .prepare("SELECT COUNT(*) AS count FROM categories")
    .get().count;
  if (categoryCount === 0) {
    const insertCategory = db.prepare(
      "INSERT INTO categories (name) VALUES (?)"
    );
    ["office", "electronics", "lifestyle"].forEach((name) => {
      insertCategory.run(name);
    });
  }

  const productCount = db
    .prepare("SELECT COUNT(*) AS count FROM products")
    .get().count;
  if (productCount === 0) {
    const categoryMap = db
      .prepare("SELECT id, name FROM categories")
      .all()
      .reduce((acc, c) => {
        acc[c.name] = c.id;
        return acc;
      }, {});

    const insertProduct = db.prepare(
      "INSERT INTO products (name, price, category_id) VALUES (?, ?, ?)"
    );
    insertProduct.run("Laptop Stand", 39.99, categoryMap.office);
    insertProduct.run("USB-C Hub", 24.5, categoryMap.electronics);
    insertProduct.run("Notebook", 5.25, categoryMap.office);
    insertProduct.run("Water Bottle", 12, categoryMap.lifestyle);
  }
}

module.exports = { getDb,closeDb, initDb, DB_PATH };
