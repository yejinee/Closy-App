/**
 * CategoryFilter
 * 옷장 메인 화면 상단의 카테고리 필터 탭 (전체 포함)
 * - selected: 현재 선택된 카테고리
 * - onSelect: 카테고리 선택 시 콜백
 */
import React from 'react';
import { ScrollView, TouchableOpacity, Text } from 'react-native';
import { Category } from '../../types';
import { styles } from './CategoryFilter.styles';

/** 옷장 필터용 카테고리 목록 ('전체' 포함) */
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
