from pydantic_settings import BaseSettings
from pydantic import ConfigDict


class Settings(BaseSettings):
    app_name: str = "Simple Vending Machine"
    database_url: str
    model_config = ConfigDict(env_file=".env")

settings = Settings()
