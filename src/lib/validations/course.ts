import { z } from "zod";

export const courseSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  description: z.string().min(10, "Description must be at least 10 characters").max(5000),
  category: z.string().min(1, "Category is required"),
  thumbnail: z.string().url("Invalid URL").optional().or(z.literal("")),
  status: z.enum(["DRAFT", "PUBLISHED"]).optional(),
});

export const courseFilterSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(9),
  search: z.string().optional().default(""),
  category: z.string().optional().default(""),
});

export type CourseInput = z.infer<typeof courseSchema>;
export type CourseFilterInput = z.infer<typeof courseFilterSchema>;
