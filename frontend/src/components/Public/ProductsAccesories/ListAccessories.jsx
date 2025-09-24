import React from "react";
import { View, Text, StyleSheet } from "react-native";
import ProductCard from "../PublicCardProduct/ProductCardPublic.jsx"; 

const ListAccessories = ({ accessories }) => {
  console.log("Accesorios que llegan al componente:", accessories);

  return (
    <View style={styles.productGrid}>
      {Array.isArray(accessories) && accessories.length > 0 ? (
        accessories.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))
      ) : (
        <Text style={styles.noAccessoriesText}>No hay accesorios disponibles</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  productGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10,
  },
  noAccessoriesText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
});

export default ListAccessories;