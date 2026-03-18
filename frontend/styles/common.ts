import { StyleSheet } from 'react-native';
import colors from './colors';

// 공통 스타일 — 앱 전체에서 재사용되는 컴포넌트 스타일

const common = StyleSheet.create({
  // 화면 기본 컨테이너
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  // 가로 패딩 기준 (여백 넉넉하게 — brat 감성)
  container: {
    paddingHorizontal: 20,
  },
  // Primary 버튼 (네온 배경 + 블랙 텍스트)
  btnPrimary: {
    backgroundColor: colors.accent,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 4,
    alignItems: 'center',
  },
  btnPrimaryText: {
    color: colors.black,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  // Secondary 버튼 (아웃라인)
  btnSecondary: {
    borderWidth: 1.5,
    borderColor: colors.accent,
    paddingVertical: 13,
    paddingHorizontal: 24,
    borderRadius: 4,
    alignItems: 'center',
  },
  btnSecondaryText: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  // 카드
  card: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    overflow: 'hidden',
  },
  // 입력창
  input: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.black,
  },
  // 구분선
  divider: {
    height: 1,
    backgroundColor: colors.surface,
    marginVertical: 12,
  },
  // 행 (가로 정렬)
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  // 가운데 정렬
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default common;
