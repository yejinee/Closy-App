import { request } from './client';
import { WardrobeItem, Category } from '../types';

// 백엔드 snake_case 응답 타입
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

// 백엔드 → 프론트엔드 타입 변환
function toFrontend(raw: WardrobeItemRaw): WardrobeItem {
  return {
    id: raw.id,
    name: raw.name ?? '',
    category: raw.category as Category,
    color: raw.color ?? '',
    styleTags: raw.style_tags,
    season: raw.season ? ([raw.season] as any) : [],
    imageUri: raw.image_url,
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

export const wardrobeApi = {
  list: async (token: string): Promise<WardrobeItem[]> => {
    const raw = await request<WardrobeItemRaw[]>('/wardrobe', { token });
    return raw.map(toFrontend);
  },

  create: async (token: string, params: CreateItemParams): Promise<WardrobeItem> => {
    const raw = await request<WardrobeItemRaw>('/wardrobe', {
      method: 'POST',
      token,
      body: params,
    });
    return toFrontend(raw);
  },

  delete: (token: string, id: string): Promise<void> =>
    request<void>(`/wardrobe/${id}`, { method: 'DELETE', token }),
};
