const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const dbPath = path.join(__dirname, "..", "data", "test.db");
process.env.DB_PATH = dbPath;

const { createApp } = require("../src/index");
const { closeDb } = require("../src/lib/db");

let server;
let baseUrl;

async function request(pathname, options = {}) {
  const res = await fetch(`${baseUrl}${pathname}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const text = await res.text();
  let data = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  return { status: res.status, data };
}

async function loginAndGetToken() {
  const res = await request("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email: "admin@example.com",
      password: "admin123",
    }),
  });

  assert.equal(res.status, 200);
  assert.ok(res.data.token);
  return res.data.token;
}

test.before(() => {
  if (fs.existsSync(dbPath)) fs.rmSync(dbPath);

  const app = createApp();
  server = app.listen(0);
  baseUrl = `http://localhost:${server.address().port}`;
});

test.after(() => {
  if (server) server.close();
  closeDb();
  if (fs.existsSync(dbPath)) fs.rmSync(dbPath);
});

test("GET /health", async () => {
  const res = await request("/health");
  assert.equal(res.status, 200);
  assert.deepEqual(res.data, { status: "ok" });
});

test("POST /auth/login returns token", async () => {
  const res = await request("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email: "admin@example.com",
      password: "admin123",
    }),
  });

  assert.equal(res.status, 200);
  assert.ok(res.data.token);
});

test("GET /auth/me requires auth", async () => {
  const res = await request("/auth/me");
  assert.equal(res.status, 401);
});

test("GET /auth/me works with token", async () => {
  const token = await loginAndGetToken();

  const res = await request("/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  assert.equal(res.status, 200);
  assert.equal(res.data.user.email, "admin@example.com");
  assert.equal(res.data.user.role, "admin");
});

test("GET /products/:id returns product", async () => {
  const res = await request("/products/1");
  assert.equal(res.status, 200);
  assert.equal(typeof res.data.id, "number");
  assert.ok(res.data.name);
});

test("GET /products/:id returns 404 when product does not exist", async () => {
  const res = await request("/products/999999");
  assert.equal(res.status, 404);
  assert.equal(res.data.error, "Product not found.");
});

test("POST /products requires auth", async () => {
  const res = await request("/products", {
    method: "POST",
    body: JSON.stringify({
      name: "Pen",
      price: 1.5,
      categoryId: 1,
    }),
  });

  assert.equal(res.status, 401);
});

test("POST /products works with token", async () => {
  const token = await loginAndGetToken();

  const res = await request("/products", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: "Pen",
      price: 1.5,
      categoryId: 1,
    }),
  });

  assert.equal(res.status, 201);
  assert.ok(res.data.id);
  assert.equal(res.data.name, "Pen");
});

test("POST /products returns 400 for invalid body", async () => {
  const token = await loginAndGetToken();

  const res = await request("/products", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: "",
      price: -1,
      categoryId: "bad",
    }),
  });

  assert.equal(res.status, 400);
  assert.ok(Array.isArray(res.data.errors));
});

test("POST /categories requires auth", async () => {
  const res = await request("/categories", {
    method: "POST",
    body: JSON.stringify({
      name: "Stationery",
    }),
  });

  assert.equal(res.status, 401);
});

test("POST /categories works with token", async () => {
  const token = await loginAndGetToken();

  const res = await request("/categories", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: `Stationery-${Date.now()}`,
    }),
  });

  assert.equal(res.status, 201);
  assert.ok(res.data.id);
  assert.ok(res.data.name);
});
