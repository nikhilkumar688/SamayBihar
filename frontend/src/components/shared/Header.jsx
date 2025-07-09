import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { Button } from "../ui/button";

const Header = () => {
  const [time, setTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  // Format date and time
  const formattedDate = time.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const formattedTime = time.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  return (
    <header className="shadow-md sticky top-0 bg-rose-200 z-50">
      <div className="flex flex-wrap items-center justify-between max-w-7xl mx-auto px-4 py-3 gap-4">
        {/* Logo */}
        <div className="flex items-center hover:animate-pulse">
          <Link to="/" className="flex items-center px-0">
            <img
              src="/logo.svg"
              alt="BiharNext Logo"
              className="h-10 sm:h-14 w-auto object-contain"
            />
          </Link>
        </div>

        {/* Clock */}
        <div className="text-sm sm:text-base text-slate-700 text-center font-semibold font-medium hidden sm:block">
          <p className="text-orange-600">{formattedDate}</p>
          <p className="text-green-700">{formattedTime}</p>
        </div>

        {/* Search Bar */}
        <div className="flex-1 flex justify-center">
          <form className="bg-slate-100 rounded-lg flex items-center px-3 py-1 w-full max-w-md">
            <input
              type="text"
              placeholder="Search..."
              className="focus:outline-none bg-transparent w-full"
            />
            <button type="submit" className="hover:animate-bounce">
              <FaSearch className="text-slate-600" />
            </button>
          </form>
        </div>

        {/* Navigation Links and Sign In */}
        <div className="flex items-center gap-4">
          <ul className="hidden lg:flex items-center gap-4 text-slate-700 font-medium">
            <li className="hover:text-white hover:bg-rose-500 hover:rounded-md hover:p-1 hover:shadow-md">
              <Link to="/">Home</Link>
            </li>
            <li className="hover:text-white hover:bg-rose-500 hover:rounded-md hover:shadow-md hover:p-1">
              <Link to="/about">About</Link>
            </li>
            <li className="hover:text-white hover:bg-rose-500 hover:rounded-md hover:shadow-md hover:p-1">
              <Link to="/news">News Article</Link>
            </li>
          </ul>
          <Link to="/sign-in">
            <Button className="px-4 py-2 shadow-md hover:shadow:md bg-rose-800 hover:bg-rose-500 font-semibold hover:font-semibold">
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
