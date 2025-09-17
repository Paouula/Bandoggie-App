// ProductosScreen.js - Actualizado
import React, { useState, useEffect } from 'react';
import { View, Alert, FlatList, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '../../../components/Private/Product/ProductHeader.js';
import SearchBar from '../../../components/Private/Product/SearchBar.js';
import ActionButtons from '../../../components/Private/Product/ActionButton.js';
import ProductList from '../../../components/Private/Product/ProductList.js';
import CreateProductModal from '../../../components/Private/Product/CreateProductModal.js';

const ProductosScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Estados para modales
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showFestivityModal, setShowFestivityModal] = useState(false);
  
  // Estados de datos
  const [productos, setProductos] = useState([
    {
      id: 1,
      nombre: 'Bandana con bordado',
      precio: 7.50,
      imagen: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=100&h=100&fit=crop&crop=center',
    },
    {
      id: 2,
      nombre: 'Bandana de calaberas reversi...',
      precio: 10.50,
      imagen: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=100&h=100&fit=crop&crop=center',
    },
  ]);
  
  const [categories, setCategories] = useState([]);
  const [festivities, setFestivities] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Cargar datos iniciales
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      // Simular carga de datos desde API
      const [productosData, categoriasData, festividadesData] = await Promise.all([
        loadProducts(),
        loadCategories(),
        loadFestivities()
      ]);
      
      setProductos(productosData);
      setCategories(categoriasData);
      setFestivities(festividadesData);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  // Funciones de carga de datos (simuladas)
  const loadProducts = async () => {
    // Simular llamada a API
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([
          {
            id: 1,
            nombre: 'Bandana con bordado',
            precio: 7.50,
            descripcion: 'Hermosa bandana con bordado artesanal',
            imagen: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=100&h=100&fit=crop&crop=center',
            categoria: 'Accesorios',
            festividad: 'Navidad'
          },
          {
            id: 2,
            nombre: 'Bandana de calaberas reversible',
            precio: 10.50,
            descripcion: 'Diseño único de calaberas, reversible',
            imagen: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=100&h=100&fit=crop&crop=center',
            categoria: 'Accesorios',
            festividad: 'Halloween'
          },
        ]);
      }, 1000);
    });
  };

  const loadCategories = async () => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([
          { id: 1, nombre: 'Accesorios' },
          { id: 2, nombre: 'Ropa' },
          { id: 3, nombre: 'Decoración' }
        ]);
      }, 500);
    });
  };

  const loadFestivities = async () => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([
          { id: 1, nombre: 'Navidad' },
          { id: 2, nombre: 'Halloween' },
          { id: 3, nombre: 'Día de San Valentín' },
          { id: 4, nombre: 'Día de la Madre' }
        ]);
      }, 500);
    });
  };

  // Filtrar productos
  const filteredProducts = productos.filter(producto =>
    producto.nombre.toLowerCase().includes(searchText.toLowerCase())
  );

  // Funciones para manejar modales
  const handleOpenCreate = () => {
    setShowCreateModal(true);
  };

  const handleOpenEdit = (product) => {
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  const handleOpenDelete = (product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setShowCategoryModal(false);
    setShowFestivityModal(false);
    setSelectedProduct(null);
  };

  // Función para crear producto
  const onCreateProduct = async (productData) => {
    setLoading(true);
    try {
      // Simular creación en API
      const newProduct = {
        id: Date.now(),
        ...productData,
        precio: parseFloat(productData.precio)
      };
      
      // Aquí harías la llamada real a tu API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setProductos(prev => [newProduct, ...prev]);
      return newProduct;
    } catch (error) {
      throw new Error('No se pudo crear el producto');
    } finally {
      setLoading(false);
    }
  };

  // Función para editar producto
  const onEditProduct = async (productData) => {
    setLoading(true);
    try {
      const updatedProduct = {
        ...selectedProduct,
        ...productData,
        precio: parseFloat(productData.precio)
      };
      
      // Simular actualización en API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setProductos(prev => 
        prev.map(product => 
          product.id === selectedProduct.id ? updatedProduct : product
        )
      );
      
      return updatedProduct;
    } catch (error) {
      throw new Error('No se pudo actualizar el producto');
    } finally {
      setLoading(false);
    }
  };

  // Función para eliminar producto
  const handleDelete = async () => {
    if (!selectedProduct) return;
    
    setLoading(true);
    try {
      // Simular eliminación en API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProductos(prev => 
        prev.filter(product => product.id !== selectedProduct.id)
      );
      
      Alert.alert('Éxito', 'Producto eliminado correctamente');
      handleCloseModal();
    } catch (error) {
      Alert.alert('Error', 'No se pudo eliminar el producto');
    } finally {
      setLoading(false);
    }
  };

  // Funciones para crear categoría y festividad
  const onSubmitCategory = async (categoryData) => {
    setLoading(true);
    try {
      const newCategory = {
        id: Date.now(),
        ...categoryData
      };
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCategories(prev => [...prev, newCategory]);
      
      Alert.alert('Éxito', 'Categoría creada correctamente');
      return newCategory;
    } catch (error) {
      throw new Error('No se pudo crear la categoría');
    } finally {
      setLoading(false);
    }
  };

  const onSubmitHoliday = async (holidayData) => {
    setLoading(true);
    try {
      const newHoliday = {
        id: Date.now(),
        ...holidayData
      };
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      setFestivities(prev => [...prev, newHoliday]);
      
      Alert.alert('Éxito', 'Festividad creada correctamente');
      return newHoliday;
    } catch (error) {
      throw new Error('No se pudo crear la festividad');
    } finally {
      setLoading(false);
    }
  };

  const handleAgregarProducto = () => {
    handleOpenCreate();
  };

  const handleNuevaCategoria = () => {
    setShowCategoryModal(true);
  };

  const handleNuevaFestividad = () => {
    setShowFestivityModal(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Header />
        <SearchBar 
          searchText={searchText}
          setSearchText={setSearchText}
          handleAgregarProducto={handleAgregarProducto}
        />
        <ActionButtons
          handleNuevaCategoria={handleNuevaCategoria}
          handleNuevaFestividad={handleNuevaFestividad}
        />
        <ProductList 
          filteredProducts={filteredProducts}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
          loading={loading}
        />
      </ScrollView>

      {/* Modal para crear producto */}
      <CreateProductModal
        visible={showCreateModal}
        onClose={handleCloseModal}
        onCreateProduct={onCreateProduct}
        categories={categories}
        festivities={festivities}
        loading={loading}
      />

      {/* Aquí puedes agregar otros modales como EditProductModal, DeleteConfirmModal, etc. */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    flex: 1,
  },
});

export default ProductosScreen;