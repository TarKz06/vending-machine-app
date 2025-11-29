from fastapi.testclient import TestClient


def create_product(client: TestClient, name: str, price: int, stock: int) -> int:
    resp = client.post(
        "/api/v1/products/",
        json={
            "name": name,
            "price": price,
            "stock_quantity": stock,
            "is_active": True,
        },
    )
    assert resp.status_code == 201
    data = resp.json()
    return data["id"]


def setup_cash_stock(client: TestClient):
    resp = client.put(
        "/api/v1/cash-units/",
        json={
            "cash": [
                {"denomination": 1, "quantity": 10},
                {"denomination": 5, "quantity": 10},
                {"denomination": 10, "quantity": 10},
                {"denomination": 20, "quantity": 10},
                {"denomination": 50, "quantity": 10},
                {"denomination": 100, "quantity": 5},
            ]
        },
    )
    assert resp.status_code == 200


def test_purchase_success_with_change_using_paid_money(client: TestClient):
    setup_cash_stock(client)
    product_id = create_product(client, "Cola", 20, 5)

    resp = client.post(
        "/api/v1/purchases/",
        json={
            "product_id": product_id,
            "paid": [
                {"denomination": 50, "quantity": 1},
            ],
        },
    )

    assert resp.status_code == 200
    data = resp.json()

    assert data["product_id"] == product_id
    assert data["product_name"] == "Cola"
    assert data["price"] == 20
    assert data["paid_amount"] == 50
    assert data["change_amount"] == 30

    total_change = sum(
        item["denomination"] * item["quantity"]
        for item in data["change_breakdown"]
    )
    assert total_change == 30

    resp2 = client.get("/api/v1/products/")
    assert resp2.status_code == 200
    products = resp2.json()
    cola = [p for p in products if p["id"] == product_id][0]
    assert cola["stock_quantity"] == 4


def test_purchase_insufficient_funds(client: TestClient):
    setup_cash_stock(client)
    product_id = create_product(client, "Snack", 30, 3)

    resp = client.post(
        "/api/v1/purchases/",
        json={
            "product_id": product_id,
            "paid": [
                {"denomination": 20, "quantity": 1},
            ],
        },
    )

    assert resp.status_code == 400
    assert resp.json()["detail"] == "INSUFFICIENT_FUNDS"


def test_purchase_out_of_stock(client: TestClient):
    setup_cash_stock(client)
    product_id = create_product(client, "Water", 15, 0)

    resp = client.post(
        "/api/v1/purchases/",
        json={
            "product_id": product_id,
            "paid": [
                {"denomination": 20, "quantity": 1},
            ],
        },
    )

    assert resp.status_code == 400
    assert resp.json()["detail"] == "OUT_OF_STOCK"


def test_purchase_no_change_available(client: TestClient):
    resp = client.put(
        "/api/v1/cash-units/",
        json={
            "cash": [
                {"denomination": 100, "quantity": 1},
            ]
        },
    )
    assert resp.status_code == 200

    product_id = create_product(client, "Juice", 70, 5)

    resp2 = client.post(
        "/api/v1/purchases/",
        json={
            "product_id": product_id,
            "paid": [
                {"denomination": 100, "quantity": 1},
            ],
        },
    )

    assert resp2.status_code == 400
    assert resp2.json()["detail"] == "NO_CHANGE_AVAILABLE"
