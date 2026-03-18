import { Redirect } from 'expo-router';

// 앱 진입점 — 탭 네비게이터의 옷장 화면으로 바로 이동
export default function Index() {
  return <Redirect href="/(tabs)/wardrobe" />;
}
