from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import auth, wardrobe, chat

app = FastAPI(
    title="OOTD AI API",
    description="내 옷장 기반 AI 스타일리스트 앱 API",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(wardrobe.router, prefix="/wardrobe", tags=["wardrobe"])
app.include_router(chat.router, prefix="/chat", tags=["chat"])


@app.get("/")
async def root():
    return {"message": "OOTD AI API is running 👗"}


@app.get("/health")
async def health_check():
    return {"status": "ok", "env": settings.APP_ENV}
