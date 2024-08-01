import React, { useState, useEffect } from 'react';
import { FaUserCircle, FaTachometerAlt, FaThList, FaShoppingCart, FaBars } from 'react-icons/fa';
import { Popover, Button, Modal, Form, Input, Upload, message, Drawer } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import SellerDashboard from './SellerDashboard';
import SellerProducts from './SellerProducts';
import SellerOrderHistory from './SellerOrderHistory';
import SellerTopSellingProducts from './SellerTopSellingProducts';
import { useLocalContext } from '../context/context';
import { signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import db, { auth, storage } from '../lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { reauthenticateWithCredential, EmailAuthProvider, updatePassword } from 'firebase/auth';

const Seller = () => {
    const { loggedInUser, setLoggedInUser } = useLocalContext();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showCompleteProfileModal, setShowCompleteProfileModal] = useState(false);
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
    const [userDetails, setUserDetails] = useState(null);
    const [cnicFront, setCnicFront] = useState(null);
    const [cnicBack, setCnicBack] = useState(null);
    const [cnicFrontImage, setCnicFrontImage] = useState(null);  // State for the CNIC front image preview
    const [cnicBackImage, setCnicBackImage] = useState(null);    // State for the CNIC back image preview
    const [drawerVisible, setDrawerVisible] = useState(false); // State for mobile drawer visibility

    useEffect(() => {
        if (loggedInUser) {
            fetchUserDetails(loggedInUser.email);
        }
    }, [loggedInUser]);

    const fetchUserDetails = async (email) => {
        try {
            const docRef = doc(db, 'users', email);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                setUserDetails(data);
                if (data.cnicFrontImage) setCnicFrontImage(data.cnicFrontImage);  // Set CNIC front image
                if (data.cnicBackImage) setCnicBackImage(data.cnicBackImage);    // Set CNIC back image
            } else {
                console.log('No such document!');
            }
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    const handleLogout = () => {
        setShowProfileMenu(false); // Close profile menu if open
        setShowLogoutModal(true); // Show logout confirmation modal
    };

    const confirmLogout = () => {
        signOut(auth)
            .then(() => {
                setLoggedInUser(null);
                console.log('Logged out successfully.');
            })
            .catch((error) => {
                console.log(error);
            });
        setShowLogoutModal(false); // Close logout modal after logout
    };

    const cancelLogout = () => {
        setShowLogoutModal(false); // Close logout modal if cancelled
        console.log('Logout cancelled.');
    };

    const handleCompleteProfile = () => {
        setShowCompleteProfileModal(true); // Show the complete profile modal
    };

    const handleCompleteProfileSubmit = async (values) => {
        try {
            if (!cnicFront || !cnicBack) {
                message.error('Please upload both CNIC front and back images.');
                return;
            }

            const profileData = {
                cnicNumber: values.cnicNumber,
                cnicFrontImage: cnicFront,
                cnicBackImage: cnicBack,
            };

            await setDoc(doc(db, 'users', loggedInUser.email), { ...profileData }, { merge: true });
            message.success('Profile completed successfully!');
            setShowCompleteProfileModal(false); // Close modal after successful submission
        } catch (error) {
            console.error('Error completing profile:', error);
            message.error('Failed to complete profile. Please try again later.');
        }
    };

    const handleCnicFrontUpload = async ({ file }) => {
        try {
            const storageRef = ref(storage, `cnic-images/${loggedInUser.email}_front_${file.name}`);
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);
            setCnicFront(downloadURL);
            setCnicFrontImage(URL.createObjectURL(file));  // Update preview image
        } catch (error) {
            console.error('Error uploading CNIC front image:', error);
            message.error('Failed to upload CNIC front image. Please try again.');
        }
    };

    const handleCnicBackUpload = async ({ file }) => {
        try {
            const storageRef = ref(storage, `cnic-images/${loggedInUser.email}_back_${file.name}`);
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);
            setCnicBack(downloadURL);
            setCnicBackImage(URL.createObjectURL(file));  // Update preview image
        } catch (error) {
            console.error('Error uploading CNIC back image:', error);
            message.error('Failed to upload CNIC back image. Please try again.');
        }
    };

    const handleChangePassword = () => {
        setShowChangePasswordModal(true); // Show the change password modal
    };

    const handleChangePasswordSubmit = async (values) => {
        try {
            const user = auth.currentUser;
            if (!user) {
                throw new Error('No user is currently logged in.');
            }

            // Reauthenticate the user
            const credential = EmailAuthProvider.credential(user.email, values.oldPassword);
            await reauthenticateWithCredential(user, credential);

            // Update the password
            await updatePassword(user, values.newPassword);
            message.success('Password changed successfully!');
            setShowChangePasswordModal(false); // Close modal after successful password change
        } catch (error) {
            console.error('Error changing password:', error);
            message.error('Failed to change password. Please try again later.');
        }
    };

    const profileMenu = (
        <div className="flex flex-col gap-2">
            <Button onClick={handleCompleteProfile}>Complete Profile</Button>
            <Button onClick={handleChangePassword}>Change Password</Button>
            <Button onClick={handleLogout} type="danger">
                Logout
            </Button>
        </div>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <SellerDashboard />;
            case 'products':
                return <SellerProducts />;
            case 'orderHistory':
                return <SellerOrderHistory />;
            case 'topSellingProducts':
                return <SellerTopSellingProducts />;
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col h-screen">
            <header className="bg-gray-100 p-4 flex justify-between items-center fixed w-full top-0 left-0 z-10">
                <div className="flex items-center">
                    <FaBars className="text-2xl cursor-pointer lg:hidden mr-2" onClick={() => setDrawerVisible(true)} />
                    <h1 className="text-2xl font-bold">Seller Dashboard</h1>
                </div>
                <Popover content={profileMenu} visible={showProfileMenu} onVisibleChange={setShowProfileMenu}>
                    <FaUserCircle className="text-3xl cursor-pointer text-gray-500 hover:text-gray-700" />
                </Popover>
            </header>
            <div className="flex flex-1 mt-16">
                <aside className="w-64 bg-gray-100 text-black p-6 overflow-y-auto hidden lg:block fixed h-full top-16 left-0 z-10">
                    <nav>
                        <ul>
                            <li
                                className={`cursor-pointer py-2 px-4 flex items-center rounded-lg ${activeTab === 'dashboard' ? 'bg-gray-300' : ''}`}
                                onClick={() => setActiveTab('dashboard')}
                            >
                                <FaTachometerAlt className="mr-2" />
                                Dashboard
                            </li>
                            <li
                                className={`cursor-pointer py-2 px-4 flex items-center rounded-lg ${activeTab === 'products' ? 'bg-gray-300' : ''}`}
                                onClick={() => setActiveTab('products')}
                            >
                                <FaThList className="mr-2" />
                                Products
                            </li>
                            <li
                                className={`cursor-pointer py-2 px-4 flex items-center rounded-lg ${activeTab === 'orderHistory' ? 'bg-gray-300' : ''}`}
                                onClick={() => setActiveTab('orderHistory')}
                            >
                                <FaShoppingCart className="mr-2" />
                                Order History
                            </li>
                            <li
                                className={`cursor-pointer py-2 px-4 flex items-center rounded-lg ${activeTab === 'topSellingProducts' ? 'bg-gray-300' : ''}`}
                                onClick={() => setActiveTab('topSellingProducts')}
                            >
                                <FaThList className="mr-2" />
                                Top Selling Products
                            </li>
                        </ul>
                    </nav>
                </aside>
                <main className="flex-1 p-6 bg-gray-200 overflow-y-auto lg:ml-64">
                    {renderContent()}
                </main>
            </div>

            {/* Complete Profile Modal */}
            <Modal
                title="Complete Your Profile"
                visible={showCompleteProfileModal}
                onCancel={() => setShowCompleteProfileModal(false)}
                footer={null}
                style={{ backgroundColor: 'white' }}  // Set background color to white
            >
                <Form
                    layout="vertical"
                    onFinish={handleCompleteProfileSubmit}
                >
                    <Form.Item
                        label="CNIC Number"
                        name="cnicNumber"
                        rules={[{ required: true, message: 'Please enter your CNIC number!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="CNIC Front Image"
                        required
                    >
                        <Upload
                            customRequest={handleCnicFrontUpload}
                            showUploadList={false}
                            accept="image/*"
                        >
                            <Button icon={<UploadOutlined />}>Upload CNIC Front Image</Button>
                        </Upload>
                        {cnicFrontImage && (
                            <div className="mt-2">
                                <img src={cnicFrontImage} alt="CNIC Front" className="w-full h-auto" />
                            </div>
                        )}
                    </Form.Item>
                    <Form.Item
                        label="CNIC Back Image"
                        required
                    >
                        <Upload
                            customRequest={handleCnicBackUpload}
                            showUploadList={false}
                            accept="image/*"
                        >
                            <Button icon={<UploadOutlined />}>Upload CNIC Back Image</Button>
                        </Upload>
                        {cnicBackImage && (
                            <div className="mt-2">
                                <img src={cnicBackImage} alt="CNIC Back" className="w-full h-auto" />
                            </div>
                        )}
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Change Password Modal */}
            <Modal
                title="Change Password"
                visible={showChangePasswordModal}
                onCancel={() => setShowChangePasswordModal(false)}
                footer={null}
            >
                <Form
                    layout="vertical"
                    onFinish={handleChangePasswordSubmit}
                >
                    <Form.Item
                        label="Old Password"
                        name="oldPassword"
                        rules={[{ required: true, message: 'Please enter your old password!' }]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        label="New Password"
                        name="newPassword"
                        rules={[{ required: true, message: 'Please enter a new password!' }]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        label="Confirm New Password"
                        name="confirmNewPassword"
                        dependencies={['newPassword']}
                        rules={[
                            { required: true, message: 'Please confirm your new password!' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('newPassword') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('The two passwords that you entered do not match!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Change Password
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Logout Modal */}
            <Modal
                title="Logout Confirmation"
                visible={showLogoutModal}
                onOk={confirmLogout}
                onCancel={cancelLogout}
                okText="Logout"
                cancelText="Cancel"
                okButtonProps={{ danger: true }}
            >
                <p>Are you sure you want to logout?</p>
            </Modal>

            {/* Mobile Drawer */}
            <Drawer
                title="Navigation"
                placement="left"
                closable={true}
                onClose={() => setDrawerVisible(false)}
                visible={drawerVisible}
            >
                <nav>
                    <ul>
                        <li
                            className={`cursor-pointer py-2 px-4 flex items-center rounded-lg ${activeTab === 'dashboard' ? 'bg-gray-300' : ''}`}
                            onClick={() => {
                                setActiveTab('dashboard');
                                setDrawerVisible(false);
                            }}
                        >
                            <FaTachometerAlt className="mr-2" />
                            Dashboard
                        </li>
                        <li
                            className={`cursor-pointer py-2 px-4 flex items-center rounded-lg ${activeTab === 'products' ? 'bg-gray-300' : ''}`}
                            onClick={() => {
                                setActiveTab('products');
                                setDrawerVisible(false);
                            }}
                        >
                            <FaThList className="mr-2" />
                            Products
                        </li>
                        <li
                            className={`cursor-pointer py-2 px-4 flex items-center rounded-lg ${activeTab === 'orderHistory' ? 'bg-gray-300' : ''}`}
                            onClick={() => {
                                setActiveTab('orderHistory');
                                setDrawerVisible(false);
                            }}
                        >
                            <FaShoppingCart className="mr-2" />
                            Order History
                        </li>
                        <li
                            className={`cursor-pointer py-2 px-4 flex items-center rounded-lg ${activeTab === 'topSellingProducts' ? 'bg-gray-300' : ''}`}
                            onClick={() => {
                                setActiveTab('topSellingProducts');
                                setDrawerVisible(false);
                            }}
                        >
                            <FaThList className="mr-2" />
                            Top Selling Products
                        </li>
                    </ul>
                </nav>
            </Drawer>
        </div>
    );
};

export default Seller;
