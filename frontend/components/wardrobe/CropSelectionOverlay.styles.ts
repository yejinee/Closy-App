/**
 * CropSelectionOverlay 스타일
 * 이미지 위에 드래그/리사이즈 가능한 선택 박스 오버레이 스타일
 * 마스크 4개(상/하/좌/우)로 선택 영역 외부를 어둡게 처리합니다.
 *
 * 코너 핸들은 selectionBox의 형제 요소로 렌더링되어
 * Android에서도 터치 이벤트가 정상 전달됩니다.
 */
import { StyleSheet } from 'react-native';
import colors from '../../styles/colors';

/** 코너 핸들 터치 영역 크기 (px) — 넉넉해야 터치가 쉬움 */
export const HANDLE = 44;

export const styles = StyleSheet.create({
  /** 전체 컨테이너 — 기본 높이 280, CropModal에서는 flex:1로 override */
  wrapper: {
    width: '100%',
    height: 280,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  /** 배경 이미지 — 컨테이너 전체 채움 */
  image: {
    ...StyleSheet.absoluteFillObject,
  },
  /** 선택 영역 외부 반투명 마스크 */
  mask: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  /** 선택 박스 — 흰색 테두리, 이동 핸들 역할 */
  selectionBox: {
    position: 'absolute',
    borderWidth: 2.5,
    borderColor: '#fff',
    backgroundColor: 'transparent',
  },
  /** 선택 박스 중앙 이동 핸들 — 큰 원형 */
  centerHint: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -22 }, { translateY: -22 }],
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.9)',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  /** 이동 핸들 안쪽 작은 점 */
  hintText: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  /** 코너 핸들 — absolute, 좌표는 인라인으로 주입 */
  corner: {
    position: 'absolute',
    width: HANDLE,
    height: HANDLE,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  /** 코너 핸들 원 — 크고 흰색 */
  cornerDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 6,
  },
});
