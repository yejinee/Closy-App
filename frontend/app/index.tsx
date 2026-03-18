import { Redirect } from 'expo-router';
import useAuthStore from '../store/authStore';

// 앱 진입점 — 로그인 여부에 따라 라우팅
export default function Index() {
  const token = useAuthStore((s) => s.token);
  return token
    ? <Redirect href="/(tabs)/wardrobe" />
    : <Redirect href="/(auth)/login" />;
}
