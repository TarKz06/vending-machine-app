# src/vending/cash/service.py
from sqlalchemy.orm import Session
from . import models, schemas


def get_cash_stock(db: Session) -> dict[int, int]:
    """อ่านสต็อกเงินทั้งหมดในตู้ -> {denomination: quantity}"""
    rows = db.query(models.CashUnit).all()
    return {row.denomination: row.quantity for row in rows}


def set_cash_stock(db: Session, items: list[schemas.CashUnitBase]) -> None:
    """
    ใช้สำหรับ reset / ตั้งค่าทั้งตู้ใหม่
    ใช้คู่กับ PUT /api/v1/cash-units
    """
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
    """
    ใช้ตอนลูกค้าซื้อสินค้า:
    - เพิ่มจำนวนแบงค์/เหรียญที่ลูกค้าจ่ายเข้าไปในตู้
    - หักจำนวนแบงค์/เหรียญที่ต้องทอนออกจากตู้

    NOTE: ฟังก์ชันนี้ "ไม่ commit" ปล่อยให้ layer ข้างบน (perform_purchase)
    เป็นคน commit/rollback เอง เพื่อให้ transaction เป็นก้อนเดียว
    """
    # เพิ่มเงินที่ลูกค้าจ่าย
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

    # หักเงินทอน
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
