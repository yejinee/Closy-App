/**
 * TagSection 스타일
 * AI 태그 4개 섹션(시즌/컬러/카테고리/스타일)의 레이아웃 스타일
 */
import { StyleSheet } from 'react-native';
import colors from '../../styles/colors';

/** 섹션별 포인트 컬러 — 태그칩 색상에도 동일 값 사용 */
export const SECTION_COLORS = {
  season:   '#00D1FF',      // 시즌   → 하늘색
  color:    '#FF6B9D',      // 컬러   → 핑크
  category: colors.accent,  // 카테고리 → 네온그린
  style:    '#A78BFF',      // 스타일 → 퍼플
} as const;

/** 섹션별 한글 레이블 */
export const SECTION_LABELS = {
  season:   '시즌',
  color:    '컬러',
  category: '카테고리',
  style:    '스타일',
} as const;

export const styles = StyleSheet.create({
  /** 전체 섹션 래퍼 */
  container: {
    gap: 16,
  },
  /** AI 태그 헤더 행 (타이틀 + 분석중 뱃지) */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  /** "AI 태그" 타이틀 */
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.white,
    letterSpacing: 0.5,
  },
  /** 분석 중 상태 뱃지 (스피너 + 텍스트) */
  analyzingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surface,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  analyzingText: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: '600',
  },
  /** 이미지 미선택 시 빈 상태 안내 */
  emptyState: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.sub,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
  },
  /** 개별 섹션 (시즌/컬러/카테고리/스타일) 래퍼 */
  section: {
    gap: 8,
  },
  /** 섹션 헤더 행 (색상 점 + 레이블) */
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  /** 섹션 색상 표시 점 */
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  /** 섹션 레이블 (색상은 인라인으로 주입) */
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});
