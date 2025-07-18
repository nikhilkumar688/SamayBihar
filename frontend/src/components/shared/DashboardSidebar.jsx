import { signOutSuccess } from "@/redux/user/userSlice";
import React from "react";
import { FaUserEdit, FaSignOutAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { IoIosCreate, IoIosDocument } from "react-icons/io";
const DashboardSidebar = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signOutSuccess());
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <aside className="h-screen w-64 bg-gradient-to-b from-[#c6edff] to-[#000a4d] text-[#0b0544] font-sans font-bold flex flex-col">
      {/* Logo Header */}
      <div className="p-4 flex items-center justify-center">
        <img
          src="https://cdn-icons-png.flaticon.com/128/7718/7718841.png"
          alt="Dashboard Icon"
          className="w-8 h-8 mt-4 mr-2 animate-spin-slow"
        />
        <h1 className="text-3xl mt-4 font-bold font-sans text-[#190096]">
          Dashboard
        </h1>
      </div>

      {/* Sidebar Items */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <Link
              to="/dashboard?tab=profile"
              className="group flex items-center p-2 hover:text-white hover:bg-rose-500 rounded"
            >
              <FaUserEdit className="mr-2 transition-transform duration-300 group-hover:text-white group-hover:animate-bounce" />
              <span>Profile</span>
            </Link>
          </li>
          {currentUser && currentUser.isAdmin && (
            <li>
              <Link
                to="/create-post"
                className="group flex items-center p-2 hover:text-white hover:bg-rose-500 rounded"
              >
                <IoIosCreate className="mr-2 transition-transform duration-300 group-hover:text-white group-hover:animate-bounce" />
                <span>Create Post</span>
              </Link>
            </li>
          )}

          {currentUser && currentUser.isAdmin && (
            <li>
              <Link
                to="/dashboard?tab=posts"
                className="group flex items-center p-2 hover:text-white hover:bg-rose-500 rounded"
              >
                <IoIosDocument className="mr-2 transition-transform duration-300 group-hover:text-white group-hover:animate-bounce" />
                <span>Your articles</span>
              </Link>
            </li>
          )}
        </ul>

        {/* Log Out Button */}
        <div className="p-4 mt-4 ml-2 border-t border-gray-700">
          <button
            className="group flex items-center text-2xl w-full p-2 hover:text-white hover:bg-rose-500 rounded"
            onClick={handleSignout}
          >
            <FaSignOutAlt className="mr-2 ml-1 mt-1 transition-transform duration-300 group-hover:animate-bounce group-hover:text-white" />
            <span>Log Out</span>
          </button>
        </div>
      </nav>
    </aside>
  );
};

export default DashboardSidebar;
