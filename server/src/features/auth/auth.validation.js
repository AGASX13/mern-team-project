import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  password: z.string().min(6),
  role: z.enum(["user", "owner"]).optional()
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});
