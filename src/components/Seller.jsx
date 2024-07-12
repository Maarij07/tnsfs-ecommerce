import React, { useState, useEffect } from 'react';
import { FaUserCircle, FaTachometerAlt, FaThList, FaShoppingCart } from 'react-icons/fa';
import { Popover, Button, Modal, message } from 'antd';
import SellerDashboard from './SellerDashboard';
import SellerProducts from './SellerProducts';
import SellerOrderHistory from './SellerOrderHistory';
import SellerTopSellingProducts from './SellerTopSellingProducts';
import { useLocalContext } from '../context/context';
import { signOut } from 'firebase/auth';
import { updatePassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import db, { auth } from '../lib/firebase';

const Seller = () => {
    const { loggedInUser, setLoggedInUser } = useLocalContext();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [userDetails, setUserDetails] = useState(null);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

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
                setUserDetails(docSnap.data());
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
        // Implement complete profile functionality if needed
    };

    const handleChangePassword = () => {
        // Implement change password functionality if needed
    };

    const handleChangePasswordSubmit = () => {
        // Implement change password submission functionality if needed
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
            <header className="bg-gray-100 p-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold">Seller Dashboard</h1>
                <Popover content={profileMenu} visible={showProfileMenu} onVisibleChange={setShowProfileMenu}>
                    <FaUserCircle className="text-3xl cursor-pointer text-gray-500 hover:text-gray-700" />
                </Popover>
            </header>
            <div className="flex flex-1">
                <aside className="w-64 bg-gray-100 text-black p-6 overflow-y-auto">
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
                                <FaShoppingCart className="mr-2" />
                                Top Selling Products
                            </li>
                        </ul>
                    </nav>
                </aside>
                <main className="flex-1 p-6 bg-gray-200 overflow-y-auto">
                    {renderContent()}
                </main>
            </div>

            {/* Logout Modal */}
            <Modal
                title="Logout Confirmation"
                visible={showLogoutModal}
                onOk={confirmLogout}
                onCancel={cancelLogout}
                okText="Logout"
                cancelText="Cancel"
            >
                <p>Are you sure you want to logout?</p>
            </Modal>
        </div>
    );
};

export default Seller;
