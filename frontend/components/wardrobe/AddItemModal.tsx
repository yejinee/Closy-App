import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import useWardrobeStore from '../../store/wardrobeStore';
import { Category, WardrobeItem } from '../../types';
import colors from '../../styles/colors';
import common from '../../styles/common';

// 아이템 추가 모달
// - visible: 모달 표시 여부
// - onClose: 닫기 콜백

const CATEGORIES: Exclude<Category, '전체'>[] = ['상의', '하의', '아우터', '신발', '기타'];

interface AddItemModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function AddItemModal({ visible, onClose }: AddItemModalProps) {
  const addItem = useWardrobeStore((s) => s.addItem);

  // 폼 상태
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Exclude<Category, '전체'>>('상의');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  // 이미지 선택 — 갤러리에서 가져오기
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('권한 필요', '사진 접근 권한이 필요해요.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  // 태그 추가 — 엔터 또는 쉼표로 구분
  const addTag = () => {
    const trimmed = tagInput.trim().replace('#', '');
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
    }
    setTagInput('');
  };

  // 저장
  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('이름을 입력해줘!');
      return;
    }
    const newItem: WardrobeItem = {
      id: Date.now().toString(),
      name: name.trim(),
      category,
      color: '',
      styleTags: tags,
      season: [],
      imageUri,
      wearCount: 0,
      createdAt: new Date().toISOString(),
    };
    addItem(newItem);
    // 폼 초기화 후 닫기
    setName('');
    setCategory('상의');
    setImageUri(null);
    setTags([]);
    setTagInput('');
    onClose();
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
              // 선택된 이미지 미리보기 표시 텍스트 (Image 컴포넌트는 아래에서 처리)
              <Text style={styles.imageDoneText}>✓ 이미지 선택됨</Text>
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

          {/* 태그 */}
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
            {/* 태그 리스트 */}
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
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.85}>
          <Text style={styles.saveBtnText}>SAVE</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 4,
    color: colors.white,
  },
  closeBtn: {
    fontSize: 20,
    color: colors.sub,
    fontWeight: '700',
  },
  imageArea: {
    height: 180,
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: colors.surface,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  imageUploadContent: {
    alignItems: 'center',
  },
  imageIcon: {
    fontSize: 36,
    color: colors.accent,
    fontWeight: '300',
  },
  imageLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.white,
    marginTop: 8,
    letterSpacing: 1,
  },
  imageHint: {
    fontSize: 11,
    color: colors.sub,
    marginTop: 4,
  },
  imageDoneText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.accent,
    letterSpacing: 1,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.sub,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  input: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.black,
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  catChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: colors.surface,
  },
  catChipActive: {
    borderColor: colors.accent,
  },
  catChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.sub,
  },
  catChipTextActive: {
    color: colors.accent,
  },
  tagAddBtn: {
    backgroundColor: colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 8,
  },
  tagAddText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.white,
  },
  tagList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  tagChip: {
    borderWidth: 1,
    borderColor: colors.accent,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 3,
  },
  tagChipText: {
    fontSize: 11,
    color: colors.accent,
    fontWeight: '700',
  },
  saveBtn: {
    backgroundColor: colors.accent,
    paddingVertical: 16,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 16,
  },
  saveBtnText: {
    color: colors.black,
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 4,
  },
});
