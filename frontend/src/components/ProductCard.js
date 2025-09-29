import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

// Card principal reutilizable
export const ProductCard = ({ product, onPress, style, showFullWidth = false }) => (
  <TouchableOpacity
    style={[
      showFullWidth ? styles.fullWidthCard : styles.compactCard,
      style
    ]}
    onPress={() => onPress(product)}
    activeOpacity={0.8}
  >
    <View style={styles.imageContainer}>
      <Image
        source={{ uri: product.image }}
        style={showFullWidth ? styles.fullWidthImage : styles.compactImage}
        resizeMode="cover"
      />
    </View>
    
    <View style={styles.productInfo}>
      <Text 
        style={[
          styles.productName,
          showFullWidth ? styles.fullWidthName : styles.compactName
        ]} 
        numberOfLines={2}
      >
        {product.nameProduct}
      </Text>
      <Text style={[
        styles.productPrice,
        showFullWidth ? styles.fullWidthPrice : styles.compactPrice
      ]}>
        Desde ${product.price ? Number(product.price).toFixed(2) : '0.00'}
      </Text>
    </View>
  </TouchableOpacity>
);

// Card vertical como en la segunda imagen
export const VerticalProductCard = ({ product, onPress }) => (
  <View style={styles.verticalCardContainer}>
    <TouchableOpacity
      style={styles.verticalCard}
      onPress={() => onPress(product)}
      activeOpacity={0.8}
    >
      <View style={styles.verticalImageContainer}>
        <Image
          source={{ uri: product.image }}
          style={styles.verticalImage}
          resizeMode="cover"
        />
      </View>
      <View style={styles.verticalInfo}>
        <Text style={styles.verticalName} numberOfLines={2}>
          {product.nameProduct}
        </Text>
        <Text style={styles.verticalPrice}>
          Desde ${product.price ? Number(product.price).toFixed(2) : '0.00'}
        </Text>
      </View>
    </TouchableOpacity>
  </View>
);

// Card para productos relacionados (más pequeña)
export const RelatedProductCard = ({ product, onPress }) => (
  <TouchableOpacity style={styles.relatedCard} onPress={() => onPress(product)}>
    <View style={styles.relatedImageContainer}>
      <Image 
        source={{ uri: product.image }}
        style={styles.relatedImage}
        resizeMode="cover"
      />
    </View>
    <View style={styles.relatedInfo}>
      <Text style={styles.relatedName} numberOfLines={2}>
        {product.nameProduct}
      </Text>
      <Text style={styles.relatedPrice}>
        Desde ${product.price ? Number(product.price).toFixed(2) : '0.00'}
      </Text>
    </View>
  </TouchableOpacity>
);

// Card para lista horizontal (carrusel)
export const HorizontalProductCard = ({ product, onPress }) => (
  <TouchableOpacity style={styles.horizontalCard} onPress={() => onPress(product)}>
    <View style={styles.horizontalImageContainer}>
      <Image
        source={{ uri: product.image }}
        style={styles.horizontalImage}
        resizeMode="cover"
      />
    </View>
    <View style={styles.horizontalInfo}>
      <Text style={styles.horizontalName} numberOfLines={2}>
        {product.nameProduct}
      </Text>
      <Text style={styles.horizontalPrice}>
        Desde ${product.price ? Number(product.price).toFixed(2) : '0.00'}
      </Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  // Estilos para card compacta (grid 2 columnas)
  compactCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    marginBottom: 15,
    width: (width - 45) / 2,
  },
  compactImage: {
    width: '100%',
    height: 120,
  },
  compactName: {
    fontSize: 13,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
    lineHeight: 16,
  },
  compactPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },

  // Estilos para card ancha (lista completa)
  fullWidthCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 15,
  },
  fullWidthImage: {
    width: '100%',
    height: 200,
  },
  fullWidthName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    lineHeight: 20,
  },
  fullWidthPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },

  // Estilos para card vertical (como en las imágenes)
  verticalCardContainer: {
    width: (width - 60) / 2,
    marginBottom: 20,
  },
  verticalCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  verticalImageContainer: {
    overflow: 'hidden',
  },
  verticalImage: {
    width: '100%',
    height: 120,
  },
  verticalInfo: {
    padding: 12,
    alignItems: 'center',
  },
  verticalName: {
    fontSize: 13,
    fontWeight: '500',
    color: '#333',
    marginBottom: 6,
    lineHeight: 16,
    textAlign: 'center',
  },
  verticalPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },

  // Estilos para productos relacionados
  relatedCard: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    overflow: 'hidden',
    marginHorizontal: 5,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  relatedImageContainer: {
    overflow: 'hidden',
  },
  relatedImage: {
    width: '100%',
    height: 100,
  },
  relatedInfo: {
    padding: 10,
    alignItems: 'center',
  },
  relatedName: {
    fontSize: 12,
    color: '#333',
    marginBottom: 4,
    fontWeight: '500',
    textAlign: 'center',
  },
  relatedPrice: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
    textAlign: 'center',
  },

  // Estilos para card horizontal (carrusel)
  horizontalCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    marginRight: 15,
    width: 140,
  },
  horizontalImageContainer: {
    overflow: 'hidden',
  },
  horizontalImage: {
    width: 140,
    height: 110,
  },
  horizontalInfo: {
    padding: 10,
    alignItems: 'center',
  },
  horizontalName: {
    fontSize: 12,
    color: '#333',
    marginBottom: 4,
    fontWeight: '500',
    textAlign: 'center',
  },
  horizontalPrice: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
    textAlign: 'center',
  },

  // Estilos comunes
  imageContainer: {
    overflow: 'hidden',
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    color: '#333',
  },
  productPrice: {
    color: '#333',
  },
});

export default ProductCard;