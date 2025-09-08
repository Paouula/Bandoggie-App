import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
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

  // Handlers
  const handleSearchChange = (text) => {
    setSearchText(text);
  };

  const handleAddPress = () => {
    console.log('Agregar nuevo cliente');
    // Aquí puedes agregar la lógica para agregar un cliente
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header Component */}
      <Header title="Historial de Clientes" />

      {/* Content Container */}
      <View style={styles.contentContainer}>
        {/* Search Bar Component */}
        <SearchBar 
          searchText={searchText}
          onSearchChange={handleSearchChange}
          onAddPress={handleAddPress}
          placeholder="Buscar clientes..."
        />

        {/* Client List Component */}
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
    marginTop: 57,
    backgroundColor: '#FAF3F9',
    paddingHorizontal: 20,
  },
});

export default ClientsScreen;