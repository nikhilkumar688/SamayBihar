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
import { useToast } from "@/hooks/use-toast";
import { getFileView, uploadFile } from "@/lib/appwrite/uploadImage";
import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "https://samaybihar-xdtd.onrender.com";

const CATEGORY_OPTIONS = [
  { value: "Worldnews", label: "World News" },
  { value: "sportsnews", label: "Sports News" },
  { value: "localnews", label: "Local News" },
  { value: "crimenews", label: "Crime News" },
  { value: "politicsnews", label: "Politics News" },
];

const EditPost = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { postId } = useParams();
  const { currentUser } = useSelector((state) => state.user);

  const [file, setFile] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState(null);

  const [formData, setFormData] = useState({});
  const [loadingPost, setLoadingPost] = useState(true);
  const [updatePostError, setUpdatePostError] = useState(null);

  // Fetch post
  useEffect(() => {
    const fetchPost = async () => {
      setLoadingPost(true);
      try {
        const res = await fetch(
          `${BASE_URL}/api/post/getposts?postId=${postId}`,
          { credentials: "include" }
        );
        const data = await res.json();

        if (!res.ok) {
          setUpdatePostError(data.message || "Failed to fetch post.");
        } else {
          setFormData(data.posts[0] || {});
          setUpdatePostError(null);
        }
      } catch (error) {
        setUpdatePostError("Error fetching post data.");
        console.error("Error:", error);
      } finally {
        setLoadingPost(false);
      }
    };

    fetchPost();
  }, [postId]);

  // Upload image
  const handleUploadImage = async () => {
    if (!file) {
      setImageUploadError("Please select an image!");
      toast({ title: "Please select an image!" });
      return;
    }

    try {
      setImageUploading(true);
      setImageUploadError(null);
      const uploadedFile = await uploadFile(file);
      const postImageUrl = getFileView(uploadedFile.$id);
      setFormData((prev) => ({ ...prev, image: postImageUrl }));
      toast({ title: "Image uploaded successfully!" });
    } catch (error) {
      setImageUploadError("Image upload failed");
      toast({ title: "Image upload failed" });
      console.error(error);
    } finally {
      setImageUploading(false);
    }
  };

  // Submit post
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `${BASE_URL}/api/post/updatepost/${postId}/${currentUser._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();

      if (!res.ok) {
        setUpdatePostError(data.message || "Update failed.");
        toast({ title: "Update failed. Please try again." });
        return;
      }

      toast({ title: "Article updated successfully!" });
      navigate(`/post/${data.slug}`);
    } catch (error) {
      console.error("Update error:", error);
      toast({ title: "Something went wrong!" });
      setUpdatePostError("Something went wrong. Try again.");
    }
  };

  if (loadingPost) {
    return (
      <div className="text-center py-20 text-xl text-slate-600">
        Loading post data...
      </div>
    );
  }

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold text-slate-700">
        Edit Post
      </h1>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {/* Title and Category */}
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <Input
            type="text"
            placeholder="Title"
            required
            id="title"
            className="w-full sm:w-3/4 h-12 border border-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0"
            value={formData.title || ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
          />

          <Select
            value={formData.category || ""}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, category: value }))
            }
          >
            <SelectTrigger className="w-full sm:w-1/4 h-12 border border-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0">
              <SelectValue placeholder="Select a Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Category</SelectLabel>
                {CATEGORY_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Image Upload */}
        <div className="flex gap-4 items-center justify-between border-4 border-slate-600 border-dotted p-3">
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            type="button"
            className="bg-[#000e4a] hover:bg-rose-500"
            onClick={handleUploadImage}
          >
            {imageUploading ? "Uploading..." : "Upload Image"}
          </Button>
        </div>

        {imageUploadError && <p className="text-red-600">{imageUploadError}</p>}

        {formData.image && (
          <img
            src={formData.image}
            alt="Uploaded"
            className="w-full h-96 object-cover rounded-md"
          />
        )}

        {/* Editor */}
        <ReactQuill
          theme="snow"
          className="h-72 mb-12 bg-white"
          value={formData.content || ""}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, content: value }))
          }
        />

        {/* Submit */}
        <Button
          type="submit"
          className="h-12 bg-[#111368] font-semibold hover:bg-rose-500 max-sm:mt-5 text-md"
        >
          Update Your Article
        </Button>

        {updatePostError && (
          <p className="text-red-600 mt-5">{updatePostError}</p>
        )}
      </form>
    </div>
  );
};

export default EditPost;
