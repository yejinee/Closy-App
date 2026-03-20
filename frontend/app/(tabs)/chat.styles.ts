/**
 * ChatScreen 스타일
 * AI 채팅 화면 — 메시지 리스트, AI 타이핑 점 3개 표시
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
  },
  /** 메시지 리스트 padding */
  messageList: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  /** AI 타이핑 표시 — 점 3개 (정적, 추후 애니메이션으로 교체 가능) */
  loadingBubble: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 6,
    marginTop: 6,
  },
  /** 타이핑 점 */
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: colors.accent,
  },
});
