from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ...database import get_db
from .schemas import PurchaseRequest, PurchaseResult
from .service import perform_purchase

router = APIRouter(
    prefix="/api/v1/purchases",
    tags=["purchases"],
)


@router.post("/", response_model=PurchaseResult)
def create_purchase(payload: PurchaseRequest, db: Session = Depends(get_db)):
    try:
        result = perform_purchase(db, payload)
        return result
    except ValueError as e:
        code = str(e)
        status_code = 400
        if code == "PRODUCT_NOT_FOUND":
            status_code = 404
        raise HTTPException(status_code=status_code, detail=code)
