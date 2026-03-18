import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import colors from '../styles/colors';

// 앱 루트 레이아웃
// SafeAreaProvider — 노치/상태바 영역 처리
// GestureHandlerRootView — 제스처 라이브러리 초기화
// Stack — expo-router 스택 네비게이터

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="light" backgroundColor={colors.bg} />
        <Stack
          screenOptions={{
            headerShown: false, // 헤더는 각 화면에서 직접 구현
            contentStyle: { backgroundColor: colors.bg }, // 화면 배경 기본값
            animation: 'fade',
          }}
        />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
