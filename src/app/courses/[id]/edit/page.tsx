import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth-utils";
import { notFound, redirect } from "next/navigation";
import { CourseForm } from "@/components/courses/course-form";
import { LessonEditor } from "@/components/courses/lesson-editor";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditCoursePage({ params }: Props) {
  const { id } = await params;
  const user = await requireAuth();

  const course = await db.course.findUnique({
    where: { id },
    include: { lessons: { orderBy: { order: "asc" } } },
  });

  if (!course) notFound();
  if (course.educatorId !== user.id && (user as any).role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <CourseForm course={{ id: course.id, title: course.title, description: course.description, category: course.category, status: course.status }} />
      <LessonEditor courseId={course.id} lessons={course.lessons} />
    </div>
  );
}
