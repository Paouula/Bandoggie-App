import React, { useState } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';

 const defaultImage = require('../../../assets/user-profile-icon-in-flat-style-member-avatar-illustration-on-isolated-background-human-permission-sign-business-concept-vector.jpg');  

const ImageLoader = ({ onImageChange }) => {
  const [imageUri, setImageUri] = useState(null);

  // Solicitar permisos
  const requestPermissions = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permisos necesarios',
          'La aplicación necesita acceso a tu galería para seleccionar imágenes.',
          [{ text: 'OK' }]
        );
        return false;
      }
      return true;
    } catch (error) {
      console.log('Error requesting permission:', error);
      return false;
    }
  };

  const handleImagePick = async () => {
    // Solicitar permisos primero
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1], // Para imagen cuadrada
        quality: 0.8,
        base64: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setImageUri(uri);
        
        if (onImageChange) {
          onImageChange(result.assets[0]);
        }
      }
    } catch (error) {
      console.log('Error picking image:', error);
      Alert.alert('Error', 'Hubo un problema al seleccionar la imagen');
    }
  };

  // Opción adicional para tomar foto con cámara
  const handleTakePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permisos necesarios',
          'La aplicación necesita acceso a tu cámara para tomar fotos.',
          [{ text: 'OK' }]
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setImageUri(uri);
        
        if (onImageChange) {
          onImageChange(result.assets[0]);
        }
      }
    } catch (error) {
      console.log('Error taking photo:', error);
      Alert.alert('Error', 'Hubo un problema al tomar la foto');
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      'Seleccionar imagen',
      'Elige una opción',
      [
        { text: 'Galería', onPress: handleImagePick },
        { text: 'Cámara', onPress: handleTakePhoto },
        { text: 'Cancelar', style: 'cancel' }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.profilePicContainer}>
        <Image
          source={imageUri ? { uri: imageUri } : defaultImage}
          style={styles.profilePic}
        />
        <TouchableOpacity style={styles.uploadButton} onPress={showImageOptions}>
          <Icon name="camera" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  profilePicContainer: {
    position: 'relative',
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePic: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#d1d1d1',
    resizeMode: 'cover',
  },
  uploadButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#ffa726',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
});

export default ImageLoader;