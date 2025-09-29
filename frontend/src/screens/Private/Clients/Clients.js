import React, { useState, useMemo } from 'react';
import { View, SafeAreaView } from 'react-native';
import Header from '../../../components/Private/Clients/Header';
import SearchBar from '../../../components/Private/Clients/SearchBar';
import ClientList from '../../../components/Private/Clients/ClientList';
import useFetchUsers from '../../../hooks/Clients/useFetchUsers';

const ClientsScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  
  const { 
    clients,
    vets,
    loading, 
    error, 
    handleGetClientes,
    handleGetVets
  } = useFetchUsers();

  const allUsers = useMemo(() => [
    ...clients.map(client => ({ ...client, userType: 'client' })),
    ...vets.map(vet => ({ ...vet, userType: 'vet' }))
  ], [clients, vets]);

  const getUsersByType = (userType) => {
    switch (userType) {
      case 'client': return clients.map(client => ({ ...client, userType: 'client' }));
      case 'vet': return vets.map(vet => ({ ...vet, userType: 'vet' }));
      case 'all':
      default: return allUsers;
    }
  };

  const filteredUsers = useMemo(() => {
    const users = getUsersByType(activeFilter);
    
    if (!searchText.trim()) {
      return users;
    }
    
    return users.filter(user =>
      user.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      user.nombre?.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchText.toLowerCase()) ||
      user.correo?.toLowerCase().includes(searchText.toLowerCase()) ||
      user.phone?.includes(searchText) ||
      user.telefono?.includes(searchText)
    );
  }, [searchText, activeFilter, allUsers, clients, vets]);

  const handleSearchChange = (text) => {
    setSearchText(text);
  };

  const handleRefresh = () => {
    handleGetClientes();
    handleGetVets();
  };

  const headerItem = {
    nombre: 'Historial de Usuarios'
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header 
        item={headerItem}
        gradientColors={['#fad1d7ff', '#ffacd1ff']}
      />

      <View style={{ flex: 1, backgroundColor: '#FAF3F9', paddingHorizontal: 20, paddingTop: 20 }}>
        <SearchBar 
          searchText={searchText}
          onSearchChange={handleSearchChange}
          placeholder="Buscar usuarios..."
        />
        <ClientList 
          clientes={filteredUsers}
          loading={loading}
          error={error}
          onRefresh={handleRefresh}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          filterOptions={[
            { key: 'all', label: 'Todos', count: allUsers.length },
            { key: 'client', label: 'Clientes', count: clients.length },
            { key: 'vet', label: 'Veterinarios', count: vets.length }
          ]}
        />
      </View>
    </SafeAreaView>
  );
};

export default ClientsScreen;