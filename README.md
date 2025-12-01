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

## License

MIT License
