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

      {/* Title Section with Gradient Background */}
      <View style={styles.titleSection}>
        <LinearGradient
          colors={['#DFEFF6', '#E8E9F9', '#F6EDFE']}
          style={styles.titleGradientBackground}
        >
          <Text style={styles.title}>Empleados</Text>
          
          {/* Logo/Icon */}
          <View style={styles.logoContainer}>
            <View style={styles.logoBackground}>
              <Image 
                source={require('../../../../assets/Employee/EmployeeHeader.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
          </View>
        </LinearGradient>
      </View>



        {/* Search and Add Section */}
        <View style={styles.contentContainer}>
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
      </View>
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
    paddingHorizontal: -10,
    paddingVertical: 15,
    backgroundColor: '#fff',
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
    fontFamily: 'BalooBhaijaan2_700Bold',
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
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoImage: {
    width: 100,
    height: 100,
  },
  contentContainer: {
    flex: 1,
    marginTop: 57,
    backgroundColor: '#FAF3F9',
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 30,
    gap: 15,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 25,
    paddingHorizontal: 10,
    paddingVertical: 2,
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
    backgroundColor: '#36A360',
    paddingHorizontal: 26,
    paddingVertical: 10,
    borderRadius: 15,
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