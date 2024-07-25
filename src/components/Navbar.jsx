import React from 'react';
import { IoMdContact } from "react-icons/io";
import { MdOutlineShoppingCart } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import logo from '../assets/logo.png';
import { IoGameControllerOutline } from "react-icons/io5";
import { MdOutlineChair } from "react-icons/md";
import { GiJug } from "react-icons/gi";
import { IoShirtOutline } from "react-icons/io5";
import { GoHome } from "react-icons/go";

const NavBar = () => {
  return (
    <nav className="bg-white shadow-md z-20 fixed top-0 left-0 w-full h-16 flex items-center justify-between px-6">
      <div className="flex items-center">
        <img src={logo} alt="Logo" className="h-14" />
      </div>
      <div className="flex space-x-4">
        <span className="flex items-center justify-center hover:bg-gray-100 transition duration-200 p-2">
          <IoShirtOutline className='h-6 w-6' />
        </span>
        <span className="flex items-center justify-center hover:bg-gray-100 transition duration-200 p-2">
          <GoHome className='h-6 w-6' />
        </span>
        <span className="flex items-center justify-center hover:bg-gray-100 transition duration-200 p-2">
          <MdOutlineChair className='h-6 w-6' />
        </span>
        <span className="flex items-center justify-center hover:bg-gray-100 transition duration-200 p-2">
          <GiJug className='h-6 w-6' />
        </span>
        <span className="flex items-center justify-center hover:bg-gray-100 transition duration-200 p-2">
          <IoGameControllerOutline className='h-6 w-6' />
        </span>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center bg-gray-100 border-2 border-gray-300 rounded-full px-4 py-2">
          <CiSearch className="text-gray-500" />
          <input
            className="bg-transparent focus:outline-none ml-2 w-64"
            type="text"
            placeholder="Search for Products"
          />
        </div>
        <span className="flex items-center justify-center hover:bg-gray-100 transition duration-200 p-2 border-2 border-transparent">
          <IoMdContact className='h-6 w-6 text-gray-700' />
        </span>
        <span className="flex items-center justify-center hover:bg-gray-100 transition duration-200 p-2 border-2 border-transparent">
          <MdOutlineShoppingCart className='h-6 w-6 text-gray-700' />
        </span>
      </div>
    </nav>
  );
};

export default NavBar;
