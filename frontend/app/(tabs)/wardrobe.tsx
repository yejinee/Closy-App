/**
 * WardrobeScreen
 * 옷장 메인 화면 — 2열 그리드로 아이템 목록 표시
 * - 카테고리 필터로 아이템 분류
 * - FAB(+) 탭 시 wardrobe-add 화면으로 이동
 * - 카드 탭 시 선택/해제 토글 (네온 border)
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Header from '../../components/common/Header';
import CategoryFilter from '../../components/wardrobe/CategoryFilter';
import WardrobeCard from '../../components/wardrobe/WardrobeCard';
import useWardrobeStore from '../../store/wardrobeStore';
import useAuthStore from '../../store/authStore';
import { WardrobeItem } from '../../types';
import colors from '../../styles/colors';
import { styles, CARD_WIDTH, CARD_GAP } from './wardrobe.styles';

export default function WardrobeScreen() {
  const { items, selectedCategory, setCategory, fetchItems, isLoading } = useWardrobeStore();
  const token = useAuthStore((s) => s.token);

  /** 현재 선택된 카드 ID (네온 border 표시용) */
  const [selectedId, setSelectedId] = useState<string | null>(null);

  /** 화면 진입 시 옷장 목록 불러오기 */
  useEffect(() => {
    if (token) fetchItems(token);
  }, [token]);

  /** 카테고리 필터 적용 */
  const filteredItems =
    selectedCategory === '전체'
      ? items
      : items.filter((item) => item.category === selectedCategory);

  /** 카드 탭 — 선택/해제 토글 */
  const handleCardPress = (item: WardrobeItem) => {
    setSelectedId((prev) => (prev === item.id ? null : item.id));
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      {/* 헤더 — 아이템 수 서브타이틀 */}
      <Header title="CLOSY" subtitle={`${items.length} ITEMS`} />

      {/* 카테고리 필터 탭 */}
      <CategoryFilter selected={selectedCategory} onSelect={setCategory} />

      {/* 로딩 스피너 */}
      {isLoading && (
        <ActivityIndicator
          size="small"
          color={colors.accent}
          style={{ marginVertical: 8 }}
        />
      )}

      {/* 옷장 2열 그리드 */}
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          // 아이템 없을 때 빈 상태 안내
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>옷장이 비어있어</Text>
            <Text style={styles.emptySubtitle}>
              아래 + 버튼으로 첫 번째 옷을 추가해봐
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={{ width: CARD_WIDTH }}>
            <WardrobeCard
              item={item}
              onPress={() => handleCardPress(item)}
              selected={selectedId === item.id}
            />
          </View>
        )}
      />

      {/* FAB — 아이템 추가 (우하단 고정) */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/wardrobe-add')}
        activeOpacity={0.85}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
