"""
Google Vision AI 라우터

서비스 계정 JSON 파일을 GOOGLE_APPLICATION_CREDENTIALS 환경변수로 지정하거나
GOOGLE_VISION_KEY_JSON 환경변수에 JSON 내용을 직접 넣으면 동작합니다.

설치: pip install google-cloud-vision
"""

import base64
import json
import os
from typing import Optional
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException

from app.deps import get_current_user
from app.models import User

router = APIRouter()


# ─── 색상 매핑 (RGB → 한국어) ────────────────────────────────────────────────

def rgb_to_korean_color(r: int, g: int, b: int) -> str:
    """Vision API의 dominant color RGB를 한국어 색상명으로 변환"""
    # 채도와 명도 계산
    max_c = max(r, g, b)
    min_c = min(r, g, b)
    diff = max_c - min_c

    # 무채색 계열
    if diff < 30:
        if max_c < 50:
            return "블랙"
        elif max_c > 210:
            return "화이트"
        elif max_c > 150:
            return "라이트그레이"
        else:
            return "그레이"

    # 유채색 계열 (Hue 기반)
    if max_c == r:
        hue = 60 * ((g - b) / diff % 6)
    elif max_c == g:
        hue = 60 * ((b - r) / diff + 2)
    else:
        hue = 60 * ((r - g) / diff + 4)

    if hue < 0:
        hue += 360

    # 브라운 계열 (낮은 채도의 레드/오렌지)
    if 10 <= hue <= 40 and max_c < 180:
        return "브라운"

    if hue < 20 or hue >= 340:
        return "레드"
    elif hue < 40:
        return "오렌지"
    elif hue < 70:
        return "옐로우"
    elif hue < 160:
        return "그린"
    elif hue < 200:
        return "민트"
    elif hue < 250:
        return "블루"
    elif hue < 290:
        return "퍼플"
    elif hue < 320:
        return "핑크"
    else:
        return "레드"


# ─── 라벨 → 태그 매핑 테이블 ─────────────────────────────────────────────────

CATEGORY_MAP = {
    # 상의
    "shirt": "셔츠", "t-shirt": "티셔츠", "blouse": "블라우스",
    "sweater": "스웨터", "knit": "니트", "hoodie": "후드",
    "top": "상의", "tank top": "탱크탑", "polo": "폴로",
    # 하의
    "pants": "팬츠", "jeans": "청바지", "trousers": "슬랙스",
    "skirt": "스커트", "shorts": "쇼츠", "leggings": "레깅스",
    # 아우터
    "jacket": "재킷", "coat": "코트", "blazer": "블레이저",
    "parka": "파카", "puffer": "패딩", "windbreaker": "윈드브레이커",
    "cardigan": "가디건",
    # 신발
    "shoe": "신발", "sneaker": "스니커즈", "boot": "부츠",
    "heel": "힐", "sandal": "샌들", "loafer": "로퍼",
    "oxford": "옥스포드", "slipper": "슬리퍼",
    # 기타 아이템
    "bag": "백", "hat": "모자", "cap": "캡", "scarf": "스카프",
    "belt": "벨트", "glove": "장갑", "sock": "양말",
}

STYLE_MAP = {
    "casual": "캐주얼", "formal": "포멀", "sport": "스포츠",
    "athletic": "애슬레저", "streetwear": "스트릿", "vintage": "빈티지",
    "minimalist": "미니멀", "classic": "클래식", "bohemian": "보헤미안",
    "preppy": "프레피", "workwear": "비즈캐주얼", "outdoor": "아웃도어",
    "denim": "데님", "luxury": "럭셔리", "punk": "펑크",
}

SEASON_MAP = {
    # 봄/가을
    "light": "봄", "floral": "봄", "linen": "봄",
    "trench coat": "봄", "spring": "봄",
    # 여름
    "cotton": "여름", "sleeveless": "여름", "summer": "여름",
    "beach": "여름", "shorts": "여름",
    # 가을
    "wool": "가을", "knit": "가을", "corduroy": "가을", "autumn": "가을",
    # 겨울
    "fur": "겨울", "down": "겨울", "puffer": "겨울",
    "parka": "겨울", "winter": "겨울", "fleece": "겨울",
    # 코트/재킷은 가을+겨울로 처리
    "coat": "가을",
}


