import { signOutSuccess } from "@/redux/user/userSlice";
import React from "react";
import { FaHome, FaSignOutAlt, FaUserAlt } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
const BottomNavBar = () => {
  const dispatch = useDispatch();
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
    <nav
      className="md:hidden font-bold fixed bottom-0 left-0 right-0 bg-[#c6edff] border-t border-black
     p-2 flex justify-around"
    >
      <Link to="/" className="flex flex-col items-center text-slate-800 ">
        <FaHome size={20} />
        <span className="text-xs">Home</span>
      </Link>
      <Link
        to="/dashboard?tab=profile"
        className="flex flex-col items-center text-slate-800 "
      >
        <FaUserAlt size={20} />
        <span className="text-xs">Profile</span>
      </Link>
      <button
        className="flex flex-col items-center text-slate-800 "
        onClick={handleSignout}
      >
        <FaSignOutAlt size={20} />
        <span className="text-xs">Logout</span>
      </button>
    </nav>
  );
};
export default BottomNavBar;
