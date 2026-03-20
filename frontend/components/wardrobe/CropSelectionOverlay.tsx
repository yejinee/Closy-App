/**
 * CropSelectionOverlay
 * 이미지 위에 드래그/리사이즈 가능한 선택 박스 오버레이
 *
 * resizeMode="contain"으로 이미지 전체를 표시하고,
 * 선택 박스는 이미지 표시 영역 내에서만 이동/리사이즈 가능합니다.
 *
 * 5개 PanResponder:
 *  - movePR: 박스 전체 이동
 *  - tlPR/trPR/blPR/brPR: 각 꼭짓점 리사이즈
 *
 * onCropChange에 전달되는 CropRect는 이미지 원본 기준 정규화 좌표(0~1)입니다.
 * 따라서 CropModal에서 원본 pixel 좌표로 변환 시 단순 곱셈만 하면 됩니다.
 */
import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  View,
  Image,
  PanResponder,
  LayoutChangeEvent,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { CropRect } from '../../types';
import { styles, HANDLE } from './CropSelectionOverlay.styles';

interface BoxState {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** 컨테이너 내 이미지 실제 표시 영역 (contain 모드 기준) */
interface ImageRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface Props {
  imageUri: string;
  onCropChange: (rect: CropRect) => void;
  /** 외부에서 컨테이너 높이를 override할 때 사용 (CropModal에서 flex:1 주입) */
  containerStyle?: StyleProp<ViewStyle>;
  /** 컨테이너 실제 크기를 부모에게 알림 */
  onContainerSize?: (w: number, h: number) => void;
}

/** 선택 박스 최소 크기 (px) */
const MIN_BOX = 60;

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val));
}

