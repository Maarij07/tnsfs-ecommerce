import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc } from 'firebase/firestore';
import { FaGem, FaPlusCircle, FaQuestionCircle, FaTrash, FaTshirt } from 'react-icons/fa';
import db from '../lib/firebase'; // adjust the import path as needed

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'categories'));
      const categoriesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCategories(categoriesList);
    } catch (error) {
      console.error('Error fetching categories: ', error);
    }
  };

  const handleAddCategory = async () => {
    try {
      const docRef = await addDoc(collection(db, 'categories'), {
        name: newCategoryName,
      });
      const newCategory = { id: docRef.id, name: newCategoryName };
      setCategories([...categories, newCategory]);
      setNewCategoryName('');
    } catch (error) {
      console.error('Error adding category: ', error);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      await deleteDoc(doc(db, 'categories', categoryId));
      setCategories(categories.filter(category => category.id !== categoryId));
    } catch (error) {
      console.error('Error deleting category: ', error);
    }
  };

  const getCategoryIcon = (categoryName) => {
    // Example mapping of category names to corresponding icons
    const iconMap = {
      'artificial jewellery': <FaGem />,
      'southern clothing': <FaTshirt />,
      // Add more mappings as needed
    };
    // Default icon if no match is found
    return iconMap[categoryName.toLowerCase()] || <FaQuestionCircle />;
  };

  return (
    <div>
      <h2 className="text-2xl mb-4">Categories</h2>
      <div className="flex items-center mb-4">
        <button
          onClick={handleAddCategory}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center"
        >
          <FaPlusCircle className="mr-2" />
          Add Category
        </button>
        <input
          type="text"
          className="ml-4 border border-gray-300 px-3 py-2 rounded-lg"
          placeholder="Enter category name"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
        />
      </div>
      <div>
        {categories.map(category => (
          <div key={category.id} className="bg-white shadow-md rounded-lg p-4 mb-2 flex justify-between items-center">
            <div className="flex items-center">
              {getCategoryIcon(category.name)}
              <span className="ml-2">{category.name}</span>
            </div>
            <button
              onClick={() => handleDeleteCategory(category.id)}
              className="text-red-500 hover:text-red-700"
            >
              <FaTrash />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCategories;
