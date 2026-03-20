/**
 * WardrobeCard 스타일
 * 옷장 그리드의 개별 카드 (이미지 + 이름 + 태그 + 착용횟수 뱃지)
 */
import { StyleSheet } from 'react-native';
import colors from '../../styles/colors';

export const styles = StyleSheet.create({
  /** 카드 기본 — 비선택 상태 (border 없음) */
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 6,
    overflow: 'hidden',
  },
  /** 선택 상태 — 네온 그린 border */
  cardSelected: {
    borderWidth: 2,
    borderColor: colors.accent,
  },
  /** 옷 이미지 — 세로 3:4 비율 */
  image: {
    width: '100%',
    aspectRatio: 3 / 4,
  },
  /** 이미지 없을 때 플레이스홀더 */
  placeholder: {
    width: '100%',
    aspectRatio: 3 / 4,
    backgroundColor: '#2A2A2A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 12,
    color: colors.sub,
    fontWeight: '600',
    letterSpacing: 1,
  },
  /** 착용 횟수 뱃지 — 이미지 우하단 overlay */
  wearBadge: {
    position: 'absolute',
    bottom: 40,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  wearText: {
    fontSize: 10,
    color: colors.sub,
    fontWeight: '600',
  },
  /** 카드 하단 정보 영역 (이름 + 태그) */
  info: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  name: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.white,
  },
  tag: {
    fontSize: 10,
    color: colors.sub,
    marginTop: 2,
  },
});
