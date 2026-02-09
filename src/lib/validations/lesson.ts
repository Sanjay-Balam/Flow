import { z } from "zod";

export const lessonSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  content: z.string().min(10, "Content must be at least 10 characters"),
  order: z.number().int().min(0),
});

export type LessonInput = z.infer<typeof lessonSchema>;
