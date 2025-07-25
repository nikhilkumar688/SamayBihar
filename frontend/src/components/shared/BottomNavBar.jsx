import { signOutSuccess } from "@/redux/user/userSlice";
import React from "react";
import { FaHome, FaSignOutAlt, FaUserAlt } from "react-icons/fa";
import { IoIosCreate, IoIosDocument } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

// ✅ Add BASE_URL for backend
const BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "https://samaybihar-xdtd.onrender.com";

const BottomNavBar = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  const handleSignout = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/user/signout`, {
        method: "POST",
        credentials: "include", // ✅ if using cookies
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
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 w-full bg-[#c6edff] border-t border-black 
      p-2 flex justify-around font-bold shadow-[0_-2px_10px_rgba(0,0,0,0.1)]"
    >
      <Link
        to="/dashboard?tab=profile"
        className="flex flex-col items-center text-slate-800"
      >
        <FaUserAlt size={20} />
        <span className="text-xs">Profile</span>
      </Link>

      {currentUser?.isAdmin && (
        <Link
          to="/create-post"
          className="flex flex-col items-center text-slate-800"
        >
          <IoIosCreate size={20} />
          <span className="text-xs">Create Post</span>
        </Link>
      )}

      {currentUser?.isAdmin && (
        <Link
          to="/dashboard?tab=posts"
          className="flex flex-col items-center text-slate-800"
        >
          <IoIosDocument size={20} />
          <span className="text-xs">Posts</span>
        </Link>
      )}

      <button
        className="flex flex-col items-center text-slate-800"
        onClick={handleSignout}
      >
        <FaSignOutAlt size={20} />
        <span className="text-xs">Logout</span>
      </button>
    </nav>
  );
};

export default BottomNavBar;
