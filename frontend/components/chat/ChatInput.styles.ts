/**
 * ChatInput 스타일
 * 채팅 화면 하단 입력창 (이미지 첨부 + 텍스트 입력 + 전송 버튼)
 */
import { StyleSheet } from 'react-native';
import colors from '../../styles/colors';

export const styles = StyleSheet.create({
  /** 입력창 전체 행 */
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.bg,
    borderTopWidth: 1,
    borderTopColor: colors.surface,
    gap: 10,
  },
  /** 이미지 첨부 버튼 */
  imageBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  imageBtnIcon: {
    fontSize: 20,
  },
  /** 텍스트 입력 필드 (최대 5줄) */
  input: {
    flex: 1,
    backgroundColor: colors.surfaceLight,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.black,
    maxHeight: 100,
  },
  /** 전송 버튼 — 활성 상태 */
  sendBtn: {
    width: 40,
    height: 40,
    backgroundColor: colors.accent,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  /** 전송 버튼 — 비활성 (텍스트 없음 또는 AI 응답 대기 중) */
  sendBtnDisabled: {
    backgroundColor: colors.surface,
  },
  sendBtnText: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.black,
  },
});
