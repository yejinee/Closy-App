/**
 * MessageBubble 스타일
 * 채팅 말풍선 — 유저(오른쪽/흰색) vs AI(왼쪽/다크)
 */
import { StyleSheet } from 'react-native';
import colors from '../../styles/colors';

export const styles = StyleSheet.create({
  /** 말풍선 래퍼 — 최대 너비 80% */
  wrapper: {
    marginVertical: 6,
    maxWidth: '80%',
  },
  /** 유저 메시지 — 오른쪽 정렬 */
  wrapperUser: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  /** AI 메시지 — 왼쪽 정렬 */
  wrapperAI: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  /** AI 이름 레이블 (CLOSY AI) */
  aiLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.accent,
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  /** 말풍선 공통 */
  bubble: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  /** 유저 말풍선 — 흰색, 오른쪽 하단 radius 없음 */
  bubbleUser: {
    backgroundColor: colors.white,
    borderBottomRightRadius: 3,
  },
  /** AI 말풍선 — 다크, 왼쪽 하단 radius 없음 */
  bubbleAI: {
    backgroundColor: colors.surface,
    borderBottomLeftRadius: 3,
  },
  /** 메시지 텍스트 공통 */
  text: {
    fontSize: 14,
    lineHeight: 22,
  },
  textUser: {
    color: colors.black,
    fontWeight: '500',
  },
  textAI: {
    color: colors.white,
    fontWeight: '400',
  },
  /** 시간 표시 */
  time: {
    fontSize: 10,
    color: colors.sub,
    marginTop: 4,
  },
});
