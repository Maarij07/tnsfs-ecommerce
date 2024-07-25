import React from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import img from '../assets/bg-blue.png';

const CategoriesShow = ({ categories }) => {
  const navigate = useNavigate();  // Initialize useNavigate

  const handleBrowseClick = () => {
    navigate('/products');  // Redirect to /products
  };

  return (
    <div 
      className='w-full bg-cover bg-center flex flex-col justify-center items-center p-12 min-h-screen h-[190vh] mb-10'
      style={{ backgroundImage: `url(${img})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <h1 className='text-white text-[4.5rem] font-bold font-sans mb-12'>Categories</h1>
      <div className='flex flex-wrap gap-8 justify-center'>
        {categories.length > 0 ? (
          categories.map((category) => (
            <div 
              key={category.id} 
              className='bg-white p-6 rounded-2xl shadow-lg w-64 text-center transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl relative'
            >
              <h2 className='text-gray-800 text-xl font-bold mb-4'>{category.name}</h2>
              <button 
                onClick={handleBrowseClick}  // Add onClick event
                className='bg-blue-600 hover:bg-blue-800 text-white px-4 py-2 rounded-full font-semibold transition-colors duration-300'
              >
                Browse
              </button>
            </div>
          ))
        ) : (
          <p className='text-white'>No categories available.</p>
        )}
      </div>
    </div>
  );
};

export default CategoriesShow;
