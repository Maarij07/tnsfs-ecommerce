import React from 'react';

const NavBar = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Icons */}
          <a href="/" className="text-gray-600 hover:text-gray-800">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </a>
          {/* Add 7 more icons here */}
          {Array.from({ length: 7 }).map((_, index) => (
            <a href="/" className="text-gray-600 hover:text-gray-800" key={index}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </a>
          ))}
        </div>
        <div className="flex items-center">
          <div className="relative">
            <input
              type="text"
              className="rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:border-blue-500"
              placeholder="Search"
            />
            <button className="absolute right-0 top-0 mt-2 mr-2 px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-600"
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
      </div>
    </nav>
  );
};

export default NavBar;
