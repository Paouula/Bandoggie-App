import React from 'react';
import { FlatList, StyleSheet, View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ClientCard from './ClientCard';

const ClientList = ({ 
  clientes, 
  loading, 
  error, 
  onRefresh, 
  activeFilter, 
  onFilterChange, 
  filterOptions 
}) => {
  const renderCliente = ({ item }) => (
    <ClientCard cliente={item} />
  );

  const renderFilterButton = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        activeFilter === item.key && styles.activeFilterButton
      ]}
      onPress={() => onFilterChange(item.key)}
    >
      <Text style={[
        styles.filterText,
        activeFilter === item.key && styles.activeFilterText
      ]}>
        {item.label}
      </Text>
      <View style={[
        styles.countBadge,
        activeFilter === item.key && styles.activeCountBadge
      ]}>
        <Text style={[
          styles.countText,
          activeFilter === item.key && styles.activeCountText
        ]}>
          {item.count}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading && (!clientes || clientes.length === 0)) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#ff6b9d" />
        <Text style={styles.loadingText}>Cargando usuarios...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle-outline" size={60} color="#ff6b9d" />
        <Text style={styles.errorTitle}>Error al cargar</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
          <Text style={styles.retryText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!clientes || clientes.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="people-outline" size={60} color="#ccc" />
        <Text style={styles.emptyTitle}>Sin usuarios</Text>
        <Text style={styles.emptyText}>No hay usuarios registrados</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Filtros */}
      {filterOptions && (
        <View style={styles.filtersContainer}>
          <FlatList
            data={filterOptions}
            keyExtractor={(item) => item.key}
            renderItem={renderFilterButton}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersContent}
          />
        </View>
      )}

      {/* Lista de usuarios */}
      <FlatList
        data={clientes}
        renderItem={renderCliente}
        keyExtractor={(item, index) => {
          // Múltiples opciones para el key
          return item?._id?.toString() || 
                 item?.id?.toString() || 
                 `user-${index}` ||
                 index.toString();
        }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        onRefresh={onRefresh}
        refreshing={loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    paddingBottom: 20,
  },
  filtersContainer: {
    marginBottom: 20,
  },
  filtersContent: {
    paddingRight: 20,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: '#fff',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  activeFilterButton: {
    backgroundColor: '#ff6b9d',
  },
  filterText: {
    marginRight: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activeFilterText: {
    color: '#fff',
  },
  countBadge: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 18,
    alignItems: 'center',
  },
  activeCountBadge: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  countText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#666',
  },
  activeCountText: {
    color: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff6b9d',
    marginTop: 20,
    marginBottom: 10,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  retryButton: {
    backgroundColor: '#ff6b9d',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ClientList;