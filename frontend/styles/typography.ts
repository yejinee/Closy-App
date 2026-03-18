import { StyleSheet } from 'react-native';
import colors from './colors';

// 타이포그래피 시스템
// 폰트: Inter (기본), Poppins Bold (로고)
// 스타일: 굵고 직선적, ALL CAPS 적극 활용

const typography = StyleSheet.create({
  // 로고 (CLOSY)
  logo: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 4,
    color: colors.white,
    textTransform: 'uppercase',
  },
  // 섹션 제목
  heading: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.white,
    letterSpacing: 1,
  },
  // 서브 제목
  subheading: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  // 본문
  body: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.white,
    lineHeight: 22,
  },
  // 캡션 (작은 텍스트)
  caption: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.sub,
    letterSpacing: 0.5,
  },
  // 버튼 텍스트
  button: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
});

export default typography;
