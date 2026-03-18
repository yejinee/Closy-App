import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import colors from '../../styles/colors';

// 탭 네비게이터 레이아웃
// 탭 2개: 옷장 (wardrobe) / 채팅 (chat)

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.bg,
          borderTopColor: colors.surface,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 10,
        },
        tabBarActiveTintColor: colors.accent,   // 선택된 탭: 네온 그린
        tabBarInactiveTintColor: colors.sub,    // 미선택 탭: 회색
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
          letterSpacing: 1.5,
        },
        sceneStyle: { backgroundColor: colors.bg }, // 탭 화면 배경
      }}
    >
      {/* 옷장 탭 */}
      <Tabs.Screen
        name="wardrobe"
        options={{
          title: 'CLOSET',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }}>👗</Text>
          ),
        }}
      />

      {/* 채팅 탭 */}
      <Tabs.Screen
        name="chat"
        options={{
          title: 'CHAT',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }}>💬</Text>
          ),
        }}
      />
    </Tabs>
  );
}
