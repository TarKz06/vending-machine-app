FROM python:3.11-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY src ./src

ENV DATABASE_URL=postgresql+psycopg2://vending_user:vending_pass@db:5432/vending_db

CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
