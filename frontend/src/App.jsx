import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import Search from "./pages/Search";
import CreatePost from "./pages/CreatePost";
import EditPost from "./pages/EditPost";
import PostDetails from "./pages/PostDetails";

// Auth
import SignInForm from "./auth/forms/SignInForm";
import SignUpForm from "./auth/forms/SignUpForm";

// Shared Components
import Header from "./components/shared/Header";
import Footer from "./components/shared/Footer";
import ScrollToTop from "./components/shared/ScrollToTop";
import PrivateRoute from "./components/shared/PrivateRoute";
import AdminPrivateRoute from "./components/shared/AdminPrivateRoute";

// UI
import { Toaster } from "./components/ui/toaster";

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignInForm />} />
        <Route path="/sign-up" element={<SignUpForm />} />
        <Route path="/about" element={<About />} />
        <Route path="/search" element={<Search />} />
        <Route path="/news" element={<Search />} />
        <Route path="/post/:postSlug" element={<PostDetails />} />

        {/* Protected Routes (User) */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<AdminPrivateRoute />}>
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/update-post/:postId" element={<EditPost />} />
        </Route>

        {/* 404 Route */}
        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center">
              <h1 className="text-3xl font-semibold text-red-500">
                404 - Page Not Found
              </h1>
            </div>
          }
        />
      </Routes>
      <Footer />
      <Toaster />
    </BrowserRouter>
  );
};

export default App;
