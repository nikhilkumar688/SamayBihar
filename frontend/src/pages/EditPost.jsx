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

// You can also import BASE_URL from a config if you have it:
const BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "https://sb-4z7m.onrender.com";

const EditPost = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { postId } = useParams();
  const { currentUser } = useSelector((state) => state.user);

  const [file, setFile] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [formData, setFormData] = useState({});
  const [updatePostError, setUpdatePostError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/api/post/getposts?postId=${postId}`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        if (!res.ok) {
          console.error("Error fetching post:", data.message);
          setUpdatePostError(data.message);
        } else {
          setFormData(data.posts[0] || {});
          setUpdatePostError(null);
        }
      } catch (error) {
        console.error("Error fetching post:", error);
        setUpdatePostError("Something went wrong while fetching post.");
      }
    };

    fetchPost();
  }, [postId]);

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
      console.error("Upload error:", error);
      toast({ title: "Image upload failed" });
    } finally {
      setImageUploading(false);
    }
  };

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
        toast({ title: "Something went wrong! Please try again." });
        setUpdatePostError(data.message);
        return;
      }

      toast({ title: "Article updated successfully!" });
      navigate(`/post/${data.slug}`);
    } catch (error) {
      console.error("Update failed:", error);
      toast({ title: "Something went wrong! Please try again." });
      setUpdatePostError("Something went wrong! Please try again.");
    }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold text-slate-700">
        Edit Post
      </h1>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <Input
            type="text"
            placeholder="Title"
            required
            id="title"
            className="w-full sm:w-3/4 h-12 border border-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0"
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            value={formData.title || ""}
          />
          <Select
            onValueChange={(value) =>
              setFormData({ ...formData, category: value })
            }
            value={formData.category || ""}
          >
            <SelectTrigger className="w-full sm:w-1/4 h-12 border border-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0">
              <SelectValue placeholder="Select a Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Category</SelectLabel>
                <SelectItem value="Worldnews">World News</SelectItem>
                <SelectItem value="sportsnews">Sports News</SelectItem>
                <SelectItem value="localnews">Local News</SelectItem>
                <SelectItem value="crimenews">Crime News</SelectItem>
                <SelectItem value="politicsnews">Politics News</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

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
            className="w-full h-96 object-cover"
          />
        )}

        <ReactQuill
          theme="snow"
          placeholder="Write something here..."
          className="h-72 mb-12"
          required
          onChange={(value) => setFormData({ ...formData, content: value })}
          value={formData.content || ""}
        />

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
