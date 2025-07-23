import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PostCard from "@/components/shared/PostCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

const BACKEND =
  import.meta.env.VITE_BACKEND_URL || "https://sb-4z7m.onrender.com";

const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    sort: "desc",
    category: "",
  });
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    setSidebarData({
      searchTerm: params.get("searchTerm") || "",
      sort: params.get("sort") || "desc",
      category: params.get("category") || "",
    });

    const fetchPosts = async () => {
      setLoading(true);
      const res = await fetch(
        `${BACKEND}/api/post/getposts?${params.toString()}`,
        { credentials: "include" }
      );
      if (!res.ok) {
        setLoading(false);
        setPosts([]);
        return;
      }
      const data = await res.json();
      setPosts(data.posts);
      setShowMore(data.posts.length === 9);
      setLoading(false);
    };

    fetchPosts();
  }, [location.search]);

  const handleChange = (e) => {
    setSidebarData({ ...sidebarData, [e.target.id]: e.target.value });
  };

  const onFilterSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    sidebarData.searchTerm && params.set("searchTerm", sidebarData.searchTerm);
    sidebarData.sort && params.set("sort", sidebarData.sort);
    sidebarData.category && params.set("category", sidebarData.category);
    navigate(`/search?${params.toString()}`);
  };

  const handleShowMore = async () => {
    const params = new URLSearchParams(location.search);
    params.set("startIndex", posts.length);
    const res = await fetch(
      `${BACKEND}/api/post/getposts?${params.toString()}`,
      { credentials: "include" }
    );
    if (!res.ok) return;
    const data = await res.json();
    setPosts((prev) => [...prev, ...data.posts]);
    setShowMore(data.posts.length === 9);
  };

  return (
    <div className="flex flex-col md:flex-row bg-gradient-to-br from-blue-50 via-pink-50 to-yellow-100 min-h-screen">
      <aside className="p-6 md:w-1/4 bg-white/80 backdrop-blur shadow-md border-r border-gray-300">
        <form onSubmit={onFilterSubmit} className="flex flex-col gap-6">
          <h2 className="text-2xl font-semibold">Filters</h2>

          <label>
            Search Term
            <Input
              id="searchTerm"
              value={sidebarData.searchTerm}
              onChange={handleChange}
              placeholder="Search..."
            />
          </label>

          <label>
            Sort By
            <Select
              value={sidebarData.sort}
              onValueChange={(v) => setSidebarData({ ...sidebarData, sort: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Order</SelectLabel>
                  <SelectItem value="desc">Latest</SelectItem>
                  <SelectItem value="asc">Oldest</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </label>

          <label>
            Category
            <Select
              value={sidebarData.category}
              onValueChange={(v) =>
                setSidebarData({ ...sidebarData, category: v })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Category</SelectLabel>
                  <SelectItem value="worldnews">World News</SelectItem>
                  <SelectItem value="sportsnews">Sports News</SelectItem>
                  <SelectItem value="localnews">Local News</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </label>

          <Button type="submit">Apply Filters</Button>
        </form>
      </aside>

      <div className="w-full">
        <h1 className="text-2xl font-semibold p-3 mt-5">News Articles:</h1>
        <Separator />
        <div className="p-7 flex flex-wrap gap-4">
          {loading && <p>Loading…</p>}
          {!loading && posts.length === 0 && <p>No posts found.</p>}
          {!loading && posts.map((p) => <PostCard key={p._id} post={p} />)}
          {showMore && <button onClick={handleShowMore}>Show More</button>}
        </div>
      </div>
    </div>
  );
};

export default Search;
