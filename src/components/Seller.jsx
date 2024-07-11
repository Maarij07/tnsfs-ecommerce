import React, { useState, useEffect } from 'react';
import { FaUserCircle, FaTachometerAlt, FaShoppingCart, FaThList, FaCamera } from 'react-icons/fa';
import { Popover, Button, Input, Upload, message } from 'antd'; // Import Upload and message from antd for file handling
import SellerDashboard from './SellerDashboard';
import SellerProducts from './SellerProducts';
import SellerOrderHistory from './SellerOrderHistory';
import SellerTopSellingProducts from './SellerTopSellingProducts';
import { useLocalContext } from '../context/context';
import { signOut } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes } from 'firebase/storage'; // Import storage functions for file upload
import db, { auth, storage } from '../lib/firebase'; // Adjust import path as needed

const Seller = () => {
  const { loggedInUser, setLoggedInUser } = useLocalContext();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showCompleteProfile, setShowCompleteProfile] = useState(false); // State to show profile completion form
  const [userDetails, setUserDetails] = useState(null); // State to hold user details
  const [cnicFront, setCnicFront] = useState(null); // State for CNIC front image
  const [cnicBack, setCnicBack] = useState(null); // State for CNIC back image

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
    signOut(auth)
      .then(() => {
        setLoggedInUser(null);
        console.log('Logged out successfully.');
      })
      .catch((error) => {
        console.log(error);
      });
    setShowLogoutModal(false);
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
    console.log('Logout cancelled.');
  };

  const handleCompleteProfile = () => {
    setShowCompleteProfile(true); // Show profile completion form
  };

  const handleChangePassword = () => {
    // Implement logic for changing password
    console.log('Change Password clicked');
  };

  const handleProfileMenuClick = (e) => {
    switch (e.key) {
      case 'completeProfile':
        handleCompleteProfile();
        break;
      case 'changePassword':
        handleChangePassword();
        break;
      case 'logout':
        handleLogout();
        break;
      default:
        break;
    }
  };

  // Function to handle file upload for CNIC front and back
  const handleFileUpload = async (file, type) => {
    try {
      const storageRef = ref(storage, `cnic/${loggedInUser.email}/${type}`);
      await uploadBytes(storageRef, file);
      message.success(`${type === 'front' ? 'CNIC Front' : 'CNIC Back'} image uploaded successfully.`);
    } catch (error) {
      console.error('Error uploading image:', error);
      message.error('Failed to upload image. Please try again.');
    }
  };

  const uploadProps = {
    beforeUpload: (file) => {
      // Handle image upload for CNIC front and back
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file types!');
        return Upload.LIST_IGNORE;
      }
      // Limit file size to 2MB
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('Image must be smaller than 2MB!');
        return Upload.LIST_IGNORE;
      }
      // Handle file upload based on type
      if (file && type === 'front') {
        setCnicFront(file); // Store CNIC front image
        handleFileUpload(file, 'front'); // Upload CNIC front image
      } else if (file && type === 'back') {
        setCnicBack(file); // Store CNIC back image
        handleFileUpload(file, 'back'); // Upload CNIC back image
      }
      return false; // Prevent default upload behavior
    },
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
    <div className="min-h-screen flex flex-col">
      <header className="py-4 px-8 flex justify-between items-center bg-white shadow-md fixed top-0 left-0 right-0 z-10">
        <h1 className="text-2xl font-bold">Seller Dashboard</h1>
        <Popover content={profileMenu} title={`Hello, ${userDetails?.displayName || 'Seller'}`}>
          <FaUserCircle className="text-3xl cursor-pointer text-gray-500 hover:text-gray-700" />
        </Popover>
      </header>
      <div className="flex mt-16">
        <aside className="w-64 bg-ebebeb text-black p-6 overflow-y-auto">
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
        <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">
          {showCompleteProfile ? (
            <div className="flex justify-center items-center h-full">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <p className="text-xl mb-4">Complete Your Profile</p>
                <div className="mb-4">
                  <Input placeholder="CNIC Number" className="mb-2" />
                  <Upload {...uploadProps} className="mb-2">
                    <Button icon={<FaCamera />} className="mb-2">
                      Upload CNIC Front
                    </Button>
                  </Upload>
                  <Upload {...uploadProps} className="mb-2">
                    <Button icon={<FaCamera />} className="mb-2">
                      Upload CNIC Back
                    </Button>
                  </Upload>
                </div>
                <div className="flex justify-end">
                  <Button type="primary" className="mr-2">
                    Save
                  </Button>
                  <Button onClick={() => setShowCompleteProfile(false)}>Cancel</Button>
                </div>
              </div>
            </div>
          ) : (
            renderContent()
          )}
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
