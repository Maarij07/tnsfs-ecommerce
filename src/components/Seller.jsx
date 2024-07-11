import React, { useState, useEffect } from 'react';
import { FaUserCircle, FaTachometerAlt, FaShoppingCart, FaThList } from 'react-icons/fa';
import { Popover, Button } from 'antd';
import SellerDashboard from './SellerDashboard';
import SellerProducts from './SellerProducts';
import SellerOrderHistory from './SellerOrderHistory';
import SellerTopSellingProducts from './SellerTopSellingProducts';
import { useLocalContext } from '../context/context';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import db, {auth } from '../lib/firebase'; // Adjust import path as needed

const Seller = () => {
  const { loggedInUser, setLoggedInUser } = useLocalContext();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [userDetails, setUserDetails] = useState(null); // State to hold user details

  useEffect(() => {
    // Fetch user details when component mounts
    if (loggedInUser) {
      fetchUserDetails(loggedInUser.email);
    }
  }, [loggedInUser]);

  // Function to fetch user details from Firestore
  const fetchUserDetails = async (email) => {
    try {
      const docRef = doc(db, 'users', email); // Assuming 'users' is your collection name
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserDetails(docSnap.data());
        console.log(userDetails)
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    signOut(auth).then(() => {
      setLoggedInUser(null);
      console.log('Logged out successfully.');
    }).catch((error) => {
      console.log(error);
    });
    setShowLogoutModal(false);
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
    console.log('Logout cancelled.');
  };

  const handleProfileMenuClick = (e) => {
    if (e.key === 'logout') {
      handleLogout();
    }
    // Add more actions based on menu items here
  };

  const profileMenu = (
    <div>
      <Button onClick={() => console.log('Complete Profile clicked')}>Complete Profile</Button>
      <Button onClick={() => handleLogout()} className="mt-2" type="danger">Logout</Button>
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
    <div className="min-h-screen flex flex-col">
      <header className="py-4 px-8 flex justify-between items-center bg-white shadow-md fixed top-0 left-0 right-0 z-10">
        <h1 className="text-2xl font-bold">Seller Dashboard</h1>
        <Popover content={profileMenu} title={`Hello, ${userDetails?.username || 'Seller'}`}>
          <FaUserCircle className="text-3xl cursor-pointer text-gray-500 hover:text-gray-700" />
        </Popover>
      </header>
      <div className="flex mt-16"> {/* Adjust margin top to accommodate fixed header */}
        <aside className="w-64 bg-ebebeb text-black p-6 overflow-y-auto"> {/* Set overflow-y to auto */}
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
        <main className="flex-1 p-6 bg-gray-100 overflow-y-auto"> {/* Set overflow-y to auto */}
          {renderContent()}
        </main>
      </div>
      {showLogoutModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-xl mb-4">Are you sure you want to logout?</p>
            <div className="flex justify-end">
              <button
                onClick={confirmLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded mr-2"
              >
                Yes
              </button>
              <button
                onClick={cancelLogout}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Seller;
