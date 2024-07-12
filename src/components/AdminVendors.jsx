import React from 'react';
import { Table, Button, Typography } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

const { Title } = Typography;

const AdminVendors = ({ vendors, handleDelete }) => {
  const columns = [
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Mobile',
      dataIndex: 'mobile',
      key: 'mobile',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Button
          type="link"
          danger
          onClick={() => handleDelete(record.id)}
          icon={<DeleteOutlined />}
        />
      ),
    },
  ];

  return (
    <div>
      <Title level={2} className="text-xl font-bold mb-4">Vendors</Title>
      <Table
        dataSource={vendors}
        columns={columns}
        rowKey="id"
        pagination={false}
        className="min-w-full bg-white"
      />
    </div>
  );
};

export default AdminVendors;
