/**
 * TagChipEditor
 * 태그 칩 목록 + 입력 필드 에디터
 * - tags: 현재 태그 배열
 * - onChange: 태그 변경 시 콜백
 * - accent: 칩 색상 커스텀 (기본: 네온그린)
 */
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import colors from '../../styles/colors';
import { styles } from './TagChipEditor.styles';

interface Props {
  tags: string[];
  onChange: (tags: string[]) => void;
  /** 칩 배경/테두리/텍스트 색상 (기본: 네온그린) */
  accent?: string;
}

export default function TagChipEditor({ tags, onChange, accent = colors.accent }: Props) {
  const [input, setValue] = useState('');

  /** 입력값을 태그로 추가 (중복 무시) */
  const addTag = () => {
    const trimmed = input.trim();
    if (!trimmed || tags.includes(trimmed)) {
      setValue('');
      return;
    }
    onChange([...tags, trimmed]);
    setValue('');
    Keyboard.dismiss();
  };

  /** 태그 칩 탭 시 삭제 */
  const removeTag = (tag: string) => {
    onChange(tags.filter((t) => t !== tag));
  };

  return (
    <View style={styles.container}>
      {/* 태그 칩 목록 */}
      <View style={styles.chipRow}>
        {tags.map((tag) => (
          <TouchableOpacity
            key={tag}
            // 칩 색상은 accent prop에서 인라인 주입
            style={[styles.chip, { backgroundColor: accent + '22', borderColor: accent }]}
            onPress={() => removeTag(tag)}
            activeOpacity={0.7}
          >
            <Text style={[styles.chipText, { color: accent }]}>#{tag}</Text>
            <Text style={[styles.chipDelete, { color: accent }]}>×</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 태그 입력 */}
      <View style={styles.inputRow}>
        <TextInput
          value={input}
          onChangeText={setValue}
          placeholder="태그 추가..."
          placeholderTextColor={colors.sub}
          style={styles.input}
          onSubmitEditing={addTag}
          returnKeyType="done"
          blurOnSubmit={false}
        />
        <TouchableOpacity style={styles.addBtn} onPress={addTag} activeOpacity={0.75}>
          <Text style={styles.addBtnText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
