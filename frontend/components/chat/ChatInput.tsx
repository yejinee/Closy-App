/**
 * ChatInput
 * 채팅 화면 하단 입력창
 * - onSend: 텍스트 전송 콜백
 * - onSendImage: 이미지 첨부 전송 콜백 (추구미 이미지)
 * - disabled: AI 응답 대기 중 비활성화
 */
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import colors from '../../styles/colors';
import { styles } from './ChatInput.styles';

interface ChatInputProps {
  onSend: (text: string) => void;
  onSendImage?: (uri: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, onSendImage, disabled = false }: ChatInputProps) {
  const [text, setText] = useState('');

  /** 텍스트 메시지 전송 */
  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText('');
  };

  /** 이미지 첨부 — 추구미(무드보드) 이미지 선택 */
  const handleImagePick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('권한 필요', '사진 접근 권한이 필요해요.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.7,
    });
    if (!result.canceled && onSendImage) {
      onSendImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      {/* 이미지 첨부 버튼 */}
      <TouchableOpacity
        style={styles.imageBtn}
        onPress={handleImagePick}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <Text style={styles.imageBtnIcon}>📎</Text>
      </TouchableOpacity>

      {/* 텍스트 입력 */}
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder="코디 물어봐..."
        placeholderTextColor={colors.sub}
        multiline
        maxLength={500}
        editable={!disabled}
        returnKeyType="send"
        onSubmitEditing={handleSend}
      />

      {/* 전송 버튼 */}
      <TouchableOpacity
        style={[styles.sendBtn, (!text.trim() || disabled) && styles.sendBtnDisabled]}
        onPress={handleSend}
        disabled={!text.trim() || disabled}
        activeOpacity={0.8}
      >
        <Text style={styles.sendBtnText}>→</Text>
      </TouchableOpacity>
    </View>
  );
}
