/**
 * WardrobeAddScreen 스타일
 * 아이템 추가 화면 — 이미지 업로드, 카테고리, AI 태그, 저장 버튼
 */
import { StyleSheet } from 'react-native';
import colors from '../styles/colors';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  /** 헤더 행 (뒤로 + 타이틀) */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.surface,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 22,
    color: colors.white,
    fontWeight: '300',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.white,
    letterSpacing: 1,
  },
  /** ScrollView contentContainer */
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 14,
  },
  /** 섹션 구분 레이블 (이미지 / 카테고리 / AI 태그) */
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.sub,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  /** 에러 메시지 박스 */
  errorBox: {
    backgroundColor: '#2A0A0A',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FF4444',
  },
  errorText: {
    color: '#FF6666',
    fontSize: 13,
    lineHeight: 18,
  },
  /** 저장 버튼 — 활성 상태 */
  saveBtn: {
    height: 52,
    borderRadius: 12,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  /** 저장 버튼 — 비활성 (이미지 미선택 또는 저장 중) */
  saveBtnDisabled: {
    opacity: 0.45,
    shadowOpacity: 0,
    elevation: 0,
  },
  saveBtnText: {
    color: colors.black,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 1,
  },
});
