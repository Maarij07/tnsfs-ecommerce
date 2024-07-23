import React from 'react';
import { IoMdContact } from "react-icons/io";
import { MdOutlineShoppingCart } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import logo from '../assets/bg logo.jpeg';
import { IoGameControllerOutline } from "react-icons/io5";
import { MdOutlineChair } from "react-icons/md";
import { GiJug } from "react-icons/gi";
import { IoShirtOutline } from "react-icons/io5";
import { GoHome } from "react-icons/go";

const NavBar = () => {
  return (
    <nav className="bg-stone-200 shadow-xl fixed top-0 left-0 w-full h-16 flex flex-row justify-between items-center">
      <div className="flex items-center">
        <img src={logo} alt="Logo" className="h-[10.2vh]" />
      </div>
      <div className="flex flex-row space-x-4 justify-items-between">
        <span className="flex items-center justify-center w-10 h-10 rounded-full">
          <IoShirtOutline className='h-8 w-8' />
        </span>
        <span className="flex items-center justify-center w-10 h-10  rounded-full">
          <GoHome className='h-8 w-8' />
        </span>
        <span className="flex items-center justify-center w-10 h-10 rounded-full">
          <MdOutlineChair className='h-8 w-8' />
        </span>
        <span className="flex items-center justify-center w-10 h-10 rounded-full">
          <GiJug className='h-8 w-8' />
        </span>
        <span className="flex items-center justify-center w-10 h-10 rounded-full">
          <IoGameControllerOutline className='h-8 w-8' />
        </span>

      </div>
      <div className="flex flex-row space-x-4 justify-center">
        <div className="border-gray-400 border-2 bg-white hover:bg-gray-100 text-black font-normal py-0.5 flex items-center gap-4 px-4 my-2 rounded-full">
          <CiSearch className=" border-white my-2 text-black" />
          <input className='active:border-none' type="text" placeholder='Search for Products' name="" id="" />
        </div>
        <span className="flex items-center my-2 justify-center w-8 h-8 border-2 border-gray-400 rounded-full">
          <IoMdContact className='h-6 w-6  text-black' />
        </span>
        <span className="flex items-center my-2 justify-center w-8 h-8 border-2 border-gray-400  rounded-full">
          <MdOutlineShoppingCart className='h-6 w-6 text-black' />
        </span>
      </div>
    </nav>
  );
};

export default NavBar;