def map_labels_to_tags(
    labels: list[str],
) -> tuple[list[str], list[str], list[str]]:
    """Vision API 라벨 목록 → (카테고리태그, 스타일태그, 시즌태그)"""
    category_tags: list[str] = []
    style_tags: list[str] = []
    season_tags: list[str] = []

    seen_seasons: set[str] = set()

    for label in labels:
        lower = label.lower()

        # 카테고리
        for key, val in CATEGORY_MAP.items():
            if key in lower and val not in category_tags:
                category_tags.append(val)
                break

        # 스타일
        for key, val in STYLE_MAP.items():
            if key in lower and val not in style_tags:
                style_tags.append(val)
                break

        # 시즌
        for key, val in SEASON_MAP.items():
            if key in lower and val not in seen_seasons:
                seen_seasons.add(val)
                season_tags.append(val)
                break

    return category_tags, style_tags, season_tags


# ─── 요청/응답 스키마 ─────────────────────────────────────────────────────────

class CropRectSchema(BaseModel):
    x: float = 0.0
    y: float = 0.0
    width: float = 1.0
    height: float = 1.0


class AnalyzeRequest(BaseModel):
    image_base64: str          # base64 인코딩된 이미지
    crop_rect: Optional[CropRectSchema] = None


class AnalyzeResponse(BaseModel):
    season_tags: list[str]
    color_tags: list[str]
    category_tags: list[str]
    style_tags: list[str]


# ─── Vision API 호출 ──────────────────────────────────────────────────────────

def get_vision_client():
    """서비스 계정으로 Vision 클라이언트 생성"""
    try:
        from google.cloud import vision
        from google.oauth2 import service_account
    except ImportError:
        raise HTTPException(
            status_code=500,
            detail="google-cloud-vision 패키지가 설치되지 않았습니다. pip install google-cloud-vision",
        )

    # 환경변수에서 JSON 내용을 직접 읽는 경우 (배포 환경 권장)
    key_json_str = os.getenv("GOOGLE_VISION_KEY_JSON")
    if key_json_str:
        key_dict = json.loads(key_json_str)
        credentials = service_account.Credentials.from_service_account_info(
            key_dict,
            scopes=["https://www.googleapis.com/auth/cloud-platform"],
        )
        return vision.ImageAnnotatorClient(credentials=credentials)

    # GOOGLE_APPLICATION_CREDENTIALS 파일 경로를 사용하는 경우 (로컬 개발 권장)
    # 환경변수만 설정해두면 자동으로 인식됨
    return vision.ImageAnnotatorClient()


@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_image(
    body: AnalyzeRequest,
    current_user: User = Depends(get_current_user),
):
    """
    이미지를 Google Vision AI로 분석하여 태그를 반환합니다.

    - image_base64: 이미지를 base64로 인코딩한 문자열
    - crop_rect: 선택 영역 (선택적, 정규화된 좌표 0~1)
    """
    try:
        from google.cloud import vision

        client = get_vision_client()

        image_bytes = base64.b64decode(body.image_base64)
        image = vision.Image(content=image_bytes)

        # crop_rect가 있으면 bounding poly로 변환 (Vision API crop hints)
        features = [
            vision.Feature(type_=vision.Feature.Type.LABEL_DETECTION, max_results=30),
            vision.Feature(type_=vision.Feature.Type.IMAGE_PROPERTIES),
            vision.Feature(type_=vision.Feature.Type.OBJECT_LOCALIZATION, max_results=10),
        ]

        request = vision.AnnotateImageRequest(image=image, features=features)
        response = client.annotate_image(request)

        if response.error.message:
            raise HTTPException(status_code=500, detail=f"Vision API 오류: {response.error.message}")

        # ── 라벨 추출 ──
        labels = [label.description for label in response.label_annotations]
        objects = [obj.name for obj in response.localized_object_annotations]
        all_labels = labels + objects

        category_tags, style_tags, season_tags = map_labels_to_tags(all_labels)

        # ── 색상 추출 ──
        color_tags: list[str] = []
        seen_colors: set[str] = set()
        colors_info = response.image_properties_annotation.dominant_colors.colors
        # 점유율 높은 순으로 최대 3개
        sorted_colors = sorted(colors_info, key=lambda c: c.pixel_fraction, reverse=True)
        for color_info in sorted_colors[:5]:
            c = color_info.color
            kr_color = rgb_to_korean_color(int(c.red), int(c.green), int(c.blue))
            if kr_color not in seen_colors and color_info.pixel_fraction > 0.05:
                seen_colors.add(kr_color)
                color_tags.append(kr_color)
            if len(color_tags) >= 3:
                break

        return AnalyzeResponse(
            season_tags=season_tags[:3],
            color_tags=color_tags,
            category_tags=category_tags[:4],
            style_tags=style_tags[:3],
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"분석 실패: {str(e)}")
