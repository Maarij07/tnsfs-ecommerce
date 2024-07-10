import React from 'react';
import { FaTrashAlt } from 'react-icons/fa';

const AdminCustomers = ({ customers, handleDelete }) => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Customers</h2>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b border-gray-200">Username</th>
            <th className="py-2 px-4 border-b border-gray-200">Email</th>
            <th className="py-2 px-4 border-b border-gray-200">Mobile</th>
            <th className="py-2 px-4 border-b border-gray-200">Action</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((user, index) => (
            <tr key={index}>
              <td className="py-2 px-4 border-b border-gray-200">{user.username}</td>
              <td className="py-2 px-4 border-b border-gray-200">{user.email}</td>
              <td className="py-2 px-4 border-b border-gray-200">{user.mobile}</td>
              <td className="py-2 px-4 border-b border-gray-200">
                <button
                  onClick={() => handleDelete(user.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrashAlt />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminCustomers;
