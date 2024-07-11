import React from 'react';
import { Card, Col, Row } from 'antd';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';

const SellerDashboard = () => {
  // Dummy data (replace with actual data fetched from your backend)
  const totalProducts = 150;
  const totalSales = 50000;

  // Dummy data for line charts (replace with actual data)
  const salesData = [
    { month: 'Jan', sales: 2200 },
    { month: 'Feb', sales: 3000 },
    { month: 'Mar', sales: 1800 },
    { month: 'Apr', sales: 2500 },
    { month: 'May', sales: 3200 },
    { month: 'Jun', sales: 2800 },
    // Add more months as needed
  ];

  const unitsData = [
    { month: 'Jan', units: 120 },
    { month: 'Feb', units: 180 },
    { month: 'Mar', units: 90 },
    { month: 'Apr', units: 150 },
    { month: 'May', units: 200 },
    { month: 'Jun', units: 180 },
    // Add more months as needed
  ];

  return (
    <div>
      <Row gutter={16}>
        <Col span={12}>
          <Card title="Total Products">
            <p>{totalProducts}</p>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Total Sales">
            <p>{totalSales}</p>
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: '20px' }}>
        <Col span={12}>
          <Card title="Sales per Month">
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
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Units Sold per Month">
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
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SellerDashboard;
