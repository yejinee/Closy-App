/**
 * LoginScreen 스타일
 * 로그인 화면 — 로고, 이메일/비밀번호 입력, 로그인 버튼, 회원가입 링크
 */
import { StyleSheet } from 'react-native';
import colors from '../../styles/colors';

export const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  /** 화면 — 수직 중앙 배치 */
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  /** 로고 영역 */
  logoArea: {
    alignItems: 'center',
    marginBottom: 52,
  },
  logo: {
    fontSize: 40,
    fontWeight: '900',
    color: colors.white,
    letterSpacing: 8,
  },
  logoSub: {
    fontSize: 13,
    color: colors.sub,
    letterSpacing: 2,
    marginTop: 6,
  },
  /** 입력 폼 영역 */
  form: {
    gap: 12,
  },
  input: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: colors.black,
  },
  /** 로그인 버튼 */
  btn: {
    backgroundColor: colors.accent,
    paddingVertical: 16,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 8,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  btnText: {
    color: colors.black,
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 4,
  },
  /** 회원가입 링크 */
  signupLink: {
    alignItems: 'center',
    marginTop: 28,
  },
  signupText: {
    fontSize: 13,
    color: colors.sub,
  },
  signupAccent: {
    color: colors.accent,
    fontWeight: '700',
  },
});
