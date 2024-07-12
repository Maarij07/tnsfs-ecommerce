import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { FaUserCircle, FaTachometerAlt, FaUsers, FaStore, FaThList, FaTrophy, FaShoppingCart, FaLock, FaSignOutAlt } from 'react-icons/fa';
import AdminCustomers from './AdminCustomers';
import AdminVendors from './AdminVendors';
import AdminCategories from './AdminCategories';
import AdminDashboard from './AdminDashboard';
import AdminTopSellers from './AdminTopSellers';
import AdminTopSellingProducts from './AdminTopSellingProducts';
import db, { auth } from '../lib/firebase'; // adjust the import path as needed
import { useLocalContext } from '../context/context';
import { signOut } from 'firebase/auth';
import { Layout, Menu, Modal, Typography, Avatar, Dropdown } from 'antd';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const Admin = () => {
  const { loggedInUser, setLoggedInUser } = useLocalContext();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [customers, setCustomers] = useState([]);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [vendors, setVendors] = useState([]);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const usersList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCustomers(usersList.filter(user => user.role === 'customer'));
      setVendors(usersList.filter(user => user.role === 'seller'));
    } catch (error) {
      console.error('Error fetching users: ', error);
    }
  };

  const handleDelete = async (userId) => {
    try {
      await deleteDoc(doc(db, 'users', userId));
      setCustomers(customers.filter(user => user.id !== userId));
      setVendors(vendors.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Error deleting user: ', error);
    }
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    signOut(auth).then(() => {
      setLoggedInUser(null);
      console.log('Logged out successfully.');
    }).catch((error) => {
      console.log(error);
    });
    setShowLogoutModal(false);
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
    console.log('Logout cancelled.');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'categories':
        return <AdminCategories />;
      case 'customers':
        return <AdminCustomers customers={customers} handleDelete={handleDelete} />;
      case 'sellers':
        return <AdminVendors vendors={vendors} handleDelete={handleDelete} />;
      case 'topSellers':
        return <AdminTopSellers />;
      case 'topSellingProducts':
        return <AdminTopSellingProducts />;
      default:
        return null;
    }
  };

  const profileMenu = (
    <Menu>
      <Menu.Item onClick={() => { /* Add functionality for changing password here */ }}>
        <div className="flex items-center">
          <FaLock style={{ marginRight: 8 }} />
          <span>Change Password</span>
        </div>
      </Menu.Item>
      <Menu.Item onClick={handleLogout}>
        <div className="flex items-center">
          <FaSignOutAlt style={{ marginRight: 8 }} />
          <span>Logout</span>
        </div>
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ backgroundColor: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 24px' }}>
        <Title level={3} style={{ margin: 0, paddingTop: '12px' }}>Admin Panel</Title>
        <Dropdown overlay={profileMenu} trigger={['click']} placement="bottomRight">
          <Avatar
            icon={<FaUserCircle />}
            size="large"
            style={{ cursor: 'pointer', backgroundColor: '#1890ff' }}
          />
        </Dropdown>
      </Header>
      <Layout>
        <Sider width={200} style={{ backgroundColor: '#fff' }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['dashboard']}
            style={{ height: '100%', borderRight: 0 }}
            onClick={({ key }) => setActiveTab(key)}
          >
            <Menu.Item key="dashboard" icon={<FaTachometerAlt />}>
              Dashboard
            </Menu.Item>
            <Menu.Item key="categories" icon={<FaThList />}>
              Categories
            </Menu.Item>
            <Menu.Item key="customers" icon={<FaUsers />}>
              Customers
            </Menu.Item>
            <Menu.Item key="sellers" icon={<FaStore />}>
              Sellers
            </Menu.Item>
            <Menu.Item key="topSellers" icon={<FaTrophy />}>
              Top Sellers
            </Menu.Item>
            <Menu.Item key="topSellingProducts" icon={<FaShoppingCart />}>
              Top Selling Products
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout style={{ padding: '24px', backgroundColor: '#f0f2f5' }}>
          <Content style={{ padding: 24, margin: 0, backgroundColor: '#fff', minHeight: 280 }}>
            {renderContent()}
          </Content>
        </Layout>
      </Layout>
      <Modal
        title="Logout"
        visible={showLogoutModal}
        onOk={confirmLogout}
        onCancel={cancelLogout}
        okText="Yes"
        cancelText="No"
      >
        <p>Are you sure you want to logout?</p>
      </Modal>
    </Layout>
  );
};

export default Admin;
