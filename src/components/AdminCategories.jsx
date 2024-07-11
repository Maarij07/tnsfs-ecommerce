import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, updateDoc, doc } from 'firebase/firestore';
import { FaGem, FaPlusCircle, FaQuestionCircle, FaTshirt, FaChevronDown, FaChevronUp, FaTrash } from 'react-icons/fa';
import db from '../lib/firebase'; // adjust the import path as needed

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newSubcategoryNames, setNewSubcategoryNames] = useState({});
  const [accordionOpen, setAccordionOpen] = useState({});

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'categories'));
      const categoriesList = querySnapshot.docs.map(doc => ({ id: doc.id, subcategories: [], ...doc.data() }));
      setCategories(categoriesList);
    } catch (error) {
      console.error('Error fetching categories: ', error);
    }
  };

  const handleAddCategory = async () => {
    try {
      const docRef = await addDoc(collection(db, 'categories'), {
        name: newCategoryName,
        subcategories: []
      });
      const newCategory = { id: docRef.id, name: newCategoryName, subcategories: [] };
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

  const handleAddSubcategory = async (categoryId) => {
    try {
      const subcategoryName = newSubcategoryNames[categoryId] || '';
      if (!subcategoryName) return;

      const categoryDoc = doc(db, 'categories', categoryId);
      const category = categories.find(cat => cat.id === categoryId);
      const updatedSubcategories = [...category.subcategories, subcategoryName];
      await updateDoc(categoryDoc, { subcategories: updatedSubcategories });

      setCategories(categories.map(cat => cat.id === categoryId ? { ...cat, subcategories: updatedSubcategories } : cat));
      setNewSubcategoryNames({ ...newSubcategoryNames, [categoryId]: '' });
    } catch (error) {
      console.error('Error adding subcategory: ', error);
    }
  };

  const handleDeleteSubcategory = async (categoryId, subcategoryName) => {
    try {
      const categoryDoc = doc(db, 'categories', categoryId);
      const category = categories.find(cat => cat.id === categoryId);
      const updatedSubcategories = category.subcategories.filter(sub => sub !== subcategoryName);
      await updateDoc(categoryDoc, { subcategories: updatedSubcategories });
      setCategories(categories.map(cat => cat.id === categoryId ? { ...cat, subcategories: updatedSubcategories } : cat));
    } catch (error) {
      console.error('Error deleting subcategory: ', error);
    }
  };

  const getCategoryIcon = (categoryName) => {
    const iconMap = {
      'artificial jewellery': <FaGem />,
      'southern clothing': <FaTshirt />,
    };
    return iconMap[categoryName.toLowerCase()] || <FaQuestionCircle />;
  };

  const handleSubcategoryInputChange = (categoryId, value) => {
    setNewSubcategoryNames({ ...newSubcategoryNames, [categoryId]: value });
  };

  const toggleAccordion = (categoryId) => {
    setAccordionOpen({ ...accordionOpen, [categoryId]: !accordionOpen[categoryId] });
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
          <div key={category.id} className="bg-white shadow-md rounded-lg p-4 mb-2">
            <div className="flex justify-between items-center mb-2 cursor-pointer" onClick={() => toggleAccordion(category.id)}>
              <div className="flex items-center">
                {getCategoryIcon(category.name)}
                <span className="ml-2">{category.name}</span>
              </div>
              <div className="flex items-center">
                <button
                  onClick={() => handleDeleteCategory(category.id)}
                  className="text-red-500 hover:text-red-700 mr-2"
                >
                  Delete Category
                </button>
                {accordionOpen[category.id] ? <FaChevronUp /> : <FaChevronDown />}
              </div>
            </div>
            {accordionOpen[category.id] && (
              <div className="ml-4 border-l-2 border-gray-300 pl-4">
                {category.subcategories && category.subcategories.map(subcategory => (
                  <div key={subcategory} className="flex justify-between items-center mb-1 ml-4">
                    <span>{subcategory}</span>
                    <button
                      onClick={() => handleDeleteSubcategory(category.id, subcategory)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
                <div className="flex items-center mt-2 ml-4">
                  <input
                    type="text"
                    className="border border-gray-300 px-3 py-2 rounded-lg"
                    placeholder="Enter subcategory name"
                    value={newSubcategoryNames[category.id] || ''}
                    onChange={(e) => handleSubcategoryInputChange(category.id, e.target.value)}
                  />
                  <button
                    onClick={() => handleAddSubcategory(category.id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center ml-2"
                  >
                    <FaPlusCircle className="mr-2" />
                    Add Subcategory
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCategories;
