// 앱 전체에서 사용하는 타입 정의

// 옷장 아이템 카테고리
export type Category = '전체' | '상의' | '하의' | '아우터' | '신발' | '기타';

// 계절
export type Season = '봄' | '여름' | '가을' | '겨울';

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
}

// 채팅 메시지 (chat_messages 테이블 대응)
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  imageUri?: string; // 추구미 이미지
  createdAt: string;
}
