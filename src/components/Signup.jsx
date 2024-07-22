import React, { useState, useEffect } from 'react';
import { auth } from '../lib/firebase';
import db from '../lib/firebase';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import backgroundImage from '../assets/bg signup.svg';
import { Form, Input, Button, Select, Typography, Tooltip, Modal } from 'antd';

const { Title, Text } = Typography;
const { Option } = Select;

const Signup = () => {
  const [form] = Form.useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState({});
  const [role, setRole] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formValues, setFormValues] = useState({});
  const [isButtonDisabled, setIsButtonDisabled] = useState(true); // State to manage the button disabled state
  const [countdown, setCountdown] = useState(5); // State for countdown timer
  const navigate = useNavigate();

  const handleSignup = async () => {
    const { username, email, password, confirmPassword, role, mobile } = formValues;
    const newError = {};

    if (password !== confirmPassword) {
      newError.confirmPassword = "Passwords do not match";
    }

    setError(newError);

    if (Object.keys(newError).length > 0) return;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const formattedMobile = `0${mobile}`;
      await setDoc(doc(db, "users", user.email), {
        username,
        email: user.email,
        role,
        mobile: formattedMobile,
      });
      toast.success('Account created successfully!');
      navigate('/');
      console.log('User created:', user);
    } catch (error) {
      setError({ general: error.message });
    }
  };

  const handleFormFinish = (values) => {
    setFormValues(values);
    if (values.role === 'seller') {
      setRole(values.role);  // Ensure role is set
      setIsModalVisible(true);

      // Reset countdown and disable button
      setCountdown(5);
      setIsButtonDisabled(true);

      // Start countdown timer
      const countdownInterval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            setIsButtonDisabled(false); // Enable the button
            return 0;
          }
          return prev - 1;
        });
      }, 1000); // Update countdown every second
    } else {
      handleSignup();
    }
  };

  const handleModalOk = () => {
    handleSignup();
    setIsModalVisible(false);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center sm:justify-between bg-white">
      <ToastContainer />
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <Title level={2} className="text-center text-gray-800">Sign Up</Title>
        {error.general && <Text type="danger" className="text-center mb-4">{error.general}</Text>}
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormFinish}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label="Username"
              name="username"
              rules={[{ required: true, message: 'Username is required' }]}
            >
              <Input
                placeholder="Enter your username"
                className="border-b border-0 border-b-2 border-gray-300"
              />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: 'Email is required' }]}
            >
              <Input
                type="email"
                placeholder="Enter your email"
                className="border-b border-0 border-b-2 border-gray-300"
              />
            </Form.Item>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: 'Password is required' }]}
              hasFeedback
            >
              <Input.Password
                placeholder="Enter your password"
                className="border-b border-0 border-b-2 border-gray-300"
                iconRender={visible => (visible ? <FaEyeSlash /> : <FaEye />)}
              />
            </Form.Item>
            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              dependencies={['password']}
              hasFeedback
              rules={[
                { required: true, message: 'Confirm Password is required' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('The two passwords do not match!'));
                  },
                }),
              ]}
            >
              <Input.Password
                placeholder="Confirm your password"
                className="border-b border-0 border-b-2 border-gray-300"
                iconRender={visible => (visible ? <FaEyeSlash /> : <FaEye />)}
              />
            </Form.Item>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label="Role"
              name="role"
              rules={[{ required: true, message: 'Role is required' }]}
            >
              <Select
                placeholder="Select Role"
                className="border-b border-0 border-b-2 border-gray-300"
                onChange={value => setRole(value)}
              >
                <Option value="customer">Customer</Option>
                <Option value="seller">Seller</Option>
              </Select>
            </Form.Item>
            <Tooltip
              title="Make sure you have a payment system activated on this number"
              visible={role === 'seller'}
              placement="topRight"
            >
              <Form.Item
                label="Mobile Number"
                name="mobile"
                rules={[
                  { required: true, message: 'Mobile number is required' },
                  { pattern: /^\d{10}$/, message: 'Mobile number must be 10 digits long' },
                ]}
              >
                <Input
                  addonBefore="+92"
                  placeholder="Enter your mobile number"
                  className="border-b border-0 border-b-2 border-gray-300"
                />
              </Form.Item>
            </Tooltip>
          </div>
          <div className="flex flex-col items-center">
            <Button
              type="primary"
              htmlType="submit"
              block
              className="mb-4"
            >
              Sign Up
            </Button>
            <p>Already have an account? <Link to='/' className="text-blue-500 hover:underline">Login</Link></p>
          </div>
        </Form>
      </div>

      <img src={backgroundImage} className='h-screen hidden sm:block' alt="Background" />

      <Modal
        title="Confirmation"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Yes"
        cancelText="No"
        okButtonProps={{ disabled: isButtonDisabled }} // Disable the OK button initially
      >
        <p>Are you sure you have an Easypaisa, JazzCash, or SadaPay on this number: <span className="font-bold">{`0${formValues.mobile}`}</span> </p>
        <p className='text-red-500'>You would not be able to change this number later</p>
        <p className="text-center text-gray-500">You can proceed in {countdown} seconds</p>
      </Modal>
    </div>
  );
};

export default Signup;
