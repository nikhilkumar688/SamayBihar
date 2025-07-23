import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import BottomNavBar from "@/components/shared/BottomNavBar";
import DashboardSidebar from "@/components/shared/DashboardSidebar";
import DashboardProfile from "@/components/shared/DashboardProfile";
import DashboardPosts from "@/components/shared/DashboardPosts";
import DashboardUsers from "@/components/shared/DashboardUsers";
import DashboardComments from "@/components/shared/DashboardComments";
import MainDashboard from "@/components/shared/MainDashboard";

const Dashboard = () => {
  const location = useLocation();
  const [tab, setTab] = useState("dashboard");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    const validTabs = ["profile", "posts", "users", "comments", "dashboard"];
    if (tabFromUrl && validTabs.includes(tabFromUrl)) {
      setTab(tabFromUrl);
    } else {
      setTab("dashboard");
    }
  }, [location.search]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [tab]);

  const tabComponents = {
    profile: <DashboardProfile />,
    posts: <DashboardPosts />,
    users: <DashboardUsers />,
    comments: <DashboardComments />,
    dashboard: <MainDashboard />,
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row w-full">
      {/* Sidebar */}
      <div className="hidden md:block">
        <DashboardSidebar />
      </div>

      <BottomNavBar />

      <div className="w-full">{tabComponents[tab] || <MainDashboard />}</div>
    </div>
  );
};

export default Dashboard;
