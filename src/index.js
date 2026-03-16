const express = require("express");
const { initDb, getDb } = require("./lib/db");
const {
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
} = require("./lib/store");
const { hashPassword } = require("./lib/passwords");
const {
  validateProduct,
  validateCategory,
  validateLogin,
} = require("./lib/validate");
const { login, requireAuth, register } = require("./lib/auth");

function createApp() {
  initDb();

  const app = express();
  app.use(express.json());

  app.get("/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/auth/register", (req, res) => {
    db=getDb();
    const errors = validateLogin(req.body);
    if (errors.length) return res.status(400).json({ errors });
    const { email, password } = req.body;
    const hash = hashPassword(password);

    db.prepare(
      "INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)",
    ).run(email, hash, "admin");

    const result = register(email);
    console.log(result);
    res.status(201).json({ message: "User registered successfully", result });
  });

  app.post("/auth/login", (req, res) => {
    const errors = validateLogin(req.body);
    if (errors.length) return res.status(400).json({ errors });

    const result = login(req.body.email, req.body.password);
    if (!result) return res.status(401).json({ error: "Invalid credentials." });
    return res.json(result);
  });

  app.delete("/users/:id", requireAuth, (req, res) => {
    db=getDb();
  const id = Number(req.params.id);

  const result = db
    .prepare("DELETE FROM users WHERE id = ?")
    .run(id);

  if (result.changes === 0) {
    return res.status(404).json({ error: "User not found." });
  }

  res.status(204).send();
});

  app.get("/auth/me", requireAuth, (req, res) => {
    res.json({ user: req.user });
  });

  app.get("/products", (req, res) => {
    const { search, limit, offset } = req.query;
    const items = listProducts({ search, limit, offset });
    res.json(items);
  });

  app.get("/products/:id", (req, res) => {
    const product = findProductById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found." });
    return res.json(product);
  });

  app.post("/products", requireAuth, (req, res) => {
    const errors = validateProduct(req.body);
    if (errors.length) return res.status(400).json({ errors });
    const product = createProduct(req.body);
    return res.status(201).json(product);
  });

  app.put("/products/:id", requireAuth, (req, res) => {
    const errors = validateProduct(req.body);
    if (errors.length) return res.status(400).json({ errors });
    const updated = updateProduct(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: "Product not found." });
    return res.json(updated);
  });

  app.delete("/products/:id", requireAuth, (req, res) => {
    const ok = deleteProduct(req.params.id);
    if (!ok) return res.status(404).json({ error: "Product not found." });
    return res.status(204).send();
  });

  app.get("/categories", (req, res) => {
    const { search, limit, offset } = req.query;
    const items = listCategories({ search, limit, offset });
    res.json(items);
  });

  app.get("/categories/:id", (req, res) => {
    const category = findCategoryById(req.params.id);
    if (!category)
      return res.status(404).json({ error: "Category not found." });
    return res.json(category);
  });

  app.post("/categories", requireAuth, (req, res) => {
    const errors = validateCategory(req.body);
    if (errors.length) return res.status(400).json({ errors });
    const category = createCategory(req.body);
    return res.status(201).json(category);
  });

  app.put("/categories/:id", requireAuth, (req, res) => {
    const errors = validateCategory(req.body);
    if (errors.length) return res.status(400).json({ errors });
    const updated = updateCategory(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: "Category not found." });
    return res.json(updated);
  });

  app.delete("/categories/:id", requireAuth, (req, res) => {
    const ok = deleteCategory(req.params.id);
    if (!ok) return res.status(404).json({ error: "Category not found." });
    return res.status(204).send();
  });

  app.use((req, res) => {
    res.status(404).json({ error: "Route not found." });
  });

  return app;
}

function startServer(port = 3000) {
  const app = createApp();
  app.listen(port, () => {
    console.log(`Catalog API v2 running on http://localhost:${port}`);
  });
  return app;
}

if (require.main === module) {
  const port = Number(process.env.PORT) || 3000;
  startServer(port);
}

module.exports = { createApp, startServer };
