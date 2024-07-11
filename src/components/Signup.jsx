import React, { useState } from 'react';
import { auth } from '../lib/firebase';
import db from '../lib/firebase';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import backgroundImage from '../assets/bg signup.svg';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('');
  const [mobile, setMobile] = useState('');
  const [error, setError] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    const newError = {};
  
    if (!username) newError.username = "Username is required";
    if (!email) newError.email = "Email is required";
    if (!password) newError.password = "Password is required";
    if (!confirmPassword) newError.confirmPassword = "Confirm Password is required";
    if (!role) newError.role = "Role is required";
    if (!mobile) newError.mobile = "Mobile number is required";
    if (!/^\d{10}$/.test(mobile)) newError.mobile = "Mobile number must be 10 digits long";
    if (password !== confirmPassword) newError.confirmPassword = "Passwords do not match";
  
    setError(newError);
  
    if (Object.keys(newError).length > 0) return;
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      // Add '0' before the mobile number
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
  

  return (
    <div className="min-h-screen flex items-center justify-between bg-zinc-300">
      <ToastContainer />
      <div className="bg-zinc-200 p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        {error.general && <p className="text-red-500 text-center mb-4">{error.general}</p>}
        <form onSubmit={handleSignup} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className={`w-full px-3 py-2 border-b ${error.username ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:border-blue-500`}
              />
              {error.username && <p className="text-red-500 text-sm mt-1">{error.username}</p>}
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className={`w-full px-3 py-2 border-b ${error.email ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:border-blue-500`}
              />
              {error.email && <p className="text-red-500 text-sm mt-1">{error.email}</p>}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className={`w-full px-3 py-2 border-b ${error.password ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:border-blue-500`}
              />
              <div
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                <span className='mt-[5vh]'>{showPassword ? <FaEyeSlash /> : <FaEye />}</span>
              </div>
              {error.password && <p className="text-red-500 text-sm mt-1">{error.password}</p>}
            </div>
            <div className="relative">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className={`w-full px-3 py-2 border-b ${error.confirmPassword ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:border-blue-500`}
              />
              <div
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <span className='mt-[5vh]'>{showConfirmPassword ? <FaEyeSlash /> : <FaEye />}</span>
              </div>
              {error.confirmPassword && <p className="text-red-500 text-sm mt-1">{error.confirmPassword}</p>}
            </div>
          </div>
          <div>
            <div className='flex w-full justify-between'>
              <div className="w-1/2">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
                  Role
                </label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className={`w-[21.6vw] flex px-3 py-2 border-b ${error.role ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:border-blue-500`}
                >
                  <option value="">Select Role</option>
                  <option value="customer">Customer</option>
                  <option value="seller">Seller</option>
                </select>
                {error.role && <p className="text-red-500 text-sm mt-1">{error.role}</p>}
              </div>
              <div className="w-[21.6vw]">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="mobile">
                  Mobile Number
                </label>
                <div className="flex items-center">
                  <div className="flex items-center bg-white border-b border-gray-300 px-2 py-2 text-gray-700">
                    +92
                  </div>
                  <input
                    id="mobile"
                    type="text"
                    value={mobile}
                    onChange={(e) => {
                      const inputMobile = e.target.value.replace(/\D/g, ''); // Remove any non-digit characters
                      setMobile(inputMobile);
                    }}
                    placeholder="Enter your mobile number"
                    className={`flex-grow px-3 py-2 border-b ${error.mobile ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:border-blue-500`}
                  />
                </div>
                {error.mobile && <p className="text-red-500 text-sm mt-1">{error.mobile}</p>}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
            >
              Sign Up
            </button>
            <p>Already have an account? <Link to='/' className="text-blue-500 hover:underline">Login</Link></p>
          </div>
        </form>
      </div>

      <img src={backgroundImage} className='h-screen bg-green-500' alt="" />
    </div>
  );
};

export default Signup;
