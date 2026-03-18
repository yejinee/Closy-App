import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import colors from '../../styles/colors';

// 채팅 입력창 컴포넌트
// - onSend: 텍스트 전송 콜백
// - onSendImage: 이미지 전송 콜백 (추구미 이미지)
// - disabled: 전송 비활성 (AI 응답 대기 중)

interface ChatInputProps {
  onSend: (text: string) => void;
  onSendImage?: (uri: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, onSendImage, disabled = false }: ChatInputProps) {
  const [text, setText] = useState('');

  // 텍스트 전송
  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText('');
  };

  // 이미지 첨부 — 추구미 이미지 선택
  const handleImagePick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('권한 필요', '사진 접근 권한이 필요해요.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
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

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.bg,
    borderTopWidth: 1,
    borderTopColor: colors.surface,
    gap: 10,
  },
  imageBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  imageBtnIcon: {
    fontSize: 20,
  },
  input: {
    flex: 1,
    backgroundColor: colors.surfaceLight,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.black,
    maxHeight: 100, // 최대 5줄
  },
  sendBtn: {
    width: 40,
    height: 40,
    backgroundColor: colors.accent,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  sendBtnDisabled: {
    backgroundColor: colors.surface,
  },
  sendBtnText: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.black,
  },
});
