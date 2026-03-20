/**
 * AddItemModal
 * 간단 아이템 추가 모달 (레거시 — wardrobe 탭에서 사용)
 * 신규 등록은 wardrobe-add 화면(CropModal 포함)을 사용합니다.
 *
 * - visible: 모달 표시 여부
 * - onClose: 닫기 콜백
 */
import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import useWardrobeStore from '../../store/wardrobeStore';
import useAuthStore from '../../store/authStore';
import { Category } from '../../types';
import colors from '../../styles/colors';
import common from '../../styles/common';
import { styles } from './AddItemModal.styles';

/** 선택 가능한 카테고리 목록 ('전체' 제외) */
const CATEGORIES: Exclude<Category, '전체'>[] = ['상의', '하의', '아우터', '신발', '기타'];

interface AddItemModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function AddItemModal({ visible, onClose }: AddItemModalProps) {
  const createItem = useWardrobeStore((s) => s.createItem);
  const token = useAuthStore((s) => s.token);

  // ─── 폼 상태 ────────────────────────────────────────────────────────────
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Exclude<Category, '전체'>>('상의');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  /**
   * 갤러리에서 이미지 선택
   * quality: 0.75 압축, exif 제거로 파일 크기 최소화
   */
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('권한 필요', '사진 접근 권한이 필요해요.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 0.75,
      exif: false,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  /** 태그 입력 — 엔터 또는 추가 버튼으로 등록 */
  const addTag = () => {
    const trimmed = tagInput.trim().replace('#', '');
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
    }
    setTagInput('');
  };

  /** 폼 초기화 */
  const resetForm = () => {
    setName('');
    setCategory('상의');
    setImageUri(null);
    setTags([]);
    setTagInput('');
  };

  /** 저장 */
  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('이름을 입력해줘!');
      return;
    }
    if (!token) return;

    setIsSaving(true);
    try {
      await createItem(token, {
        name: name.trim(),
        category,
        style_tags: tags,
        image_url: imageUri,
      });
      resetForm();
      onClose();
    } catch (e: any) {
      Alert.alert('저장 실패', e.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* 헤더 */}
          <View style={styles.header}>
            <Text style={styles.title}>ADD ITEM</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeBtn}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* 이미지 업로드 */}
          <TouchableOpacity style={styles.imageArea} onPress={pickImage} activeOpacity={0.8}>
            {imageUri ? (
              <>
                <Image source={{ uri: imageUri }} style={styles.imagePreview} resizeMode="cover" />
                <View style={styles.imageChangeOverlay}>
                  <Text style={styles.imageChangeText}>탭하여 변경</Text>
                </View>
              </>
            ) : (
              <View style={styles.imageUploadContent}>
                <Text style={styles.imageIcon}>+</Text>
                <Text style={styles.imageLabel}>사진 업로드</Text>
                <Text style={styles.imageHint}>갤러리에서 선택</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* 아이템 이름 */}
          <View style={styles.section}>
            <Text style={styles.label}>아이템 이름</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="예: 블랙 크롭 자켓"
              placeholderTextColor={colors.sub}
            />
          </View>

          {/* 카테고리 */}
          <View style={styles.section}>
            <Text style={styles.label}>카테고리</Text>
            <View style={styles.categoryRow}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.catChip, category === cat && styles.catChipActive]}
                  onPress={() => setCategory(cat)}
                >
                  <Text style={[styles.catChipText, category === cat && styles.catChipTextActive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* 스타일 태그 */}
          <View style={styles.section}>
            <Text style={styles.label}>스타일 태그</Text>
            <View style={common.row}>
              <TextInput
                style={[styles.input, { flex: 1, marginRight: 8 }]}
                value={tagInput}
                onChangeText={setTagInput}
                placeholder="#스트릿, #캐주얼..."
                placeholderTextColor={colors.sub}
                onSubmitEditing={addTag}
                returnKeyType="done"
              />
              <TouchableOpacity style={styles.tagAddBtn} onPress={addTag}>
                <Text style={styles.tagAddText}>추가</Text>
              </TouchableOpacity>
            </View>
            {/* 태그 칩 목록 */}
            {tags.length > 0 && (
              <View style={styles.tagList}>
                {tags.map((tag) => (
                  <TouchableOpacity
                    key={tag}
                    style={styles.tagChip}
                    onPress={() => setTags(tags.filter((t) => t !== tag))}
                  >
                    <Text style={styles.tagChipText}>#{tag} ✕</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </ScrollView>

        {/* 저장 버튼 */}
        <TouchableOpacity
          style={[styles.saveBtn, isSaving && { opacity: 0.6 }]}
          onPress={handleSave}
          disabled={isSaving}
          activeOpacity={0.85}
        >
          {isSaving
            ? <ActivityIndicator size="small" color={colors.black} />
            : <Text style={styles.saveBtnText}>SAVE</Text>
          }
        </TouchableOpacity>
      </View>
    </Modal>
  );
}
