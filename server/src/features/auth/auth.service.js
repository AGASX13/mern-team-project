import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../users/user.model.js";
import { ApiError } from "../../utils/apiError.js";

export const registerUser = async (data) => {
  const { name, email, phone, password, role } = data;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    phone,
    password: hashedPassword,
    role: role || "user"
  });

  return user;
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return { user, token };
};
