import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ChatMessage } from '../../types';
import colors from '../../styles/colors';

// 채팅 말풍선 컴포넌트
// - 유저: 오른쪽 / 흰색 배경
// - AI: 왼쪽 / 다크 배경

interface MessageBubbleProps {
  message: ChatMessage;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <View style={[styles.wrapper, isUser ? styles.wrapperUser : styles.wrapperAI]}>
      {/* AI 이름 표시 */}
      {!isUser && <Text style={styles.aiLabel}>CLOSY AI</Text>}

      <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAI]}>
        {/* 메시지 텍스트 — AI는 핵심 단어 강조 없이 일반 텍스트로 표시 */}
        <Text style={[styles.text, isUser ? styles.textUser : styles.textAI]}>
          {message.content}
        </Text>
      </View>

      {/* 시간 */}
      <Text style={styles.time}>
        {new Date(message.createdAt).toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 6,
    maxWidth: '80%',
  },
  // 유저: 오른쪽 정렬
  wrapperUser: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  // AI: 왼쪽 정렬
  wrapperAI: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  aiLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.accent,
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  bubble: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  // 유저 말풍선: 흰색
  bubbleUser: {
    backgroundColor: colors.white,
    borderBottomRightRadius: 3,
  },
  // AI 말풍선: 다크
  bubbleAI: {
    backgroundColor: colors.surface,
    borderBottomLeftRadius: 3,
  },
  text: {
    fontSize: 14,
    lineHeight: 22,
  },
  textUser: {
    color: colors.black,
    fontWeight: '500',
  },
  textAI: {
    color: colors.white,
    fontWeight: '400',
  },
  time: {
    fontSize: 10,
    color: colors.sub,
    marginTop: 4,
  },
});
