// components/Public/Products/ListAccesories.jsx
import React from "react";
import ProductCard from "../PublicCardProduct/ProductCardPublic.jsx"; 

const ListAccessories = ({ Accessories }) => {
  console.log("Accesorios que llegan al componente:", Accessories);

  return (
    <div className="product-grid">
        {Array.isArray(Accessories) && Accessories.length > 0 ? (
            Accessories.map((product) => (
            <ProductCard key={product._id} product={product} />
            ))
        ) : (
            <p>No hay accesorios disponibles</p>
        )}
        </div>

  );
};

export default ListAccessories;
