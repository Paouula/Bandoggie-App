import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function MainScreen({ navigation }) {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.openDrawer()} style={{ marginLeft: 15 }}>
          <Ionicons name="menu" size={24} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

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

  const seasonalCategories = [
    {
      id: 1,
      title: 'Navidad',
      color: '#FF6B6B',
      icon: 'gift',
      image: require('../../../assets/Home/Dog.png'),
    },
    {
      id: 2,
      title: 'Halloween',
      color: '#FF9F43',
      icon: 'skull',
      image: require('../../../assets/Home/Dog2.png'),
    },
    {
      id: 3,
      title: 'San Valentín',
      color: '#FFB3D9',
      icon: 'heart',
       image: require('../../../assets/Home/Dog3.png'),
    },
    {
      id: 4,
      title: 'Días Patrios',
      color: '#4299E1',
      icon: 'flag',
      image: require('../../../assets/Home/Dog4.png'),
    },
    {
      id: 5,
      title: 'Año Nuevo',
      color: '#9F7AEA',
      icon: 'star',
       image: require('../../../assets/Home/Dog6.png'),
    },
    {
      id: 6,
      title: 'Cumpleaños',
      color: '#F6AD55',
      icon: 'balloon',
      image: require('../../../assets/Home/Dog5.png'),
    },
  ];

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
            // Aquí puedes navegar a la categoría específica
            console.log(`Navigating to ${category.title}`);
          }}
        >
          <View style={[styles.categoryContent, { backgroundColor: category.color }]}>
            <View style={styles.categoryTextContainer}>
              <Text style={styles.categoryTitle}>{category.title}</Text>
              <Text style={styles.categoryDescription}>{category.description}</Text>
              <TouchableOpacity style={styles.seeMoreButton}>
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
      <Text style={styles.sectionTitle}>Festividades</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.seasonalScrollContainer}
        style={styles.seasonalScrollView}
      >
        {seasonalCategories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[styles.seasonalCard, { backgroundColor: category.color }]}
            onPress={() => {
              console.log(`Navigating to ${category.title}`);
            }}
          >
            <View style={styles.seasonalImageContainer}>
              {/* Imagen de festividad o ícono de respaldo */}
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
            <Text style={styles.seasonalTitle}>{category.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

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
  categoryCard: {
    marginHorizontal: 20,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Altura ajustable - cambia este valor según necesites
    height: 180, // Puedes modificar esta altura
  },
  categoryContent: {
    flexDirection: 'row',
    padding: 20,
    flex: 1, // Cambiado de minHeight a flex para usar toda la altura
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
    // Altura ajustable - cambia este valor según necesites
    height: 150, // Puedes modificar esta altura
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
});