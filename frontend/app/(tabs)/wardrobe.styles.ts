/**
 * WardrobeScreen 스타일
 * 옷장 메인 화면 — 2열 그리드, 카테고리 필터, FAB
 */
import { StyleSheet, Dimensions } from 'react-native';
import colors from '../../styles/colors';

const { width } = Dimensions.get('window');

/** 카드 레이아웃 상수 — 스타일과 렌더 로직에서 공유 */
export const CARD_GAP = 10;
export const PADDING = 20;
/** 2열 그리드 기준 카드 너비 */
export const CARD_WIDTH = (width - PADDING * 2 - CARD_GAP) / 2;

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  /** 그리드 contentContainer — FAB/탭바와 겹치지 않도록 하단 여백 */
  grid: {
    paddingHorizontal: PADDING,
    paddingBottom: 100,
  },
  /** 2열 행 간격 */
  row: {
    gap: CARD_GAP,
    marginBottom: CARD_GAP,
  },
  /** 빈 옷장 안내 */
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
  /** FAB (Floating Action Button) — 우하단 고정, 네온 그린 */
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
