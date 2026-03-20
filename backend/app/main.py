"""
OOTD AI API — 메인 앱 설정

- CORS, 라우터 등록, static 파일 서빙
- /static 경로로 업로드된 이미지 파일 접근 가능
"""
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.config import settings
from app.routers import auth, wardrobe, chat, vision

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

# ─── 라우터 등록 ──────────────────────────────────────────────────────────────
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(wardrobe.router, prefix="/wardrobe", tags=["wardrobe"])
app.include_router(chat.router, prefix="/chat", tags=["chat"])
app.include_router(vision.router, prefix="/vision", tags=["vision"])

# ─── 정적 파일 서빙 (업로드된 이미지 접근용) ──────────────────────────────────
STATIC_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "static")
os.makedirs(STATIC_DIR, exist_ok=True)
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")


@app.get("/")
async def root():
    return {"message": "OOTD AI API is running 👗"}


@app.get("/health")
async def health_check():
    return {"status": "ok", "env": settings.APP_ENV}
