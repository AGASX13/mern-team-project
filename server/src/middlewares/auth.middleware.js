import jwt from "jsonwebtoken";
import { ApiError } from "../utils/apiError.js";

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(401, "Unauthorized");
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Use _id here to match your property service
    req.user = {
      _id: decoded.id,  // <-- this must be _id
      role: decoded.role
    };

    next();
  } catch (error) {
    next(error);
  }
};
