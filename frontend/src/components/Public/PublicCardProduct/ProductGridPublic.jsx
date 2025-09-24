import React from 'react';
import ProductCard from './ProductCardPublic.jsx';
import Pagination from '../../Pagination.jsx';

const ProductGrid = ({ products }) => {
  return (
    <>
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      <Pagination />
    </>
  );
};

export default ProductGrid;