import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
  Alert,
  TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

const { width } = Dimensions.get('window');

const DetailProductModal = ({ 
  visible, 
  onClose, 
  product, 
  onUpdate,
  onDelete,
  categories = [],
  holidays = []
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Estados para edición
  const [editedName, setEditedName] = useState('');
  const [editedPrice, setEditedPrice] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [editedCategory, setEditedCategory] = useState('');
  const [editedHoliday, setEditedHoliday] = useState('');

  useEffect(() => {
    if (product) {
      setEditedName(product.nameProduct || '');
      setEditedPrice(product.price?.toString() || '');
      setEditedDescription(product.description || '');
      setEditedCategory(product.idCategory || '');
      setEditedHoliday(product.idHolidayProduct || '');
      setIsEditing(false);
      setSelectedImageIndex(0);
    }
  }, [product]);

  if (!product) return null;

  // Obtener nombre de categoría
  const getCategoryName = () => {
    if (!product.idCategory) return 'Sin categoría';
    
    // Manejar tanto ObjectId como string
    const categoryId = typeof product.idCategory === 'object' && product.idCategory._id
      ? product.idCategory._id.toString()
      : product.idCategory.toString();
    
    const category = categories.find(cat => cat._id.toString() === categoryId);
    
    return category ? category.nameCategory : 'Sin categoría';
  };

  // Obtener nombre de festividad
  const getHolidayName = () => {
    if (!product.idHolidayProduct) return 'Sin festividad';
    
    // Manejar tanto ObjectId como string
    const holidayId = typeof product.idHolidayProduct === 'object' && product.idHolidayProduct._id
      ? product.idHolidayProduct._id.toString()
      : product.idHolidayProduct.toString();
    
    const holiday = holidays.find(hol => hol._id.toString() === holidayId);
    
    console.log('🔍 Buscando festividad:', {
      productHolidayId: holidayId,
      productHolidayType: typeof product.idHolidayProduct,
      availableHolidays: holidays.map(h => ({ id: h._id.toString(), name: h.nameHoliday })),
      found: holiday
    });
    
    return holiday ? holiday.nameHoliday : 'Sin festividad';
  };

  // Todas las imágenes (principal + diseños)
  const allImages = [
    product.image,
    ...(product.designImages || [])
  ].filter(Boolean);

  const handleDelete = () => {
    Alert.alert(
      'Eliminar Producto',
      `¿Estás seguro de que deseas eliminar "${product.nameProduct}"?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            await onDelete(product._id);
            setLoading(false);
            onClose();
          }
        }
      ]
    );
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    // Restaurar valores originales
    setEditedName(product.nameProduct || '');
    setEditedPrice(product.price?.toString() || '');
    setEditedDescription(product.description || '');
    setEditedCategory(product.idCategory || '');
    setEditedHoliday(product.idHolidayProduct || '');
    setIsEditing(false);
  };

  const handleSaveEdit = async () => {
    // Validaciones
    if (!editedName.trim()) {
      Alert.alert('Error', 'El nombre del producto es requerido');
      return;
    }

    if (!editedPrice || parseFloat(editedPrice) <= 0) {
      Alert.alert('Error', 'El precio debe ser mayor a 0');
      return;
    }

    if (!editedDescription.trim()) {
      Alert.alert('Error', 'La descripción es requerida');
      return;
    }

    const updatedData = {
      nameProduct: editedName.trim(),
      price: parseFloat(editedPrice),
      description: editedDescription.trim(),
      idCategory: editedCategory || null,
      idHolidayProduct: editedHoliday || null,
    };

    try {
      setLoading(true);
      await onUpdate(product._id, updatedData);
      setIsEditing(false);
      onClose();
    } catch (error) {
      console.error('Error updating product:', error);
      Alert.alert('Error', 'No se pudo actualizar el producto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              {isEditing ? 'Editar Producto' : 'Detalles del Producto'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={28} color="#333" />
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#4a90a4" />
            </View>
          ) : (
            <ScrollView 
              style={styles.content}
              showsVerticalScrollIndicator={false}
            >
              {/* Galería de Imágenes */}
              <View style={styles.imageSection}>
                <View style={styles.mainImageContainer}>
                  <Image
                    source={{ uri: allImages[selectedImageIndex] }}
                    style={styles.mainImage}
                    resizeMode="cover"
                  />
                  {allImages.length > 1 && (
                    <View style={styles.imageCounter}>
                      <Text style={styles.imageCounterText}>
                        {selectedImageIndex + 1} / {allImages.length}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Thumbnails */}
                {allImages.length > 1 && (
                  <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    style={styles.thumbnailsContainer}
                  >
                    {allImages.map((img, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => setSelectedImageIndex(index)}
                        style={[
                          styles.thumbnail,
                          selectedImageIndex === index && styles.thumbnailSelected
                        ]}
                      >
                        <Image
                          source={{ uri: img }}
                          style={styles.thumbnailImage}
                          resizeMode="cover"
                        />
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                )}
              </View>

              {/* Información del Producto */}
              <View style={styles.infoSection}>
                {/* Nombre del Producto */}
                {isEditing ? (
                  <View style={styles.editBlock}>
                    <Text style={styles.editLabel}>Nombre del Producto</Text>
                    <TextInput
                      style={styles.editInput}
                      value={editedName}
                      onChangeText={setEditedName}
                      placeholder="Nombre del producto"
                    />
                  </View>
                ) : (
                  <Text style={styles.productName}>{product.nameProduct}</Text>
                )}

                {/* Precio */}
                {isEditing ? (
                  <View style={styles.editBlock}>
                    <Text style={styles.editLabel}>Precio</Text>
                    <TextInput
                      style={styles.editInput}
                      value={editedPrice}
                      onChangeText={setEditedPrice}
                      placeholder="0.00"
                      keyboardType="decimal-pad"
                    />
                  </View>
                ) : (
                  <Text style={styles.productPrice}>
                    ${parseFloat(product.price).toFixed(2)}
                  </Text>
                )}

                {/* Descripción */}
                <View style={styles.detailBlock}>
                  <View style={styles.detailHeader}>
                    <Ionicons name="document-text-outline" size={20} color="#4a90a4" />
                    <Text style={styles.detailTitle}>Descripción</Text>
                  </View>
                  {isEditing ? (
                    <TextInput
                      style={[styles.editInput, styles.editTextArea]}
                      value={editedDescription}
                      onChangeText={setEditedDescription}
                      placeholder="Descripción del producto"
                      multiline
                      numberOfLines={4}
                    />
                  ) : (
                    <Text style={styles.detailText}>{product.description}</Text>
                  )}
                </View>

                {/* Categoría */}
                <View style={styles.detailBlock}>
                  <View style={styles.detailHeader}>
                    <Ionicons name="pricetags-outline" size={20} color="#4a90a4" />
                    <Text style={styles.detailTitle}>Categoría</Text>
                  </View>
                  {isEditing ? (
                    <View style={styles.pickerContainer}>
                      <Picker
                        selectedValue={editedCategory}
                        onValueChange={setEditedCategory}
                        style={styles.picker}
                      >
                        <Picker.Item label="Sin categoría" value="" />
                        {categories.map((cat) => (
                          <Picker.Item 
                            key={cat._id} 
                            label={cat.nameCategory} 
                            value={cat._id} 
                          />
                        ))}
                      </Picker>
                    </View>
                  ) : (
                    <Text style={styles.detailText}>{getCategoryName()}</Text>
                  )}
                </View>

                {/* Festividad */}
                <View style={styles.detailBlock}>
                  <View style={styles.detailHeader}>
                    <Ionicons name="calendar-outline" size={20} color="#4a90a4" />
                    <Text style={styles.detailTitle}>Festividad</Text>
                  </View>
                  {isEditing ? (
                    <View style={styles.pickerContainer}>
                      <Picker
                        selectedValue={editedHoliday}
                        onValueChange={setEditedHoliday}
                        style={styles.picker}
                      >
                        <Picker.Item label="Sin festividad" value="" />
                        {holidays.map((hol) => (
                          <Picker.Item 
                            key={hol._id} 
                            label={hol.nameHoliday} 
                            value={hol._id} 
                          />
                        ))}
                      </Picker>
                    </View>
                  ) : (
                    <Text style={styles.detailText}>{getHolidayName()}</Text>
                  )}
                </View>

                {/* Imágenes de Diseño */}
                {!isEditing && product.designImages && product.designImages.length > 0 && (
                  <View style={styles.detailBlock}>
                    <View style={styles.detailHeader}>
                      <Ionicons name="images-outline" size={20} color="#4a90a4" />
                      <Text style={styles.detailTitle}>
                        Imágenes de Diseño ({product.designImages.length})
                      </Text>
                    </View>
                    <Text style={styles.detailSubtext}>
                      {product.designImages.length} imagen{product.designImages.length !== 1 ? 'es' : ''} adicional{product.designImages.length !== 1 ? 'es' : ''} disponible{product.designImages.length !== 1 ? 's' : ''}
                    </Text>
                  </View>
                )}
              </View>

              {/* Botones de Acción */}
              <View style={styles.actionButtons}>
                {isEditing ? (
                  <>
                    <TouchableOpacity 
                      style={[styles.actionButton, styles.cancelButton]}
                      onPress={handleCancelEdit}
                    >
                      <Ionicons name="close-outline" size={20} color="#fff" />
                      <Text style={styles.actionButtonText}>Cancelar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={[styles.actionButton, styles.saveButton]}
                      onPress={handleSaveEdit}
                    >
                      <Ionicons name="checkmark-outline" size={20} color="#fff" />
                      <Text style={styles.actionButtonText}>Guardar</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <TouchableOpacity 
                      style={[styles.actionButton, styles.editButtonProuct]}
                      onPress={handleEdit}
                    >
                      <Ionicons name="create-outline" size={20} color="#fff" />
                      <Text style={styles.actionButtonText}>Editar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={[styles.actionButton, styles.deleteButton]}
                      onPress={handleDelete}
                    >
                      <Ionicons name="trash-outline" size={20} color="#fff" />
                      <Text style={styles.actionButtonText}>Eliminar</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    height: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  imageSection: {
    backgroundColor: '#f8f9fa',
    paddingBottom: 10,
  },
  mainImageContainer: {
    position: 'relative',
    width: width,
    height: width * 0.8,
    backgroundColor: '#fff',
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  imageCounter: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  imageCounterText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  thumbnailsContainer: {
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  thumbnailSelected: {
    borderColor: '#f6c7de',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  infoSection: {
    padding: 20,
  },
  productName: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#f59f2d',
    marginBottom: 20,
  },
  detailBlock: {
    marginBottom: 20,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  detailText: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
    marginLeft: 28,
  },
  detailSubtext: {
    fontSize: 14,
    color: '#999',
    marginLeft: 28,
    fontStyle: 'italic',
  },
  editBlock: {
    marginBottom: 15,
  },
  editLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  editInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    backgroundColor: '#fff',
  },
  editTextArea: {
    height: 100,
    textAlignVertical: 'top',
    marginLeft: 28,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginLeft: 28,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 20,
    paddingTop: 10,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  editButtonProuct: {
    backgroundColor: '#c78937',
    borderRadius: 18,
    
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 18,
  },
  saveButton: {
    backgroundColor: '#609dd5',
    borderRadius: 18,
  },
  cancelButton: {
    backgroundColor: '#95a5a6',
    borderRadius: 18,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DetailProductModal;