import React from 'react';
import img from '../assets/bg-blue.png';

const CategoriesShow = ({ categories }) => {
  return (
    <div 
      className='w-full bg-cover bg-center flex flex-col justify-center items-center p-12 min-h-screen h-[190vh] mb-10'
      style={{ backgroundImage: `url(${img})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <h1 className='text-white text-[4.5rem] relative bottom-10 font-bold font-sans my-8'>Categories</h1>
      <div className='flex flex-wrap gap-8 justify-center'>
        {categories.length > 0 ? (
          categories.map((category) => (
            <div 
              key={category.id} 
              className='bg-white p-6 rounded-3xl shadow-lg w-64 text-center'
            >
              <h2 className='text-xl font-bold mb-4'>{category.name}</h2>
              <button className='bg-[#1553ff] text-white px-4 py-2 rounded-full'>Browse</button>
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
