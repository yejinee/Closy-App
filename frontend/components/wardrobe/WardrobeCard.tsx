/**
 * WardrobeCard
 * 옷장 그리드의 개별 카드 컴포넌트
 * - item: 옷 데이터
 * - onPress: 카드 탭 시 콜백 (선택/해제 토글)
 * - selected: 선택 상태 (네온 그린 border 표시)
 */
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { WardrobeItem } from '../../types';
import { styles } from './WardrobeCard.styles';

interface WardrobeCardProps {
  item: WardrobeItem;
  onPress: () => void;
  selected?: boolean;
}

export default function WardrobeCard({ item, onPress, selected = false }: WardrobeCardProps) {
  return (
    <TouchableOpacity
      style={[styles.card, selected && styles.cardSelected]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* 이미지 영역 */}
      {item.imageUri ? (
        <Image source={{ uri: item.imageUri }} style={styles.image} resizeMode="cover" />
      ) : (
        // 이미지 없을 때 카테고리 텍스트 플레이스홀더
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>{item.category}</Text>
        </View>
      )}

      {/* 착용 횟수 뱃지 — 1회 이상일 때만 표시 */}
      {item.wearCount > 0 && (
        <View style={styles.wearBadge}>
          <Text style={styles.wearText}>{item.wearCount}회</Text>
        </View>
      )}

      {/* 아이템 이름 + 첫 번째 스타일 태그 */}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        {item.styleTags.length > 0 && (
          <Text style={styles.tag}>#{item.styleTags[0]}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}
