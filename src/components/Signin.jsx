import React, { useState } from 'react';
import db, { auth } from '../lib/firebase'; // Adjust the import path as needed
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, query, where, getDocs } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { useLocalContext } from '../context/context';
import { Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Button, Form, Input, Typography } from 'antd';
import backgroundImage from '../assets/bg signup.svg';

const { Title, Text } = Typography;

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { setLoggedInUser, setUserRole } = useLocalContext();
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignin = async (values) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;
      setLoggedInUser(user);

      const userData = await getUserData(values.email);

      if (userData) {
        setUserRole(userData.role); // Set the user role in context
        if (userData.role === 'admin') {
          navigate('/admin');
        } else if (userData.role === 'seller') {
          navigate('/seller');
        } else {
          navigate('/home');
        }
      } else {
        toast.error('User role not found!');
      }

      toast.success('Signed in successfully!');
    } catch (error) {
      setError(error.message);
      toast.error('Failed to sign in!');
    }
  };

  // Function to fetch user data from Firestore
  const getUserData = async (email) => {
    try {
      const q = query(collection(db, 'users'), where('email', '==', email));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        return querySnapshot.docs[0].data();
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error fetching user data: ', error);
      return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-between bg-white">
      <div className="w-auto sm:w-[40vw] sm:mx-auto bg-white p-8 mx-auto rounded-lg shadow-lg">
        <Title level={2} className="text-center text-gray-800">Sign In</Title>
        {error && <Text type="danger" className="text-center mb-4">{error}</Text>}
        <Form
          layout="vertical"
          onFinish={handleSignin}
          initialValues={{ email: '', password: '' }}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please enter your email' }]}
          >
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="border-b-2 border-gray-300 focus:border-blue-500"
              style={{ border: 'none', borderBottom: '1px solid #d9d9d9' }}
            />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="border-b-2 border-gray-300 focus:border-blue-500"
              style={{ border: 'none', borderBottom: '1px solid #d9d9d9' }}
              iconRender={visible => (visible ? <FaEyeSlash /> : <FaEye />)}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Sign In
            </Button>
          </Form.Item>
        </Form>
        <div className="flex justify-between items-center">
          <Text>Don't have an account? <Link to='/signup' className="text-blue-500 hover:underline">Signup</Link></Text>
        </div>
      </div>
      <img src={backgroundImage} className='h-screen hidden sm:block' alt="" />
      <ToastContainer />
    </div>
  );
};

export default Signin;
