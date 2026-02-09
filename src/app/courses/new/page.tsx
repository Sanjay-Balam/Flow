import { requireRole } from "@/lib/auth-utils";
import { CourseForm } from "@/components/courses/course-form";

export default async function NewCoursePage() {
  await requireRole("EDUCATOR");

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <CourseForm />
    </div>
  );
}
