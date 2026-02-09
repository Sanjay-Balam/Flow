export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { CourseCard } from "@/components/courses/course-card";
import { CourseFilters } from "@/components/courses/course-filters";
import { Pagination } from "@/components/courses/pagination";
import { Suspense } from "react";
import { BookOpen } from "lucide-react";

interface Props {
  searchParams: Promise<{ page?: string; search?: string; category?: string }>;
}

export default async function CoursesPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const limit = 9;
  const search = params.search || "";
  const category = params.category || "";

  const where: any = { status: "PUBLISHED" };
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }
  if (category) where.category = category;

  const [courses, total] = await Promise.all([
    db.course.findMany({
      where,
      include: {
        educator: { select: { name: true } },
        _count: { select: { lessons: true, enrollments: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.course.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <BookOpen className="h-8 w-8 text-blue-600" />
          Browse Courses
        </h1>
        <p className="text-gray-600 mt-2">Discover courses taught by expert educators</p>
      </div>

      <Suspense fallback={<div>Loading filters...</div>}>
        <CourseFilters />
      </Suspense>

      {courses.length === 0 ? (
        <div className="text-center py-16">
          <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600">No courses found</h2>
          <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">{total} course{total !== 1 ? "s" : ""} found</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
          <Pagination currentPage={page} totalPages={totalPages} />
        </>
      )}
    </div>
  );
}
