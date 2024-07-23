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
      <div className="w-full bg-white h-screen">
<div className='w-1/2 bg-white '>



</div>
<div className="hidden md:flex w-full md:w-1/2 justify-center items-center">
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
