// 앱 전체에서 사용하는 타입 정의

// 옷장 아이템 카테고리
export type Category = '전체' | '상의' | '하의' | '아우터' | '신발' | '기타';

// 등록 가능한 카테고리 (전체 제외)
export type ItemCategory = '상의' | '하의' | '아우터' | '신발' | '기타';

// 계절
export type Season = '봄' | '여름' | '가을' | '겨울';

// 이미지 내 crop 영역 (정규화된 좌표 0~1)
export interface CropRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Google Vision AI가 반환하는 태그 구조
export interface GeneratedTags {
  seasonTags: string[];
  colorTags: string[];
  categoryTags: string[];
  styleTags: string[];
}

// 옷장 아이템 (wardrobe_items 테이블 대응)
export interface WardrobeItem {
  id: string;
  name: string;
  category: Category;
  color: string;
  styleTags: string[];
  season: Season[];
  imageUri: string | null; // 로컬 이미지 URI (백엔드 연동 전)
  wearCount: number;       // 착용 횟수
  createdAt: string;
  // AI 생성 태그 (선택적)
  generatedTags?: GeneratedTags;
  cropRect?: CropRect;
}

// 채팅 메시지 (chat_messages 테이블 대응)
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  imageUri?: string; // 추구미 이미지
  createdAt: string;
}
