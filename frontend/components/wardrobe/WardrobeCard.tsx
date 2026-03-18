import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { WardrobeItem } from '../../types';
import colors from '../../styles/colors';

// 옷장 그리드의 개별 카드
// - item: 옷 데이터
// - onPress: 카드 탭 시 콜백 (상세 보기 등)
// - selected: 선택 상태 (네온 border)

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
        // 이미지 없을 때 플레이스홀더
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>{item.category}</Text>
        </View>
      )}

      {/* 착용 횟수 — 이미지 우하단 overlay */}
      {item.wearCount > 0 && (
        <View style={styles.wearBadge}>
          <Text style={styles.wearText}>{item.wearCount}회</Text>
        </View>
      )}

      {/* 아이템 이름 */}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        {/* 스타일 태그 첫 번째 하나만 표시 */}
        {item.styleTags.length > 0 && (
          <Text style={styles.tag}>#{item.styleTags[0]}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 6,
    overflow: 'hidden',
    // 선택 안 됐을 때: border 없음
  },
  // 선택 시 네온 border
  cardSelected: {
    borderWidth: 2,
    borderColor: colors.accent,
  },
  image: {
    width: '100%',
    aspectRatio: 3 / 4, // 옷 이미지 세로 비율
  },
  placeholder: {
    width: '100%',
    aspectRatio: 3 / 4,
    backgroundColor: '#2A2A2A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 12,
    color: colors.sub,
    fontWeight: '600',
    letterSpacing: 1,
  },
  // 착용 횟수 배지 — 이미지 위에 overlay
  wearBadge: {
    position: 'absolute',
    bottom: 40,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  wearText: {
    fontSize: 10,
    color: colors.sub,
    fontWeight: '600',
  },
  info: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  name: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.white,
  },
  tag: {
    fontSize: 10,
    color: colors.sub,
    marginTop: 2,
  },
});
