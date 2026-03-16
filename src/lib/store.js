const { getDb } = require("./db");

function listProducts({ search, limit, offset } = {}) {
  db=getDb();
  let sql = "SELECT id, name, price, category_id FROM products";
  const params = [];

  if (search) {
    sql =sql + " WHERE name LIKE ?";
    params.push(`%${search}%`);
  }

  sql += " ORDER BY id";

  if (limit !== undefined) {
    sql += " LIMIT ?";
    params.push(Number(limit));
  }

  if (offset !==undefined) {
    sql += " OFFSET ?";
    params.push(Number(offset));
  }

  return db.prepare(sql).all(...params);
}

function findProductById(id) {
  db=getDb();
  return db
    .prepare("SELECT id, name, price, category_id FROM products WHERE id = ?")
    .get(id);
}
// 
function createProduct({ name, price, categoryId }) {
  db=getDb();
  const result = db
    .prepare(
      "INSERT INTO products (name, price, category_id) VALUES (?, ?, ?)"
    )
    .run(name, price, categoryId);

  return findProductById(result.lastInsertRowid);
}

function updateProduct(id, { name, price, categoryId }) {
  db=getDb();
  const result = db
    .prepare(
      "UPDATE products SET name = ?, price = ?, category_id = ? WHERE id = ?"
    )
    .run(name, price, categoryId, id);

  if (result.changes === 0) return null;
  return findProductById(id);
}

function deleteProduct(id) {
  db=getDb();
  const result = db.prepare("DELETE FROM products WHERE id = ?").run(id);
  return result.changes > 0;
}

function listCategories({ search, limit, offset } = {}) {
  db=getDb();
  let sql = "SELECT id, name FROM categories";
  const params = [];

  if (search) {
    sql += " WHERE name LIKE ?";
    params.push(`%${search}%`);
  }

  sql += " ORDER BY name";

  if (limit) {
    sql += " LIMIT ?";
    params.push(Number(limit));
  }

  if (offset) {
    sql += " OFFSET ?";
    params.push(Number(offset));
  }

  return db.prepare(sql).all(...params);
}

function findCategoryById(id) {
  db=getDb();
const result =db.prepare("SELECT id, name FROM categories WHERE id = ?").get(id);
return (result);
}

function createCategory({ name }) {
  db=getDb();
  const result = db
    .prepare("INSERT INTO categories (name) VALUES (?)")
    .run(name);
  return findCategoryById(result.lastInsertRowid);
}

function updateCategory(id, { name }) {
  db=getDb();
  const result = db
    .prepare("UPDATE categories SET name = ? WHERE id = ?")
    .run(name, id);
  if (result.changes === 0) return null;
  return findCategoryById(id);
}

function deleteCategory(id) {
  db=getDb();
  const result = db.prepare("DELETE FROM categories WHERE id = ?").run(id);
  return result.changes > 0;
}

function findUserByEmail(email) {
  db=getDb();
  return db
    .prepare("SELECT id, email, password_hash, role FROM users WHERE email = ?")
    .get(email);
}

function findUserById(id) {
  db=getDb();
  return db
    .prepare("SELECT id, email, role FROM users WHERE id = ?")
    .get(id);
}

module.exports = {
  listProducts,
  findProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  listCategories,
  findCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  findUserByEmail,
  findUserById
};
// 5059a7da0fcb824f03820d85c0bd4bf717348795f54af5d5
