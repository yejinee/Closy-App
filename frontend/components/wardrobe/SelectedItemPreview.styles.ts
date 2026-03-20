/**
 * SelectedItemPreview 스타일
 * 크롭 선택 영역을 수학적으로 시뮬레이션하는 미리보기 카드 스타일
 */
import { StyleSheet } from 'react-native';
import colors from '../../styles/colors';

/** 미리보기 정사각형 크기 (px) — 컴포넌트 로직에서도 참조 */
export const PREVIEW_SIZE = 120;

export const styles = StyleSheet.create({
  /** 카드 전체 — 가로 배치 */
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  /** 크롭 시뮬레이션 뷰 — overflow hidden으로 잘라내기 */
  cropFrame: {
    width: PREVIEW_SIZE,
    height: PREVIEW_SIZE,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: colors.bg,
    flexShrink: 0,
  },
  /** 오른쪽 정보 영역 */
  info: {
    flex: 1,
    gap: 8,
  },
  /** 카테고리 뱃지 */
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.accent,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    color: colors.black,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  /** 안내 힌트 텍스트 */
  hint: {
    fontSize: 12,
    color: colors.sub,
    lineHeight: 18,
  },
});
