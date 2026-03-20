/**
 * CategorySegmentTabs
 * 아이템 등록 화면의 카테고리 선택 세그먼트 탭
 * - selected: 현재 선택된 카테고리
 * - onSelect: 카테고리 선택 시 콜백
 */
import React from 'react';
import { Text, TouchableOpacity, ScrollView } from 'react-native';
import { ItemCategory } from '../../types';
import { styles } from './CategorySegmentTabs.styles';

/** 선택 가능한 카테고리 목록 */
const CATEGORIES: ItemCategory[] = ['상의', '하의', '아우터', '신발', '기타'];

interface Props {
  selected: ItemCategory;
  onSelect: (category: ItemCategory) => void;
}

export default function CategorySegmentTabs({ selected, onSelect }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {CATEGORIES.map((cat) => {
        const active = cat === selected;
        return (
          <TouchableOpacity
            key={cat}
            style={[styles.tab, active && styles.tabActive]}
            onPress={() => onSelect(cat)}
            activeOpacity={0.75}
          >
            <Text style={[styles.label, active && styles.labelActive]}>{cat}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
