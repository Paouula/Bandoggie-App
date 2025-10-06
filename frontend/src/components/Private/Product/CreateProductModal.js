// CreateProductModal.js - ARCHIVO COMPLETO
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
  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    descripcion: '',
    categoria: '',
    festividad: '',
    imagenPrincipal: null,
    imagenesDiseno: []
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showFestivityPicker, setShowFestivityPicker] = useState(false);

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
    setShowCategoryPicker(false);
    setShowFestivityPicker(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!formData.precio.trim()) {
      newErrors.precio = 'El precio es requerido';
    } else if (isNaN(parseFloat(formData.precio)) || parseFloat(formData.precio) <= 0) {
      newErrors.precio = 'Ingrese un precio válido';
    }

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es requerida';
    } else if (formData.descripcion.length > 235) {
      newErrors.descripcion = 'La descripción no puede exceder 235 caracteres';
    }

    if (!formData.imagenPrincipal) {
      newErrors.imagenPrincipal = 'La imagen principal es requerida';
    }

    if (formData.imagenesDiseno.length < 3) {
      newErrors.imagenesDiseno = 'Se requieren al menos 3 imágenes de diseño';
    }

    if (!formData.categoria) {
      newErrors.categoria = 'Selecciona una categoría';
    }

    if (!formData.festividad) {
      newErrors.festividad = 'Selecciona una festividad';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // FUNCIÓN CRÍTICA: Preparar imagen para FormData
  const prepareImageForUpload = (imageAsset) => {
    console.log('🔧 [PREPARE] Asset original:', {
      uri: imageAsset.uri?.substring(0, 50),
      type: imageAsset.type,
      fileName: imageAsset.fileName,
      name: imageAsset.name
    });

    // Obtener el nombre del archivo
    let fileName = imageAsset.fileName || imageAsset.name || 'photo.jpg';
    
    // Determinar el tipo MIME correcto
    let fileType = imageAsset.type;
    
    // Si el tipo es solo "image", extraer la extensión de la URI o nombre
    if (!fileType || fileType === 'image') {
      // Intentar desde el nombre del archivo
      if (fileName) {
        const nameParts = fileName.split('.');
        const extension = nameParts[nameParts.length - 1].toLowerCase();
        
        if (extension === 'jpg' || extension === 'jpeg') {
          fileType = 'image/jpeg';
        } else if (extension === 'png') {
          fileType = 'image/png';
        } else if (extension === 'gif') {
          fileType = 'image/gif';
        } else if (extension === 'webp') {
          fileType = 'image/webp';
        } else {
          fileType = 'image/jpeg'; // Default
        }
      } else {
        // Intentar desde la URI
        const uriParts = imageAsset.uri.split('.');
        const extension = uriParts[uriParts.length - 1].toLowerCase().split('?')[0];
        
        if (extension === 'jpg' || extension === 'jpeg') {
          fileType = 'image/jpeg';
        } else if (extension === 'png') {
          fileType = 'image/png';
        } else {
          fileType = 'image/jpeg'; // Default
        }
      }
    }

    // Asegurar que la URI tenga el formato correcto
    let cleanUri = imageAsset.uri;
    
    // Para Android, algunas URIs ya vienen con file://
    if (Platform.OS === 'android') {
      if (!cleanUri.startsWith('file://') && !cleanUri.startsWith('content://')) {
        cleanUri = `file://${cleanUri}`;
      }
    }

    const imageFile = {
      uri: cleanUri,
      name: fileName,
      type: fileType
    };

    console.log('✅ [PREPARE] Imagen preparada:', imageFile);
    return imageFile;
  };

  const handleSubmit = async () => {
    console.log('🔍 [MODAL] Iniciando validación...');
    
    if (!validateForm()) {
      Alert.alert('Error', 'Por favor corrige los errores en el formulario');
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('📦 [MODAL] Preparando datos del producto...');
      console.log('📦 [MODAL] Categorías disponibles:', categories.length);
      console.log('📦 [MODAL] Festividades disponibles:', festivities.length);
      
      // Preparar imagen principal
      const mainImage = prepareImageForUpload(formData.imagenPrincipal);
      
      // Preparar imágenes de diseño
      const designImagesArray = formData.imagenesDiseno.map((img, index) => {
        return prepareImageForUpload(img);
      });

      console.log('✅ [MODAL] Imágenes preparadas:', {
        mainImage: mainImage.name,
        designImages: designImagesArray.length
      });

      // Preparar datos para enviar
      const productData = {
        nameProduct: formData.nombre,
        price: parseFloat(formData.precio).toFixed(2),
        description: formData.descripcion,
        image: mainImage,
        designImages: designImagesArray,
        idCategory: formData.categoria,
        idHolidayProduct: formData.festividad,
      };

      console.log('✅ [MODAL] Datos finales:', {
        nameProduct: productData.nameProduct,
        price: productData.price,
        descriptionLength: productData.description.length,
        idCategory: productData.idCategory,
        idHolidayProduct: productData.idHolidayProduct
      });

      await onCreateProduct(productData);
      
    } catch (error) {
      console.error('💥 [MODAL] Error:', error);
      Alert.alert('Error', error.message || 'No se pudo crear el producto');
    } finally {
      setIsSubmitting(false);
    }
  };

  const pickMainImage = async () => {
    try {
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

      if (!result.canceled && result.assets && result.assets[0]) {
        const asset = result.assets[0];
        console.log('📸 [PICKER MAIN] Asset seleccionado:', {
          uri: asset.uri?.substring(0, 60),
          type: asset.type,
          mimeType: asset.mimeType,
          fileName: asset.fileName,
          width: asset.width,
          height: asset.height
        });
        handleInputChange('imagenPrincipal', asset);
      }
    } catch (error) {
      console.error('❌ [PICKER MAIN] Error:', error);
      Alert.alert('Error', 'No se pudo seleccionar la imagen');
    }
  };

  const pickDesignImages = async () => {
    try {
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

      if (!result.canceled && result.assets) {
        console.log(`📸 [PICKER DESIGN] ${result.assets.length} assets seleccionados`);
        result.assets.forEach((asset, idx) => {
          console.log(`  Asset ${idx + 1}:`, {
            uri: asset.uri?.substring(0, 60),
            type: asset.type,
            mimeType: asset.mimeType,
            fileName: asset.fileName
          });
        });
        
        const currentImages = formData.imagenesDiseno || [];
        const newImages = [...currentImages, ...result.assets];
        handleInputChange('imagenesDiseno', newImages);
      }
    } catch (error) {
      console.error('❌ [PICKER DESIGN] Error:', error);
      Alert.alert('Error', 'No se pudieron seleccionar las imágenes');
    }
  };

  const removeDesignImage = (index) => {
    const newImages = formData.imagenesDiseno.filter((_, i) => i !== index);
    handleInputChange('imagenesDiseno', newImages);
  };

  const selectCategory = (category) => {
    console.log('📂 [SELECT] Categoría seleccionada:', category.nameCategory);
    handleInputChange('categoria', category._id);
    setShowCategoryPicker(false);
  };

  const selectFestivity = (festivity) => {
    console.log('🎉 [SELECT] Festividad seleccionada:', festivity.nameHoliday);
    handleInputChange('festividad', festivity._id);
    setShowFestivityPicker(false);
  };

  const getSelectedCategoryName = () => {
    const category = categories.find(cat => cat._id === formData.categoria);
    return category ? category.nameCategory : 'Selecciona una categoría';
  };

  const getSelectedFestivityName = () => {
    const festivity = festivities.find(fest => fest._id === formData.festividad);
    return festivity ? festivity.nameHoliday : 'Selecciona una festividad';
  };

  const CategoryPickerModal = () => (
    <Modal
      visible={showCategoryPicker}
      transparent
      animationType="fade"
      onRequestClose={() => setShowCategoryPicker(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.pickerContainer}>
          <View style={styles.pickerHeader}>
            <Text style={styles.pickerTitle}>Seleccionar Categoría</Text>
            <TouchableOpacity 
              onPress={() => setShowCategoryPicker(false)}
              style={styles.pickerCloseButton}
            >
              <Feather name="x" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.pickerList}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category._id}
                style={[
                  styles.pickerItem,
                  formData.categoria === category._id && styles.pickerItemSelected
                ]}
                onPress={() => selectCategory(category)}
              >
                <Text style={[
                  styles.pickerItemText,
                  formData.categoria === category._id && styles.pickerItemTextSelected
                ]}>
                  {category.nameCategory}
                </Text>
                {formData.categoria === category._id && (
                  <Feather name="check" size={20} color="#007AFF" />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  const FestivityPickerModal = () => (
    <Modal
      visible={showFestivityPicker}
      transparent
      animationType="fade"
      onRequestClose={() => setShowFestivityPicker(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.pickerContainer}>
          <View style={styles.pickerHeader}>
            <Text style={styles.pickerTitle}>Seleccionar Festividad</Text>
            <TouchableOpacity 
              onPress={() => setShowFestivityPicker(false)}
              style={styles.pickerCloseButton}
            >
              <Feather name="x" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.pickerList}>
            {festivities.map((festivity) => (
              <TouchableOpacity
                key={festivity._id}
                style={[
                  styles.pickerItem,
                  formData.festividad === festivity._id && styles.pickerItemSelected
                ]}
                onPress={() => selectFestivity(festivity)}
              >
                <Text style={[
                  styles.pickerItemText,
                  formData.festividad === festivity._id && styles.pickerItemTextSelected
                ]}>
                  {festivity.nameHoliday}
                </Text>
                {formData.festividad === festivity._id && (
                  <Feather name="check" size={20} color="#007AFF" />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <>
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={onClose}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Feather name="x" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.title}>Crear nuevo producto</Text>
            <View style={styles.placeholder} />
          </View>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.form}>
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

              <View style={styles.inputGroup}>
                <TextInput
                  style={[styles.input, errors.precio && styles.inputError]}
                  placeholder="Precio (ej: 12.50)"
                  value={formData.precio}
                  onChangeText={(value) => handleInputChange('precio', value)}
                  keyboardType="decimal-pad"
                  placeholderTextColor="#999"
                />
                {errors.precio && <Text style={styles.errorText}>{errors.precio}</Text>}
              </View>

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

              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Imágenes de Diseño ({formData.imagenesDiseno.length}/3 mínimo) *
                </Text>
                <TouchableOpacity
                  style={[styles.imageUploadButton, errors.imagenesDiseno && styles.inputError]}
                  onPress={pickDesignImages}
                >
                  <View style={styles.imageUploadContent}>
                    <Feather name="plus" size={32} color="#666" />
                    <Text style={styles.imageUploadText}>Agregar imágenes</Text>
                  </View>
                </TouchableOpacity>
                
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

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Categoría *</Text>
                <TouchableOpacity
                  style={[styles.selectButton, errors.categoria && styles.inputError]}
                  onPress={() => setShowCategoryPicker(true)}
                >
                  <Text style={[
                    styles.selectButtonText, 
                    !formData.categoria && styles.placeholderText
                  ]}>
                    {getSelectedCategoryName()}
                  </Text>
                  <Feather name="chevron-down" size={20} color="#666" />
                </TouchableOpacity>
                {errors.categoria && <Text style={styles.errorText}>{errors.categoria}</Text>}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Festividad *</Text>
                <TouchableOpacity
                  style={[styles.selectButton, errors.festividad && styles.inputError]}
                  onPress={() => setShowFestivityPicker(true)}
                >
                  <Text style={[
                    styles.selectButtonText, 
                    !formData.festividad && styles.placeholderText
                  ]}>
                    {getSelectedFestivityName()}
                  </Text>
                  <Feather name="chevron-down" size={20} color="#666" />
                </TouchableOpacity>
                {errors.festividad && <Text style={styles.errorText}>{errors.festividad}</Text>}
              </View>

              <TouchableOpacity
                style={[styles.submitButton, (isSubmitting || loading) && styles.submitButtonDisabled]}
                onPress={handleSubmit}
                disabled={isSubmitting || loading}
              >
                {(isSubmitting || loading) ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text style={styles.submitButtonText}>Crear Producto</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>

      <CategoryPickerModal />
      <FestivityPickerModal />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  closeButton: {
    padding: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  placeholder: {
    width: 34,
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
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    minHeight: 100,
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    marginTop: 5,
  },
  characterCount: {
    alignItems: 'flex-end',
    marginTop: 5,
  },
  characterCountText: {
    color: '#666',
    fontSize: 12,
  },
  imageUploadButton: {
    borderWidth: 2,
    borderColor: '#E5E5E5',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  imageUploadContent: {
    alignItems: 'center',
  },
  imageUploadText: {
    color: '#666',
    fontSize: 16,
    marginTop: 8,
  },
  selectedImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  selectedImagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    gap: 10,
  },
  selectedImageItem: {
    position: 'relative',
  },
  selectedImageSmall: {
    width: 80,
    height: 80,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  removeImageButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  selectButtonText: {
    fontSize: 16,
    color: '#333',
  },
  placeholderText: {
    color: '#999',
  },
  submitButton: {
    backgroundColor: '#609dd5',
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: {
    backgroundColor: '#B0B0B0',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    maxHeight: '70%',
    width: '85%',
    overflow: 'hidden',
  },
  pickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  pickerCloseButton: {
    padding: 5,
  },
  pickerList: {
    maxHeight: 400,
  },
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  pickerItemSelected: {
    backgroundColor: '#F0F8FF',
  },
  pickerItemText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  pickerItemTextSelected: {
    color: '#007AFF',
    fontWeight: '600',
  },
});

export default CreateProductModal;