import React, { useState } from 'react';
import { auth } from '../lib/firebase';
import { signInWithEmailAndPassword } from "firebase/auth";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom'; // Import useNavigate instead of useHistory
import { useLocalContext } from '../context/context';
import { Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import backgroundImage from '../assets/bg signup.svg'; 
const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const { setLoggedInUser } = useLocalContext();
  const navigate = useNavigate(); // Use useNavigate for navigation in React Router v6

  const handleSignin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      setLoggedInUser(user);

      // Check user role from Firestore
      // Replace 'email' with the appropriate user identifier (e.g., UID) if necessary
      const userData = await getUserData(email); // Assuming a function to fetch user data from Firestore

      if (userData && userData.role === 'admin') {
        navigate('/admin'); // Redirect to Admin component if user is admin
      } else {
        navigate('/home'); // Redirect to Home component for other users
      }

      toast.success('Signed in successfully!');
    } catch (error) {
      setError(error.message);
      toast.error('Failed to sign in!');
    }
  };

  // Function to fetch user data from Firestore
  const getUserData = async (email) => {
    // Implement your logic to fetch user data from Firestore
    // Example:
    // const userRef = db.collection('users').doc(email);
    // const doc = await userRef.get();
    // return doc.data();
    return null; // Replace with actual implementation
  };

  return (
    <div className="min-h-screen flex items-center  bg-zinc-300 justify-between">
      <div className="w-[40vw] bg-zinc-200 p-8 mx-auto rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
        {error && <p className="text-red-.com/500500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSignin}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-3 py-2 border-b border-gray-300 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-6 relative">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-3 py-2 border-b border-gray-300 focus:outline-none focus:border-blue-500"
            />
            <div
              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              <span className='mt-[5vh]'>{showPassword ? <FaEyeSlash /> : <FaEye />}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
            >
              Sign In
            </button>
            <p>Don't have an account? <Link to='/signup' className="text-blue-500 hover:underline">Signup</Link></p>
          </div>
        </form>
      </div>
      <img src={backgroundImage} className='h-screen bg-green-500' alt="" />
    </div>
  );
};

export default Signin;