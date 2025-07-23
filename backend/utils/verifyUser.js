import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";

export const verifyToken = (req, res, next) => {
  let token = null;

  // 1. Try from cookies
  if (req.cookies && req.cookies.access_token) {
    token = req.cookies.access_token;
  }

  // 2. Try from Authorization header
  else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // 3. If no token found
  if (!token) {
    return next(errorHandler(401, "Unauthorized: No token provided"));
  }

  // 4. Verify token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(errorHandler(401, "Unauthorized: Invalid token"));
    }

    req.user = decoded; // decoded = payload from jwt.sign
    next();
  });
};
