from sqlalchemy.orm import Session
from . import models, schemas


def list_products(db: Session) -> list[models.Product]:
    return (
        db.query(models.Product)
        .filter(models.Product.is_active == True)
        .order_by(models.Product.id)
        .all()
    )


def get_product(db: Session, product_id: int) -> models.Product | None:
    return db.query(models.Product).filter(models.Product.id == product_id).first()


def create_product(db: Session, data: schemas.ProductCreate) -> models.Product:
    product = models.Product(**data.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


def update_product(
    db: Session,
    product_id: int,
    data: schemas.ProductUpdate,
) -> models.Product | None:
    product = get_product(db, product_id)
    if not product:
        return None

    for field, value in data.model_dump().items():
        setattr(product, field, value)

    db.commit()
    db.refresh(product)
    return product

def create_products_bulk(
    db: Session,
    payloads: list[schemas.ProductCreate],
):
    products = []
    for p in payloads:
        product = models.Product(**p.dict())
        db.add(product)
        products.append(product)

    db.commit()

    for product in products:
        db.refresh(product)

    return products

def delete_product(db: Session, product_id: int) -> bool:
    product = get_product(db, product_id)
    if not product:
        return False
    product.is_active = False
    db.commit()
    return True
