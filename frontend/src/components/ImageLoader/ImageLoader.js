import React, { useState } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';

//const defaultImage = require('../../../assets/user-profile-icon.jpg');  

//Componente encargado de cargar imagenes en la parte del frontend

const ImageLoader = ({ onImageChange }) => {
  const [imageUri, setImageUri] = useState(null);

  const handleImagePick = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
      },
      (response) => {
        if (response.didCancel || response.errorCode) return;

        const uri = response.assets?.[0]?.uri;
        if (uri) {
          setImageUri(uri);
          if (onImageChange) onImageChange(response.assets[0]);
        }
      }
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.profilePicContainer}>
        <Image
          source={imageUri ? { uri: imageUri } : defaultImage}
          style={styles.profilePic}
        />
        <TouchableOpacity style={styles.uploadButton} onPress={handleImagePick}>
          <Icon name="camera" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const { width } = Dimensions.get('window');

//Estilos del componente para cargar imagenes
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
