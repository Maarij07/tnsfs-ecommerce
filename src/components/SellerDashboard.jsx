import React, { useState, useEffect } from 'react';
import { Card, Col, Row } from 'antd';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import { ShopOutlined, DollarOutlined } from '@ant-design/icons';
import { collection, query, where, getDocs } from 'firebase/firestore';
import db from '../lib/firebase';
import { useLocalContext } from '../context/context';

const SellerDashboard = () => {
  const { loggedInUser } = useLocalContext();  // Get logged-in user from LocalContext
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalSales, setTotalSales] = useState(0);

  // Dummy data for line charts (replace with actual data)
  const [salesData, setSalesData] = useState([
    { month: 'Jan', sales: 2200 },
    { month: 'Feb', sales: 3000 },
    { month: 'Mar', sales: 1800 },
    { month: 'Apr', sales: 2500 },
    { month: 'May', sales: 3200 },
    { month: 'Jun', sales: 2800 },
    // Add more months as needed
  ]);

  const [unitsData, setUnitsData] = useState([
    { month: 'Jan', units: 120 },
    { month: 'Feb', units: 180 },
    { month: 'Mar', units: 90 },
    { month: 'Apr', units: 150 },
    { month: 'May', units: 200 },
    { month: 'Jun', units: 180 },
    // Add more months as needed
  ]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (loggedInUser) {
          // Fetch products uploaded by the user
          const productsQuery = query(
            collection(db, 'products'),
            where('sellerEmail', '==', loggedInUser.email)
          );
          const querySnapshot = await getDocs(productsQuery);
          const productsList = [];
          let total = 0;
          let sales = 0;

          querySnapshot.forEach((doc) => {
            const data = doc.data();
            productsList.push({ id: doc.id, ...data });
            total += 1; // Count products
            sales += data.price || 0; // Accumulate sales
          });

          setTotalProducts(total);
          setTotalSales(sales);

          // If you want to update charts, you can fetch real data and update `salesData` and `unitsData` here
          // Example:
          // const salesData = ...
          // setSalesData(salesData);
          // const unitsData = ...
          // setUnitsData(unitsData);

        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, [loggedInUser]);

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12}>
          <Card
            className="bg-white shadow-sm"
            bordered={false}
            bodyStyle={{ textAlign: 'left', padding: '20px' }}
          >
            <div className="flex items-center">
              <ShopOutlined style={{ fontSize: '32px', color: '#1890ff', marginRight: '10px' }} />
              <div>
                <h3 className="text-xl font-bold">Total Products</h3>
                <p className="text-lg font-semibold"> {totalProducts} </p>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12}>
          <Card
            className="bg-white shadow-sm"
            bordered={false}
            bodyStyle={{ textAlign: 'left', padding: '20px' }}
          >
            <div className="flex items-center">
              <DollarOutlined style={{ fontSize: '32px', color: '#52c41a', marginRight: '10px' }} />
              <div>
                <h3 className="text-xl font-bold">Total Sales</h3>
                <p className="text-lg font-semibold">Rs. {totalSales.toLocaleString()}</p>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
        <Col xs={24} sm={12}>
          <Card title="Sales per Month" className="bg-white shadow-sm">
            <div style={{ overflowX: 'auto' }}>
              <LineChart
                width={400}
                height={300}
                data={salesData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="sales" stroke="#8884d8" />
              </LineChart>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12}>
          <Card title="Units Sold per Month" className="bg-white shadow-sm">
            <div style={{ overflowX: 'auto' }}>
              <LineChart
                width={400}
                height={300}
                data={unitsData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="units" stroke="#82ca9d" />
              </LineChart>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SellerDashboard;
