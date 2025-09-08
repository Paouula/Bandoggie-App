import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import ClientCard from './ClientCard';

const ClientList = ({ clientes }) => {
  const renderCliente = ({ item }) => (
    <ClientCard cliente={item} />
  );

  return (
    <FlatList
      data={clientes}
      renderItem={renderCliente}
      keyExtractor={(item) => item.id.toString()}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: 20,
  },
});

export default ClientList;