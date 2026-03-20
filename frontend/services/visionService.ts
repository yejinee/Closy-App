/**
 * Google Vision AI 연동 서비스
 *
 * 백엔드(FastAPI /vision/analyze)를 통해 Vision API를 호출합니다.
 * 서비스 계정 키는 절대 프론트엔드에 두지 않습니다.
 *
 * 백엔드 설정: backend/.env에 GOOGLE_APPLICATION_CREDENTIALS 또는
 *             GOOGLE_VISION_KEY_JSON 환경변수를 추가하세요.
 */

import { BASE_URL } from '../api/client';
import { GeneratedTags, CropRect } from '../types';

// ─── 응답 타입 (백엔드 snake_case) ───────────────────────────────────────────

interface VisionApiResponse {
  season_tags: string[];
  color_tags: string[];
  category_tags: string[];
  style_tags: string[];
}

// ─── Mock fallback (백엔드 미연동 시 사용) ────────────────────────────────────

const MOCK_RESULTS: GeneratedTags[] = [
  {
    seasonTags: ['봄', '가을'],
    colorTags: ['블랙', '그레이'],
    categoryTags: ['하의', '팬츠'],
    styleTags: ['캐주얼', '스트릿'],
  },
  {
    seasonTags: ['여름'],
    colorTags: ['화이트'],
    categoryTags: ['상의', '티셔츠'],
    styleTags: ['베이직', '미니멀'],
  },
  {
    seasonTags: ['겨울', '가을'],
    colorTags: ['네이비', '블루'],
    categoryTags: ['아우터', '코트'],
    styleTags: ['포멀', '클린'],
  },
  {
    seasonTags: ['봄', '여름', '가을'],
    colorTags: ['베이지', '크림'],
    categoryTags: ['상의', '셔츠'],
    styleTags: ['캐주얼', '비즈캐주얼'],
  },
  {
    seasonTags: ['겨울'],
    colorTags: ['블랙'],
    categoryTags: ['신발', '부츠'],
    styleTags: ['스트릿', '엣지'],
  },
];

async function mockAnalyze(): Promise<GeneratedTags> {
  await new Promise((r) => setTimeout(r, 1200));
  return { ...MOCK_RESULTS[Math.floor(Math.random() * MOCK_RESULTS.length)] };
}

// ─── 실제 Vision API 호출 ────────────────────────────────────────────────────

/**
 * 이미지를 백엔드로 전송하여 Google Vision AI 분석 결과를 받아옵니다.
 *
 * @param imageUri  분석할 이미지 URI (crop 결과 or 원본)
 * @param token     인증 토큰
 * @param cropRect  선택 영역 (선택적)
 */
export async function analyzeImage(
  imageUri: string,
  token: string | null,
  cropRect?: CropRect,
): Promise<GeneratedTags> {
  // 토큰이 없으면 mock 반환
  if (!token) {
    console.warn('[Vision] 토큰 없음 → mock 사용');
    return mockAnalyze();
  }

  try {
    // 1. 이미지 → base64 변환 (expo-file-system 없이 fetch + btoa 사용)
    const imgRes = await fetch(imageUri);
    const arrayBuffer = await imgRes.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const base64 = btoa(binary);

    // 2. 백엔드 Vision 엔드포인트 호출 (30초 타임아웃)
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    const res = await fetch(`${BASE_URL}/vision/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        image_base64: base64,
        crop_rect: cropRect ?? null,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Unknown error' }));
      throw new Error(err.detail ?? `HTTP ${res.status}`);
    }

    const data: VisionApiResponse = await res.json();

    // 3. snake_case → camelCase 변환
    return {
      seasonTags: data.season_tags,
      colorTags: data.color_tags,
      categoryTags: data.category_tags,
      styleTags: data.style_tags,
    };
  } catch (e: any) {
    if (e.name === 'AbortError') {
      throw new Error('Vision API 타임아웃 (30초). 이미지 크기를 줄여보세요.');
    }
    console.error('[Vision] 분석 실패, mock으로 폴백:', e.message);
    // 실패 시 mock으로 폴백 (개발 편의)
    return mockAnalyze();
  }
}
