import React, { useState, useEffect } from 'react';
import { FaUserCircle, FaTachometerAlt, FaShoppingCart, FaThList, FaLock } from 'react-icons/fa';
import { Popover, Button, Input, message } from 'antd'; // Import Input and message from antd for form handling
import SellerDashboard from './SellerDashboard';
import SellerProducts from './SellerProducts';
import SellerOrderHistory from './SellerOrderHistory';
import SellerTopSellingProducts from './SellerTopSellingProducts';
import { useLocalContext } from '../context/context';
import { signOut } from 'firebase/auth';
import { updatePassword } from 'firebase/auth'; // Import updatePassword function from firebase/auth
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import db, { auth } from '../lib/firebase'; // Adjust import path as needed

const Seller = () => {
  const { loggedInUser, setLoggedInUser } = useLocalContext();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showCompleteProfile, setShowCompleteProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false); // State to show change password form
  const [userDetails, setUserDetails] = useState(null);
  const [oldPassword, setOldPassword] = useState(''); // State for old password input
  const [newPassword, setNewPassword] = useState(''); // State for new password input

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
    setShowCompleteProfile(true);
  };

  const handleChangePassword = () => {
    setShowChangePassword(true); // Show change password form
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

  // Function to handle password change
  const handleChangePasswordSubmit = () => {
    // Validate input fields
    if (oldPassword === '' || newPassword === '') {
      message.error('Please enter both old and new passwords.');
      return;
    }

    // Firebase authentication update password
    const user = auth.currentUser;
    updatePassword(user, newPassword)
      .then(() => {
        message.success('Password updated successfully.');
        setShowChangePassword(false); // Hide change password form
        setOldPassword('');
        setNewPassword('');
      })
      .catch((error) => {
        console.error('Error updating password:', error);
        message.error('Failed to update password. Please try again.');
      });
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
    <div className="min-h-screen flex flex-col relative">
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
        <main className="flex-1 p-6 bg-gray-100 overflow-y-auto relative">
          {renderContent()}
        </main>
      </div>
      {showCompleteProfile && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-20">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-xl mb-4">Complete Your Profile</p>
            <div className="mb-4">
              <Input placeholder="CNIC Number" className="mb-2" />
              {/* Upload components for CNIC front and back */}
            </div>
            <div className="flex justify-end">
              <Button type="primary" className="mr-2">
                Save
              </Button>
              <Button onClick={() => setShowCompleteProfile(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
      {showChangePassword && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-20">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-xl mb-4">Change Password</p>
            <div className="mb-4">
              <Input.Password
                placeholder="Old Password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="mb-2"
              />
              <Input.Password
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mb-2"
              />
            </div>
            <div className="flex justify-end">
              <Button type="primary" className="mr-2" onClick={handleChangePasswordSubmit}>
                Save
              </Button>
              <Button onClick={() => setShowChangePassword(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
      {showLogoutModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-30">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-xl mb-4">Are you sure you want to logout?</p>
            <div className="flex justify-end">
              <Button
                onClick={confirmLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded mr-2"
              >
                Yes
              </Button>
              <Button
                onClick={cancelLogout}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
              >
                No
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Seller;
