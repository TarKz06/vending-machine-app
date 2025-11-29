from pydantic import BaseModel


class PaidItem(BaseModel):
    denomination: int
    quantity: int


class PurchaseRequest(BaseModel):
    product_id: int
    paid: list[PaidItem]


class ChangeItem(BaseModel):
    denomination: int
    quantity: int


class PurchaseResult(BaseModel):
    product_id: int
    product_name: str
    price: int
    paid_amount: int
    change_amount: int
    change_breakdown: list[ChangeItem]
