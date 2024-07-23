import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import ProductList from './ProductList';
import CategoriesShow from './CategoriesShow';
import Footer from '../components/Footer'
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
      <div className="w-full bg-white h-screen flex">
        <div className="w-1/2 bg-white flex justify-center items-center">
          <div className="max-w-md">
            <h2 className="text-4xl font-bold font-serif my-2">Find Everything You </h2>
            <h2 className="text-4xl font-bold font-serif my-2">Need in One Place</h2>
            <p className='my-3'>Free shipping over orders over PKR 10,000</p>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">Explore Products</button>
          </div>
        </div>
        <div className="hidden md:flex w-1/2 justify-center items-center">
          <img src={logo} alt="Logo" className="h-[50vh] md:h-[73vh] object-contain" />
        </div>
      </div>
      <ProductList/>
      <CategoriesShow categories={categories}/>
      <Footer/>
    </>
  );
};

export default Home;