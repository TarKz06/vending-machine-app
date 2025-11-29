from fastapi import FastAPI

from .config import settings
from .database import Base, engine
from .vending.products.router import router as products_router
from .vending.cash.router import router as cash_router
from .vending.purchase.router import router as purchase_router


def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.app_name,
        version="0.1.0",
    )

    Base.metadata.create_all(bind=engine)

    @app.get("/health")
    def health_check():
        return {"status": "ok"}

    app.include_router(products_router)
    app.include_router(cash_router)
    app.include_router(purchase_router)

    return app


app = create_app()
