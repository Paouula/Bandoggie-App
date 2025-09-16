import React from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import ProductCard from './ProductCard';

const ProductList = ({ filteredProducts }) => (
  <View style={styles.productsContainer}>
    <FlatList
      data={filteredProducts}
      renderItem={({ item }) => <ProductCard item={item} />}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.flatListContent}
      showsVerticalScrollIndicator={false}
    />
  </View>
);

const styles = StyleSheet.create({
  productsContainer: {
    backgroundColor: '#ffe6f0',
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  flatListContent: {
    paddingBottom: 20,
  },
});

export default ProductList;
