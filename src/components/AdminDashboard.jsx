import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { FaUsers, FaStore, FaThList } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import db from '../lib/firebase';
import { Card, Col, Row, Typography, Statistic, Layout } from 'antd';

const { Title } = Typography;
const { Content } = Layout;

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
      const vendorsCount = usersList.filter(user => user.role === 'seller').length;

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
    <Layout style={{ padding: '6px', backgroundColor: '#ffffff' }}>
      <Content>
        <Title level={3}>Admin Dashboard</Title>
        <Row gutter={[12, 12]}>
          <Col span={8}>
            <Card>
              <Statistic
                title="Total Customers"
                value={totalCustomers}
                prefix={<FaUsers />}
                valueStyle={{ color: '#3f8600', fontSize: '18px' }}
                titleStyle={{ fontSize: '14px' }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Total Sellers"
                value={totalVendors}
                prefix={<FaStore />}
                valueStyle={{ color: '#108ee9', fontSize: '18px' }}
                titleStyle={{ fontSize: '14px' }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Total Categories"
                value={totalCategories}
                prefix={<FaThList />}
                valueStyle={{ color: '#cf1322', fontSize: '18px' }}
                titleStyle={{ fontSize: '14px' }}
              />
            </Card>
          </Col>
        </Row>
        <Row gutter={[12, 12]} style={{ marginTop: '16px' }}>
          <Col span={12}>
            <Card title="Total Sales (in price)" headStyle={{ fontSize: '16px' }}>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={sampleSalesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="sales" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </Col>
          <Col span={12}>
            <Card title="Total Units Sold (in quantity)" headStyle={{ fontSize: '16px' }}>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={sampleSalesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="units" stroke="#82ca9d" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default AdminDashboard;
