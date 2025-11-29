from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ...database import get_db
from . import schemas, service

router = APIRouter(
    prefix="/api/v1/products",
    tags=["products"],
)


@router.get("/", response_model=list[schemas.ProductOut])
def list_products(db: Session = Depends(get_db)):
    return service.list_products(db)


@router.get("/{product_id}", response_model=schemas.ProductOut)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = service.get_product(db, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="PRODUCT_NOT_FOUND")
    return product


@router.post(
    "/",
    response_model=schemas.ProductOut,
    status_code=status.HTTP_201_CREATED,
)
def create_product(
    payload: schemas.ProductCreate,
    db: Session = Depends(get_db),
):
    return service.create_product(db, payload)


@router.put("/{product_id}", response_model=schemas.ProductOut)
def update_product(
    product_id: int,
    payload: schemas.ProductUpdate,
    db: Session = Depends(get_db),
):
    product = service.update_product(db, product_id, payload)
    if not product:
        raise HTTPException(status_code=404, detail="PRODUCT_NOT_FOUND")
    return product
