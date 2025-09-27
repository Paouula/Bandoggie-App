import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const ClientCard = ({ cliente }) => {
  return (
    <View style={styles.clienteCard}>
      <View style={styles.avatarContainer}>
        <Image source={{ uri: cliente.avatar }} style={styles.avatar} />
        <View style={styles.clienteInfo}>
          <Text style={styles.nombreCliente}>{cliente.nombre}</Text>
          <Text style={styles.rolCliente}>Cliente</Text>
        </View>
      </View>
      
      <View style={styles.detallesCliente}>
        <View style={styles.detalleRow}>
          <Text style={styles.detalleLabel}>Nombre:</Text>
          <Text style={styles.detalleValue}>{cliente.nombre}</Text>
        </View>
        <View style={styles.detalleRow}>
          <Text style={styles.detalleLabel}>Correo:</Text>
          <Text style={styles.detalleValue} numberOfLines={1}>{cliente.correo}</Text>
        </View>
        <View style={styles.detalleRow}>
          <Text style={styles.detalleLabel}>Teléfono:</Text>
          <Text style={styles.detalleValue}>{cliente.telefono}</Text>
        </View>
        <View style={styles.detalleRow}>
          <Text style={styles.detalleLabel}>Registrado:</Text>
          <Text style={styles.detalleValue}>{cliente.registrado}</Text>
        </View>
        <View style={styles.detalleRow}>
          <Text style={styles.detalleLabel}>Dirección:</Text>
          <Text style={styles.detalleValue} numberOfLines={2}>{cliente.direccion}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  clienteCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  clienteInfo: {
    flex: 1,
  },
  nombreCliente: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  rolCliente: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: '500',
  },
  detallesCliente: {
    gap: 8,
  },
  detalleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 2,
  },
  detalleLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    width: 85,
  },
  detalleValue: {
    fontSize: 14,
    color: '#666',
    flex: 1,
    lineHeight: 18,
  },
});

export default ClientCard;