import React, { useState } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Text,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';

// const defaultImage = require('../../../assets/user-profile-icon.jpg');

const ImageLoader = ({ onImageChange, currentImage }) => {
  const [imageUri, setImageUri] = useState(currentImage?.uri || null);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const cameraGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Permiso de cámara',
            message: 'La app necesita acceso a tu cámara para tomar fotos.',
            buttonPositive: 'Aceptar',
          }
        );

        const storageGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'Permiso de almacenamiento',
            message: 'La app necesita acceso a tu galería para seleccionar imágenes.',
            buttonPositive: 'Aceptar',
          }
        );

        return (
          cameraGranted === PermissionsAndroid.RESULTS.GRANTED &&
          storageGranted === PermissionsAndroid.RESULTS.GRANTED
        );
      } catch (err) {
        console.warn('Error solicitando permisos:', err);
        return false;
      }
    }
    return true;
  };

  const showImagePicker = () => {
    Alert.alert('Seleccionar imagen', 'Elige una opción', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Cámara', onPress: () => openCamera() },
      { text: 'Galería', onPress: () => openGallery() },
    ]);
  };

  const openCamera = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      Alert.alert('Permiso denegado', 'No se puede acceder a la cámara sin permisos.');
      return;
    }

    const options = {
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 1000,
      maxHeight: 1000,
    };

    launchCamera(options, handleImageResponse);
  };

  const openGallery = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      Alert.alert('Permiso denegado', 'No se puede acceder a la galería sin permisos.');
      return;
    }

    const options = {
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 1000,
      maxHeight: 1000,
    };

    launchImageLibrary(options, handleImageResponse);
  };

  const handleImageResponse = (response) => {
    if (response.didCancel) {
      console.log('Usuario canceló la selección de imagen');
      return;
    }

    if (response.errorCode) {
      console.log('Error al seleccionar imagen:', response.errorMessage);
      Alert.alert('Error', 'No se pudo seleccionar la imagen');
      return;
    }

    if (response.assets && response.assets[0]) {
      const asset = response.assets[0];
      const uri = asset.uri;

      if (uri) {
        setImageUri(uri);
        if (onImageChange) {
          onImageChange(asset);
        }
      }
    }
  };

  const renderImage = () => {
    if (imageUri) {
      return <Image source={{ uri: imageUri }} style={styles.profilePic} />;
    }

    // return <Image source={defaultImage} style={styles.profilePic} />;

    return (
      <View style={[styles.profilePic, styles.placeholder]}>
        <Icon name="user" size={40} color="#999" />
        <Text style={styles.placeholderText}>Subir foto</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.profilePicContainer}>
        {renderImage()}
        <TouchableOpacity style={styles.uploadButton} onPress={showImagePicker}>
          <Icon name="camera" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: 'transparent',
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
    borderWidth: 3,
    borderColor: '#365a7d',
    resizeMode: 'cover',
    backgroundColor: '#fff',
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  placeholderText: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
    textAlign: 'center',
  },
  uploadButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#ff9900',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default ImageLoader;
