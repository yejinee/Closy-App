import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '../../styles/colors';

// 앱 상단 헤더 컴포넌트
// - title: 헤더 텍스트 (기본값: 'CLOSY')
// - rightElement: 오른쪽에 버튼 등을 넣을 수 있는 슬롯
interface HeaderProps {
  title?: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
}

export default function Header({ title = 'CLOSY', subtitle, rightElement }: HeaderProps) {
  const insets = useSafeAreaInsets(); // 노치/상태바 높이 자동 적용

  return (
    <View style={[styles.container, { paddingTop: insets.top + 12 }]}>
      <View style={styles.inner}>
        {/* 로고 / 타이틀 */}
        <View>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>

        {/* 오른쪽 슬롯 (선택) */}
        {rightElement && <View>{rightElement}</View>}
      </View>

      {/* 하단 구분선 */}
      <View style={styles.divider} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.bg,
    paddingHorizontal: 20,
    paddingBottom: 0,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingBottom: 14,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 5,
    color: colors.white,
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.sub,
    letterSpacing: 1.5,
    marginTop: 2,
    textTransform: 'uppercase',
  },
  divider: {
    height: 1,
    backgroundColor: colors.surface,
  },
});
