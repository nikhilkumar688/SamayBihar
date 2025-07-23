import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignInForm from "./auth/forms/SignInForm";
import SignUpForm from "./auth/forms/SignUpForm";
import Home from "./pages/Home";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import Search from "./pages/Search";
import Header from "./components/shared/Header";
import Footer from "./components/shared/Footer";
import PrivateRoute from "./components/shared/PrivateRoute";
import AdminPrivateRoute from "./components/shared/AdminPrivateRoute";
import CreatePost from "./pages/CreatePost";
import EditPost from "./pages/EditPost";
import PostDetails from "./pages/PostDetails";
import ScrollToTop from "./components/shared/ScrollToTop";
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

        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<AdminPrivateRoute />}>
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/update-post/:postId" element={<EditPost />} />
        </Route>

        {/* Catch-all for 404 */}
        <Route
          path="*"
          element={
            <h1 className="text-center text-3xl py-10">404 - Page Not Found</h1>
          }
        />
      </Routes>
      <Footer />
      <Toaster />
    </BrowserRouter>
  );
};

export default App;
