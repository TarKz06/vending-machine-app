from sqlalchemy.orm import Session
from . import models, schemas


def get_cash_stock(db: Session) -> dict[int, int]:
    rows = db.query(models.CashUnit).all()
    return {row.denomination: row.quantity for row in rows}


def set_cash_stock(db: Session, items: list[schemas.CashUnitBase]) -> None:
    for item in items:
        cu = db.get(models.CashUnit, item.denomination)
        if cu is None:
            cu = models.CashUnit(
                denomination=item.denomination,
                quantity=item.quantity,
            )
            db.add(cu)
        else:
            cu.quantity = item.quantity

    db.commit()


def apply_cash_change(
    db: Session,
    paid: list[schemas.CashUnitBase],
    change: dict[int, int],
) -> None:
    for item in paid:
        cu = db.get(models.CashUnit, item.denomination)
        if cu is None:
            cu = models.CashUnit(
                denomination=item.denomination,
                quantity=item.quantity,
            )
            db.add(cu)
        else:
            cu.quantity += item.quantity

    for denom, qty in change.items():
        cu = db.get(models.CashUnit, denom)
        if not cu or cu.quantity < qty:
            raise ValueError("CASH_STOCK_INCONSISTENT")
        cu.quantity -= qty


def apply_cash_adjustments(
    db: Session,
    items: list[schemas.CashAdjustmentItem],
) -> None:

    for item in items:
        cu = db.get(models.CashUnit, item.denomination)

        if cu is None:
            if item.delta < 0:
                raise ValueError("NOT_ENOUGH_CASH_TO_WITHDRAW")

            cu = models.CashUnit(
                denomination=item.denomination,
                quantity=0,
            )
            db.add(cu)

        new_qty = cu.quantity + item.delta

        if new_qty < 0:
            raise ValueError("NOT_ENOUGH_CASH_TO_WITHDRAW")

        cu.quantity = new_qty

    db.commit()


def delete_cash_unit(db: Session, denomination: int) -> None:
    cu = db.get(models.CashUnit, denomination)
    if cu:
        db.delete(cu)
        db.commit()

