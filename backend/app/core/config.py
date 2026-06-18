from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_prefix="SIGNBRIDGE_", env_file=".env", extra="ignore")

    env: str = "development"
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    database_url: str = "sqlite:///signbridge.db"
    redis_url: str = "redis://localhost:6379/0"
    model_dir: str = "models"
    data_dir: str = "data/signbridge"
    cors_origins_raw: str = Field(default="http://localhost:5173,http://localhost:8080", alias="SIGNBRIDGE_CORS_ORIGINS")

    @property
    def cors_origins(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins_raw.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
