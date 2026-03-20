/**
 * ChatScreen
 * AI 채팅 화면 — FastAPI + Gemini 연동
 * - 메시지 전송 시 옷장 컨텍스트 포함하여 AI에게 코디 추천 요청
 * - 이미지 첨부 시 추구미(무드보드) 기반 추천 요청
 */
import React, { useRef, useEffect } from 'react';
import {
  View,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/common/Header';
import MessageBubble from '../../components/chat/MessageBubble';
import ChatInput from '../../components/chat/ChatInput';
import useChatStore from '../../store/chatStore';
import useAuthStore from '../../store/authStore';
import { chatApi } from '../../api/chat';
import { ChatMessage } from '../../types';
import { styles } from './chat.styles';

export default function ChatScreen() {
  const { messages, isLoading, addMessage, setLoading, clearMessages } = useChatStore();
  const token = useAuthStore((s) => s.token);
  const listRef = useRef<FlatList>(null);

  /** 화면 진입 시 채팅 히스토리 불러오기 */
  useEffect(() => {
    if (!token) return;
    chatApi.history(token).then((history) => {
      if (history.length > 0) {
        clearMessages();
        history.forEach(addMessage);
      }
    }).catch(() => {
      // 히스토리 로드 실패 시 웰컴 메시지 유지
    });
  }, [token]);

  /** 새 메시지 추가 시 리스트 맨 아래로 스크롤 */
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages.length]);

  /** 텍스트/이미지 메시지 전송 */
  const handleSend = async (text: string, imageUrl?: string) => {
    if (!token) return;

    // 유저 메시지를 즉시 화면에 추가 (Optimistic UI)
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      createdAt: new Date().toISOString(),
    };
    addMessage(userMsg);
    setLoading(true);

    try {
      // FastAPI → Gemini 호출
      const aiMsg = await chatApi.send(token, text, imageUrl ?? null);
      addMessage(aiMsg);
    } catch (e: any) {
      Alert.alert('오류', e.message);
    } finally {
      setLoading(false);
    }
  };

  /** 이미지 첨부 전송 (추구미 이미지 기반 코디 추천) */
  const handleSendImage = (uri: string) => {
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: '📎 이미지를 첨부했어. 이 무드랑 비슷하게 내 옷장에서 코디 짜줘!',
      imageUri: uri,
      createdAt: new Date().toISOString(),
    };
    addMessage(userMsg);
    handleSend('이미지 기반 코디 추천', uri);
  };

  return (
    // 키보드가 올라올 때 입력창이 가려지지 않도록
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaView style={styles.screen} edges={['top']}>
        <Header title="CLOSY AI" subtitle="Style Assistant" />

        {/* 메시지 리스트 */}
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messageList}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <MessageBubble message={item} />}
          // AI 응답 대기 중 — 점 3개 타이핑 표시
          ListFooterComponent={
            isLoading ? (
              <View style={styles.loadingBubble}>
                <View style={styles.dot} />
                <View style={styles.dot} />
                <View style={styles.dot} />
              </View>
            ) : null
          }
        />

        <ChatInput
          onSend={handleSend}
          onSendImage={handleSendImage}
          disabled={isLoading}
        />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
