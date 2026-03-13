# Mohammad-Yousaf-Masoodi-week-4

# Catalog API v2 (DB + Auth)

A beginner-friendly REST API built with Node.js, Express, and SQLite
that manages products and categories with authentication.

## Features

- Health check endpoint
- SQLite database
- Authentication with tokens
- Protected routes
- Products CRUD
- Categories CRUD
- Pagination and search
- Input validation
- Automated tests

## Tech Stack

- Node.js
- Express
- SQLite
- pnpm
- node:test
- curl

## Installation

Install dependencies:

    pnpm install

Start the server:

    pnpm start

Server runs at:

    http://localhost:3000

## Run Tests

    pnpm test

## API Endpoints

### Health Check

    curl http://localhost:3000/health

Response

    { "status": "ok" }

---

## Authentication

### Login

    curl -X POST http://localhost:3000/auth/login -H "Content-Type: application/json" -d '{"email":"admin@example.com","password":"admin123"}'

### Get Current User

    curl http://localhost:3000/auth/me -H "Authorization: Bearer TOKEN"

---

## Products

### Get All Products

    curl http://localhost:3000/products

### Search Products

    curl "http://localhost:3000/products?search=Notebook"

### Pagination

    curl "http://localhost:3000/products?limit=2&offset=0"

### Get Product by ID

    curl http://localhost:3000/products/1

### Create Product

    curl -X POST http://localhost:3000/products -H "Content-Type: application/json" -H "Authorization: Bearer TOKEN" -d '{"name":"Pen","price":1.5,"categoryId":1}'

### Update Product

    curl -X PUT http://localhost:3000/products/1 -H "Content-Type: application/json" -H "Authorization: Bearer TOKEN" -d '{"name":"Blue Pen","price":2,"categoryId":1}'

### Delete Product

    curl -X DELETE http://localhost:3000/products/1 -H "Authorization: Bearer TOKEN"

---

## Categories

### Get All Categories

    curl http://localhost:3000/categories

### Get Category by ID

    curl http://localhost:3000/categories/1

### Create Category

    curl -X POST http://localhost:3000/categories -H "Content-Type: application/json" -H "Authorization: Bearer TOKEN" -d '{"name":"Stationery"}'

### Update Category

    curl -X PUT http://localhost:3000/categories/1 -H "Content-Type: application/json" -H "Authorization: Bearer TOKEN" -d '{"name":"Office Supplies"}'

### Delete Category

    curl -X DELETE http://localhost:3000/categories/1 -H "Authorization: Bearer TOKEN"

---

## Project Structure

    catalog-api-v2
    │
    ├── src
    │   ├── index.js
    │   ├── lib
    │   │   ├── db.js
    │   │   ├── store.js
    │   │   ├── auth.js
    │   │   ├── passwords.js
    │   │   └── validate.js
    │
    ├── tests
    ├── data
    │   └── app.db
    │
    ├── package.json
    └── README.md

## Demo Checklist

- Show `/health`
- Login and get a token
- Create a product (authorized)
- Reject product creation without token
- Run tests successfully

Demo video: https://drive.google.com/file/d/1kPCsYI-Kb4Kp2SMGqxUyPJzkRzk8ZOtX/view?usp=sharing