import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Image 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import SearchBar from '../../../components/Private/SearchBar';  // Asegúrate de importar el SearchBar aquí

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
      nombre: 'Juan Rodríguez',
      correo: 'juanrodriguez@gmail.com',
      telefono: '7897-2362',
      contratada: '11/02/2024',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b69d4dad?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 3,
      nombre: 'Ana Gómez',
      correo: 'anagomez@gmail.com',
      telefono: '7897-2362',
      contratada: '10/01/2023',
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
      
      {/* Scrollable container for everything */}
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
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
            {/* Usamos el SearchBar de ProductosScreen aquí */}
            <SearchBar 
              searchText={searchText} 
              setSearchText={setSearchText}
              handleAgregarProducto={() => console.log('Agregar Empleado')}
            />
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
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginTop: 20,
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
    marginTop: 50,
    backgroundColor: '#FAF3F9',
  },
  searchSection: {
    marginTop: -30,
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
