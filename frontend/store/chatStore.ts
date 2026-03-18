import { create } from 'zustand';
import { ChatMessage } from '../types';

// 채팅 상태 타입
interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;             // AI 응답 대기 중 여부
  addMessage: (message: ChatMessage) => void;
  setLoading: (loading: boolean) => void;
  clearMessages: () => void;
}

const useChatStore = create<ChatState>((set) => ({
  // 초기값: 웰컴 메시지
  messages: [
    {
      id: '0',
      role: 'assistant',
      content: '안녕! 나는 CLOSY AI야.\n오늘 어떤 코디 도움이 필요해?',
      createdAt: new Date().toISOString(),
    },
  ],
  isLoading: false,

  // 메시지 추가
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),

  // 로딩 상태 변경
  setLoading: (loading) => set({ isLoading: loading }),

  // 채팅 초기화
  clearMessages: () =>
    set({
      messages: [
        {
          id: '0',
          role: 'assistant',
          content: '안녕! 나는 CLOSY AI야.\n오늘 어떤 코디 도움이 필요해?',
          createdAt: new Date().toISOString(),
        },
      ],
    }),
}));

export default useChatStore;
