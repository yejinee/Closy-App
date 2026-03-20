/**
 * Header
 * 앱 공통 상단 헤더
 * - title: 헤더 타이틀 (기본값: 'CLOSY')
 * - subtitle: 서브타이틀 (선택, 아이템 수 등 부가 정보)
 * - rightElement: 우측 버튼 슬롯 (선택)
 */
import React from 'react';
import { View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from './Header.styles';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
}

export default function Header({ title = 'CLOSY', subtitle, rightElement }: HeaderProps) {
  /** 노치/상태바 높이를 paddingTop에 동적으로 적용 */
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 12 }]}>
      <View style={styles.inner}>
        {/* 로고 / 타이틀 */}
        <View>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>

        {/* 우측 슬롯 (버튼 등) */}
        {rightElement && <View>{rightElement}</View>}
      </View>

      {/* 하단 구분선 */}
      <View style={styles.divider} />
    </View>
  );
}
