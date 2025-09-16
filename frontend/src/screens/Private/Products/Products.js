import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  SafeAreaView,
  Alert,
  ScrollView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Search, Plus } from 'lucide-react-native';

const ProductosScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [productos] = useState([
    {
      id: 1,
      nombre: 'Bandana con bordado',
      precio: 7.50,
      imagen: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=100&h=100&fit=crop&crop=center'
    },
    {
      id: 2,
      nombre: 'Bandana de calaberas reversi...',
      precio: 10.50,
      imagen: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=100&h=100&fit=crop&crop=center'
    },
    {
      id: 3,
      nombre: 'Bandana con bordado',
      precio: 7.50,
      imagen: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=100&h=100&fit=crop&crop=center'
    },
    {
      id: 4,
      nombre: 'Bandana de calaberas reversi...',
      precio: 10.50,
      imagen: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=100&h=100&fit=crop&crop=center'
    },
    {
      id: 5,
      nombre: 'Bandana con bordado',
      precio: 7.50,
      imagen: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=100&h=100&fit=crop&crop=center'
    },
    {
      id: 6,
      nombre: 'Bandana de calaberas reversi...',
      precio: 10.50,
      imagen: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=100&h=100&fit=crop&crop=center'
    }
  ]);

  const filteredProducts = productos.filter(producto =>
    producto.nombre.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleAgregarProducto = () => {
    Alert.alert('Agregar Producto', 'Agregar nuevo producto');
  };

  const handleNuevaCategoria = () => {
    Alert.alert('Nueva Categoría', 'Crear nueva categoría');
  };

  const handleNuevaFestividad = () => {
    Alert.alert('Nueva Festividad', 'Crear nueva festividad');
  };

  const renderProductItem = ({ item, index }) => (
    <TouchableOpacity style={styles.productCard}>
      <View style={styles.productImageContainer}>
        <Image 
          source={{ uri: item.imagen }}
          style={styles.productImage}
          resizeMode="cover"
        />
      </View>
      <Text style={styles.productName}>{item.nombre}</Text>
      <Text style={styles.productPrice}>${item.precio.toFixed(2)}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header con gradiente */}
<View style={styles.titleSection}>
      <LinearGradient
        colors={['#DFEFF6', '#E8E9F9', '#F6EDFE']}
        style={styles.titleGradientBackground}
      >
        <Text style={styles.title}>Productos</Text>

        {/* Círculo amarillo para imagen personalizada */}
        <View style={styles.logoContainer}>
          <View style={styles.logoBackground}>
            <Image
              source={require('../../../../assets/Products/ProductsHeader.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
        </View>
      </LinearGradient>
    </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Barra de búsqueda */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar..."
              placeholderTextColor="#666"
              value={searchText}
              onChangeText={setSearchText}
            />
            <Search size={20} color="#666" style={styles.searchIcon} />
          </View>
          
          <TouchableOpacity 
            style={styles.addButton} 
            onPress={handleAgregarProducto}
            activeOpacity={0.8}
          >
            <Plus size={16} color="white" />
            <Text style={styles.addButtonText}>Agregar</Text>
          </TouchableOpacity>
        </View>

        {/* Botones de categoría y festividad */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.categoryButton} 
            onPress={handleNuevaCategoria}
            activeOpacity={0.8}
          >
            <Plus size={16} color="white" />
            <Text style={styles.categoryButtonText}>Nueva Categoría</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.festividadButton} 
            onPress={handleNuevaFestividad}
            activeOpacity={0.8}
          >
            <Plus size={16} color="white" />
            <Text style={styles.festividadButtonText}>Nueva Festividad</Text>
          </TouchableOpacity>
        </View>

        {/* Lista de productos */}
        <View style={styles.productsContainer}>
          <FlatList
            data={filteredProducts}
            renderItem={renderProductItem}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.flatListContent}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Contenedor principal
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },

  scrollContainer: {
    flex: 1,
  },

  // Header
headerSection: {
  marginBottom: 20,
},

headerGradient: {
  paddingTop: 20,
  paddingBottom: 30,
  paddingHorizontal: 20,
  borderBottomLeftRadius: 30,
  borderBottomRightRadius: 30,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 10,
  elevation: 5,
  alignItems: 'center',
},


titleSection: {
  paddingHorizontal: -30,
  marginBottom: 20,
},

titleGradientBackground: {
  alignItems: 'center',
  paddingVertical: 30,
  paddingHorizontal: 20,
  borderBottomRightRadius: 50,
  borderBottomLeftRadius: 50,
  marginHorizontal: 10,
},

title: {
  fontSize: 35,
  fontFamily: 'BalooBhaijaan2_700Bold', // igual que empleados
  color: '#000',
  marginBottom: 30,
},

logoContainer: {
  marginBottom: 20,
},

logoBackground: {
  width: 160,
  height: 160,
  marginTop: 30,
  marginBottom: -100,
  borderRadius: 80,
  backgroundColor: '#FDF7DF',
  justifyContent: 'center',
  alignItems: 'center',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
},

logoImage: {
  width: 100,
  height: 100,
},

  // Barra de búsqueda
  searchContainer: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
    gap: 10,
    marginTop:30,
  },

  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },

  searchIcon: {
    marginLeft: 10,
  },

  addButton: {
    backgroundColor: '#4a90a4',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 6,
  },

  addButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },

  // Botones de acción
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 15,
  },

  categoryButton: {
    flex: 1,
    backgroundColor: '#ff8c42',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 20,
    gap: 6,
  },

  categoryButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },

  festividadButton: {
    flex: 1,
    backgroundColor: '#ff8c42',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 20,
    gap: 6,
  },

  festividadButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },

  // Contenedor de productos
  productsContainer: {
    flex: 1,
    backgroundColor: '#ffe6f0',
    paddingHorizontal: 15,
    paddingTop: 10,
  },

  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },

  flatListContent: {
    paddingBottom: 20,
  },

  // Tarjetas de productos
  productCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 15,
    width: '48%',
  },

  productImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    marginBottom: 10,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },

  productImage: {
    width: '100%',
    height: '100%',
  },

  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 18,
    minHeight: 36,
    textAlignVertical: 'center',
  },

  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4a90a4',
  },
});

export default ProductosScreen;