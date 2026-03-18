from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from uuid import UUID

from app.database import get_db
from app.models import User, WardrobeItem
from app.schemas import WardrobeItemCreate, WardrobeItemUpdate, WardrobeItemOut
from app.deps import get_current_user

router = APIRouter()


@router.get("", response_model=list[WardrobeItemOut])
async def list_items(
    category: str | None = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = select(WardrobeItem).where(WardrobeItem.user_id == current_user.id)
    if category:
        query = query.where(WardrobeItem.category == category)
    result = await db.execute(query.order_by(WardrobeItem.created_at.desc()))
    return result.scalars().all()


@router.post("", response_model=WardrobeItemOut, status_code=201)
async def create_item(
    body: WardrobeItemCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
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
    result = await db.execute(
        select(WardrobeItem).where(WardrobeItem.id == item_id, WardrobeItem.user_id == current_user.id)
    )
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="아이템을 찾을 수 없습니다.")
    await db.delete(item)
