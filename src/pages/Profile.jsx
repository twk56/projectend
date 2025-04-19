import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile, uploadProfilePicture } from "../utils/api";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("กรุณาเข้าสู่ระบบก่อน");
        navigate("/login");
        return;
      }

      try {
        const res = await getProfile();
        setProfile(res.data);
        setLoading(false);
      } catch (err) {
        alert("โหลดข้อมูลผิดพลาด");
        navigate("/login");
      }
    };

    fetchProfile();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await uploadProfilePicture(formData);
      setProfile((prev) => ({
        ...prev,
        profileImage: res.data.url,
      }));
    } catch (err) {
      alert("อัปโหลดรูปผิดพลาด");
    } finally {
      setUploading(false);
    }
  };

  const roleMapping = {
    User: "นักศึกษา",
    Admin: "ผู้ดูแลระบบ",
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center px-4 py-12 animate-fade-in-down">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 transition-all duration-500 hover:shadow-2xl hover:scale-[1.01]">
        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto" />
            <div className="h-6 bg-gray-300 rounded w-3/4 mx-auto" />
            <div className="h-5 bg-gray-300 rounded w-full" />
            <div className="h-5 bg-gray-300 rounded w-full" />
            <div className="h-5 bg-gray-300 rounded w-full" />
          </div>
        ) : (
          <>
            <div className="relative mb-6 text-center">
              <img
                src={
                  profile.profileImage &&
                  profile.profileImage !== "/uploads/default.png"
                    ? profile.profileImage
                    : `https://ui-avatars.com/api/?name=${profile.fullName}&background=random`
                }
                alt="Profile"
                className="w-24 h-24 rounded-full mx-auto shadow-md object-cover"
              />
              {/* <label className="block mt-3 cursor-pointer text-sm text-indigo-600 hover:underline">
                {uploading ? "กำลังอัปโหลด..." : "เปลี่ยนรูปโปรไฟล์"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label> */}
            </div>

            <h2 className="text-2xl font-bold text-center text-indigo-600 mb-4">
              โปรไฟล์ของคุณ
            </h2>

            <div className="space-y-3 text-gray-700 text-base">
              <div>
                <strong>ชื่อ-นามสกุล:</strong> {profile.fullName}
              </div>
              <div>
                <strong>อีเมล:</strong> {profile.email}
              </div>
              <div>
                <strong>รหัสนักศึกษา:</strong> {profile.studentId}
              </div>
              <div>
                <strong>สถานะผู้ใช้:</strong>
                <span className="capitalize">
                  {roleMapping[profile.role] || profile.role}
                </span>
              </div>
              {/* <div><strong>เข้าใช้งานล่าสุด:</strong> {new Date(profile.lastLogin).toLocaleString()}</div> */}
              {/* <div>
                <strong>สถานะอนุมัติ:</strong>{" "}
                <span className={profile.isApproved ? "text-green-600 font-semibold" : "text-red-600"}>
                  {profile.isApproved ? "ได้รับการอนุมัติแล้ว" : "ยังไม่อนุมัติ"}
                </span>
              </div> */}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
