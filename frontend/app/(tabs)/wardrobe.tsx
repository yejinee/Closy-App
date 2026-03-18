import React, { useState } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/common/Header';
import CategoryFilter from '../../components/wardrobe/CategoryFilter';
import WardrobeCard from '../../components/wardrobe/WardrobeCard';
import AddItemModal from '../../components/wardrobe/AddItemModal';
import useWardrobeStore from '../../store/wardrobeStore';
import { WardrobeItem } from '../../types';
import colors from '../../styles/colors';

// 화면 너비를 기준으로 카드 크기 계산
const { width } = Dimensions.get('window');
const CARD_GAP = 10;
const PADDING = 20;
const CARD_WIDTH = (width - PADDING * 2 - CARD_GAP) / 2; // 2열 그리드

// 옷장 화면 (메인 화면)
export default function WardrobeScreen() {
  const { items, selectedCategory, setCategory } = useWardrobeStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // 카테고리 필터 적용
  const filteredItems =
    selectedCategory === '전체'
      ? items
      : items.filter((item) => item.category === selectedCategory);

  // 카드 탭 — 선택/해제 토글
  const handleCardPress = (item: WardrobeItem) => {
    setSelectedId((prev) => (prev === item.id ? null : item.id));
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      {/* 헤더 */}
      <Header
        title="CLOSY"
        subtitle={`${items.length} ITEMS`}
      />

      {/* 카테고리 필터 */}
      <CategoryFilter selected={selectedCategory} onSelect={setCategory} />

      {/* 옷장 그리드 */}
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        numColumns={2}                    // 2열 그리드
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          // 아이템 없을 때 빈 상태 표시
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

      {/* FAB — 아이템 추가 버튼 (네온 그린) */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.85}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

      {/* 아이템 추가 모달 */}
      <AddItemModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  grid: {
    paddingHorizontal: PADDING,
    paddingBottom: 100, // FAB와 탭바가 가리지 않도록
  },
  row: {
    gap: CARD_GAP,
    marginBottom: CARD_GAP,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.white,
    letterSpacing: 1,
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 13,
    color: colors.sub,
    textAlign: 'center',
    lineHeight: 20,
  },
  // FAB 스타일 — 우하단 고정
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  fabIcon: {
    fontSize: 28,
    color: colors.black,
    fontWeight: '300',
    lineHeight: 32,
  },
});
