import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, message, Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';
import db, { storage } from '../lib/firebase';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const SellerProducts = () => {
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'categories'));
            const categoriesList = [];
            querySnapshot.forEach((doc) => {
                categoriesList.push({ id: doc.id, ...doc.data() });
            });
            setCategories(categoriesList);
        } catch (error) {
            console.error('Error fetching categories:', error);
            message.error('Failed to fetch categories.');
        }
    };

    const handleCategoryChange = (categoryId) => {
        const selectedCategory = categories.find(category => category.id === categoryId);
        if (selectedCategory && selectedCategory.subcategories) {
            setSubcategories(selectedCategory.subcategories);
        } else {
            setSubcategories([]);
        }
    };

    const handleImageUpload = async (file) => {
        const storageRef = ref(storage, `product-images/${uuidv4()}_${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        setFileList([...fileList, { uid: file.uid, name: file.name, url: downloadURL }]);
    };

    const handleProductSubmit = async (values) => {
        try {
            const productData = {
                name: values.name,
                description: values.description,
                price: values.price,
                category: values.category,
                subcategory: values.subcategory || null,
                images: fileList.map(file => ({ name: file.name, url: file.url })),
            };

            await setDoc(doc(db, 'products', productData.name.toLowerCase()), productData);
            message.success('Product uploaded successfully!');
            form.resetFields();
            setFileList([]); // Clear uploaded files after submission
        } catch (error) {
            console.error('Error uploading product:', error);
            message.error('Failed to upload product. Please try again later.');
        }
    };

    const handleRemoveFile = (file) => {
        const updatedFileList = fileList.filter(item => item.uid !== file.uid);
        setFileList(updatedFileList);
    };

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Your Products</h2>
            <Form
                form={form}
                layout="vertical"
                onFinish={handleProductSubmit}
                initialValues={{ category: '', subcategory: '' }}
            >
                <Form.Item
                    label="Product Name"
                    name="name"
                    rules={[{ required: true, message: 'Please enter product name' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Description"
                    name="description"
                    rules={[{ required: true, message: 'Please enter product description' }]}
                >
                    <Input.TextArea />
                </Form.Item>
                <Form.Item
                    label="Price"
                    name="price"
                    rules={[{ required: true, message: 'Please enter product price' }]}
                >
                    <Input type="number" min={0} step={0.01} />
                </Form.Item>
                <Form.Item
                    label="Category"
                    name="category"
                    rules={[{ required: true, message: 'Please select product category' }]}
                >
                    <Select onChange={handleCategoryChange}>
                        {categories.map((category) => (
                            <Select.Option key={category.id} value={category.id}>
                                {category.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                {subcategories.length > 0 && (
                    <Form.Item label="Subcategory" name="subcategory">
                        <Select>
                            {subcategories.map((subcategory) => (
                                <Select.Option key={subcategory} value={subcategory}>
                                    {subcategory}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                )}
                <Form.Item label="Upload Images">
                    <Upload
                        listType="picture-card"
                        fileList={fileList}
                        beforeUpload={handleImageUpload}
                        onRemove={handleRemoveFile}
                    >
                        {fileList.length >= 8 ? null : uploadButton}
                    </Upload>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Upload Product
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default SellerProducts;
