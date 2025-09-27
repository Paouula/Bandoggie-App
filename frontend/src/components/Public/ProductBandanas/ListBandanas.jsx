import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import ProductCard from "../PublicCardProduct/ProductCardPublic.jsx";

const ListBandanas = ({ Bandanas, navigation }) => {
  console.log("Bandanas que llegan al componente:", Bandanas);

  // Función para renderizar cada item
  const renderBandanaItem = ({ item }) => (
    <ProductCard 
      key={item._id} 
      product={item} 
      navigation={navigation}
    />
  );

  // Si no hay bandanas se  mostruestra este mensaje
  if (!Array.isArray(Bandanas) || Bandanas.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.noBandanasText}>No hay bandanas disponibles</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={Bandanas}
        renderItem={renderBandanaItem}
        keyExtractor={(item) => item._id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.productGrid}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  productGrid: {
    padding: 10,
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  separator: {
    height: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  noBandanasText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
});

export default ListBandanas;