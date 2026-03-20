/**
 * TagChipEditor 스타일
 * 태그 칩 목록 + 입력 필드 스타일
 * 칩의 색상(배경/테두리/텍스트)은 accent prop으로 인라인 주입되므로
 * chip/chipText/chipDelete는 레이아웃 전용 스타일만 정의
 */
import { StyleSheet } from 'react-native';
import colors from '../../styles/colors';

export const styles = StyleSheet.create({
  /** 전체 래퍼 */
  container: {
    gap: 10,
  },
  /** 칩 목록 — 줄바꿈 허용 */
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  /** 개별 태그 칩 레이아웃 (색상은 인라인으로 주입) */
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    gap: 4,
  },
  /** 칩 텍스트 레이아웃 */
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  /** 칩 삭제(×) 버튼 */
  chipDelete: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 16,
  },
  /** 입력 필드 + 추가 버튼 행 */
  inputRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  /** 태그 입력 TextInput */
  input: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: colors.white,
    fontSize: 13,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  /** 태그 추가 버튼 (+) */
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: {
    color: colors.accent,
    fontSize: 20,
    fontWeight: '300',
    lineHeight: 24,
  },
});
