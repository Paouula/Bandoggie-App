import React from 'react';
import {
  Modal,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const ProductDetailModal = ({ visible, product, onClose, onEdit, onDelete }) => {
  if (!product) return null;

  const handleDelete = () => {
    // Mostrar confirmación antes de eliminar
    Alert.alert(
      'Eliminar Producto',
      '¿Estás seguro de que deseas eliminar este producto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => onDelete(product._id),
        },
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header con botón de cerrar */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Detalle del Producto</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={28} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Imagen del producto */}
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: product.image }}
                style={styles.productImage}
                resizeMode="cover"
              />
            </View>

            {/* Información del producto */}
            <View style={styles.infoSection}>
              <Text style={styles.productName}>{product.nameProduct}</Text>
              <Text style={styles.productPrice}>${product.price}</Text>

              {/* Descripción */}
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Descripción</Text>
                <Text style={styles.detailValue}>{product.description}</Text>
              </View>

              {/* Categoría */}
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Categoría</Text>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {product.idCategory?.nameCategory || 'Sin categoría'}
                  </Text>
                </View>
              </View>

              {/* Festividad */}
              {product.idHolidayProduct && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Festividad</Text>
                  <View style={[styles.badge, styles.holidayBadge]}>
                    <Text style={styles.badgeText}>
                      {product.idHolidayProduct.nameHoliday}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </ScrollView>

          {/* Botones de acción */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.button, styles.editButton]}
              onPress={() => onEdit(product)}
            >
              <Ionicons name="create-outline" size={20} color="white" />
              <Text style={styles.buttonText}>Editar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.deleteButton]}
              onPress={handleDelete}
            >
              <Ionicons name="trash-outline" size={20} color="white" />
              <Text style={styles.buttonText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    maxHeight: '90%',
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  productImage: {
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  infoSection: {
    marginBottom: 20,
  },
  productName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4a90a4',
    marginBottom: 24,
  },
  detailRow: {
    marginBottom: 20,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  badge: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  holidayBadge: {
    backgroundColor: '#fce4ec',
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4a90a4',
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 12,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  editButton: {
    backgroundColor: '#b9d7e0ff',
  },
  deleteButton: {
    backgroundColor: '#aa4035ff',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProductDetailModal;