import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, updateDoc, doc } from 'firebase/firestore';
import { PlusCircleOutlined, QuestionCircleOutlined, DeleteOutlined, CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import db from '../lib/firebase'; // adjust the import path as needed
import { Button, Input, Collapse, Typography, Space, Avatar } from 'antd';
import { FaGem, FaTshirt  } from 'react-icons/fa';
import { FaKitchenSet } from "react-icons/fa6";
import { PiHairDryerLight } from "react-icons/pi";
import { PiBaby } from "react-icons/pi";

const { Panel } = Collapse;
const { Text } = Typography;

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newSubcategoryNames, setNewSubcategoryNames] = useState({});
  const [activeAccordion, setActiveAccordion] = useState('');

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

  const toggleAccordion = (categoryId) => {
    setActiveAccordion(activeAccordion === categoryId ? '' : categoryId);
  };

  return (
    <div>
      <Typography.Title level={2}>Categories</Typography.Title>
      <Space direction="vertical" style={{ marginBottom: 16 }}>
        <Space>
          <Button type="primary" icon={<PlusCircleOutlined />} onClick={handleAddCategory}>
            Add Category
          </Button>
          <Input
            style={{ width: 200 }}
            placeholder="Enter category name"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
        </Space>
      </Space>
      <Collapse accordion activeKey={activeAccordion} onChange={toggleAccordion}>
        {categories.map(category => (
          <Panel
            key={category.id}
            header={
              <Space align="center">
                <Avatar icon={getCategoryIcon(category.name)} />
                <Text strong>{category.name}</Text>
                <Space>
                  <Button type="link" danger onClick={() => handleDeleteCategory(category.id)}>
                    <DeleteOutlined /> Delete Category
                  </Button>
                  {activeAccordion === category.id ? <CaretUpOutlined /> : <CaretDownOutlined />}
                </Space>
              </Space>
            }
          >
            <Space direction="vertical" style={{ marginLeft: 24 }}>
              {category.subcategories && category.subcategories.map(subcategory => (
                <Space key={subcategory} align="center">
                  <Text>{subcategory}</Text>
                  <Button type="link" danger onClick={() => handleDeleteSubcategory(category.id, subcategory)}>
                    <DeleteOutlined />
                  </Button>
                </Space>
              ))}
              <Space>
                <Input
                  style={{ width: 200 }}
                  placeholder="Enter subcategory name"
                  value={newSubcategoryNames[category.id] || ''}
                  onChange={(e) => handleSubcategoryInputChange(category.id, e.target.value)}
                />
                <Button type="primary" icon={<PlusCircleOutlined />} onClick={() => handleAddSubcategory(category.id)}>
                  Add Subcategory
                </Button>
              </Space>
            </Space>
          </Panel>
        ))}
      </Collapse>
    </div>
  );
};

const getCategoryIcon = (categoryName) => {
  const iconMap = {
    'accessories': <FaGem />,
    'southern clothing': <FaTshirt />,
    'beauty & health': <PiHairDryerLight />,
    'kitchen': <FaKitchenSet />,
    'baby care': <PiBaby />,
    
  };
  return iconMap[categoryName.toLowerCase()] || <QuestionCircleOutlined />;
};

export default AdminCategories;
