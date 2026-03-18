import React, { useRef, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
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
import colors from '../../styles/colors';

// 채팅 화면 — FastAPI + Gemini 연동
export default function ChatScreen() {
  const { messages, isLoading, addMessage, setLoading, clearMessages } = useChatStore();
  const token = useAuthStore((s) => s.token);
  const listRef = useRef<FlatList>(null);

  // 화면 진입 시 채팅 히스토리 불러오기
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

  // 새 메시지가 오면 리스트 맨 아래로 스크롤
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        listRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]);

  // 메시지 전송 처리
  const handleSend = async (text: string, imageUrl?: string) => {
    if (!token) return;

    // 1. 유저 메시지를 즉시 화면에 추가
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      createdAt: new Date().toISOString(),
    };
    addMessage(userMsg);
    setLoading(true);

    try {
      // 2. FastAPI → Gemini 호출
      const aiMsg = await chatApi.send(token, text, imageUrl ?? null);
      addMessage(aiMsg);
    } catch (e: any) {
      Alert.alert('오류', e.message);
    } finally {
      setLoading(false);
    }
  };

  // 이미지 전송 처리 (추구미 이미지)
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
    // KeyboardAvoidingView — 키보드가 올라올 때 입력창이 가려지지 않도록
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaView style={styles.screen} edges={['top']}>
        {/* 헤더 */}
        <Header title="CLOSY AI" subtitle="Style Assistant" />

        {/* 메시지 리스트 */}
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messageList}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <MessageBubble message={item} />}
          // AI 로딩 중 표시 (하단에 점 3개)
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

        {/* 입력창 */}
        <ChatInput
          onSend={handleSend}
          onSendImage={handleSendImage}
          disabled={isLoading}
        />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  messageList: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  // AI 타이핑 표시 — 점 3개 애니메이션 (정적 표시)
  loadingBubble: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 6,
    marginTop: 6,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: colors.accent,
  },
});
