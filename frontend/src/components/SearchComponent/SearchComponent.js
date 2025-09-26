import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  Dimensions,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/300x300?text=Producto';

const SearchComponent = ({ 
  data = [], 
  navigation, 
  placeholder = "Buscar productos...",
  onProductPress,
  categories = ['Todos', 'Accesorios', 'Bandanas', 'Collares']
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Función para filtrar datos
  const filterData = useCallback((term, category) => {
    setIsSearching(true);
    
    setTimeout(() => {
      let filtered = data;

      // Filtrar por categoría
      if (category !== 'Todos') {
        filtered = filtered.filter(item => {
          const itemCategory = item.category?.toLowerCase() || '';
          const itemName = item.nameProduct?.toLowerCase() || '';
          return itemCategory.includes(category.toLowerCase()) || 
                 itemName.includes(category.toLowerCase());
        });
      }

      // Filtrar por término de búsqueda
      if (term.trim()) {
        filtered = filtered.filter(item => {
          const name = item.nameProduct?.toLowerCase() || '';
          const description = item.description?.toLowerCase() || '';
          const searchLower = term.toLowerCase();
          
          return name.includes(searchLower) || description.includes(searchLower);
        });
      }

      setFilteredData(filtered);
      setIsSearching(false);
      setShowResults(term.trim().length > 0 || category !== 'Todos');
    }, 300); // Debounce de 300ms
  }, [data]);

  // Efecto para filtrar cuando cambia el término o categoría
  useEffect(() => {
    filterData(searchTerm, selectedCategory);
  }, [searchTerm, selectedCategory, filterData]);

  // Limpiar búsqueda
  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setSelectedCategory('Todos');
    setShowResults(false);
    setFilteredData([]);
    Keyboard.dismiss();
  }, []);

  // Manejar selección de categoría
  const handleCategoryPress = useCallback((category) => {
    setSelectedCategory(category);
  }, []);

  // Manejar presión en producto
  const handleProductPress = useCallback((product) => {
    if (onProductPress) {
      onProductPress(product);
    } else if (navigation) {
      // Navegar a detalle del producto
      navigation.navigate('ProductDetail', { 
        productId: product._id,
        product: product 
      });
    }
    Keyboard.dismiss();
  }, [navigation, onProductPress]);

  // Renderizar producto en resultados
  const renderSearchResult = useCallback(({ item }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => handleProductPress(item)}
      activeOpacity={0.7}
    >
      <Image 
        source={{ uri: item.image || PLACEHOLDER_IMAGE }}
        style={styles.resultImage}
        resizeMode="cover"
      />
      <View style={styles.resultInfo}>
        <Text style={styles.resultTitle} numberOfLines={2}>
          {item.nameProduct}
        </Text>
        <Text style={styles.resultPrice}>
          ${parseFloat(item.price || 0).toFixed(2)}
        </Text>
        {item.description && (
          <Text style={styles.resultDescription} numberOfLines={1}>
            {item.description}
          </Text>
        )}
      </View>
      <Ionicons name="chevron-forward" size={20} color="#999" />
    </TouchableOpacity>
  ), [handleProductPress]);

  // Renderizar categoría
  const renderCategory = useCallback(({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryButton,
        selectedCategory === item && styles.selectedCategoryButton
      ]}
      onPress={() => handleCategoryPress(item)}
      activeOpacity={0.7}
    >
      <Text style={[
        styles.categoryText,
        selectedCategory === item && styles.selectedCategoryText
      ]}>
        {item}
      </Text>
    </TouchableOpacity>
  ), [selectedCategory, handleCategoryPress]);

  return (
    <View style={styles.container}>
      {/* Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder={placeholder}
            placeholderTextColor="#999"
            value={searchTerm}
            onChangeText={setSearchTerm}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchTerm.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filtros de categoría */}
      <View style={styles.categoriesContainer}>
        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {/* Indicador de carga */}
      {isSearching && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#FF9F43" />
          <Text style={styles.loadingText}>Buscando...</Text>
        </View>
      )}

      {/* Resultados de búsqueda */}
      {showResults && !isSearching && (
        <View style={styles.resultsContainer}>
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsTitle}>
              {filteredData.length} resultado{filteredData.length !== 1 ? 's' : ''}
            </Text>
            {filteredData.length > 0 && (
              <TouchableOpacity onPress={clearSearch}>
                <Text style={styles.clearAllText}>Limpiar</Text>
              </TouchableOpacity>
            )}
          </View>

          {filteredData.length > 0 ? (
            <FlatList
              data={filteredData}
              renderItem={renderSearchResult}
              keyExtractor={(item) => item._id}
              style={styles.resultsList}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.noResultsContainer}>
              <Ionicons name="search-outline" size={48} color="#CCC" />
              <Text style={styles.noResultsText}>
                No se encontraron productos
              </Text>
              <Text style={styles.noResultsSubtext}>
                Intenta con otros términos de búsqueda
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Estado inicial */}
      {!showResults && !isSearching && (
        <View style={styles.initialStateContainer}>
          <Ionicons name="search-outline" size={64} color="#E0E0E0" />
          <Text style={styles.initialStateText}>
            Busca tus productos favoritos
          </Text>
          <Text style={styles.initialStateSubtext}>
            Encuentra accesorios, bandanas y collares
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  
  // Search container
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 50,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    height: '100%',
  },
  clearButton: {
    padding: 5,
  },
  
  // Categories
  categoriesContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  categoriesList: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    marginRight: 10,
  },
  selectedCategoryButton: {
    backgroundColor: '#FF9F43',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: '#FFF',
  },
  
  // Loading
  loadingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#666',
  },
  
  // Results
  resultsContainer: {
    flex: 1,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  clearAllText: {
    fontSize: 14,
    color: '#FF9F43',
    fontWeight: '500',
  },
  resultsList: {
    flex: 1,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  resultImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
  },
  resultInfo: {
    flex: 1,
  },
  resultTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  resultPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF9F43',
    marginBottom: 2,
  },
  resultDescription: {
    fontSize: 12,
    color: '#999',
  },
  
  // No results
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 15,
    textAlign: 'center',
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
    textAlign: 'center',
  },
  
  // Initial state
  initialStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  initialStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 15,
    textAlign: 'center',
  },
  initialStateSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
    textAlign: 'center',
  },
});

export default SearchComponent;