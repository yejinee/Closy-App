import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Category } from '../../types';
import colors from '../../styles/colors';

// 카테고리 필터 탭
// - selected: 현재 선택된 카테고리
// - onSelect: 카테고리 선택 시 콜백

const CATEGORIES: Category[] = ['전체', '상의', '하의', '아우터', '신발', '기타'];

interface CategoryFilterProps {
  selected: Category;
  onSelect: (category: Category) => void;
}

export default function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
      style={styles.scroll}
    >
      {CATEGORIES.map((cat) => {
        const isActive = selected === cat;
        return (
          <TouchableOpacity
            key={cat}
            onPress={() => onSelect(cat)}
            style={[styles.tab, isActive && styles.tabActive]}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
              {cat}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 0, // 세로 공간을 과하게 차지하지 않도록
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 8, // 탭 간격
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: colors.surface,
  },
  // 선택된 탭: 네온 outline
  tabActive: {
    borderColor: colors.accent,
    backgroundColor: 'transparent',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.sub,
    letterSpacing: 1,
  },
  // 선택된 탭 텍스트: 네온 색
  tabTextActive: {
    color: colors.accent,
  },
});
