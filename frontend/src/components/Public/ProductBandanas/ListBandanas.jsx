import React from "react";
import { View, Text, StyleSheet, FlatList, useWindowDimensions } from "react-native";
import ProductCard from "../PublicCardProduct/ProductCardPublic.jsx";

const ListBandanas = ({ Bandanas, navigation }) => {
  const { width } = useWindowDimensions();

  // Calcula el ancho de cada card dinámicamente
  const cardWidth = (width - 40) / 2; // 40 = padding lateral total + separación

  const renderBandanaItem = ({ item }) => (
    <View style={[styles.cardWrapper, { width: cardWidth }]}>
      <ProductCard key={item._id} product={item} navigation={navigation} />
    </View>
  );

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
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.productGrid}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  productGrid: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 15,
  },
  cardWrapper: {
    borderRadius: 10,
    overflow: "hidden",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  noBandanasText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    marginTop: 20,
  },
});

export default ListBandanas;
