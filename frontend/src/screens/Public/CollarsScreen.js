import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ListCollars from '../../components/Public/ProductCollars/ListCollars';
import useDataCollars from '../../components/Public/ProductCollars/hooks/useDataCollars';
import SearchComponent from '../../components/SearchComponent/SearchComponent';

const CollarsScreen = ({ navigation }) => {
  const { Collars, loading, error, retry } = useDataCollars();
  const [showSearch, setShowSearch] = useState(false);

  const handleProductPress = (product) => {
    navigation.navigate('ProductDetail', { 
      productId: product._id,
      product: product 
    });
  };

  if (loading) {
    if (showSearch) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => setShowSearch(false)}
            style={styles.headerButton}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Buscar Collares</Text>
          <View style={styles.headerButton} />
        </View>
        <SearchComponent
          data={Collars}
          navigation={navigation}
          placeholder="Buscar collares..."
          onProductPress={handleProductPress}
          categories={['Todos', 'Collares']}
        />
      </SafeAreaView>
    );
  }

  return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation?.goBack()}
            style={styles.headerButton}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Collares</Text>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="search" size={24} color="#333" />
          </TouchableOpacity>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF9F43" />
          <Text style={styles.loadingText}>Cargando collares...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation?.goBack()}
            style={styles.headerButton}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Collares</Text>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="search" size={24} color="#333" />
          </TouchableOpacity>
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#FF6B6B" />
          <Text style={styles.errorText}>Error: {error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={retry}>
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (showSearch) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => setShowSearch(false)}
            style={styles.headerButton}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Buscar Collares</Text>
          <View style={styles.headerButton} />
        </View>
        <SearchComponent
          data={Collars}
          navigation={navigation}
          placeholder="Buscar collares..."
          onProductPress={handleProductPress}
          categories={['Todos', 'Collares']}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation?.goBack()}
          style={styles.headerButton}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Collares</Text>
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={() => setShowSearch(true)}
        >
          <Ionicons name="search" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {Collars && Collars.length > 0 && (
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>
            {Collars.length} collares disponibles
          </Text>
        </View>
      )}

      <View style={styles.productContainer}>
        <ListCollars 
          Collars={Collars} 
          navigation={navigation}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#FFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  statsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#F8F9FA',
  },
  statsText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  
  productContainer: {
    flex: 1,
  },
  
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#666',
  },
  
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 50,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 15,
    lineHeight: 22,
  },
  retryButton: {
    backgroundColor: '#FF9F43',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 15,
  },
  retryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CollarsScreen;