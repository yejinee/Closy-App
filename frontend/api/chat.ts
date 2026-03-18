import { request } from './client';
import { ChatMessage } from '../types';

// 백엔드 응답 타입
interface ChatMessageRaw {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  image_url: string | null;
  created_at: string;
}

interface ChatResponseRaw {
  reply: string;
  message: ChatMessageRaw;
}

function toFrontend(raw: ChatMessageRaw): ChatMessage {
  return {
    id: raw.id,
    role: raw.role,
    content: raw.content,
    imageUri: raw.image_url ?? undefined,
    createdAt: raw.created_at,
  };
}

export const chatApi = {
  send: async (
    token: string,
    message: string,
    image_url?: string | null
  ): Promise<ChatMessage> => {
    const raw = await request<ChatResponseRaw>('/chat', {
      method: 'POST',
      token,
      body: { message, image_url: image_url ?? null },
    });
    return toFrontend(raw.message);
  },

  history: async (token: string): Promise<ChatMessage[]> => {
    const raw = await request<ChatMessageRaw[]>('/chat/history', { token });
    return raw.map(toFrontend);
  },
};
