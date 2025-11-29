from pydantic import BaseModel, ConfigDict


class CashUnitBase(BaseModel):
    denomination: int
    quantity: int


class CashUnitOut(CashUnitBase):
    model_config = ConfigDict(from_attributes=True)


class CashBulkUpdate(BaseModel):
    cash: list[CashUnitBase]


class CashAdjustmentItem(BaseModel):
    denomination: int
    delta: int


class CashAdjustmentRequest(BaseModel):
    cash: list[CashAdjustmentItem]
