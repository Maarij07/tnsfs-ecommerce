import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import db from '../lib/firebase';
import { Button } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { useLocalContext } from '../context/context';  // Import LocalContext hook

const ProductList = () => {
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [peopleAlsoSearchedFor, setPeopleAlsoSearchedFor] = useState([]);
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
      setPeopleAlsoSearchedFor(products.slice(5, 10));
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleAddToCart = (product) => {
    // Add product details to the cart
    addToCart(product);
  };

  return (
    <div className='h-screen w-full p-8'>
      <div className='max-w-full px-10 space-y-16'>
        {/* Favorite Items Section */}
        <section>
          <h2 className='text-2xl font-bold mb-6'>Favorite Items</h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6'>
            {favoriteItems.map((item) => (
              <div
                key={item.id}
                className='bg-white p-4 rounded-lg shadow-md flex flex-col items-start'
              >
                <img
                  src={item.images[0]?.url}
                  alt={item.name}
                  className='w-full h-32 object-cover mb-4 rounded-lg'
                />
                <h3 className='text-lg font-semibold mb-1'>{item.name}</h3>
                <p className='text-gray-600 mb-1'>Category: {item.category}</p>
                <p className='text-gray-900 mb-2'>Price: Rs. {(parseFloat(item.price) || 0).toFixed(2)}</p>
                <Button 
                  type='primary'
                  icon={<ShoppingCartOutlined />}
                  onClick={() => handleAddToCart(item)}
                >
                  Add to Cart
                </Button>
              </div>
            ))}
          </div>
        </section>

        {/* People Also Searched For Section */}
        <section>
          <h2 className='text-2xl font-bold mb-6'>People Also Searched For</h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6'>
            {peopleAlsoSearchedFor.map((item) => (
              <div
                key={item.id}
                className='bg-white p-4 rounded-lg shadow-md flex flex-col items-start'
              >
                <img
                  src={item.images[0]?.url}
                  alt={item.name}
                  className='w-full h-32 object-cover mb-4 rounded-lg'
                />
                <h3 className='text-lg font-semibold mb-1'>{item.name}</h3>
                <p className='text-gray-600 mb-1'>Category: {item.category}</p>
                <p className='text-gray-900 mb-2'>Price: Rs. {(parseFloat(item.price) || 0).toFixed(2)}</p>
                <Button 
                  type='primary'
                  icon={<ShoppingCartOutlined />}
                  onClick={() => handleAddToCart(item)}
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
