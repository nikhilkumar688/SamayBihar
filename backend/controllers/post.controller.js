import Post from "../models/post.model.js";
import { errorHandler } from "../utils/error.js";

export const create = async (req, res, next) => {
  try {
    // Check if user is admin
    if (!req.user?.isAdmin) {
      return next(errorHandler(403, "You are not authorised to create post!"));
    }

    // Check if req.body exists
    if (!req.body || typeof req.body !== "object") {
      return next(errorHandler(400, "Request body is missing or invalid"));
    }

    // Field validation
    if (!req.body.title || !req.body.content) {
      return next(errorHandler(400, "Title and content are required fields."));
    }

    // Generate slug
    const slug = req.body.title
      .toString()
      .normalize("NFKD") // Normalize Unicode characters
      .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/[^\p{L}\p{N}-]+/gu, "") // Remove non-word characters except hyphens
      .replace(/--+/g, "-") // Replace multiple hyphens with a single one
      .replace(/^-+|-+$/g, "") // Trim hyphens from start/end
      .split("-") // Split into words
      .slice(0, 6) // Keep only first 6 words
      .join("-") // Rejoin with hyphen
      .toLowerCase(); // Lowercase if applicable

    // Create and save post
    const newPost = new Post({
      title: req.body.title,
      content: req.body.content,
      category: req.body.category || "uncategorized",
      image:
        req.body.image ||
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg",
      slug,
      userId: req.user.id,
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    console.error("Error creating post:", error);
    next(error);
  }
};
