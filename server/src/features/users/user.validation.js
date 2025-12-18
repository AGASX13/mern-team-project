import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  age: z.number().min(16).optional(),
  college: z.string().optional(),
  city: z.string().optional(),
  profileImage: z.string().url().optional()
});
