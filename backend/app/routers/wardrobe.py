"""
옷장 아이템 CRUD 라우터

- GET    /wardrobe              : 아이템 목록 (카테고리 필터 가능)
- POST   /wardrobe              : 아이템 생성
- POST   /wardrobe/upload-image : 이미지 파일 업로드 → URL 반환
- PATCH  /wardrobe/{item_id}    : 아이템 수정
- DELETE /wardrobe/{item_id}    : 아이템 삭제
"""
import os
import uuid as uuid_mod
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.models import User, WardrobeItem
from app.schemas import WardrobeItemCreate, WardrobeItemUpdate, WardrobeItemOut
from app.deps import get_current_user

router = APIRouter()

# 이미지 저장 디렉토리 (컨테이너 기준 /app/static/wardrobe/)
UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "static", "wardrobe")


@router.get("", response_model=list[WardrobeItemOut])
async def list_items(
    category: str | None = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """사용자의 옷장 아이템 목록 조회 (카테고리 필터 가능)"""
    query = select(WardrobeItem).where(WardrobeItem.user_id == current_user.id)
    if category:
        query = query.where(WardrobeItem.category == category)
    result = await db.execute(query.order_by(WardrobeItem.created_at.desc()))
    return result.scalars().all()


@router.post("/upload-image")
async def upload_image(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
):
    """
    이미지 파일 업로드

    - 사용자별 디렉토리에 UUID 파일명으로 저장
    - 반환되는 image_url을 아이템 생성 시 사용
    """
    # 허용 확장자 검증
    ext = (file.filename or "image.jpg").rsplit(".", 1)[-1].lower()
    if ext not in ("jpg", "jpeg", "png", "webp"):
        raise HTTPException(status_code=400, detail="jpg, png, webp 이미지만 업로드 가능합니다.")

    # 사용자별 디렉토리 생성
    user_dir = os.path.join(UPLOAD_DIR, str(current_user.id))
    os.makedirs(user_dir, exist_ok=True)

    # UUID 파일명으로 저장 (충돌 방지)
    filename = f"{uuid_mod.uuid4()}.{ext}"
    filepath = os.path.join(user_dir, filename)

    contents = await file.read()
    with open(filepath, "wb") as f:
        f.write(contents)

    # 클라이언트가 접근 가능한 URL 경로 반환
    image_url = f"/static/wardrobe/{current_user.id}/{filename}"
    return {"image_url": image_url}


@router.post("", response_model=WardrobeItemOut, status_code=201)
async def create_item(
    body: WardrobeItemCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """새 옷장 아이템 생성 (이미지 업로드 후 image_url 포함)"""
    item = WardrobeItem(**body.model_dump(), user_id=current_user.id)
    db.add(item)
    await db.flush()
    return item


@router.patch("/{item_id}", response_model=WardrobeItemOut)
async def update_item(
    item_id: UUID,
    body: WardrobeItemUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """옷장 아이템 수정"""
    result = await db.execute(
        select(WardrobeItem).where(WardrobeItem.id == item_id, WardrobeItem.user_id == current_user.id)
    )
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="아이템을 찾을 수 없습니다.")
    for field, value in body.model_dump(exclude_none=True).items():
        setattr(item, field, value)
    return item


@router.delete("/{item_id}", status_code=204)
async def delete_item(
    item_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """옷장 아이템 삭제"""
    result = await db.execute(
        select(WardrobeItem).where(WardrobeItem.id == item_id, WardrobeItem.user_id == current_user.id)
    )
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="아이템을 찾을 수 없습니다.")
    await db.delete(item)
