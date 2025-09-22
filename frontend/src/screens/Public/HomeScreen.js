import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useFetchHolidays from '../../hooks/Holidays/useFetchHolidays'; 

const { width } = Dimensions.get('window');

export default function MainScreen({ navigation }) {
  // Estados para manejar las festividades
  const [holidays, setHolidays] = useState([]);
  const [isLoadingHolidays, setIsLoadingHolidays] = useState(true);
  
  // Hook personalizado para las festividades
  const { handleGetHolidays } = useFetchHolidays();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.openDrawer()} style={{ marginLeft: 15 }}>
          <Ionicons name="menu" size={24} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  // Cargar festividades
  useEffect(() => {
    loadHolidays();
  }, []);

  const loadHolidays = async () => {
    try {
      setIsLoadingHolidays(true);
      const data = await handleGetHolidays();
      
      if (data && Array.isArray(data)) {
        const mappedHolidays = data.map((holiday, index) => ({
          id: holiday._id || holiday.id || index + 1,
          title: holiday.nameHoliday || 'Sin nombre',
          color: getDefaultColor(index),
          icon: getIconForHoliday(holiday.nameCategory),
          image: getDefaultImage(index), // Imagen por defecto porque en la base no hay imagenes :(
          screen: 'FestivitiesScreen',
          nameCategory: holiday.nameCategory,
        }));
        
        setHolidays(mappedHolidays);
      } else {
        console.warn('No se recibieron festividades válidas:', data);
        setHolidays([]);
      }
    } catch (error) {
      console.error('Error al cargar festividades:', error);
      setHolidays([]);
    } finally {
      setIsLoadingHolidays(false);
    }
  };

  // Función para obtener colores
  const getDefaultColor = (index) => {
    const colors = ['#FF6B6B', '#FF9F43', '#FFB3D9', '#4299E1', '#9F7AEA', '#F6AD55'];
    return colors[index % colors.length];
  };

  // Función para obtener íconos basados en el nombre de la festividad
  const getIconForHoliday = (name) => {
    if (!name) return 'star';
    
    const lowercaseName = name.toLowerCase();
    
    if (lowercaseName.includes('navidad') || lowercaseName.includes('christmas')) return 'gift';
    if (lowercaseName.includes('halloween')) return 'skull';
    if (lowercaseName.includes('valentín') || lowercaseName.includes('valentine')) return 'heart';
    if (lowercaseName.includes('patrios') || lowercaseName.includes('independencia')) return 'flag';
    if (lowercaseName.includes('año nuevo') || lowercaseName.includes('new year')) return 'star';
    if (lowercaseName.includes('cumpleaños') || lowercaseName.includes('birthday')) return 'balloon';
    if (lowercaseName.includes('pascua') || lowercaseName.includes('easter')) return 'flower';
    if (lowercaseName.includes('madre') || lowercaseName.includes('mother')) return 'heart';
    if (lowercaseName.includes('padre') || lowercaseName.includes('father')) return 'person';
    
    return 'star'; // ícono por defecto
  };

  // Función para obtener imágenes por defecto si no hay imagen en la BD
  const getDefaultImage = (index) => {
    const images = [
      require('../../../assets/Home/Dog.png'),
      require('../../../assets/Home/Dog2.png'),
      require('../../../assets/Home/Dog3.png'),
      require('../../../assets/Home/Dog4.png'),
      require('../../../assets/Home/Dog5.png'),
      require('../../../assets/Home/Dog6.png'),
    ];
    return images[index % images.length];
  };

  const categories = [
    {
      id: 1,
      title: 'Bandanas',
      description: 'Lindas y personalizables bandanas para tus peludos.',
      color: '#FFE066',
      gradient: ['#FFE066', '#B3D9FF'],
      image: require('../../../assets/Home/Bandandas.png'),
    },
    {
      id: 2,
      title: 'Collares',
      description: 'Collares de varios diseños para tus mascotas.',
      color: '#FFB3D9',
      gradient: ['#FFB3D9', '#4A5568'],
      image: require('../../../assets/Home/Collar.png'),
    },
    {
      id: 3,
      title: 'Accesorios',
      description: 'Accesorios para destacar la lindura de tus animalitos.',
      color: '#FFD4A3',
      gradient: ['#FFD4A3', '#FFFFFF'],
     image: require('../../../assets/Home/Accesorios.png'),
    },
  ];

  // Función para determinar la pantalla a navegar para categorías principales
  const getNavigationRoute = (title) => {
    switch(title) {
      case 'Bandanas':
        return 'Bandanas';
      case 'Collares':
        return 'Collares';
      case 'Accesorios':
        return 'Accesorios';
      default:
        return 'BottomTabs';
    }
  };

  // Función para manejar la navegación de festividades
  const handleFestivityPress = (festivity) => {
    console.log(`Navegando a ${festivity.screen} para ${festivity.title}`);
    
    try {
      // Navegar a la pantalla de festividades con parámetros
      navigation.navigate(festivity.screen, {
        festivityName: festivity.title,
        festivityId: festivity.id,
        festivityColor: festivity.color,
        nameCategory: festivity.nameCategory, // Campo original de la BD
      });
    } catch (error) {
      console.error('Error al navegar:', error);
      navigation.navigate('FestivitiesScreen');
    }
  };

  // Función para renderizar el contenido de festividades
  const renderHolidaysContent = () => {
    if (isLoadingHolidays) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF9F43" />
          <Text style={styles.loadingText}>Cargando festividades...</Text>
        </View>
      );
    }

    if (holidays.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons name="calendar-outline" size={50} color="#999" />
          <Text style={styles.emptyText}>No hay festividades disponibles</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={loadHolidays}
          >
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.seasonalScrollContainer}
        style={styles.seasonalScrollView}
      >
        {holidays.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[styles.seasonalCard, { backgroundColor: category.color }]}
            onPress={() => handleFestivityPress(category)}
            activeOpacity={0.8}
          >
            <View style={styles.seasonalImageContainer}>
              {/* Imagen de festividad o ícono de respaldo */}
              {category.image ? (
                <Image 
                  source={category.image} 
                  style={styles.seasonalImage}
                  resizeMode="contain"
                  onError={() => {
                    // Si hay error al cargar la imagen de la BD, usar imagen por defecto
                    console.warn(`Error al cargar imagen para ${category.title}`);
                  }}
                />
              ) : (
                <View style={styles.seasonalImagePlaceholder}>
                  <Ionicons name={category.icon} size={35} color="white" />
                </View>
              )}
            </View>
            <Text style={styles.seasonalTitle} numberOfLines={2}>
              {category.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Section */}
      <View style={styles.headerSection}>
        <Text style={styles.mainTitle}>BANDOGGIE</Text>
        <Text style={styles.subtitle}>
          Lindas y personalizables{'\n'}bandanas para tus peludos.
        </Text>
        <TouchableOpacity style={styles.buyButton}>
          <Text style={styles.buyButtonText}>Comprar</Text>
        </TouchableOpacity>
      </View>

      {/* Categories Section */}
      <Text style={styles.sectionTitle}>Categorías</Text>

      {/* Main Categories */}
      {categories.map((category, index) => (
        <TouchableOpacity
          key={category.id}
          style={[styles.categoryCard, { marginBottom: 20 }]}
          onPress={() => {
            // Navegar cuando se toca toda la card
            const route = getNavigationRoute(category.title);
            navigation.navigate(route);
            console.log(`Navigating to ${route} from card`);
          }}
        >
          <View style={[styles.categoryContent, { backgroundColor: category.color }]}>
            <View style={styles.categoryTextContainer}>
              <Text style={styles.categoryTitle}>{category.title}</Text>
              <Text style={styles.categoryDescription}>{category.description}</Text>
              <TouchableOpacity 
                style={styles.seeMoreButton}
                onPress={(e) => {
                  // Evitar que se propague el evento al TouchableOpacity padre
                  e.stopPropagation();
                  const route = getNavigationRoute(category.title);
                  navigation.navigate(route);
                  console.log(`Navigating to ${route} from Ver más button`);
                }}
              >
                <Text style={styles.seeMoreText}>Ver más</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.categoryImageContainer}>
              {/* Imagen del perro o placeholder */}
              {category.image ? (
                <Image 
                  source={category.image} 
                  style={styles.categoryImage}
                  resizeMode="contain"
                />
              ) : (
                <View style={styles.dogPlaceholder}>
                  <Ionicons name="paw" size={40} color="#666" />
                </View>
              )}
            </View>
          </View>
        </TouchableOpacity>
      ))}

      {/* Seasonal Categories */}
      <View style={styles.festivitiesHeader}>
        <Text style={styles.sectionTitle}>Festividades</Text>
      </View>

      {/* Render holidays content */}
      {renderHolidaysContent()}

      {/* Espacio adicional al final */}
      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerSection: {
    backgroundColor: '#B3D9FF',
    padding: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 30,
    alignItems: 'center',
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2C5282',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#4A5568',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  buyButton: {
    backgroundColor: '#FF9F43',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  buyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 20,
    marginLeft: 20,
  },
  festivitiesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 0,
    paddingRight: 20,
  },
  refreshButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  categoryCard: {
    marginHorizontal: 20,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    height: 180,
  },
  categoryContent: {
    flexDirection: 'row',
    padding: 20,
    flex: 1,
  },
  categoryTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  categoryTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 5,
  },
  categoryDescription: {
    fontSize: 14,
    color: '#4A5568',
    marginBottom: 15,
    lineHeight: 18,
  },
  seeMoreButton: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  seeMoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3748',
  },
  categoryImageContainer: {
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryImage: {
    width: 160,
    height: 160,
    borderRadius: 5,
  },
  dogPlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  seasonalScrollView: {
    marginBottom: 30,
  },
  seasonalScrollContainer: {
    paddingHorizontal: 20,
    paddingRight: 40,
  },
  seasonalCard: {
    width: 120,
    height: 150,
    borderRadius: 15,
    padding: 15,
    marginRight: 15,
    justifyContent: 'space-between',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  seasonalImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  seasonalImage: {
    width: 80,
    height: 80,
    borderRadius: 20,
  },
  seasonalImagePlaceholder: {
    width: 50,
    height: 50,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  seasonalTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  // Nuevos estilos para estados de carga y error
  loadingContainer: {
    alignItems: 'center',
    padding: 40,
    marginHorizontal: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
    marginHorizontal: 20,
  },
  emptyText: {
    marginTop: 15,
    marginBottom: 20,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#FF9F43',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});