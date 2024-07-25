import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import ProductList from './ProductList';
import CategoriesShow from './CategoriesShow';
import Footer from '../components/Footer';
import img1 from '../assets/topProduct.png';
import db from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import logo from '../assets/left.png';

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
      <div className="w-full bg-gray-50 min-h-screen flex sm:pt-10 flex-col">
        <div className="flex flex-col md:flex-row justify-center items-center py-12 bg-white">
          <div className="w-full md:w-1/2 flex justify-center items-center px-4 md:px-8">
            <div className="max-w-md text-center md:text-left">
              <h2 className="text-4xl md:text-5xl font-bold font-serif my-2">Find Everything You</h2>
              <h2 className="text-4xl md:text-5xl font-bold font-serif my-2">Need in One Place</h2>
              <p className='my-4 text-gray-600'>Free shipping over orders over PKR 10,000</p>
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full transition duration-300">Explore Products</button>
            </div>
          </div>
          <div className="w-full md:w-1/2 flex justify-center items-center mt-8 md:mt-0">
            <img src={logo} alt="Logo" className="h-[50vh] md:h-[73vh] object-contain" />
          </div>
        </div>
        <ProductList />
        <CategoriesShow categories={categories} />
        <Footer />
      </div>
    </>
  );
};

export default Home;
