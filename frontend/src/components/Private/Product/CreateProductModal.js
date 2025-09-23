// CreateProductModal.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
  Alert,
  Image,
  ActivityIndicator,
  Platform
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const CreateProductModal = ({ 
  visible, 
  onClose, 
  onCreateProduct,
  categories = [],
  festivities = [],
  loading = false 
}) => {
  // Estados del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    descripcion: '',
    categoria: '',
    festividad: '',
    imagenPrincipal: null,
    imagenesDiseno: []
  });

  // Estados de validación
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Limpiar formulario cuando se abre/cierra el modal
  useEffect(() => {
    if (visible) {
      resetForm();
    }
  }, [visible]);

  const resetForm = () => {
    setFormData({
      nombre: '',
      precio: '',
      descripcion: '',
      categoria: '',
      festividad: '',
      imagenPrincipal: null,
      imagenesDiseno: []
    });
    setErrors({});
    setIsSubmitting(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validar nombre
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    // Validar precio
    if (!formData.precio.trim()) {
      newErrors.precio = 'El precio es requerido';
    } else if (isNaN(parseFloat(formData.precio)) || parseFloat(formData.precio) <= 0) {
      newErrors.precio = 'Ingrese un precio válido';
    }

    // Validar descripción
    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es requerida';
    } else if (formData.descripcion.length > 235) {
      newErrors.descripcion = 'La descripción no puede exceder 235 caracteres';
    }

    // Validar imagen principal
    if (!formData.imagenPrincipal) {
      newErrors.imagenPrincipal = 'La imagen principal es requerida';
    }

    // Validar imágenes de diseño (mínimo 3)
    if (formData.imagenesDiseno.length < 3) {
      newErrors.imagenesDiseno = 'Se requieren al menos 3 imágenes de diseño';
    }

    // Validar categoría
    if (!formData.categoria) {
      newErrors.categoria = 'Selecciona una categoría';
    }

    // Validar festividad
    if (!formData.festividad) {
      newErrors.festividad = 'Selecciona una festividad';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Error', 'Por favor corrige los errores en el formulario');
      return;
    }

    setIsSubmitting(true);
    try {
      await onCreateProduct(formData);
      Alert.alert('Éxito', 'Producto creado correctamente');
      onClose();
    } catch (error) {
      Alert.alert('Error', 'No se pudo crear el producto');
    } finally {
      setIsSubmitting(false);
    }
  };

  const pickMainImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Error', 'Se requieren permisos para acceder a la galería');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      handleInputChange('imagenPrincipal', result.assets[0]);
    }
  };

  const pickDesignImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Error', 'Se requieren permisos para acceder a la galería');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      const newImages = [...formData.imagenesDiseno, ...result.assets];
      handleInputChange('imagenesDiseno', newImages);
    }
  };

  const removeDesignImage = (index) => {
    const newImages = formData.imagenesDiseno.filter((_, i) => i !== index);
    handleInputChange('imagenesDiseno', newImages);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Feather name="x" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>Crear nuevo producto</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.form}>
            {/* Nombre del producto */}
            <View style={styles.inputGroup}>
              <TextInput
                style={[styles.input, errors.nombre && styles.inputError]}
                placeholder="Nombre del producto"
                value={formData.nombre}
                onChangeText={(value) => handleInputChange('nombre', value)}
                placeholderTextColor="#999"
              />
              {errors.nombre && <Text style={styles.errorText}>{errors.nombre}</Text>}
            </View>

            {/* Precio */}
            <View style={styles.inputGroup}>
              <TextInput
                style={[styles.input, errors.precio && styles.inputError]}
                placeholder="Precio"
                value={formData.precio}
                onChangeText={(value) => handleInputChange('precio', value)}
                keyboardType="numeric"
                placeholderTextColor="#999"
              />
              {errors.precio && <Text style={styles.errorText}>{errors.precio}</Text>}
            </View>

            {/* Descripción */}
            <View style={styles.inputGroup}>
              <TextInput
                style={[styles.textArea, errors.descripcion && styles.inputError]}
                placeholder="Descripción"
                value={formData.descripcion}
                onChangeText={(value) => handleInputChange('descripcion', value)}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                placeholderTextColor="#999"
                maxLength={235}
              />
              <View style={styles.characterCount}>
                <Text style={styles.characterCountText}>
                  {formData.descripcion.length}/235
                </Text>
              </View>
              {errors.descripcion && <Text style={styles.errorText}>{errors.descripcion}</Text>}
            </View>

            {/* Imagen Principal */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Imagen Principal *</Text>
              <TouchableOpacity
                style={[styles.imageUploadButton, errors.imagenPrincipal && styles.inputError]}
                onPress={pickMainImage}
              >
                {formData.imagenPrincipal ? (
                  <Image source={{ uri: formData.imagenPrincipal.uri }} style={styles.selectedImage} />
                ) : (
                  <View style={styles.imageUploadContent}>
                    <Feather name="image" size={32} color="#666" />
                    <Text style={styles.imageUploadText}>Selecciona un archivo</Text>
                  </View>
                )}
              </TouchableOpacity>
              {errors.imagenPrincipal && <Text style={styles.errorText}>{errors.imagenPrincipal}</Text>}
            </View>

            {/* Imágenes de Diseño */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Imágenes de Diseño (mín. 3) *</Text>
              <TouchableOpacity
                style={[styles.imageUploadButton, errors.imagenesDiseno && styles.inputError]}
                onPress={pickDesignImages}
              >
                <View style={styles.imageUploadContent}>
                  <Feather name="plus" size={32} color="#666" />
                  <Text style={styles.imageUploadText}>Agregar imágenes</Text>
                </View>
              </TouchableOpacity>
              
              {/* Mostrar imágenes seleccionadas */}
              {formData.imagenesDiseno.length > 0 && (
                <View style={styles.selectedImagesContainer}>
                  {formData.imagenesDiseno.map((image, index) => (
                    <View key={index} style={styles.selectedImageItem}>
                      <Image source={{ uri: image.uri }} style={styles.selectedImageSmall} />
                      <TouchableOpacity
                        style={styles.removeImageButton}
                        onPress={() => removeDesignImage(index)}
                      >
                        <Feather name="x" size={16} color="white" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
              {errors.imagenesDiseno && <Text style={styles.errorText}>{errors.imagenesDiseno}</Text>}
            </View>

            {/* Categoría */}
            <View style={styles.inputGroup}>
              <TouchableOpacity
                style={[styles.selectButton, errors.categoria && styles.inputError]}
                onPress={() => {
                  // Aquí implementarías un picker o modal para seleccionar categoría
                  Alert.alert('Categoría', 'Implementar selector de categoría');
                }}
              >
                <Text style={[styles.selectButtonText, !formData.categoria && styles.placeholderText]}>
                  {formData.categoria || 'Selecciona una categoría'}
                </Text>
                <Feather name="chevron-down" size={20} color="#666" />
              </TouchableOpacity>
              {errors.categoria && <Text style={styles.errorText}>{errors.categoria}</Text>}
            </View>

            {/* Festividad */}
            <View style={styles.inputGroup}>
              <TouchableOpacity
                style={[styles.selectButton, errors.festividad && styles.inputError]}
                onPress={() => {
                  // Aquí implementarías un picker o modal para seleccionar festividad
                  Alert.alert('Festividad', 'Implementar selector de festividad');
                }}
              >
                <Text style={[styles.selectButtonText, !formData.festividad && styles.placeholderText]}>
                  {formData.festividad || 'Selecciona una festividad'}
                </Text>
                <Feather name="chevron-down" size={20} color="#666" />
              </TouchableOpacity>
              {errors.festividad && <Text style={styles.errorText}>{errors.festividad}</Text>}
            </View>

            {/* Botón Guardar */}
            <TouchableOpacity
              style={[styles.submitButton, (isSubmitting || loading) && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={isSubmitting || loading}
            >
              {(isSubmitting || loading) ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text style={styles.submitButtonText}>Crear</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: Platform.OS === 'ios' ? 50 : 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    color: '#333',
  },
  textArea: {
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    color: '#333',
    minHeight: 100,
  },
  characterCount: {
    alignItems: 'flex-end',
    marginTop: 5,
  },
  characterCountText: {
    fontSize: 12,
    color: '#666',
  },
  inputError: {
    borderColor: '#ff4444',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    marginTop: 5,
  },
  imageUploadButton: {
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageUploadContent: {
    alignItems: 'center',
  },
  imageUploadText: {
    color: '#666',
    fontSize: 14,
    marginTop: 8,
  },
  selectedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
  },
  selectedImagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    gap: 10,
  },
  selectedImageItem: {
    position: 'relative',
    width: 80,
    height: 80,
  },
  selectedImageSmall: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
  },
  removeImageButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#ff4444',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectButton: {
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectButtonText: {
    fontSize: 16,
    color: '#333',
  },
  placeholderText: {
    color: '#999',
  },
  submitButton: {
    backgroundColor: '#f7941d',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default CreateProductModal;