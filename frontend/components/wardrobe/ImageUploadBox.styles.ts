/**
 * ImageUploadBox 스타일
 * 이미지 업로드 박스 + 바텀 시트 (사진 촬영/사진첩 선택) 스타일
 */
import { StyleSheet } from 'react-native';
import colors from '../../styles/colors';

export const styles = StyleSheet.create({
  /** 이미지 업로드 터치 영역 */
  container: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.surface,
    borderStyle: 'dashed',
    backgroundColor: colors.surface,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  /** 이미지 선택 완료 상태 — 네온 실선 border */
  hasImage: {
    borderStyle: 'solid',
    borderColor: colors.accent,
  },
  /** 선택된 이미지 — contain으로 전체 이미지 표시 */
  image: {
    width: '100%',
    height: '100%',
  },
  /** "탭하여 변경" 오버레이 — 이미지 하단 */
  changeOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingVertical: 6,
    alignItems: 'center',
  },
  changeText: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  /** 이미지 미선택 플레이스홀더 */
  placeholder: {
    alignItems: 'center',
    gap: 6,
  },
  plusIcon: {
    fontSize: 36,
    color: colors.sub,
    fontWeight: '200',
    lineHeight: 40,
  },
  placeholderTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: 0.5,
  },
  placeholderSub: {
    fontSize: 12,
    color: colors.sub,
    letterSpacing: 0.3,
  },
  // ─── 바텀 시트 ────────────────────────────────────────────────────────────
  /** 반투명 딤 배경 */
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  /** 흰색 바텀 시트 */
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 12,
    paddingBottom: 40,
  },
  /** 드래그 핸들 */
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ccc',
    alignSelf: 'center',
    marginBottom: 16,
  },
  /** 옵션 버튼 (사진 촬영 / 사진첩) */
  option: {
    paddingVertical: 20,
    paddingHorizontal: 28,
  },
  optionText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#111',
  },
  /** 옵션 사이 구분선 */
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
  },
});
