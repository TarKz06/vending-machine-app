from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ...database import get_db
from . import schemas, service, models

router = APIRouter(
    prefix="/api/v1/cash-units",
    tags=["cash"],
)


@router.get("/", response_model=list[schemas.CashUnitOut])
def list_cash_units(db: Session = Depends(get_db)):
    rows = db.query(models.CashUnit).order_by(models.CashUnit.denomination).all()
    return rows


@router.put("/")
def set_cash_units(payload: schemas.CashBulkUpdate, db: Session = Depends(get_db)):
    service.set_cash_stock(db, payload.cash)
    return {"status": "ok"}


@router.post("/adjustments")
def adjust_cash_units(
    payload: schemas.CashAdjustmentRequest,
    db: Session = Depends(get_db),
):
    try:
        service.apply_cash_adjustments(db, payload.cash)
        return {"status": "ok"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/{denomination}")
def delete_cash_unit(denomination: int, db: Session = Depends(get_db)):
    service.delete_cash_unit(db, denomination)
    return {"status": "ok"}
