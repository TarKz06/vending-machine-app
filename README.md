
# Vending Machine App


## Overview

This project is a backend solution for a simple vending machine system.
It provides APIs for managing product stocks, managing cash units inside the machine, and performing a purchase transaction with validation and change calculation.
The architecture is designed to be modular, maintainable, and production-ready, following industry best practices.


## Features

- CRUD operations for products (create, update, delete, list)

- CRUD operations for cash units (manage coin/banknote stock)

    - Purchase API with:

    -  Stock validation

    - Payment validation

    - Change calculation

- Updating inventory after purchase

- RESTful API structure with versioning (/api/v1)

- Ready for Docker deployment

- Unit tests included (Pytest)
## Tech Stack

- FastAPI (Python)

- PostgreSQL

- Docker & Docker Compose

- SQLAlchemy ORM
## How to Run (Docker)

Make sure Docker Desktop is running.

Build and start the services:

```bash
docker compose up --build
```

Stop services:
```bash
docker compose down
```


Backend will be available at:
```bash
http://localhost:8000
```

## How to Run (Local Development)
Create virtual environment
```bash
http://localhost:8000
```

Install dependencies
```bash
pip install -r requirements.txt
```

Start FastAPI server
```bash
uvicorn src.main:app --reload
```

API server will run at:
```bash
http://127.0.0.1:8000
```
## Run Tests

Execute unit tests with:
```bash
pytest -v
```
## API Documentation


Swagger UI:
```bash
http://localhost:8000/docs
```

Redoc:
```bash
http://localhost:8000/redoc
```
## Project Structure

To deploy this project run

```bash
vending-machine-app/
│
├── backend/
│   ├── src/
│   │   ├── vending/
│   │   │   ├── products/
│   │   │   │   ├── router.py
│   │   │   │   ├── schemas.py
│   │   │   │   ├── models.py
│   │   │   │   └── service.py
│   │   │   ├── cash/
│   │   │   │   ├── router.py
│   │   │   │   ├── schemas.py
│   │   │   │   ├── models.py
│   │   │   │   └── service.py
│   │   │   ├── purchase/
│   │   │   │   ├── router.py
│   │   │   │   ├── schemas.py
│   │   │   │   └── service.py
│   │   ├── config.py
│   │   ├── database.py
│   │   └── main.py
│   ├── tests/
│   ├── requirements.txt
│   └── Dockerfile
│
└── docker-compose.yml
```

