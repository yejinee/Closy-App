/**
 * WardrobeAddScreen
 * 아이템 추가 화면
 *
 * 이미지 URI 관리:
 *  - selectedImageUri : 사용자가 갤러리/카메라에서 선택한 원본 이미지
 *  - croppedImageUri  : CropModal에서 확인 후 반환된 실제 크롭 결과
 *  - previewUri       : 미리보기·AI·저장에 사용 (croppedImageUri 우선)
 *
 * 흐름:
 * 1. 이미지 박스 탭 → 바텀 시트 (사진 촬영 / 사진첩)
 * 2. 이미지 선택 → selectedImageUri 저장 → CropModal 열기
 * 3. 크롭 확인 → croppedImageUri 저장 → Vision AI 자동 분석
 * 4. 태그 수동 편집 후 저장
 */
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import ImageUploadBox from '../components/wardrobe/ImageUploadBox';
import CropModal from '../components/wardrobe/CropModal';
import CategorySegmentTabs from '../components/wardrobe/CategorySegmentTabs';
import TagSection from '../components/wardrobe/TagSection';

import useWardrobeStore from '../store/wardrobeStore';
import useAuthStore from '../store/authStore';
import { analyzeImage } from '../services/visionService';
import { wardrobeApi } from '../api/wardrobe';
import { GeneratedTags, ItemCategory } from '../types';
import { styles } from './wardrobe-add.styles';

/** 세부 카테고리 태그 → 대분류(CategorySegmentTabs) 매핑 */
const DETAIL_TO_BROAD: Record<string, ItemCategory> = {
  // 상의
  셔츠: '상의', 티셔츠: '상의', 블라우스: '상의', 스웨터: '상의',
  니트: '상의', 후드: '상의', 상의: '상의', 탱크탑: '상의', 폴로: '상의',
  // 하의
  팬츠: '하의', 청바지: '하의', 슬랙스: '하의',
  스커트: '하의', 쇼츠: '하의', 레깅스: '하의',
  // 아우터
  재킷: '아우터', 코트: '아우터', 블레이저: '아우터',
  파카: '아우터', 패딩: '아우터', 윈드브레이커: '아우터', 가디건: '아우터',
  // 신발
  신발: '신발', 스니커즈: '신발', 부츠: '신발', 힐: '신발',
  샌들: '신발', 로퍼: '신발', 옥스포드: '신발', 슬리퍼: '신발',
  // 기타
  백: '기타', 모자: '기타', 캡: '기타', 스카프: '기타',
  벨트: '기타', 장갑: '기타', 양말: '기타',
};

/** AI 태그 초기 상태 */
const DEFAULT_TAGS: GeneratedTags = {
  seasonTags: [],
  colorTags: [],
  categoryTags: [],
  styleTags: [],
};

