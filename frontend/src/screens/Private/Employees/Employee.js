import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const EmpleadosScreen = () => {
  const [searchText, setSearchText] = useState('');
  
  // Datos de ejemplo de empleados
  const [empleados] = useState([
    {
      id: 1,
      nombre: 'Monica Pérez',
      correo: 'monicaperez@gmail.com',
      telefono: '7897-2362',
      contratada: '12/03/2025',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b69d4dad?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 2,
      nombre: 'Monica Pérez',
      correo: 'monicaperez@gmail.com',
      telefono: '7897-2362',
      contratada: '12/03/2025',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b69d4dad?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 3,
      nombre: 'Monica Pérez',
      correo: 'monicaperez@gmail.com',
      telefono: '7897-2362',
      contratada: '12/03/2025',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b69d4dad?w=150&h=150&fit=crop&crop=face'
    }
  ]);

  const filteredEmpleados = empleados.filter(empleado =>
    empleado.nombre.toLowerCase().includes(searchText.toLowerCase()) ||
    empleado.correo.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderEmpleado = ({ item }) => (
    <View style={styles.empleadoCard}>
      <View style={styles.avatarContainer}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <View style={styles.empleadoInfo}>
          <Text style={styles.nombreEmpleado}>{item.nombre}</Text>
          <Text style={styles.rolEmpleado}>Empleado</Text>
        </View>
      </View>
      
      <View style={styles.detallesEmpleado}>
        <View style={styles.detalleRow}>
          <Text style={styles.detalleLabel}>Nombre:</Text>
          <Text style={styles.detalleValue}>{item.nombre}</Text>
        </View>
        <View style={styles.detalleRow}>
          <Text style={styles.detalleLabel}>Correo:</Text>
          <Text style={styles.detalleValue} numberOfLines={1}>{item.correo}</Text>
        </View>
        <View style={styles.detalleRow}>
          <Text style={styles.detalleLabel}>Teléfono:</Text>
          <Text style={styles.detalleValue}>{item.telefono}</Text>
        </View>
        <View style={styles.detalleRow}>
          <Text style={styles.detalleLabel}>Contratada:</Text>
          <Text style={styles.detalleValue}>{item.contratada}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Gradient Background */}
      <LinearGradient
        colors={['#E8F4FD', '#F0E8FF', '#FFF8E1']}
        style={styles.gradientBackground}
      >
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Empleados</Text>
          
          {/* Logo/Icon */}
          <View style={styles.logoContainer}>
            <LinearGradient
              colors={['#FFE082', '#FFF9C4']}
              style={styles.logoBackground}
            >
              <Image 
                source={require('../../../../assets/Employee/EmployeeHeader.png')}
                style={styles.logoImage}
                resizeMode="cover"
              />
            </LinearGradient>
          </View>
        </View>

        {/* Search and Add Section */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar..."
              value={searchText}
              onChangeText={setSearchText}
              placeholderTextColor="#999"
            />
            <TouchableOpacity style={styles.searchButton}>
              <Ionicons name="search" size={20} color="#666" />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add" size={18} color="white" />
            <Text style={styles.addButtonText}>Agregar</Text>
          </TouchableOpacity>
        </View>

        {/* Empleados List */}
        <FlatList
          data={filteredEmpleados}
          renderItem={renderEmpleado}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
  },
  menuButton: {
    marginRight: 15,
  },
  gradientBackground: {
    flex: 1,
    paddingHorizontal: 20,
  },
  titleSection: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 30,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoBackground: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoIcon: {
    alignItems: 'center',
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 15,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  searchButton: {
    padding: 5,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  listContainer: {
    paddingBottom: 20,
  },
  empleadoCard: {
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
  empleadoInfo: {
    flex: 1,
  },
  nombreEmpleado: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  rolEmpleado: {
    fontSize: 14,
    color: '#FF9800',
    fontWeight: '500',
  },
  detallesEmpleado: {
    gap: 8,
  },
  detalleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detalleLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    width: 80,
  },
  detalleValue: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
});

export default EmpleadosScreen;