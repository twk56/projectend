import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const AdminApproveUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('/api/admin/unapproved-users', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(response => {
      setUsers(response.data);
    })
    .catch(error => {
      console.error('Error fetching unapproved users:', error);
    });
  }, []);
  const approveUser = (userId) => {
    axios.patch(`/api/admin/approve-user/${userId}`, {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(() => {
      setUsers(users.filter(user => user._id !== userId));
    })
    .catch(error => {
      console.error('Error approving user:', error);
    });
  };

  return (
    <div className="max-w-3xl mx-auto p-6 mt-10 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">👥 ผู้ใช้ที่รอการอนุมัติ</h2>
      <ul className="space-y-4">
        <AnimatePresence>
          {users.map(user => (
            <motion.li
              key={user._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-between bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div>
                <p className="text-lg font-medium text-gray-700">{user.fullName}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              <button
                onClick={() => approveUser(user._id)}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                ✅ อนุมัติ
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      {users.length === 0 && (
        <p className="text-center text-gray-400 mt-10">ไม่มีผู้ใช้ที่รอการอนุมัติ 🎉</p>
      )}
    </div>
  );
};

export default AdminApproveUsers;
