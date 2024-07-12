import React from 'react';
import { Table, Button, Typography } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

const { Title } = Typography;

const AdminCustomers = ({ customers, handleDelete }) => {
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
      <Title level={2} className="mb-4">Customers</Title>
      <Table
        dataSource={customers}
        columns={columns}
        rowKey="id"
        pagination={false}
        className="bg-white"
      />
    </div>
  );
};

export default AdminCustomers;
