import React from 'react';

const NavBar = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between border-b-0">
        {/* Website Name */}
        <div className="text-2xl font-bold text-[#2851E3]">
          <a href="/" className="hover:text-[#0033A0]">YourWebsiteName</a>
        </div>

        {/* Search Bar with Icons */}
        <div className="relative flex items-center w-1/2">
          {/* Filter Icon */}
          <button className="absolute left-0 ml-3 p-2 rounded-full hover:bg-blue-100 focus:outline-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-[#2851E3]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 8h16M4 12h16M4 16h16"
              />
            </svg>
          </button>
          <input
            type="text"
            className="w-full rounded-full border border-transparent pl-12 pr-12 py-2 shadow-lg focus:outline-none focus:border-[#2851E3] placeholder-gray-500"
            placeholder="Search"
          />
          {/* Search Icon */}
          <button className="absolute right-0 mr-3 p-2 rounded-full hover:bg-blue-100 focus:outline-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-[#2851E3]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35M11 17a6 6 0 110-12 6 6 0 010 12z"
              />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
