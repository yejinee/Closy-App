/**
 * CropModal 스타일
 * 전체화면 크롭 선택 모달 스타일
 * 이미지 위에 오버레이를 그리고 "확인" 버튼으로 크롭을 확정합니다.
 */
import { StyleSheet } from 'react-native';
import colors from '../../styles/colors';

export const styles = StyleSheet.create({
  /** 모달 전체 배경 — 검정 */
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  /** 헤더 행 (취소 / 타이틀) */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  /** 헤더 좌우 버튼 터치 영역 */
  headerBtn: {
    width: 60,
    alignItems: 'flex-start',
  },
  /** "취소" 텍스트 */
  cancelText: {
    color: colors.sub,
    fontSize: 16,
    fontWeight: '500',
  },
  /** 모달 타이틀 */
  headerTitle: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1,
  },
  /** 조작 안내 힌트 */
  hint: {
    color: colors.sub,
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  /** 크롭 오버레이 영역 — 남은 공간 전부 차지 */
  cropArea: {
    flex: 1,
    height: undefined,  // 고정 높이 override
    borderRadius: 0,    // 전체화면이므로 radius 제거
  },
  /** 확인 버튼 */
  confirmBtn: {
    marginHorizontal: 20,
    marginTop: 20,
    height: 52,
    borderRadius: 12,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  /** 처리 중 비활성화 상태 */
  confirmBtnDisabled: {
    opacity: 0.6,
  },
  confirmBtnText: {
    color: colors.black,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1,
  },
});
