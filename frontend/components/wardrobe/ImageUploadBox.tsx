/**
 * ImageUploadBox
 * 이미지 업로드 터치 영역 + 바텀 시트 (사진 촬영 / 사진첩 선택)
 * - imageUri: 선택된 이미지 URI (null이면 플레이스홀더 표시)
 * - onImageSelected: 이미지 선택 완료 시 URI 콜백
 */
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Modal, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { styles } from './ImageUploadBox.styles';

interface Props {
  imageUri: string | null;
  onImageSelected: (uri: string) => void;
}

export default function ImageUploadBox({ imageUri, onImageSelected }: Props) {
  console.log('[ImageUploadBox] 렌더링 imageUri:', imageUri);
  const [sheetVisible, setSheetVisible] = useState(false);

  /** 갤러리에서 이미지 선택 */
  const pickFromGallery = async () => {
    setSheetVisible(false);
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('권한 필요', '갤러리 접근 권한이 필요합니다.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 0.9,
    });
    if (!result.canceled && result.assets[0]) {
      onImageSelected(result.assets[0].uri);
    }
  };

  /** 카메라로 촬영 */
  const pickFromCamera = async () => {
    setSheetVisible(false);
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('권한 필요', '카메라 접근 권한이 필요합니다.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 0.9,
    });
    if (!result.canceled && result.assets[0]) {
      onImageSelected(result.assets[0].uri);
    }
  };

  return (
    <>
      {/* 이미지 업로드 터치 영역 */}
      <TouchableOpacity
        style={[styles.container, imageUri && styles.hasImage]}
        onPress={() => setSheetVisible(true)}
        activeOpacity={0.85}
      >
        {imageUri ? (
          <>
            <Image
              key={imageUri}
              source={{ uri: imageUri }}
              style={styles.image}
              resizeMode="contain"
            />
            <View style={styles.changeOverlay}>
              <Text style={styles.changeText}>탭하여 변경</Text>
            </View>
          </>
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.plusIcon}>+</Text>
            <Text style={styles.placeholderTitle}>이미지 추가</Text>
            <Text style={styles.placeholderSub}>갤러리 또는 카메라</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* 바텀 시트 — 사진 촬영 / 사진첩 선택 */}
      <Modal
        visible={sheetVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setSheetVisible(false)}
      >
        {/* 딤 배경 탭 시 닫기 */}
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={() => setSheetVisible(false)}
        >
          <View style={styles.sheet}>
            <View style={styles.handle} />

            <TouchableOpacity style={styles.option} onPress={pickFromCamera} activeOpacity={0.7}>
              <Text style={styles.optionText}>사진 촬영</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.option} onPress={pickFromGallery} activeOpacity={0.7}>
              <Text style={styles.optionText}>사진첩</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}
