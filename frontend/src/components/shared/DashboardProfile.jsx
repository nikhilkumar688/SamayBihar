import React from "react";
import { useSelector } from "react-redux";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
const DashboardProfile = () => {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">
        Update Your Profile
      </h1>
      <form className="flex flex-col gap-4">
        <div className="w-32 h-32 self-center cursor-pointer overflow-hidden">
          <img
            src={currentUser.profilePicture}
            alt=""
            className="rounded-full w-full h-full object-cover border-8 border-green-600"
          />
        </div>
        <Input
          type="text"
          id="username"
          placeholder="username"
          defaultValue={currentUser.username}
          className="h-12 border-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        <Input
          type="email"
          id="email"
          placeholder="email"
          defaultValue={currentUser.email}
          className="h-12 border-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0"
          disabled
        />
        <Input
          type="password"
          id="password"
          placeholder="password"
          className="h-12 border-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        <Button
          type="submit"
          className="h-12 bg-orange-600 text-[#000e4a] font-bold hover:bg-green-500"
        >
          Update Profile
        </Button>
      </form>
      <div className="text-red-500 flex justify-between mt-5 cursor-pointer">
        <span>Delete Account</span>
        <span>Sign Out</span>
      </div>
    </div>
  );
};
export default DashboardProfile;
