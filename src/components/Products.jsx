import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import db from '../lib/firebase';
import { Button } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import Navbar from './Navbar';
const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      // Fetching all products from Firestore
      const querySnapshot = await getDocs(collection(db, 'products'));
      const productsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  return (
    <>
      <Navbar/>
      <div className='w-full p-8'>
        <h1 className='text-3xl font-bold mb-6'>Products</h1>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {products.length > 0 ? (
            products.map((product) => (
              <div
                key={product.id}
                className='bg-white pb-2  flex flex-col items-start'
              >
                <img
                  src={product.images[0]?.url}
                  alt={product.name}
                  className='w-[300px] h-[200px] object-cover    '
                />
                <h3 className='text-2xl font-semibold ml-2 '>{product.name}</h3>
                <p className='text-gray-600 text-sm ml-2'>{product.category}</p>
                <p className='text-red-500 ml-2 '>Rs. {(parseFloat(product.price) || 0).toFixed(2)}</p>
                {/* <Button 
                type='primary'
                icon={<ShoppingCartOutlined />}
                // Placeholder for adding to cart functionality
              >
                Add to Cart
              </Button> */}
              </div>
            ))
          ) : (
            <p>No products available.</p>
          )}
        </div>
      </div>
    </>

  );
};

export default Products;
