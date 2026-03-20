import { create } from 'zustand';
import { WardrobeItem, Category } from '../types';
import { wardrobeApi, CreateItemParams } from '../api/wardrobe';

interface WardrobeState {
  items: WardrobeItem[];
  selectedCategory: Category;
  isLoading: boolean;

  setCategory: (category: Category) => void;
  fetchItems: (token: string) => Promise<void>;
  createItem: (token: string, params: CreateItemParams) => Promise<void>;
  deleteItem: (token: string, id: string) => Promise<void>;
  // 로컬 즉시 추가 (백엔드 연동 전 또는 옵티미스틱 업데이트)
  addItemLocally: (item: WardrobeItem) => void;
  // 로컬 전용 (착용 횟수 — 추후 API 연동 가능)
  incrementWearCount: (id: string) => void;
}

const useWardrobeStore = create<WardrobeState>((set, get) => ({
  items: [],
  selectedCategory: '전체',
  isLoading: false,

  setCategory: (category) => set({ selectedCategory: category }),

  fetchItems: async (token) => {
    set({ isLoading: true });
    try {
      const items = await wardrobeApi.list(token);
      set({ items, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  createItem: async (token, params) => {
    const item = await wardrobeApi.create(token, params);
    set((state) => ({ items: [item, ...state.items] }));
  },

  deleteItem: async (token, id) => {
    await wardrobeApi.delete(token, id);
    set((state) => ({ items: state.items.filter((i) => i.id !== id) }));
  },

  addItemLocally: (item) =>
    set((state) => ({ items: [item, ...state.items] })),

  incrementWearCount: (id) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.id === id ? { ...i, wearCount: i.wearCount + 1 } : i
      ),
    })),
}));

export default useWardrobeStore;
