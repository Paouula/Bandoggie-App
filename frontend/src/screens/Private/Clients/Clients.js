import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import Header from '../../../components/Private/Clients/Header';
import SearchBar from '../../../components/Private/Clients/SearchBar';
import ClientList from '../../../components/Private/Clients/ClientList';

const ClientsScreen = () => {
  const [searchText, setSearchText] = useState('');

  // Datos de ejemplo de clientes
  const [clientes] = useState([
    {
      id: 1,
      nombre: 'María González',
      correo: 'maria.gonzalez@email.com',
      telefono: '7845-1234',
      registrado: '15/01/2025',
      direccion: 'Col. Centro, San Salvador',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 4,
      nombre: 'Roberto Herrera',
      correo: 'roberto.herrera@yahoo.com',
      telefono: '7456-7890',
      registrado: '05/02/2025',
      direccion: 'Col. Miramonte, San Salvador',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    }
  ]);

  // Filtrar clientes
  const filteredClientes = clientes.filter(cliente =>
    cliente.nombre.toLowerCase().includes(searchText.toLowerCase()) ||
    cliente.correo.toLowerCase().includes(searchText.toLowerCase()) ||
    cliente.telefono.includes(searchText)
  );

  // Handler de búsqueda
  const handleSearchChange = (text) => {
    setSearchText(text);
  };

  // Configuración del header
  const headerItem = {
    nombre: 'Historial de Clientes'
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header con diseño rectangular y lado derecho circular */}
      <Header 
        item={headerItem}
        gradientColors={['#fad1d7ff', '#ffacd1ff']}
      />

      {/* Contenido principal */}
      <View style={styles.contentContainer}>
        <SearchBar 
          searchText={searchText}
          onSearchChange={handleSearchChange}
          placeholder="Buscar clientes..."
        />
        <ClientList clientes={filteredClientes} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#FAF3F9',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
});

export default ClientsScreen;