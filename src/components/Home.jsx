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
      <div className="w-full bg-gray-50 min-h-screen flex flex-col pt-16 md:pt-10">
        <div className="flex flex-col md:flex-row justify-center items-center py-8 md:py-12 bg-white">
          <div className="w-full md:w-1/2 flex justify-center items-center px-4 md:px-8">
            <div className="max-w-md text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold font-serif my-2">Find Everything You</h2>
              <h2 className="text-3xl md:text-4xl font-bold font-serif my-2">Need in One Place</h2>
              <p className='my-4 text-gray-600'>Free shipping on orders over PKR 10,000</p>
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full transition duration-300">Explore Products</button>
            </div>
          </div>
          <div className="w-full md:w-1/2 justify-center items-center mt-8 md:mt-0 hidden md:flex">
            <img src={logo} alt="Logo" className="h-[40vh] md:h-[60vh] object-contain" />
          </div>
        </div>
        <div className="py-4 md:py-0">
          <ProductList />
        </div>
        <div className="py-4 md:py-0">
          <CategoriesShow categories={categories} />
        </div>
        <div className="py-4 md:py-0">
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Home;
