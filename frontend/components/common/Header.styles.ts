/**
 * Header 스타일
 * 앱 공통 상단 헤더 (로고 + 서브타이틀 + 우측 슬롯)
 */
import { StyleSheet } from 'react-native';
import colors from '../../styles/colors';

export const styles = StyleSheet.create({
  /** 헤더 컨테이너 — paddingTop은 SafeAreaInsets로 동적 적용 */
  container: {
    backgroundColor: colors.bg,
    paddingHorizontal: 20,
    paddingBottom: 0,
  },
  /** 내부 행 — 타이틀과 우측 슬롯 */
  inner: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingBottom: 14,
  },
  /** 앱 타이틀 (CLOSY) */
  title: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 5,
    color: colors.white,
    textTransform: 'uppercase',
  },
  /** 서브타이틀 (아이템 수 등) */
  subtitle: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.sub,
    letterSpacing: 1.5,
    marginTop: 2,
    textTransform: 'uppercase',
  },
  /** 하단 구분선 */
  divider: {
    height: 1,
    backgroundColor: colors.surface,
  },
});
