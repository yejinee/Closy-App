// HTTP 클라이언트 — 모든 API 요청의 기반
// 실기기(Expo Go): 컴퓨터의 로컬 IP 주소로 변경 필요
// ipconfig 실행 후 Wi-Fi IPv4 주소 확인 (예: 192.168.0.10)
export const BASE_URL = 'http://172.31.99.158:8000'; // ← 본인 IP로 변경!

type Method = 'GET' | 'POST' | 'PATCH' | 'DELETE';

interface RequestOptions {
  method?: Method;
  token?: string | null;
  body?: object;
}

export async function request<T>(
  path: string,
  { method = 'GET', token, body }: RequestOptions = {}
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${BASE_URL}${path}`;
  console.log(`[API] ${method} ${url}`);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000); // 10초 타임아웃

  try {
    const res = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    if (res.status === 204) return undefined as T;

    const data = await res.json();

    if (!res.ok) {
      console.error(`[API] Error ${res.status}:`, data);
      throw new Error(data?.detail ?? `HTTP ${res.status}`);
    }

    return data as T;
  } catch (e: any) {
    if (e.name === 'AbortError') {
      throw new Error(`서버에 연결할 수 없어 (${BASE_URL}). 백엔드가 실행 중인지 확인해줘.`);
    }
    console.error(`[API] Fetch failed:`, e.message);
    throw e;
  } finally {
    clearTimeout(timeout);
  }
}
