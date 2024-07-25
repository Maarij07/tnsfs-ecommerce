import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import db from '../lib/firebase';
import { Button } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { useLocalContext } from '../context/context';  // Import LocalContext hook

const ProductList = () => {
  const [favoriteItems, setFavoriteItems] = useState([]);
  const { addToCart } = useLocalContext();  // Get addToCart function from LocalContext

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      // Fetching all products from Firestore
      const querySnapshot = await getDocs(collection(db, 'products'));
      const products = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Separate the products into favorite items and "people also searched for" based on some criteria
      setFavoriteItems(products.slice(0, 5));
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleAddToCart = (product) => {
    // Add product details to the cart
    addToCart(product);
  };

  return (
    <div className='min-h-screen w-full py-8 bg-gray-50'>
      <div className='max-w-screen-xl mx-auto px-4'>
        {/* Favorite Items Section */}
        <section>
          <h2 className='text-3xl font-bold mb-8 text-center'>Popular Products</h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'>
            {favoriteItems.map((item) => (
              <div
                key={item.id}
                className='bg-white p-6 rounded-lg shadow-lg flex flex-col items-start transition-transform transform hover:scale-105'
              >
                <img
                  src={item.images[0]?.url}
                  alt={item.name}
                  className='w-full h-48 object-cover mb-4 rounded-lg'
                />
                <h3 className='text-xl font-semibold mb-2'>{item.name}</h3>
                <p className='text-gray-600 mb-2'>Category: {item.category}</p>
                <p className='text-gray-900 mb-4'>Price: Rs. {(parseFloat(item.price) || 0).toFixed(2)}</p>
                <Button 
                  type='primary'
                  icon={<ShoppingCartOutlined />}
                  onClick={() => handleAddToCart(item)}
                  className='mt-auto w-full'
                >
                  Add to Cart
                </Button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProductList;
