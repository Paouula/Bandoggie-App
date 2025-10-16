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
import { API_FETCH_JSON } from '../../config';

const { width } = Dimensions.get('window');

export default function MainScreen({ navigation }) {
  const [holidays, setHolidays] = useState([]);
  const [isLoadingHolidays, setIsLoadingHolidays] = useState(true);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.openDrawer()} style={{ marginLeft: 15 }}>
          <Ionicons name="menu" size={24} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    fetchHolidaysFromAPI();
  }, []);

  // NUEVA FUNCIÓN SIMPLIFICADA
  const fetchHolidaysFromAPI = async () => {
    try {
      setIsLoadingHolidays(true);
      console.log('🚀 NUEVA CARGA: Solicitando /Holiday...');
      
      const response = await API_FETCH_JSON('Holiday');
      console.log('✅ Respuesta completa:', JSON.stringify(response, null, 2));

      if (!response || !Array.isArray(response)) {
        console.error('❌ La respuesta no es un array:', response);
        setHolidays([]);
        return;
      }

      console.log(`📦 ${response.length} festividades recibidas`);

      // Configuración visual de festividades
      const visualConfig = {
        'Navidad': { color: '#E63946', icon: 'gift', image: require('../../../assets/Home/Dog2.png') },
        ' Navidad': { color: '#E63946', icon: 'gift', image: require('../../../assets/Home/Dog2.png') },
        'Halloween': { color: '#FF9F43', icon: 'skull', image: require('../../../assets/Home/Dog.png') },
        'San Valentín': { color: '#FFB3D9', icon: 'heart', image: require('../../../assets/Home/Dog3.png') },
        'Días patrios': { color: '#4299E1', icon: 'flag', image: require('../../../assets/Home/Dog4.png') },
        'Cumpleaños': { color: '#ffdd00ff', icon: 'balloon', image: require('../../../assets/Home/Dog5.png') },
        'Año Nuevo': { color: '#9F7AEA', icon: 'star', image: require('../../../assets/Home/Dog6.png') },
      };

      const defaultColors = ['#E63946', '#FF9F43', '#FFB3D9', '#4299E1', '#9F7AEA', '#ffdd00ff'];
      const defaultImages = [
        require('../../../assets/Home/Dog.png'),
        require('../../../assets/Home/Dog2.png'),
        require('../../../assets/Home/Dog3.png'),
        require('../../../assets/Home/Dog4.png'),
        require('../../../assets/Home/Dog5.png'),
        require('../../../assets/Home/Dog6.png'),
      ];

      // Orden deseado de festividades
      const desiredOrder = ['Navidad', ' Navidad', 'Halloween', 'San Valentín', 'Días patrios', 'Cumpleaños', 'Año Nuevo'];

      const processed = response
        .filter(h => {
          const name = h.nameHoliday?.trim();
          const isValid = name && 
                         name !== 'Sin festividad' && 
                         name !== ' Sin festividad' &&
                         name !== 'Dia del Padre';
          if (!isValid) console.log(`🚫 Filtrando: "${name}"`);
          return isValid;
        })
        .sort((a, b) => {
          // Ordenar según el array desiredOrder
          const indexA = desiredOrder.indexOf(a.nameHoliday);
          const indexB = desiredOrder.indexOf(b.nameHoliday);
          
          // Si ambos están en el orden deseado, ordenar según su posición
          if (indexA !== -1 && indexB !== -1) {
            return indexA - indexB;
          }
          // Si solo uno está en el orden, ese va primero
          if (indexA !== -1) return -1;
          if (indexB !== -1) return 1;
          // Si ninguno está, mantener orden original
          return 0;
        })
        .map((h, idx) => {
          const name = h.nameHoliday.trim();
          const visual = visualConfig[name];
          
          const result = {
            id: h._id,
            title: name,
            color: visual?.color || defaultColors[idx % defaultColors.length],
            icon: visual?.icon || 'star',
            image: visual?.image || defaultImages[idx % defaultImages.length],
            screen: 'FestivitiesScreen',
            nameCategory: name,
            holidayCode: h._id,
          };
          
          console.log(`✨ Procesado: ${name} → Color: ${result.color}`);
          return result;
        });

      console.log(`🎉 RESULTADO FINAL: ${processed.length} festividades procesadas`);
      setHolidays(processed);

    } catch (error) {
      console.error('💥 ERROR CRÍTICO:', error);
      console.error('Stack:', error.stack);
      setHolidays([]);
    } finally {
      setIsLoadingHolidays(false);
      console.log('🏁 Proceso completado');
    }
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

  const handleFestivityPress = (festivity) => {
    console.log(`➡️ Navegando a ${festivity.title}`);
    
    try {
      navigation.navigate(festivity.screen, {
        festivityName: festivity.title,
        festivityId: festivity.id,
        festivityColor: festivity.color,
        nameCategory: festivity.nameCategory,
        holidayCode: festivity.holidayCode,
      });
    } catch (error) {
      console.error('❌ Error al navegar:', error);
      navigation.navigate('FestivitiesScreen');
    }
  };

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
            onPress={fetchHolidaysFromAPI}
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
              {category.image ? (
                <Image 
                  source={category.image} 
                  style={styles.seasonalImage}
                  resizeMode="contain"
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
      <View style={styles.headerSection}>
        <Text style={styles.mainTitle}>BANDOGGIE</Text>
        <Text style={styles.subtitle}>
          Lindas y personalizables{'\n'}bandanas para tus peludos.
        </Text>
        <TouchableOpacity style={styles.buyButton}>
          <Text style={styles.buyButtonText}>Comprar</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Categorías</Text>

      {categories.map((category, index) => (
        <TouchableOpacity
          key={category.id}
          style={[styles.categoryCard, { marginBottom: 20 }]}
          onPress={() => {
            const route = getNavigationRoute(category.title);
            navigation.navigate(route);
          }}
        >
          <View style={[styles.categoryContent, { backgroundColor: category.color }]}>
            <View style={styles.categoryTextContainer}>
              <Text style={styles.categoryTitle}>{category.title}</Text>
              <Text style={styles.categoryDescription}>{category.description}</Text>
              <TouchableOpacity 
                style={styles.seeMoreButton}
                onPress={(e) => {
                  e.stopPropagation();
                  const route = getNavigationRoute(category.title);
                  navigation.navigate(route);
                }}
              >
                <Text style={styles.seeMoreText}>Ver más</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.categoryImageContainer}>
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

      <View style={styles.festivitiesHeader}>
        <Text style={styles.sectionTitle}>Festividades</Text>
      </View>

      {renderHolidaysContent()}

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
    fontSize: 37,
    color: '#2C5282',
    marginBottom: -9,
    fontFamily: 'BalooBhaijaan2_700Bold',
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
    fontFamily: 'BalooBhaijaan2_700Bold',
    color: '#2D3748',
    marginBottom: 0,
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