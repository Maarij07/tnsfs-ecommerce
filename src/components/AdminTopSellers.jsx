import React from 'react';
import { Typography, List, Avatar } from 'antd';

const { Title } = Typography;

const AdminTopSellers = () => {
  // Dummy data for top sellers (replace with actual data from your backend)
  const topSellers = [
    { id: 1, name: 'Seller 1', sales: 100 },
    { id: 2, name: 'Seller 2', sales: 90 },
    { id: 3, name: 'Seller 3', sales: 80 },
  ];

  return (
    <div style={{ padding: '16px', maxWidth: '600px', margin: '0 auto' }}>
      <Title level={2} style={{ fontSize: '1.5rem', marginBottom: '16px', textAlign: 'center' }}>
        Top Sellers
      </Title>
      <List
        itemLayout="horizontal"
        dataSource={topSellers.slice(0, 3)} // Show only the top 3 sellers
        renderItem={(seller, index) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar>{seller.name.charAt(0)}</Avatar>}
              title={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontWeight: index === 0 ? 'bold' : 'normal' }}>{seller.name}</span>
                  {index === 0 && (
                    <span style={{ marginLeft: '8px', color: '#1890ff' }}>(Top Seller)</span>
                  )}
                </div>
              }
              description={`Sales: ${seller.sales}`}
              style={{ padding: '8px 0' }}
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default AdminTopSellers;
