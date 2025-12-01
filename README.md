# Vending Machine App

## Overview

This project is a **full-stack vending machine system** consisting of:

* **Backend**: FastAPI + PostgreSQL
* **Frontend**: React + TypeScript + Vite + Tailwind CSS
* **Docker**: docker-compose to run `db + backend + frontend` together

The system provides:

* APIs for managing products and cash units
* Purchase flow with validation and change calculation
* Simple admin UI for managing products and cash units
* Customer UI to select products, insert money, and see change breakdown

The architecture is designed to be modular, maintainable, and production-ready.

---

## Features

### Backend

* CRUD operations for **products** (create, update, delete, list)
* CRUD operations for **cash units** (manage coin/banknote stock)
* **Purchase API** with:

  * Stock validation
  * Payment validation
  * Change calculation
  * Inventory update after purchase
* RESTful API structure with versioning: `/api/v1`
* Ready for Docker deployment
* Unit tests (Pytest)

### Frontend

* **Customer page**

  * Show product cards (name, price, stock, image)
  * Select product
  * Insert money and perform purchase
  * Show change amount and change breakdown
* **Admin pages**

  * Manage products (name, price, stock, image url)
  * Manage cash units (denominations & quantities)
* Built with React + TypeScript + Tailwind, packaged with Nginx in Docker

---

## Tech Stack

* **Backend**

  * FastAPI (Python)
  * PostgreSQL
  * SQLAlchemy ORM
* **Frontend**

  * React + TypeScript + Vite
  * Tailwind CSS
* **Infra**

  * Docker & Docker Compose
  * Nginx (for serving frontend build)

---

## How to Run with Docker (recommended for local)

Make sure **Docker Desktop** is running.

From the project root (where `docker-compose.yml` is):

```bash
docker compose up --build
```

Stop all services:

```bash
docker compose down
```

Backend will be available at:

```bash
http://localhost:8000
```

Frontend will be available at:

```bash
http://localhost:3000
```

---

## How to Run Backend Locally (Without Docker)

Create virtual environment:

```bash
python3 -m venv .venv
source .venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start FastAPI server:

```bash
uvicorn src.main:app --reload
```

API server will run at:

```bash
http://127.0.0.1:8000
```

---

## How to Run Frontend Locally

Install dependencies:

```bash
npm install
```

Start dev server:

```bash
npm run dev
```

Frontend will be available at:

```bash
http://localhost:5173
```

---

## API Documentation

Swagger UI:

```bash
http://localhost:8000/docs
```

Redoc:

```bash
http://localhost:8000/redoc
```

---

## Project Structure

```bash
vending-machine-app/
│
├── backend/
│   ├── src/
│   │   ├── vending/
│   │   │   ├── products/
│   │   │   ├── cash/
│   │   │   └── purchase/
│   │   ├── config.py
│   │   ├── database.py
│   │   └── main.py
│   ├── tests/
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── vite.config.ts
│   ├── Dockerfile
│   └── nginx.conf
│
└── docker-compose.yml
```

---

## Testing (Backend)

Run unit tests with:

```bash
pytest -v
```

---

## Seed / Mock Data (Bulk API)

You can populate the system with mock product data and cash-unit stock using the following APIs.

### **1. Bulk Insert Products**

**POST** `/api/v1/products/bulk`

```json
[
    {
        "name": "Cola",
        "price": 20,
        "stock_quantity": 10,
        "is_active": true,
        "image_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYFwqjs7rZBIsuMTFPArhmPuaHaK5b-bbQEQ&s"
    },
    {
        "name": "Orange Soda",
        "price": 18,
        "stock_quantity": 12,
        "is_active": true,
        "image_url": "https://slicesoda.com/cdn/shop/files/SliceHealthySoda_KeepItReal_product_Orange_9b8323ad-b4d4-4f1c-9614-0b3063f4fc97.jpg?v=1763060291"
    },
    {
        "name": "Lemon Tea",
        "price": 25,
        "stock_quantity": 8,
        "is_active": true,
        "image_url": "https://sg.fnlife.com/pub/media/catalog/product/cache/1270337d5bbd2f34cfe21e58bb4c921d/i/l/iltcanfront.jpg"
    },
    {
        "name": "Mineral Water",
        "price": 15,
        "stock_quantity": 20,
        "is_active": true,
        "image_url": "https://pim-cdn0.ofm.co.th/products/original/0003016.jpg?v=20251128&x-image-process=image/format,webp"
    },
    {
        "name": "Energy Drink",
        "price": 30,
        "stock_quantity": 6,
        "is_active": true,
        "image_url": "https://media-stark.gourmetmarketthailand.com/products/cover/9002490221249-1.webp"
    },
    {
        "name": "Potato Chips",
        "price": 25,
        "stock_quantity": 15,
        "is_active": true,
        "image_url": "https://m.media-amazon.com/images/I/81A9IZqezwL._AC_UF894,1000_QL80_.jpg"
    },
    {
        "name": "Chocolate Bar",
        "price": 22,
        "stock_quantity": 14,
        "is_active": true,
        "image_url": "https://m.media-amazon.com/images/I/81YBoro1YCL._AC_UF894,1000_QL80_.jpg"
    },
    {
        "name": "Sandwich",
        "price": 35,
        "stock_quantity": 7,
        "is_active": true,
        "image_url": "https://m.media-amazon.com/images/I/61xJCH0S4iL._AC_UF1000,1000_QL80_.jpg"
    },
    {
        "name": "Cup Noodles",
        "price": 28,
        "stock_quantity": 9,
        "is_active": true,
        "image_url": "https://m.media-amazon.com/images/I/81Pwk1exwVL._SL1500_.jpg"
    },
    {
        "name": "Green Tea",
        "price": 23,
        "stock_quantity": 11,
        "is_active": true,
        "image_url": "https://www.jundirect.com.au/cdn/shop/products/ItoEnO-iOchaRyokuchaCan340ml.jpg?v=1748935351"
    }
]
```

---

### **2. Mock Cash Units (Initial Machine Cash Stock)**

Use this to preload change money into the vending machine.

**PUT** `/api/v1/cash-units/`

```json
{
  "cash": [
    { "denomination": 1, "quantity": 10 },
    { "denomination": 5, "quantity": 10 },
    { "denomination": 10, "quantity": 10 },
    { "denomination": 20, "quantity": 10 },
    { "denomination": 50, "quantity": 10 },
    { "denomination": 100, "quantity": 10 },
    { "denomination": 500, "quantity": 5 },
    { "denomination": 1000, "quantity": 2 }
  ]
}
```

---

## License

MIT License
