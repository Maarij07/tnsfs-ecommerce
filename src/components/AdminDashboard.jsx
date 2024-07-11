import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { FaUsers, FaStore, FaThList } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
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

      const categoriesSnapshot = await getDocs(collection(db, 'categories'));
      const categoriesCount = categoriesSnapshot.docs.length;

      setTotalCustomers(customersCount);
      setTotalVendors(vendorsCount);
      setTotalCategories(categoriesCount);
    } catch (error) {
      console.error('Error fetching totals: ', error);
    }
  };

  const sampleSalesData = [
    { month: 'Jan', sales: 4000, units: 2400 },
    { month: 'Feb', sales: 3000, units: 1398 },
    { month: 'Mar', sales: 2000, units: 9800 },
    { month: 'Apr', sales: 2780, units: 3908 },
    { month: 'May', sales: 1890, units: 4800 },
    { month: 'Jun', sales: 2390, units: 3800 },
    { month: 'Jul', sales: 3490, units: 4300 },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-2 rounded-lg shadow-md">
          <div className="flex items-center">
            <FaUsers className="text-4xl text-blue-500 mr-4" />
            <div>
              <p className="text-lg font-bold">Total Customers</p>
              <p className="text-2xl">{totalCustomers}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-2 rounded-lg shadow-md">
          <div className="flex items-center">
            <FaStore className="text-4xl text-green-500 mr-4" />
            <div>
              <p className="text-lg font-bold">Total Vendors</p>
              <p className="text-2xl">{totalVendors}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-2 rounded-lg shadow-md">
          <div className="flex items-center">
            <FaThList className="text-4xl text-purple-500 mr-4" />
            <div>
              <p className="text-lg font-bold">Total Categories</p>
              <p className="text-2xl">{totalCategories}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4">Total Sales (in price)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={sampleSalesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="sales" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4">Total Units Sold (in quantity)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={sampleSalesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="units" stroke="#82ca9d" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
