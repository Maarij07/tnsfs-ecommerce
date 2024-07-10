import React, { useState, useEffect } from 'react';
import db from '../lib/firebase'; // adjust the import path as needed
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { FaSignOutAlt, FaTachometerAlt, FaUsers, FaStore, FaThList, FaCheckSquare } from 'react-icons/fa'; // Changed icon for Approvals
import AdminCustomers from './AdminCustomers';
import AdminVendors from './AdminVendors';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [customers, setCustomers] = useState([]);
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      const usersList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCustomers(usersList.filter(user => user.role === 'customer'));
      setVendors(usersList.filter(user => user.role === 'vendor'));
    };
    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    try {
      await deleteDoc(doc(db, "users", userId));
      setCustomers(customers.filter(user => user.id !== userId));
      setVendors(vendors.filter(user => user.id !== userId));
    } catch (error) {
      console.error("Error deleting user: ", error);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <div>Dashboard Content</div>;
      case 'approvals': // Changed from 'products' to 'approvals'
        return <div>Approvals Content</div>;
      case 'categories':
        return <div>Categories Content</div>;
      case 'customers':
        return <AdminCustomers customers={customers} handleDelete={handleDelete} />;
      case 'vendors':
        return <AdminVendors vendors={vendors} handleDelete={handleDelete} />;
      default:
        return null;
    }
  };

  const handleLogout = () => {
    // Add logout functionality here
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-ebebeb p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <button
          onClick={handleLogout}
          className="text-red-500 hover:text-red-700 flex items-center"
        >
          <FaSignOutAlt className="mr-2" />
          Logout
        </button>
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
                className={`cursor-pointer py-2 px-4 flex items-center rounded-lg ${activeTab === 'approvals' ? 'bg-gray-300' : ''}`}
                onClick={() => setActiveTab('approvals')}
              >
                <FaCheckSquare className="mr-2" /> {/* Changed icon for Approvals */}
                Approvals
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
                className={`cursor-pointer py-2 px-4 flex items-center rounded-lg ${activeTab === 'vendors' ? 'bg-gray-300' : ''}`}
                onClick={() => setActiveTab('vendors')}
              >
                <FaStore className="mr-2" />
                Vendors
              </li>
            </ul>
          </nav>
        </aside>
        <main className="flex-1 p-6 bg-gray-100">
          {renderContent()}
        </main>
      </div>
    </div>
  )
};

export default Admin;
