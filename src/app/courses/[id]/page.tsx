import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";
import { EnrollButton } from "@/components/courses/enroll-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BookOpen, Users, GraduationCap, Clock, ChevronRight } from "lucide-react";
import Link from "next/link";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function CourseDetailPage({ params }: Props) {
  const { id } = await params;
  const session = await auth();

  const course = await db.course.findUnique({
    where: { id },
    include: {
      educator: { select: { id: true, name: true } },
      lessons: { orderBy: { order: "asc" } },
      _count: { select: { enrollments: true } },
    },
  });

  if (!course) notFound();

  let isEnrolled = false;
  if (session?.user) {
    const enrollment = await db.enrollment.findUnique({
      where: { userId_courseId: { userId: session.user.id, courseId: id } },
    });
    isEnrolled = !!enrollment;
  }

  const isOwner = session?.user?.id === course.educatorId;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge>{course.category}</Badge>
              <Badge variant={course.status === "PUBLISHED" ? "default" : "secondary"}>
                {course.status}
              </Badge>
            </div>
            <h1 className="text-3xl font-bold">{course.title}</h1>
            <div className="flex items-center gap-4 mt-3 text-gray-600">
              <span className="flex items-center gap-1">
                <GraduationCap className="h-4 w-4" /> {course.educator.name}
              </span>
              <span className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" /> {course.lessons.length} lessons
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" /> {course._count.enrollments} enrolled
              </span>
            </div>
          </div>

          <Separator />

          <div>
            <h2 className="text-xl font-semibold mb-3">About this course</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{course.description}</p>
          </div>

          <Separator />

          <div>
            <h2 className="text-xl font-semibold mb-4">Course Content</h2>
            <div className="space-y-3">
              {course.lessons.map((lesson, index) => (
                <Card key={lesson.id}>
                  <CardContent className="flex items-center gap-3 py-4">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-600 text-sm font-medium shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{lesson.title}</h3>
                      {(isEnrolled || isOwner) && (
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{lesson.content}</p>
                      )}
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400 shrink-0" />
                  </CardContent>
                </Card>
              ))}
              {course.lessons.length === 0 && (
                <p className="text-gray-500 text-center py-8">No lessons yet</p>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="text-lg">Course Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Lessons</span>
                <span className="font-medium">{course.lessons.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Students</span>
                <span className="font-medium">{course._count.enrollments}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Instructor</span>
                <span className="font-medium">{course.educator.name}</span>
              </div>
              <Separator />
              {isOwner ? (
                <Link href={`/courses/${course.id}/edit`} className="block">
                  <Button className="w-full" variant="outline">Edit Course</Button>
                </Link>
              ) : (
                <EnrollButton
                  courseId={course.id}
                  isEnrolled={isEnrolled}
                  userRole={(session?.user as any)?.role}
                  isLoggedIn={!!session}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
