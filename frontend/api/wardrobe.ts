/**
 * Wardrobe API 클라이언트
 *
 * - list: 옷장 아이템 목록 조회
 * - create: 아이템 생성 (메타데이터 + image_url)
 * - uploadImage: 이미지 파일 업로드 → image_url 반환
 * - delete: 아이템 삭제
 */
import { request, BASE_URL } from './client';
import { WardrobeItem, Category } from '../types';

// ─── 백엔드 snake_case 응답 타입 ─────────────────────────────────────────────
interface WardrobeItemRaw {
  id: string;
  name: string | null;
  category: string;
  color: string | null;
  style_tags: string[];
  season: string | null;
  image_url: string | null;
  wear_count: number;
  created_at: string;
}

// ─── 백엔드 → 프론트엔드 타입 변환 ──────────────────────────────────────────
function toFrontend(raw: WardrobeItemRaw): WardrobeItem {
  return {
    id: raw.id,
    name: raw.name ?? '',
    category: raw.category as Category,
    color: raw.color ?? '',
    styleTags: raw.style_tags,
    season: raw.season ? ([raw.season] as any) : [],
    // image_url이 상대경로면 BASE_URL을 붙여 절대 URL로 변환
    imageUri: raw.image_url
      ? raw.image_url.startsWith('http')
        ? raw.image_url
        : `${BASE_URL}${raw.image_url}`
      : null,
    wearCount: raw.wear_count,
    createdAt: raw.created_at,
  };
}

export interface CreateItemParams {
  name: string;
  category: string;
  color?: string;
  style_tags?: string[];
  season?: string;
  image_url?: string | null;
}

// ─── API 함수들 ──────────────────────────────────────────────────────────────
export const wardrobeApi = {
  /** 옷장 아이템 목록 조회 */
  list: async (token: string): Promise<WardrobeItem[]> => {
    const raw = await request<WardrobeItemRaw[]>('/wardrobe', { token });
    return raw.map(toFrontend);
  },

  /** 새 아이템 생성 (메타데이터 + image_url) */
  create: async (token: string, params: CreateItemParams): Promise<WardrobeItem> => {
    const raw = await request<WardrobeItemRaw>('/wardrobe', {
      method: 'POST',
      token,
      body: params,
    });
    return toFrontend(raw);
  },

  /**
   * 이미지 파일 업로드
   * 로컬 file:// URI → 서버에 저장 → image_url (서버 경로) 반환
   */
  uploadImage: async (token: string, imageUri: string): Promise<string> => {
    // 파일 확장자 추출
    const ext = imageUri.split('.').pop()?.toLowerCase() ?? 'jpg';
    const filename = `upload_${Date.now()}.${ext}`;

    // FormData로 multipart 요청 구성
    const formData = new FormData();
    formData.append('file', {
      uri: imageUri,
      name: filename,
      type: `image/${ext === 'jpg' ? 'jpeg' : ext}`,
    } as any);

    console.log('[wardrobeApi] 이미지 업로드 시작:', imageUri);

    const res = await fetch(`${BASE_URL}/wardrobe/upload-image`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        // Content-Type은 FormData가 자동 설정 (boundary 포함)
      },
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Unknown error' }));
      throw new Error(err.detail ?? `이미지 업로드 실패: HTTP ${res.status}`);
    }

    const data = await res.json();
    console.log('[wardrobeApi] 업로드 완료, image_url:', data.image_url);
    return data.image_url;
  },

  /** 아이템 삭제 */
  delete: (token: string, id: string): Promise<void> =>
    request<void>(`/wardrobe/${id}`, { method: 'DELETE', token }),
};
