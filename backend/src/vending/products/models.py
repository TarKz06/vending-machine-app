from sqlalchemy import Column, Integer, String, Boolean
from ...database import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    price = Column(Integer, nullable=False)  # THB
    stock_quantity = Column(Integer, nullable=False, default=0)
    is_active = Column(Boolean, nullable=False, default=True)
