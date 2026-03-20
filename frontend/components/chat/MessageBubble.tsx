/**
 * MessageBubble
 * 채팅 말풍선 컴포넌트
 * - 유저 메시지: 오른쪽 정렬 / 흰색 배경
 * - AI 메시지: 왼쪽 정렬 / 다크 배경 + "CLOSY AI" 레이블
 */
import React from 'react';
import { View, Text } from 'react-native';
import { ChatMessage } from '../../types';
import { styles } from './MessageBubble.styles';

interface MessageBubbleProps {
  message: ChatMessage;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <View style={[styles.wrapper, isUser ? styles.wrapperUser : styles.wrapperAI]}>
      {/* AI 이름 레이블 */}
      {!isUser && <Text style={styles.aiLabel}>CLOSY AI</Text>}

      <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAI]}>
        <Text style={[styles.text, isUser ? styles.textUser : styles.textAI]}>
          {message.content}
        </Text>
      </View>

      {/* 전송 시간 */}
      <Text style={styles.time}>
        {new Date(message.createdAt).toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </Text>
    </View>
  );
}
