import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { API_URL } from '../../config.js';

// Modal para Gestión de Categorías
export const ManageCategoriesModal = ({ visible, onClose, categories, onRefresh }) => {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Por favor ingresa un nombre para la categoría',
      });
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nameCategory: newCategoryName.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear la categoría');
      }

      Toast.show({
        type: 'success',
        text1: 'Éxito',
        text2: 'Categoría creada correctamente',
      });

      setNewCategoryName('');
      await onRefresh();
    } catch (error) {
      console.error('Error creating category:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || 'No se pudo crear la categoría',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCategory = async (categoryId) => {
    if (!editValue.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'El nombre no puede estar vacío',
      });
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}categories/${categoryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nameCategory: editValue.trim() }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar la categoría');
      }

      Toast.show({
        type: 'success',
        text1: 'Éxito',
        text2: 'Categoría actualizada correctamente',
      });

      setEditingId(null);
      setEditValue('');
      await onRefresh();
    } catch (error) {
      console.error('Error updating category:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No se pudo actualizar la categoría',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId, categoryName) => {
    Alert.alert(
      'Confirmar eliminación',
      `¿Estás seguro de eliminar la categoría "${categoryName}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              const response = await fetch(`${API_URL}categories/${categoryId}`, {
                method: 'DELETE',
              });

              if (!response.ok) {
                throw new Error('Error al eliminar la categoría');
              }

              Toast.show({
                type: 'success',
                text1: 'Éxito',
                text2: 'Categoría eliminada correctamente',
              });

              await onRefresh();
            } catch (error) {
              console.error('Error deleting category:', error);
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'No se pudo eliminar la categoría',
              });
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const renderCategoryItem = ({ item }) => {
    const isEditing = editingId === item._id;

    if (isEditing) {
      return (
        <View style={styles.listItem}>
          <TextInput
            style={styles.editInput}
            value={editValue}
            onChangeText={setEditValue}
            editable={!loading}
            autoFocus
          />
          <TouchableOpacity
            onPress={() => handleUpdateCategory(item._id)}
            style={styles.iconButton}
            disabled={loading}
          >
            <Ionicons name="checkmark-circle" size={28} color="#28a745" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setEditingId(null);
              setEditValue('');
            }}
            style={styles.iconButton}
            disabled={loading}
          >
            <Ionicons name="close-circle" size={28} color="#6c757d" />
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.listItem}>
        <Text style={styles.itemText}>{item.nameCategory}</Text>
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            onPress={() => {
              setEditingId(item._id);
              setEditValue(item.nameCategory);
            }}
            style={styles.iconButton}
            disabled={loading}
          >
            <Ionicons name="create-outline" size={24} color="#4a90a4" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleDeleteCategory(item._id, item.nameCategory)}
            style={styles.iconButton}
            disabled={loading}
          >
            <Ionicons name="trash-outline" size={24} color="#dc3545" />
          </TouchableOpacity>
        </View>
      </View>
    );
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
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Gestionar Categorías</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <View style={styles.addSection}>
            <TextInput
              style={styles.input}
              placeholder="Nombre de la categoría"
              value={newCategoryName}
              onChangeText={setNewCategoryName}
              editable={!loading}
            />
            <TouchableOpacity
              style={[styles.addButton, loading && styles.addButtonDisabled]}
              onPress={handleAddCategory}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons name="add" size={24} color="#fff" />
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.listContainer}>
            <Text style={styles.listTitle}>
              Categorías existentes ({categories?.length || 0})
            </Text>
            <FlatList
              data={categories || []}
              keyExtractor={(item) => item._id?.toString() || item.id?.toString()}
              renderItem={renderCategoryItem}
              ListEmptyComponent={
                <Text style={styles.emptyText}>No hay categorías registradas</Text>
              }
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Modal para Gestión de Festividades
export const ManageHolidaysModal = ({ visible, onClose, holidays, onRefresh }) => {
  const [newHolidayName, setNewHolidayName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddHoliday = async () => {
    if (!newHolidayName.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Por favor ingresa un nombre para la festividad',
      });
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}holiday`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nameHoliday: newHolidayName.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear la festividad');
      }

      Toast.show({
        type: 'success',
        text1: 'Éxito',
        text2: 'Festividad creada correctamente',
      });

      setNewHolidayName('');
      await onRefresh();
    } catch (error) {
      console.error('Error creating holiday:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || 'No se pudo crear la festividad',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateHoliday = async (holidayId) => {
    if (!editValue.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'El nombre no puede estar vacío',
      });
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}holiday/${holidayId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nameHoliday: editValue.trim() }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar la festividad');
      }

      Toast.show({
        type: 'success',
        text1: 'Éxito',
        text2: 'Festividad actualizada correctamente',
      });

      setEditingId(null);
      setEditValue('');
      await onRefresh();
    } catch (error) {
      console.error('Error updating holiday:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No se pudo actualizar la festividad',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteHoliday = async (holidayId, holidayName) => {
    Alert.alert(
      'Confirmar eliminación',
      `¿Estás seguro de eliminar la festividad "${holidayName}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              const response = await fetch(`${API_URL}holiday/${holidayId}`, {
                method: 'DELETE',
              });

              if (!response.ok) {
                throw new Error('Error al eliminar la festividad');
              }

              Toast.show({
                type: 'success',
                text1: 'Éxito',
                text2: 'Festividad eliminada correctamente',
              });

              await onRefresh();
            } catch (error) {
              console.error('Error deleting holiday:', error);
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'No se pudo eliminar la festividad',
              });
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const renderHolidayItem = ({ item }) => {
    const isEditing = editingId === item._id;

    if (isEditing) {
      return (
        <View style={styles.listItem}>
          <TextInput
            style={styles.editInput}
            value={editValue}
            onChangeText={setEditValue}
            editable={!loading}
            autoFocus
          />
          <TouchableOpacity
            onPress={() => handleUpdateHoliday(item._id)}
            style={styles.iconButton}
            disabled={loading}
          >
            <Ionicons name="checkmark-circle" size={28} color="#28a745" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setEditingId(null);
              setEditValue('');
            }}
            style={styles.iconButton}
            disabled={loading}
          >
            <Ionicons name="close-circle" size={28} color="#6c757d" />
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.listItem}>
        <Text style={styles.itemText}>{item.nameHoliday}</Text>
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            onPress={() => {
              setEditingId(item._id);
              setEditValue(item.nameHoliday);
            }}
            style={styles.iconButton}
            disabled={loading}
          >
            <Ionicons name="create-outline" size={24} color="#4a90a4" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleDeleteHoliday(item._id, item.nameHoliday)}
            style={styles.iconButton}
            disabled={loading}
          >
            <Ionicons name="trash-outline" size={24} color="#dc3545" />
          </TouchableOpacity>
        </View>
      </View>
    );
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
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Gestionar Festividades</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <View style={styles.addSection}>
            <TextInput
              style={styles.input}
              placeholder="Nombre de la festividad"
              value={newHolidayName}
              onChangeText={setNewHolidayName}
              editable={!loading}
            />
            <TouchableOpacity
              style={[styles.addButton, loading && styles.addButtonDisabled]}
              onPress={handleAddHoliday}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons name="add" size={24} color="#fff" />
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.listContainer}>
            <Text style={styles.listTitle}>
              Festividades existentes ({holidays?.length || 0})
            </Text>
            <FlatList
              data={holidays || []}
              keyExtractor={(item) => item._id?.toString() || item.id?.toString()}
              renderItem={renderHolidayItem}
              ListEmptyComponent={
                <Text style={styles.emptyText}>No hay festividades registradas</Text>
              }
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  addSection: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
  },
  addButton: {
    backgroundColor: '#4a90a4',
    borderRadius: 10,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonDisabled: {
    backgroundColor: '#a0a0a0',
  },
  listContainer: {
    flex: 1,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 10,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    marginBottom: 8,
  },
  itemText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  editInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#4a90a4',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    backgroundColor: '#fff',
    marginRight: 8,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 5,
    marginLeft: 5,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    marginTop: 20,
  },
});