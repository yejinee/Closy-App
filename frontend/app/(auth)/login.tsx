import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import useAuthStore from '../../store/authStore';
import colors from '../../styles/colors';

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
        {/* 로고 */}
        <View style={styles.logoArea}>
          <Text style={styles.logo}>CLOSY</Text>
          <Text style={styles.logoSub}>AI 스타일리스트</Text>
        </View>

        {/* 폼 */}
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

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  logoArea: {
    alignItems: 'center',
    marginBottom: 52,
  },
  logo: {
    fontSize: 40,
    fontWeight: '900',
    color: colors.white,
    letterSpacing: 8,
  },
  logoSub: {
    fontSize: 13,
    color: colors.sub,
    letterSpacing: 2,
    marginTop: 6,
  },
  form: {
    gap: 12,
  },
  input: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: colors.black,
  },
  btn: {
    backgroundColor: colors.accent,
    paddingVertical: 16,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 8,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  btnText: {
    color: colors.black,
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 4,
  },
  signupLink: {
    alignItems: 'center',
    marginTop: 28,
  },
  signupText: {
    fontSize: 13,
    color: colors.sub,
  },
  signupAccent: {
    color: colors.accent,
    fontWeight: '700',
  },
});
