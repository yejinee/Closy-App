/**
 * LoginScreen
 * 로그인 화면 — 이메일/비밀번호 입력 후 JWT 발급
 * 성공 시 /(tabs)/wardrobe 화면으로 이동
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import useAuthStore from '../../store/authStore';
import colors from '../../styles/colors';
import { styles } from './login.styles';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuthStore();

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('이메일과 비밀번호를 입력해줘!');
      return;
    }
    try {
      await login(email.trim(), password);
      router.replace('/(tabs)/wardrobe');
    } catch (e: any) {
      Alert.alert('로그인 실패', e.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaView style={styles.screen}>
        {/* 로고 영역 */}
        <View style={styles.logoArea}>
          <Text style={styles.logo}>CLOSY</Text>
          <Text style={styles.logoSub}>AI 스타일리스트</Text>
        </View>

        {/* 입력 폼 */}
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="이메일"
            placeholderTextColor={colors.sub}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="비밀번호"
            placeholderTextColor={colors.sub}
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.btn, isLoading && styles.btnDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
            activeOpacity={0.85}
          >
            <Text style={styles.btnText}>
              {isLoading ? '로그인 중...' : 'LOGIN'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* 회원가입 링크 */}
        <TouchableOpacity
          style={styles.signupLink}
          onPress={() => router.push('/(auth)/signup')}
        >
          <Text style={styles.signupText}>
            계정이 없어?{' '}
            <Text style={styles.signupAccent}>회원가입</Text>
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
