from typing import Dict
from sqlalchemy.orm import Session

from ..products import service as product_service
from ..cash import service as cash_service, schemas as cash_schemas
from .schemas import PurchaseRequest, PurchaseResult, ChangeItem


def calculate_change(change_amount: int, stock: Dict[int, int]) -> Dict[int, int] | None:
    if change_amount == 0:
        return {}

    denoms = sorted(stock.keys(), reverse=True)  # 1000, 500, 100, ...
    result: Dict[int, int] = {}
    remaining = change_amount

    for d in denoms:
        if remaining <= 0:
            break
        if d <= 0:
            continue

        max_from_amount = remaining // d
        if max_from_amount <= 0:
            continue

        available = stock.get(d, 0)
        use = min(max_from_amount, available)

        if use > 0:
            result[d] = use
            remaining -= use * d

    if remaining != 0:
        return None

    return result


def perform_purchase(db: Session, data: PurchaseRequest) -> PurchaseResult:
    product = product_service.get_product(db, data.product_id)
    if not product:
        raise ValueError("PRODUCT_NOT_FOUND")

    if product.stock_quantity <= 0:
        raise ValueError("OUT_OF_STOCK")

    total_paid = sum(item.denomination * item.quantity for item in data.paid)
    if total_paid < product.price:
        raise ValueError("INSUFFICIENT_FUNDS")

    base_stock = cash_service.get_cash_stock(db)  # {denom: qty}
    temp_stock = base_stock.copy()
    for p in data.paid:
        temp_stock[p.denomination] = temp_stock.get(p.denomination, 0) + p.quantity

    change_amount = total_paid - product.price
    change_map = calculate_change(change_amount, temp_stock)

    if change_map is None:
        raise ValueError("NO_CHANGE_AVAILABLE")

    paid_cash = [
        cash_schemas.CashUnitBase(
            denomination=p.denomination,
            quantity=p.quantity,
        )
        for p in data.paid
    ]

    try:
        cash_service.apply_cash_change(db, paid=paid_cash, change=change_map)
        product.stock_quantity -= 1
        db.commit()
        db.refresh(product)
    except Exception:
        db.rollback()
        raise

    return PurchaseResult(
        product_id=product.id,
        product_name=product.name,
        price=product.price,
        paid_amount=total_paid,
        change_amount=change_amount,
        change_breakdown=[
            ChangeItem(denomination=d, quantity=q) for d, q in change_map.items()
        ],
    )