export default function CropSelectionOverlay({
  imageUri,
  onCropChange,
  containerStyle,
  onContainerSize,
}: Props) {
  const containerRef = useRef({ w: 0, h: 0 });
  /** contain 모드에서 이미지가 실제 표시되는 영역 */
  const imageRectRef = useRef<ImageRect>({ left: 0, top: 0, width: 0, height: 0 });
  /** 원본 이미지 크기 (px) */
  const imageDimsRef = useRef({ w: 0, h: 0 });

  const [box, setBox] = useState<BoxState>({ x: 0, y: 0, w: 0, h: 0 });
  const initialized = useRef(false);

  /**
   * 컨테이너 + 원본 이미지 크기로 contain 표시 영역 계산
   * 이미지 또는 컨테이너 크기가 확정되면 호출
   */
  const updateImageRect = useCallback(() => {
    const { w: cw, h: ch } = containerRef.current;
    const { w: iw, h: ih } = imageDimsRef.current;
    if (cw === 0 || iw === 0) return;

    // contain 스케일: 이미지 전체가 보이도록 축소
    const scale = Math.min(cw / iw, ch / ih);
    const displayW = iw * scale;
    const displayH = ih * scale;
    // 레터박스(빈 공간) 오프셋
    const left = (cw - displayW) / 2;
    const top = (ch - displayH) / 2;
    imageRectRef.current = { left, top, width: displayW, height: displayH };
    console.log('[CropOverlay] imageRect:', { left, top, displayW, displayH });
    console.log('[CropOverlay] 원본 이미지:', iw, 'x', ih, '/ 컨테이너:', cw, 'x', ch, '/ scale:', scale);

    // 초기 선택 박스: 이미지 표시 영역의 80% (중앙)
    if (!initialized.current) {
      initialized.current = true;
      setBox({
        x: left + displayW * 0.1,
        y: top + displayH * 0.1,
        w: displayW * 0.8,
        h: displayH * 0.8,
      });
    }
  }, []);

  // ─── 원본 이미지 크기 조회 ──────────────────────────────────────────────
  useEffect(() => {
    Image.getSize(
      imageUri,
      (w, h) => {
        imageDimsRef.current = { w, h };
        updateImageRect();
      },
      () => console.warn('[CropOverlay] Image.getSize 실패'),
    );
  }, [imageUri, updateImageRect]);

  // ─── 컨테이너 레이아웃 측정 ────────────────────────────────────────────────
  const handleLayout = useCallback(
    (e: LayoutChangeEvent) => {
      const { width, height } = e.nativeEvent.layout;
      if (width === 0) return;
      containerRef.current = { w: width, h: height };
      onContainerSize?.(width, height);
      updateImageRect();
    },
    [onContainerSize, updateImageRect],
  );

  // ─── cropRect: 이미지 표시 영역 기준 정규화 (0~1) ─────────────────────────
  // 이미지 원본 좌표와 1:1 대응하므로 CropModal에서 단순 곱셈으로 변환 가능
  useEffect(() => {
    const ir = imageRectRef.current;
    if (ir.width === 0 || box.w === 0) return;
    const rect = {
      x: (box.x - ir.left) / ir.width,
      y: (box.y - ir.top) / ir.height,
      width: box.w / ir.width,
      height: box.h / ir.height,
    };
    console.log('[CropOverlay] box:', box, '→ rect:', rect);
    onCropChange(rect);
  }, [box]);

  // ─── Move PanResponder (박스 이동) ────────────────────────────────────────
  // 이미지 표시 영역 내에서만 이동 가능하도록 클램핑
  const moveDelta = useRef({ x: 0, y: 0 });
  const movePR = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => { moveDelta.current = { x: 0, y: 0 }; },
      onPanResponderMove: (_, gs) => {
        const dx = gs.dx - moveDelta.current.x;
        const dy = gs.dy - moveDelta.current.y;
        moveDelta.current = { x: gs.dx, y: gs.dy };
        const ir = imageRectRef.current;
        setBox((prev) => ({
          ...prev,
          x: clamp(prev.x + dx, ir.left, ir.left + ir.width - prev.w),
          y: clamp(prev.y + dy, ir.top, ir.top + ir.height - prev.h),
        }));
      },
    }),
  ).current;

  // ─── TL (상좌) 리사이즈 ───────────────────────────────────────────────────
  const tlDelta = useRef({ x: 0, y: 0 });
  const tlPR = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => { tlDelta.current = { x: 0, y: 0 }; },
      onPanResponderMove: (_, gs) => {
        const dx = gs.dx - tlDelta.current.x;
        const dy = gs.dy - tlDelta.current.y;
        tlDelta.current = { x: gs.dx, y: gs.dy };
        setBox((prev) => {
          const ir = imageRectRef.current;
          const newX = clamp(prev.x + dx, ir.left, prev.x + prev.w - MIN_BOX);
          const newY = clamp(prev.y + dy, ir.top, prev.y + prev.h - MIN_BOX);
          return { x: newX, y: newY, w: prev.w + (prev.x - newX), h: prev.h + (prev.y - newY) };
        });
      },
    }),
  ).current;

  // ─── TR (상우) 리사이즈 ───────────────────────────────────────────────────
  const trDelta = useRef({ x: 0, y: 0 });
  const trPR = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => { trDelta.current = { x: 0, y: 0 }; },
      onPanResponderMove: (_, gs) => {
        const dx = gs.dx - trDelta.current.x;
        const dy = gs.dy - trDelta.current.y;
        trDelta.current = { x: gs.dx, y: gs.dy };
        setBox((prev) => {
          const ir = imageRectRef.current;
          const newY = clamp(prev.y + dy, ir.top, prev.y + prev.h - MIN_BOX);
          return {
            ...prev,
            y: newY,
            w: clamp(prev.w + dx, MIN_BOX, ir.left + ir.width - prev.x),
            h: prev.h + (prev.y - newY),
          };
        });
      },
    }),
  ).current;

  // ─── BL (하좌) 리사이즈 ───────────────────────────────────────────────────
  const blDelta = useRef({ x: 0, y: 0 });
  const blPR = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => { blDelta.current = { x: 0, y: 0 }; },
      onPanResponderMove: (_, gs) => {
        const dx = gs.dx - blDelta.current.x;
        const dy = gs.dy - blDelta.current.y;
        blDelta.current = { x: gs.dx, y: gs.dy };
        setBox((prev) => {
          const ir = imageRectRef.current;
          const newX = clamp(prev.x + dx, ir.left, prev.x + prev.w - MIN_BOX);
          return {
            x: newX,
            y: prev.y,
            w: prev.w + (prev.x - newX),
            h: clamp(prev.h + dy, MIN_BOX, ir.top + ir.height - prev.y),
          };
        });
      },
    }),
  ).current;

  // ─── BR (하우) 리사이즈 ───────────────────────────────────────────────────
  const brDelta = useRef({ x: 0, y: 0 });
  const brPR = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => { brDelta.current = { x: 0, y: 0 }; },
      onPanResponderMove: (_, gs) => {
        const dx = gs.dx - brDelta.current.x;
        const dy = gs.dy - brDelta.current.y;
        brDelta.current = { x: gs.dx, y: gs.dy };
        setBox((prev) => {
          const ir = imageRectRef.current;
          return {
            ...prev,
            w: clamp(prev.w + dx, MIN_BOX, ir.left + ir.width - prev.x),
            h: clamp(prev.h + dy, MIN_BOX, ir.top + ir.height - prev.y),
          };
        });
      },
    }),
  ).current;

  const { x, y, w, h } = box;

  return (
    <View style={[styles.wrapper, containerStyle]} onLayout={handleLayout}>
      {/* 배경 이미지 — contain으로 전체 이미지 표시 */}
      <Image source={{ uri: imageUri }} style={styles.image} resizeMode="contain" />

      {/* 마스크 4개 + 선택 박스 */}
      {w > 0 && (
        <>
          {/* 선택 영역 외부 반투명 마스크 */}
          <View style={[styles.mask, { top: 0, left: 0, right: 0, height: y }]} />
          <View style={[styles.mask, { top: y + h, left: 0, right: 0, bottom: 0 }]} />
          <View style={[styles.mask, { top: y, left: 0, width: x, height: h }]} />
          <View style={[styles.mask, { top: y, left: x + w, right: 0, height: h }]} />

          {/* 선택 박스 (이동 핸들) */}
          <View
            style={[styles.selectionBox, { left: x, top: y, width: w, height: h }]}
            {...movePR.panHandlers}
          >
            {/* 중앙 이동 핸들 (큰 원형) */}
            <View style={styles.centerHint}>
              <View style={styles.hintText} />
            </View>
          </View>

          {/* 꼭짓점 핸들 — selectionBox 바깥 형제 요소로 배치해야 터치가 정상 동작 */}
          <View style={[styles.corner, { left: x - HANDLE / 2, top: y - HANDLE / 2 }]} {...tlPR.panHandlers}>
            <View style={styles.cornerDot} />
          </View>
          <View style={[styles.corner, { left: x + w - HANDLE / 2, top: y - HANDLE / 2 }]} {...trPR.panHandlers}>
            <View style={styles.cornerDot} />
          </View>
          <View style={[styles.corner, { left: x - HANDLE / 2, top: y + h - HANDLE / 2 }]} {...blPR.panHandlers}>
            <View style={styles.cornerDot} />
          </View>
          <View style={[styles.corner, { left: x + w - HANDLE / 2, top: y + h - HANDLE / 2 }]} {...brPR.panHandlers}>
            <View style={styles.cornerDot} />
          </View>
        </>
      )}
    </View>
  );
}
