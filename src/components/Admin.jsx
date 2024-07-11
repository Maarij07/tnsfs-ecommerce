import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { FaUserCircle, FaTachometerAlt, FaUsers, FaStore, FaThList, FaTrophy, FaShoppingCart, FaLock, FaSignOutAlt } from 'react-icons/fa';
import AdminCustomers from './AdminCustomers';
import AdminVendors from './AdminVendors';
import AdminCategories from './AdminCategories';
<<<<<<< HEAD



import AdminDashboard from './AdminDashboard';
import AdminTopSellers from './AdminTopSellers';
import AdminTopSellingProducts from './AdminTopSellingProducts';

=======
import AdminDashboard from './AdminDashboard';
import AdminTopSellers from './AdminTopSellers';
import AdminTopSellingProducts from './AdminTopSellingProducts';
>>>>>>> 1601b8f70a286c6bf0ffccf23cafbb5cf141341c
import db, { auth } from '../lib/firebase'; // adjust the import path as needed
import { useLocalContext } from '../context/context';
import { signOut } from 'firebase/auth';

const Admin = () => {
  const { loggedInUser, setLoggedInUser } = useLocalContext();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [customers, setCustomers] = useState([]);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [vendors, setVendors] = useState([]);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const usersList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCustomers(usersList.filter(user => user.role === 'customer'));
      setVendors(usersList.filter(user => user.role === 'seller'));
    } catch (error) {
      console.error('Error fetching users: ', error);
    }
  };

  const handleDelete = async (userId) => {
    try {
      await deleteDoc(doc(db, 'users', userId));
      setCustomers(customers.filter(user => user.id !== userId));
      setVendors(vendors.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Error deleting user: ', error);
    }
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    signOut(auth).then(() => {
      setLoggedInUser(null);
      // Replace Navigate('/') with your actual navigation logic
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

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const handleLogoutProfileOption = () => {
    setShowProfileMenu(false);
    handleLogout();
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'categories':
        return <AdminCategories />;
      case 'customers':
        return <AdminCustomers customers={customers} handleDelete={handleDelete} />;
      case 'sellers':
        return <AdminVendors vendors={vendors} handleDelete={handleDelete} />;
      case 'topSellers':
        return <AdminTopSellers />;
      case 'topSellingProducts':
        return <AdminTopSellingProducts />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="py-4 px-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <div className="relative">
          <FaUserCircle
            className="text-3xl cursor-pointer text-gray-600 hover:text-gray-800"
            onClick={toggleProfileMenu}
          />
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2">
              <button
                onClick={() => {} /* Add functionality for changing password here */}
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left"
              >
                <FaLock className="mr-2" />
                Change Password
              </button>
              <button
                onClick={handleLogoutProfileOption}
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left"
              >
                <FaSignOutAlt className="mr-2" />
                Logout
              </button>
            </div>
          )}
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="w-64 bg-ebebeb text-black p-6">
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
                className={`cursor-pointer py-2 px-4 flex items-center rounded-lg ${activeTab === 'categories' ? 'bg-gray-300' : ''}`}
                onClick={() => setActiveTab('categories')}
              >
                <FaThList className="mr-2" />
                Categories
              </li>
              <li
                className={`cursor-pointer py-2 px-4 flex items-center rounded-lg ${activeTab === 'customers' ? 'bg-gray-300' : ''}`}
                onClick={() => setActiveTab('customers')}
              >
                <FaUsers className="mr-2" />
                Customers
              </li>
              <li
                className={`cursor-pointer py-2 px-4 flex items-center rounded-lg ${activeTab === 'sellers' ? 'bg-gray-300' : ''}`}
                onClick={() => setActiveTab('sellers')}
              >
                <FaStore className="mr-2" />
                Sellers
              </li>
              <li
                className={`cursor-pointer py-2 px-4 flex items-center rounded-lg ${activeTab === 'topSellers' ? 'bg-gray-300' : ''}`}
                onClick={() => setActiveTab('topSellers')}
              >
                <FaTrophy className="mr-2" />
                Top Sellers
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
        <main className="flex-1 p-6 bg-gray-100">
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

export default Admin;
