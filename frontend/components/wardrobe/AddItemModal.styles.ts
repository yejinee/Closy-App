/**
 * AddItemModal 스타일
 * 기존 간단 아이템 추가 모달 스타일 (wardrobe 탭의 레거시 모달)
 */
import { StyleSheet } from 'react-native';
import colors from '../../styles/colors';

export const styles = StyleSheet.create({
  /** 모달 전체 컨테이너 */
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 32,
  },
  /** 헤더 행 (타이틀 + 닫기 버튼) */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 4,
    color: colors.white,
  },
  closeBtn: {
    fontSize: 20,
    color: colors.sub,
    fontWeight: '700',
  },
  /** 이미지 업로드 터치 영역 */
  imageArea: {
    height: 180,
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: colors.surface,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
    overflow: 'hidden',
  },
  imageUploadContent: {
    alignItems: 'center',
  },
  imageIcon: {
    fontSize: 36,
    color: colors.accent,
    fontWeight: '300',
  },
  imageLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.white,
    marginTop: 8,
    letterSpacing: 1,
  },
  imageHint: {
    fontSize: 11,
    color: colors.sub,
    marginTop: 4,
  },
  /** 이미지 선택 완료 상태 */
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  /** "탭하여 변경" 오버레이 */
  imageChangeOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingVertical: 6,
    alignItems: 'center',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  imageChangeText: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  /** 폼 섹션 */
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.sub,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  /** 텍스트 입력 */
  input: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.black,
  },
  /** 카테고리 칩 행 */
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  catChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: colors.surface,
  },
  catChipActive: {
    borderColor: colors.accent,
  },
  catChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.sub,
  },
  catChipTextActive: {
    color: colors.accent,
  },
  /** 태그 추가 버튼 */
  tagAddBtn: {
    backgroundColor: colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 8,
  },
  tagAddText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.white,
  },
  /** 태그 목록 */
  tagList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  tagChip: {
    borderWidth: 1,
    borderColor: colors.accent,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 3,
  },
  tagChipText: {
    fontSize: 11,
    color: colors.accent,
    fontWeight: '700',
  },
  /** 저장 버튼 */
  saveBtn: {
    backgroundColor: colors.accent,
    paddingVertical: 16,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 16,
  },
  saveBtnText: {
    color: colors.black,
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 4,
  },
});
