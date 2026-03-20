from pydantic_settings import BaseSettings
from typing import List
import json


class Settings(BaseSettings):
    DATABASE_URL: str
    GEMINI_API_KEY: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10080
    APP_ENV: str = "development"
    CORS_ORIGINS: str = '["http://localhost:8081"]'
    # Google Vision AI (선택적)
    GOOGLE_APPLICATION_CREDENTIALS: str = ""
    GOOGLE_VISION_KEY_JSON: str = ""

    @property
    def cors_origins_list(self) -> List[str]:
        return json.loads(self.CORS_ORIGINS)

    class Config:
        env_file = ".env"
        extra = "ignore"  # .env에 알 수 없는 키가 있어도 무시


settings = Settings()
