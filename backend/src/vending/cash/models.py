from sqlalchemy import Column, Integer
from ...database import Base


class CashUnit(Base):
    __tablename__ = "cash_units"

    denomination = Column(Integer, primary_key=True)
    quantity = Column(Integer, nullable=False, default=0)
