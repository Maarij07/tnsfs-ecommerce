import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import ProductList from './ProductList';
import CategoriesShow from './CategoriesShow';
import Footer from '../components/Footer'
import img1 from '../assets/topProduct.png';
import db from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

const Home = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch categories from Firestore
    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'categories'));
        const categoriesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
        }));
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center sm:px-16 h-screen bg-white">
        <div className="w-1/2 relative bottom-16">
          <img src={img1} alt="Top Product" className="h-[78vh] transform transition-transform duration-300 hover:scale-110" />
          <h2 className="text-2xl font-bold my-2">Recent Categories</h2>
          <div className="w-full p-2">
            <ul className='flex flex-wrap gap-2 items-center'>
              {categories.length > 0 ? (
                categories.map((category) => (
                  <li key={category.id} className="mb-2 px-4 py-2 bg-[#3563E9] text-white rounded-full">
                    {category.name}
                  </li>
                ))
              ) : (
                <p>No categories available.</p>
              )}
            </ul>
          </div>
        </div>
        <div className="w-full sm:w-1/2 flex items-center justify-center">
          ji
        </div>
      </div>
      <ProductList/>
      <CategoriesShow categories={categories}/>
      <Footer/>
    </>
  );
};

export default Home;
