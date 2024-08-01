import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, message, Upload, Tabs, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';
import db, { storage } from '../lib/firebase';
import { collection, getDocs, doc, setDoc, query, where, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useLocalContext } from '../context/context';

const { TabPane } = Tabs;

const SellerProducts = () => {
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const [categorySearch, setCategorySearch] = useState(''); // State for category search
    const [subcategorySearch, setSubcategorySearch] = useState(''); // State for subcategory search
    const { loggedInUser } = useLocalContext(); // Get logged-in user from LocalContext
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchCategories();
        fetchSellerProducts();
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
            setSubcategorySearch(''); // Clear subcategory search when category changes
        } else {
            setSubcategories([]);
        }
    };

    const handleImageUpload = async (file) => {
        const storageRef = ref(storage, `product-images/${uuidv4()}_${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        setFileList([...fileList, { uid: file.uid, name: file.name, url: downloadURL }]);
        return false; // Prevent auto-upload
    };

    const handleProductSubmit = async (values) => {
        try {
            const selectedCategory = categories.find(category => category.id === values.category);
            const productData = {
                name: values.name,
                description: values.description,
                price: parseFloat(values.price), // Convert price to number
                category: selectedCategory ? selectedCategory.name : '', // Store category name
                subcategory: values.subcategory || null,
                quantity: values.quantity, // Add quantity to product data
                images: fileList.map(file => ({ name: file.name, url: file.url })),
                sellerEmail: loggedInUser.email, // Add seller's email
            };
            await setDoc(doc(db, 'products', `${productData.category}_${productData.name.toLowerCase()}_${uuidv4()}`), productData);
            message.success('Product uploaded successfully!');
            form.resetFields();
            setFileList([]); // Clear uploaded files after submission
            fetchSellerProducts(); // Refresh the product list
        } catch (error) {
            console.error('Error uploading product:', error);
            message.error('Failed to upload product. Please try again later.');
        }
    };

    const handleRemoveFile = (file) => {
        const updatedFileList = fileList.filter(item => item.uid !== file.uid);
        setFileList(updatedFileList);
    };

    const handleDeleteProduct = async (productId) => {
        try {
            await deleteDoc(doc(db, 'products', productId));
            message.success('Product deleted successfully!');
            fetchSellerProducts(); // Refresh the product list
        } catch (error) {
            console.error('Error deleting product:', error);
            message.error('Failed to delete product. Please try again later.');
        }
    };

    const fetchSellerProducts = async () => {
        try {
            const q = query(collection(db, 'products'), where('sellerEmail', '==', loggedInUser.email));
            const querySnapshot = await getDocs(q);
            const productsList = [];
            querySnapshot.forEach((doc) => {
                productsList.push({ id: doc.id, ...doc.data() });
            });
            setProducts(productsList);
        } catch (error) {
            console.error('Error fetching seller products:', error);
            message.error('Failed to fetch your products.');
        }
    };

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    return (
        <div className="p-6 bg-white shadow-md rounded-lg">
            <Tabs defaultActiveKey="uploadProduct" type="card">
                <TabPane tab="Upload Product" key="uploadProduct">
                    <h2 className="text-2xl font-bold mb-4">Upload Product</h2>
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleProductSubmit}
                        initialValues={{ category: '', subcategory: '', quantity: 1 }} // Add initial value for quantity
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
                            label="Price (Rs.)"
                            name="price"
                            rules={[{ required: true, message: 'Please enter product price' }]}
                        >
                            <Input type="number" min={0} step={0.01} />
                        </Form.Item>
                        <Form.Item
                            label="Quantity"
                            name="quantity"
                            rules={[{ required: true, message: 'Please enter product quantity' }]}
                        >
                            <Input type="number" min={1} step={1} />
                        </Form.Item>
                        <Form.Item
                            label="Category"
                            name="category"
                            rules={[{ required: true, message: 'Please select product category' }]}
                        >
                            <Select
                                showSearch
                                placeholder="Select a category"
                                onChange={handleCategoryChange}
                                onSearch={(value) => setCategorySearch(value.toLowerCase())}
                            >
                                {categories
                                    .filter(category =>
                                        category.name.toLowerCase().includes(categorySearch)
                                    )
                                    .map((category) => (
                                        <Select.Option key={category.id} value={category.id}>
                                            {category.name}
                                        </Select.Option>
                                    ))}
                            </Select>
                        </Form.Item>
                        {subcategories.length > 0 && (
                            <Form.Item label="Subcategory" name="subcategory">
                                <Select
                                    showSearch
                                    placeholder="Select a subcategory"
                                    onSearch={(value) => setSubcategorySearch(value.toLowerCase())}
                                >
                                    {subcategories
                                        .filter(subcategory =>
                                            subcategory.toLowerCase().includes(subcategorySearch)
                                        )
                                        .map((subcategory) => (
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
                </TabPane>
                <TabPane tab="Your Products" key="yourProducts">
                    <h2 className="text-2xl font-bold mb-4">Your Products</h2>
                    <ProductList products={products} handleDeleteProduct={handleDeleteProduct} />
                </TabPane>
            </Tabs>
        </div>
    );
};

const ProductList = ({ products, handleDeleteProduct }) => {
    return (
        <div className="space-y-4">
            {products.length > 0 ? (
                products.map(product => (
                    <div key={product.id} className="p-4 border rounded-lg bg-white shadow-sm flex items-center justify-between">
                        <div className="flex-1 pr-4">
                            <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                            <p className="text-gray-700 mb-2">{product.description}</p>
                            <p className="text-gray-900 mb-2">Price: Rs. {(parseFloat(product.price) || 0).toFixed(2)}</p>
                            <p className="text-gray-600 mb-2">Quantity: {product.quantity}</p>
                            <p className="text-gray-600 mb-2">Category: {product.category}</p>
                            <p className="text-gray-600 mb-2">Subcategory: {product.subcategory || 'N/A'}</p>
                            <div className="flex space-x-2 mb-2">
                                {product.images.map((image, index) => (
                                    <img
                                        key={index}
                                        src={image.url}
                                        alt={image.name}
                                        className="w-16 h-16 object-cover"
                                    />
                                ))}
                            </div>
                        </div>
                        <div>
                            <Popconfirm
                                title="Are you sure you want to delete this product?"
                                onConfirm={() => handleDeleteProduct(product.id)}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button danger>Delete</Button>
                            </Popconfirm>
                        </div>
                    </div>
                ))
            ) : (
                <p>No products found.</p>
            )}
        </div>
    );
};

export default SellerProducts;