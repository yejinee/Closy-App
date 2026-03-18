import React, { useRef, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/common/Header';
import MessageBubble from '../../components/chat/MessageBubble';
import ChatInput from '../../components/chat/ChatInput';
import useChatStore from '../../store/chatStore';
import { ChatMessage } from '../../types';
import colors from '../../styles/colors';

// 채팅 화면
// - 유저가 상황을 입력하면 AI(백엔드 연동 전 임시 응답)가 코디 추천
export default function ChatScreen() {
  const { messages, isLoading, addMessage, setLoading } = useChatStore();
  const listRef = useRef<FlatList>(null);

  // 새 메시지가 오면 리스트 맨 아래로 스크롤
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        listRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]);

  // 메시지 전송 처리
  const handleSend = async (text: string) => {
    // 1. 유저 메시지 추가
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      createdAt: new Date().toISOString(),
    };
    addMessage(userMsg);
    setLoading(true);

    // 2. 임시 AI 응답 (백엔드 연동 전 mock)
    // 실제 연동 시 여기서 FastAPI 호출
    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '백엔드 연동 후 실제 코디 추천이 여기에 표시될 거야!\n지금은 테스트 모드야 😊',
        createdAt: new Date().toISOString(),
      };
      addMessage(aiMsg);
      setLoading(false);
    }, 1200);
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
    handleSend('이미지 기반 코디 추천');
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
