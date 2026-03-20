/**
 * SignupScreen
 * 회원가입 화면 — 이메일/비밀번호 입력 후 계정 생성
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
import { styles } from './signup.styles';

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
        {/* 뒤로 버튼 */}
        <TouchableOpacity style={styles.back} onPress={() => router.back()}>
          <Text style={styles.backText}>← 뒤로</Text>
        </TouchableOpacity>

        {/* 타이틀 */}
        <View style={styles.titleArea}>
          <Text style={styles.title}>JOIN CLOSY</Text>
          <Text style={styles.subtitle}>나만의 AI 스타일리스트</Text>
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
