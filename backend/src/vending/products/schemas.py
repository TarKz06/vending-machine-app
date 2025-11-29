from pydantic import BaseModel, ConfigDict


class ProductBase(BaseModel):
    name: str
    price: int
    is_active: bool = True


class ProductCreate(ProductBase):
    stock_quantity: int


class ProductUpdate(ProductBase):
    stock_quantity: int


class ProductOut(ProductBase):
    id: int
    stock_quantity: int

    model_config = ConfigDict(from_attributes=True)
