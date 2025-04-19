import React, { useState } from 'react';
import { Transition } from '@headlessui/react';

const AddRoom = ({ open, handleClose, handleAddRoom }) => {
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomImage, setNewRoomImage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewRoomImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setNewRoomImage('');
    }
  };

  const handleSubmit = async () => {
    if (!newRoomName.trim()) {
      alert('กรุณาระบุชื่อห้อง');
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("name", newRoomName);

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${BASE_URL}/api/upload`, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      const data = await response.json();

      if (response.ok) {
        handleAddRoom(newRoomName, data.imageUrl);
        setNewRoomName('');
        setNewRoomImage('');
        setSelectedFile(null);
        handleClose();
      } else {
        alert(data.error || 'เกิดข้อผิดพลาดในการอัปโหลด');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์');
    }
  };

  if (!open) return null;

  return (
    <Transition
      show={open}
      enter="transition-opacity duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-200"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-black opacity-50"
          onClick={handleClose}
        ></div>
        {/* Modal */}
        <div className="relative bg-white rounded-lg shadow-lg z-10 w-full max-w-md mx-4 p-6 transform transition-all duration-300">
          <h2 className="text-2xl font-bold mb-4 text-center">เพิ่มห้องใหม่</h2>
          <div className="mb-4">
            <label className="block text-gray-700">ชื่อห้อง</label>
            <input
              type="text"
              className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              autoFocus
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">รูปภาพ</label>
            <input
              accept="image/*"
              type="file"
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              onChange={handleFileUpload}
            />
          </div>
          {newRoomImage && (
            <div className="mb-4">
              <img
                src={newRoomImage}
                alt="Preview"
                className="w-full max-h-48 object-cover rounded"
              />
            </div>
          )}
          <div className="flex justify-end space-x-4">
            <button
              onClick={handleClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
            >
              ยกเลิก
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              บันทึก
            </button>
          </div>
        </div>
      </div>
    </Transition>
  );
};

export default AddRoom;
