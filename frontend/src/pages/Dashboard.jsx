import BottomNavBar from "@/components/shared/BottomNavBar";
import DashboardPosts from "@/components/shared/DashboardPosts";
import DashboardProfile from "@/components/shared/DashboardProfile";
import DashboardSidebar from "@/components/shared/DashboardSidebar";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
const Dashboard = () => {
  const location = useLocation();
  const [tab, setTab] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    //console.log(tabFromUrl);
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  return (
    <div className="min-h-screen flex flex-col md:flex-row w-full">
      {/*Sidebar */}
      <div className="hidden md:block">
        <DashboardSidebar />
      </div>
      <BottomNavBar />

      <div className="w-full">
        {/*profile */}
        {tab === "profile" && <DashboardProfile />}
        {/*news articles */}
        {tab === "posts" && <DashboardPosts />}
      </div>
    </div>
  );
};
export default Dashboard;
