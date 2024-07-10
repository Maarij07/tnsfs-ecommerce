import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { FaUsers, FaStore, FaThList } from 'react-icons/fa';
import db from '../lib/firebase'; // Adjust the import path as needed

const AdminDashboard = () => {
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalVendors, setTotalVendors] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);

  useEffect(() => {
    fetchTotals();
  }, []);

  const fetchTotals = async () => {
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersList = usersSnapshot.docs.map(doc => doc.data());

      const customersCount = usersList.filter(user => user.role === 'customer').length;
      const vendorsCount = usersList.filter(user => user.role === 'vendor').length;

      // For dummy categories count, you may fetch from another collection or set a default value
      const dummyCategoriesCount = 5; // Replace with actual logic to fetch categories

      setTotalCustomers(customersCount);
      setTotalVendors(vendorsCount);
      setTotalCategories(dummyCategoriesCount);
    } catch (error) {
      console.error('Error fetching totals: ', error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center">
            <FaUsers className="text-4xl text-blue-500 mr-4" />
            <div>
              <p className="text-xl font-bold">Total Customers</p>
              <p className="text-3xl">{totalCustomers}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center">
            <FaStore className="text-4xl text-green-500 mr-4" />
            <div>
              <p className="text-xl font-bold">Total Vendors</p>
              <p className="text-3xl">{totalVendors}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center">
            <FaThList className="text-4xl text-purple-500 mr-4" />
            <div>
              <p className="text-xl font-bold">Total Categories</p>
              <p className="text-3xl">{totalCategories}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
