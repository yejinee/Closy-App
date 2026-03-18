import { create } from 'zustand';
import { WardrobeItem, Category } from '../types';

// 옷장 상태 타입
interface WardrobeState {
  items: WardrobeItem[];           // 전체 아이템 목록
  selectedCategory: Category;     // 현재 선택된 카테고리 필터
  setCategory: (category: Category) => void;
  addItem: (item: WardrobeItem) => void;
  removeItem: (id: string) => void;
  incrementWearCount: (id: string) => void;
}

const useWardrobeStore = create<WardrobeState>((set) => ({
  // 초기값: 빈 배열, 전체 카테고리 선택
  items: [],
  selectedCategory: '전체',

  // 카테고리 필터 변경
  setCategory: (category) => set({ selectedCategory: category }),

  // 아이템 추가
  addItem: (item) =>
    set((state) => ({ items: [item, ...state.items] })),

  // 아이템 삭제
  removeItem: (id) =>
    set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

  // 착용 횟수 증가
  incrementWearCount: (id) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.id === id ? { ...i, wearCount: i.wearCount + 1 } : i
      ),
    })),
}));

export default useWardrobeStore;
