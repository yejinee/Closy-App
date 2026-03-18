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

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const { signup, isLoading } = useAuthStore();

  const handleSignup = async () => {
    if (!email.trim() || !password) {
      Alert.alert('이메일과 비밀번호를 입력해줘!');
      return;
    }
    if (password !== confirm) {
      Alert.alert('비밀번호가 일치하지 않아!');
      return;
    }
    try {
      await signup(email.trim(), password);
      router.replace('/(tabs)/wardrobe');
    } catch (e: any) {
      Alert.alert('회원가입 실패', e.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaView style={styles.screen}>
        {/* 헤더 */}
        <TouchableOpacity style={styles.back} onPress={() => router.back()}>
          <Text style={styles.backText}>← 뒤로</Text>
        </TouchableOpacity>

        <View style={styles.titleArea}>
          <Text style={styles.title}>JOIN CLOSY</Text>
          <Text style={styles.subtitle}>나만의 AI 스타일리스트</Text>
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
          <TextInput
            style={styles.input}
            value={confirm}
            onChangeText={setConfirm}
            placeholder="비밀번호 확인"
            placeholderTextColor={colors.sub}
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.btn, isLoading && styles.btnDisabled]}
            onPress={handleSignup}
            disabled={isLoading}
            activeOpacity={0.85}
          >
            <Text style={styles.btnText}>
              {isLoading ? '처리 중...' : 'SIGN UP'}
            </Text>
          </TouchableOpacity>
        </View>
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
    paddingTop: 16,
  },
  back: {
    marginBottom: 32,
  },
  backText: {
    color: colors.sub,
    fontSize: 14,
  },
  titleArea: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.white,
    letterSpacing: 6,
  },
  subtitle: {
    fontSize: 13,
    color: colors.sub,
    marginTop: 6,
    letterSpacing: 1,
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
});
