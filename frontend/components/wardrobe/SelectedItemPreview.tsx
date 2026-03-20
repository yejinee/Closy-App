/**
 * SelectedItemPreview
 * cropRect 좌표를 수학적으로 계산해 선택 영역 미리보기를 렌더링
 * - imageUri: 원본 이미지 URI
 * - cropRect: 정규화된 크롭 좌표 (0~1)
 * - category: 카테고리 뱃지 표시용
 */
import React from 'react';
import { View, Image, Text } from 'react-native';
import { CropRect, ItemCategory } from '../../types';
import { styles, PREVIEW_SIZE } from './SelectedItemPreview.styles';

interface Props {
  imageUri: string;
  cropRect: CropRect;
  category: ItemCategory;
}

export default function SelectedItemPreview({ imageUri, cropRect, category }: Props) {
  /**
   * cropRect(0~1 정규화)를 기반으로 이미지 전체를 스케일한 뒤
   * overflow:hidden으로 선택 영역만 보이도록 시뮬레이션
   */
  const scaledW = PREVIEW_SIZE / cropRect.width;
  const scaledH = PREVIEW_SIZE / cropRect.height;
  const offsetX = -cropRect.x * scaledW;
  const offsetY = -cropRect.y * scaledH;

  return (
    <View style={styles.card}>
      {/* 크롭 시뮬레이션 뷰 */}
      <View style={styles.cropFrame}>
        <Image
          source={{ uri: imageUri }}
          style={{ width: scaledW, height: scaledH, marginLeft: offsetX, marginTop: offsetY }}
          resizeMode="cover"
        />
      </View>

      {/* 카테고리 뱃지 + 안내 텍스트 */}
      <View style={styles.info}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{category}</Text>
        </View>
        <Text style={styles.hint} numberOfLines={2}>
          드래그로 영역을{'\n'}조정하세요
        </Text>
      </View>
    </View>
  );
}
