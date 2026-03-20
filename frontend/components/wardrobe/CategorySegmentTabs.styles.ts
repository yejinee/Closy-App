/**
 * CategorySegmentTabs 스타일
 * 아이템 등록 화면에서 카테고리를 선택하는 수평 세그먼트 탭 스타일
 */
import { StyleSheet } from 'react-native';
import colors from '../../styles/colors';

export const styles = StyleSheet.create({
  /** 탭 전체를 감싸는 가로 스크롤 컨테이너 */
  container: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 2,
  },
  /** 비활성 탭 */
  tab: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.surface,
    backgroundColor: colors.surface,
  },
  /** 활성 탭 — 네온 그린 채우기 */
  tabActive: {
    borderColor: colors.accent,
    backgroundColor: colors.accent,
  },
  /** 비활성 탭 레이블 */
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.sub,
    letterSpacing: 0.3,
  },
  /** 활성 탭 레이블 — 검정 (배경이 밝으므로) */
  labelActive: {
    color: colors.black,
  },
});
