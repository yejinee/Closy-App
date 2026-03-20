/**
 * CategoryFilter 스타일
 * 옷장 메인 화면 상단의 카테고리 필터 탭 스타일
 */
import { StyleSheet } from 'react-native';
import colors from '../../styles/colors';

export const styles = StyleSheet.create({
  /** ScrollView — 세로 공간을 과하게 차지하지 않도록 flexGrow 제한 */
  scroll: {
    flexGrow: 0,
  },
  /** 탭 아이템들의 가로 배치 컨테이너 */
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 8,
  },
  /** 비활성 탭 */
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: colors.surface,
  },
  /** 활성 탭 — 네온 아웃라인만 (배경 투명) */
  tabActive: {
    borderColor: colors.accent,
    backgroundColor: 'transparent',
  },
  /** 비활성 탭 텍스트 */
  tabText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.sub,
    letterSpacing: 1,
  },
  /** 활성 탭 텍스트 — 네온 그린 */
  tabTextActive: {
    color: colors.accent,
  },
});