export default function WardrobeAddScreen() {
  // ─── 이미지 URI 분리 관리 ──────────────────────────────────────────────
  /** 사용자가 갤러리/카메라에서 선택한 원본 이미지 URI */
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  /** CropModal에서 확인 후 반환된 실제 크롭 결과 URI */
  const [croppedImageUri, setCroppedImageUri] = useState<string | null>(null);

  const [cropModalVisible, setCropModalVisible] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<ItemCategory>('상의');
  const [generatedTags, setGeneratedTags] = useState<GeneratedTags>(DEFAULT_TAGS);

  const [analyzing, setAnalyzing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addItemLocally = useWardrobeStore((s) => s.addItemLocally);
  const token = useAuthStore((s) => s.token);

  /** 미리보기·AI·저장에 사용할 최종 이미지 URI (크롭 결과 우선) */
  const previewUri = croppedImageUri ?? selectedImageUri;
  console.log('[WardrobeAdd] previewUri:', previewUri, '/ cropped:', croppedImageUri, '/ selected:', selectedImageUri);

  // ─── 이미지 선택 → 크롭 모달 열기 ────────────────────────────────────────
  const handleImagePicked = useCallback((uri: string) => {
    console.log('[WardrobeAdd] 이미지 선택 (원본):', uri);
    setSelectedImageUri(uri);
    // 새 이미지 선택 시 이전 크롭 결과 초기화
    setCroppedImageUri(null);
    setCropModalVisible(true);
  }, []);

  // ─── 크롭 확정 → Vision AI 분석 ──────────────────────────────────────────
  const handleCropConfirm = useCallback(
    async (croppedUri: string) => {
      console.log('[WardrobeAdd] 크롭 결과 URI:', croppedUri);
      console.log('[WardrobeAdd] 원본 URI:', selectedImageUri);

      setCropModalVisible(false);
      // 크롭 결과를 별도 상태에 저장
      setCroppedImageUri(croppedUri);
      setGeneratedTags(DEFAULT_TAGS);
      setError(null);

      // Vision AI 분석 — 크롭된 이미지 사용
      const analyzeUri = croppedUri;
      console.log('[WardrobeAdd] Vision AI 요청 URI:', analyzeUri);

      setAnalyzing(true);
      try {
        const tags = await analyzeImage(analyzeUri, token);
        setGeneratedTags(tags);

        // AI 세부 카테고리 → 대분류 자동 선택
        const broad = tags.categoryTags
          .map((t) => DETAIL_TO_BROAD[t])
          .find(Boolean);
        console.log('[AutoCategory] categoryTags:', tags.categoryTags, '→ broad:', broad);
        if (broad) setSelectedCategory(broad);
      } catch {
        setError('태그 분석에 실패했어요. 수동으로 추가할 수 있어요.');
      } finally {
        setAnalyzing(false);
      }
    },
    [selectedImageUri, token],
  );

  // ─── 저장: 이미지 업로드 → DB 저장 ──────────────────────────────────────
  const handleSave = useCallback(async () => {
    if (!previewUri) {
      Alert.alert('이미지 필요', '이미지를 먼저 선택해주세요.');
      return;
    }
    if (!token) {
      Alert.alert('로그인 필요', '로그인 후 이용해주세요.');
      return;
    }

    console.log('[WardrobeAdd] 저장 시작 — previewUri:', previewUri);

    setSaving(true);
    setError(null);

    try {
      // 1. 크롭된 이미지를 백엔드에 업로드 → 서버 경로 반환
      const imageUrl = await wardrobeApi.uploadImage(token, previewUri);
      console.log('[WardrobeAdd] 이미지 업로드 완료:', imageUrl);

      // 2. 시즌 태그 → DB용 단일 값 변환 (첫 번째 값 또는 '사계절')
      const seasonValue = generatedTags.seasonTags.find((s) =>
        ['봄', '여름', '가을', '겨울'].includes(s),
      ) ?? '사계절';

      // 3. 아이템 메타데이터 DB 저장 — 태그는 ',' 구분자로 전체 저장
      const created = await wardrobeApi.create(token, {
        name: generatedTags.categoryTags.length > 0
          ? generatedTags.categoryTags.join(',')
          : selectedCategory,
        category: selectedCategory,
        color: generatedTags.colorTags.length > 0
          ? generatedTags.colorTags.join(',')
          : undefined,
        style_tags: generatedTags.styleTags,
        season: seasonValue,
        image_url: imageUrl,
      });
      console.log('[WardrobeAdd] DB 저장 완료, id:', created.id);

      // 4. 로컬 스토어에도 반영 (목록 화면 즉시 갱신)
      addItemLocally(created);
      router.back();
    } catch (e: any) {
      console.error('[WardrobeAdd] 저장 실패:', e.message);
      setError('저장에 실패했어요. 다시 시도해주세요.');
    } finally {
      setSaving(false);
    }
  }, [previewUri, token, selectedCategory, generatedTags, addItemLocally]);

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.75}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>아이템 추가</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* 이미지 업로드 — 크롭 결과 우선 표시 */}
          <Text style={styles.sectionLabel}>이미지</Text>
          <ImageUploadBox
            imageUri={previewUri}
            onImageSelected={handleImagePicked}
          />

          {/* 카테고리 */}
          <Text style={styles.sectionLabel}>카테고리</Text>
          <CategorySegmentTabs
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />

          {/* AI 태그 */}
          <TagSection
            tags={generatedTags}
            analyzing={analyzing}
            onChange={setGeneratedTags}
          />

          {/* 에러 메시지 */}
          {error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* 저장 버튼 */}
          <TouchableOpacity
            style={[styles.saveBtn, (saving || !previewUri) && styles.saveBtnDisabled]}
            onPress={handleSave}
            disabled={saving || !previewUri}
            activeOpacity={0.85}
          >
            {saving ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.saveBtnText}>저장하기</Text>
            )}
          </TouchableOpacity>

          <View style={{ height: 32 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* 전체화면 크롭 모달 — 원본 이미지 URI를 전달 */}
      {selectedImageUri && (
        <CropModal
          visible={cropModalVisible}
          imageUri={selectedImageUri}
          onConfirm={handleCropConfirm}
          onCancel={() => setCropModalVisible(false)}
        />
      )}
    </SafeAreaView>
  );
}
