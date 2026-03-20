/**
 * SignupScreen 스타일
 * 회원가입 화면 — 뒤로 버튼, 타이틀, 이메일/비밀번호 입력, 가입 버튼
 */
import { StyleSheet } from 'react-native';
import colors from '../../styles/colors';

export const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  /** 뒤로 버튼 */
  back: {
    marginBottom: 32,
  },
  backText: {
    color: colors.sub,
    fontSize: 14,
  },
  /** 타이틀 영역 */
  titleArea: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.white,
    letterSpacing: 6,
  },
  subtitle: {
    fontSize: 13,
    color: colors.sub,
    marginTop: 6,
    letterSpacing: 1,
  },
  /** 입력 폼 */
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
  /** 가입 버튼 */
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
});
