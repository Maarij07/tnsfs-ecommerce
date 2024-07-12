import React from 'react';
import { Spin, Typography, Space } from 'antd';

const { Title } = Typography;

const LoadingScreen = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="flex flex-col items-center">
        <Space direction="vertical" size="large">
          <Spin size="large" />
          <Title level={3} className="text-gray-600">Loading...</Title>
        </Space>
      </div>
    </div>
  );
};

export default LoadingScreen;
