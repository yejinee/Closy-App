from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import google.generativeai as genai

from app.database import get_db
from app.models import User, WardrobeItem, ChatMessage
from app.schemas import ChatRequest, ChatResponse, ChatMessageOut
from app.deps import get_current_user
from app.config import settings

router = APIRouter()

genai.configure(api_key=settings.GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-1.5-flash")

SYSTEM_PROMPT = """
너는 패션 AI 스타일리스트야. 유저의 옷장 데이터를 바탕으로 코디를 추천해줘.
- 친근하고 유쾌한 말투 사용 (친구처럼)
- 구체적인 아이템 조합으로 추천
- 옷장에 없는 아이템은 추천하지 마
- 한국어로 답변해
"""


def wardrobe_to_text(items: list[WardrobeItem]) -> str:
    if not items:
        return "등록된 옷이 없습니다."
    lines = []
    for item in items:
        tags = ", ".join(item.style_tags) if item.style_tags else ""
        lines.append(
            f"- {item.category} | {item.color or '색상미상'} | {item.season or '사계절'} | 태그: {tags}"
        )
    return "\n".join(lines)


@router.post("", response_model=ChatResponse)
async def chat(
    body: ChatRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # 옷장 데이터 조회
    result = await db.execute(select(WardrobeItem).where(WardrobeItem.user_id == current_user.id))
    items = result.scalars().all()
    wardrobe_text = wardrobe_to_text(list(items))

    # 이전 대화 불러오기 (최근 10개)
    history_result = await db.execute(
        select(ChatMessage)
        .where(ChatMessage.user_id == current_user.id)
        .order_by(ChatMessage.created_at.desc())
        .limit(10)
    )
    history = list(reversed(history_result.scalars().all()))

    # Gemini 대화 구성
    chat_history = [
        {
            "role": "user",
            "parts": [f"{SYSTEM_PROMPT}\n\n[내 옷장]\n{wardrobe_text}"],
        },
        {"role": "model", "parts": ["알겠어! 옷장 데이터 확인했어. 무엇이 필요해?"]},
    ]
    for msg in history:
        chat_history.append({
            "role": "user" if msg.role == "user" else "model",
            "parts": [msg.content],
        })

    gemini_chat = model.start_chat(history=chat_history)
    response = gemini_chat.send_message(body.message)
    reply = response.text

    # 유저 메시지 저장
    user_msg = ChatMessage(user_id=current_user.id, role="user", content=body.message, image_url=body.image_url)
    db.add(user_msg)

    # AI 응답 저장
    ai_msg = ChatMessage(user_id=current_user.id, role="assistant", content=reply)
    db.add(ai_msg)
    await db.flush()

    return ChatResponse(
        reply=reply,
        message=ChatMessageOut.model_validate(ai_msg),
    )


@router.get("/history", response_model=list[ChatMessageOut])
async def get_history(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(ChatMessage)
        .where(ChatMessage.user_id == current_user.id)
        .order_by(ChatMessage.created_at.asc())
        .limit(50)
    )
    return result.scalars().all()
