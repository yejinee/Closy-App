/**
 * CropModal
 * 전체화면 크롭 선택 모달
 * 1. 이미지 위에 드래그/리사이즈 선택 박스 표시 (contain 모드)
 * 2. "확인" 탭 시 expo-image-manipulator로 실제 이미지 크롭 후 URI 반환
 *
 * cropRect를 ref로 관리하여 stale closure 문제를 방지합니다.
 * CropSelectionOverlay가 이미지 기준 정규화 좌표(0~1)를 반환하므로
 * 원본 크기에 곱하기만 하면 pixel 좌표가 됩니다.
 */
import React, { useRef, useState, useCallback } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImageManipulator from 'expo-image-manipulator';
import CropSelectionOverlay from './CropSelectionOverlay';
import { CropRect } from '../../types';
import { styles } from './CropModal.styles';

/** 기본 크롭 영역 — 이미지 중앙 80% */
const DEFAULT_CROP: CropRect = { x: 0.1, y: 0.1, width: 0.8, height: 0.8 };

interface Props {
  visible: boolean;
  imageUri: string;
  /** 크롭 완료 시 잘린 이미지 URI 반환 */
  onConfirm: (croppedUri: string) => void;
  onCancel: () => void;
}

export default function CropModal({ visible, imageUri, onConfirm, onCancel }: Props) {
  /** cropRect를 ref로 관리 — stale closure 방지, 항상 최신 값 참조 */
  const cropRectRef = useRef<CropRect>(DEFAULT_CROP);
  const [processing, setProcessing] = useState(false);

  /** CropSelectionOverlay에서 박스 변경 시 ref 즉시 갱신 */
  const handleCropChange = useCallback((rect: CropRect) => {
    cropRectRef.current = rect;
    console.log('[CropModal] cropRect 갱신:', JSON.stringify(rect));
  }, []);

  /**
   * 확인 버튼 처리
   * ref에서 최신 cropRect를 직접 읽어 stale 값 문제를 원천 차단
   */
  const handleConfirm = async () => {
    const cropRect = cropRectRef.current;
    console.log('[CropModal] 확인 클릭 — cropRect:', JSON.stringify(cropRect));

    setProcessing(true);
    try {
      // 원본 이미지 픽셀 크기 조회
      const { imgW, imgH } = await new Promise<{ imgW: number; imgH: number }>(
        (resolve, reject) => {
          Image.getSize(imageUri, (w, h) => resolve({ imgW: w, imgH: h }), reject);
        },
      );
      console.log('[CropModal] 원본 이미지 크기:', imgW, 'x', imgH);

      // 정규화 좌표(0~1) → 원본 픽셀 좌표
      const pixelX = Math.round(cropRect.x * imgW);
      const pixelY = Math.round(cropRect.y * imgH);
      const pixelW = Math.round(cropRect.width * imgW);
      const pixelH = Math.round(cropRect.height * imgH);

      // 이미지 경계 내로 클램프 (안전장치)
      const safeX = Math.max(0, Math.min(pixelX, imgW - 1));
      const safeY = Math.max(0, Math.min(pixelY, imgH - 1));
      const safeW = Math.max(1, Math.min(pixelW, imgW - safeX));
      const safeH = Math.max(1, Math.min(pixelH, imgH - safeY));

      console.log('[CropModal] 크롭 픽셀:', { safeX, safeY, safeW, safeH });

      const result = await ImageManipulator.manipulateAsync(
        imageUri,
        [{ crop: { originX: safeX, originY: safeY, width: safeW, height: safeH } }],
        { compress: 0.85, format: ImageManipulator.SaveFormat.JPEG },
      );

      console.log('[CropModal] 크롭 결과 URI:', result.uri);
      onConfirm(result.uri);
    } catch (e) {
      console.error('[CropModal] 크롭 실패:', e);
      Alert.alert('오류', '이미지 처리에 실패했어요. 다시 시도해주세요.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onCancel}
    >
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        {/* 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={onCancel}
            style={styles.headerBtn}
            activeOpacity={0.7}
            disabled={processing}
          >
            <Text style={[styles.cancelText, processing && { opacity: 0.4 }]}>취소</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>영역 선택</Text>
          <View style={styles.headerBtn} />
        </View>

        <Text style={styles.hint}>드래그로 이동 · 모서리로 크기 조절</Text>

        {/* 크롭 오버레이 — visible일 때만 마운트하여 ref 초기화 */}
        {visible && (
          <CropSelectionOverlay
            key={imageUri}
            imageUri={imageUri}
            onCropChange={handleCropChange}
            containerStyle={styles.cropArea}
          />
        )}

        {/* 확인 버튼 */}
        <TouchableOpacity
          style={[styles.confirmBtn, processing && styles.confirmBtnDisabled]}
          onPress={handleConfirm}
          disabled={processing}
          activeOpacity={0.85}
        >
          {processing ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.confirmBtnText}>확인</Text>
          )}
        </TouchableOpacity>
      </SafeAreaView>
    </Modal>
  );
}
