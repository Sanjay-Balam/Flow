export const dynamic = "force-dynamic";

import { requireAuth } from "@/lib/auth-utils";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { BookOpen, Users, GraduationCap, Plus, BarChart3, Clock } from "lucide-react";

export default async function DashboardPage() {
  const user = await requireAuth();
  const role = (user as any).role;

  if (role === "STUDENT") {
    const enrollments = await db.enrollment.findMany({
      where: { userId: user.id },
      include: {
        course: {
          include: {
            educator: { select: { name: true } },
            _count: { select: { lessons: true } },
          },
        },
      },
      orderBy: { enrolledAt: "desc" },
    });

    const avgProgress = enrollments.length
      ? Math.round(enrollments.reduce((a, e) => a + e.progress, 0) / enrollments.length)
      : 0;

    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}!</h1>
        <p className="text-gray-600 mb-8">Here&apos;s your learning progress</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <BookOpen className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">{enrollments.length}</p>
                  <p className="text-sm text-gray-500">Courses Enrolled</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <BarChart3 className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">{avgProgress}%</p>
                  <p className="text-sm text-gray-500">Average Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Clock className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold">{enrollments.filter(e => e.progress === 100).length}</p>
                  <p className="text-sm text-gray-500">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-xl font-semibold mb-4">My Courses</h2>
        {enrollments.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500 mb-4">You haven&apos;t enrolled in any courses yet</p>
              <Button asChild><Link href="/courses">Browse Courses</Link></Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {enrollments.map((enrollment) => (
              <Card key={enrollment.id}>
                <CardContent className="flex items-center gap-4 py-4">
                  <div className="flex-1 min-w-0">
                    <Link href={`/courses/${enrollment.courseId}`} className="font-medium hover:underline">
                      {enrollment.course.title}
                    </Link>
                    <p className="text-sm text-gray-500">{enrollment.course.educator.name} · {enrollment.course._count.lessons} lessons</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${enrollment.progress}%` }} />
                    </div>
                    <span className="text-sm font-medium w-10 text-right">{enrollment.progress}%</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (role === "EDUCATOR") {
    const courses = await db.course.findMany({
      where: { educatorId: user.id },
      include: { _count: { select: { lessons: true, enrollments: true } } },
      orderBy: { createdAt: "desc" },
    });

    const totalStudents = courses.reduce((a, c) => a + c._count.enrollments, 0);

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Welcome, {user.name}!</h1>
            <p className="text-gray-600">Manage your courses and students</p>
          </div>
          <Button asChild><Link href="/courses/new"><Plus className="mr-2 h-4 w-4" /> New Course</Link></Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <BookOpen className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">{courses.length}</p>
                  <p className="text-sm text-gray-500">Total Courses</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">{totalStudents}</p>
                  <p className="text-sm text-gray-500">Total Students</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <GraduationCap className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold">{courses.filter(c => c.status === "PUBLISHED").length}</p>
                  <p className="text-sm text-gray-500">Published</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-xl font-semibold mb-4">My Courses</h2>
        {courses.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500 mb-4">You haven&apos;t created any courses yet</p>
              <Button asChild><Link href="/courses/new">Create Your First Course</Link></Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {courses.map((course) => (
              <Card key={course.id}>
                <CardContent className="flex items-center gap-4 py-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Link href={`/courses/${course.id}`} className="font-medium hover:underline">{course.title}</Link>
                      <Badge variant={course.status === "PUBLISHED" ? "default" : "secondary"} className="text-xs">{course.status}</Badge>
                    </div>
                    <p className="text-sm text-gray-500">{course._count.lessons} lessons · {course._count.enrollments} students</p>
                  </div>
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/courses/${course.id}/edit`}>Edit</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ADMIN
  const [totalUsers, totalCourses, totalEnrollments] = await Promise.all([
    db.user.count(),
    db.course.count(),
    db.enrollment.count(),
  ]);

  const recentUsers = await db.user.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
      <p className="text-gray-600 mb-8">Overview of the platform</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{totalUsers}</p>
                <p className="text-sm text-gray-500">Total Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{totalCourses}</p>
                <p className="text-sm text-gray-500">Total Courses</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{totalEnrollments}</p>
                <p className="text-sm text-gray-500">Total Enrollments</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-xl font-semibold mb-4">Recent Users</h2>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="text-left p-3 font-medium">Name</th>
                  <th className="text-left p-3 font-medium">Email</th>
                  <th className="text-left p-3 font-medium">Role</th>
                  <th className="text-left p-3 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map((u) => (
                  <tr key={u.id} className="border-b last:border-0">
                    <td className="p-3">{u.name}</td>
                    <td className="p-3 text-gray-500">{u.email}</td>
                    <td className="p-3"><Badge variant="secondary" className="text-xs">{u.role}</Badge></td>
                    <td className="p-3 text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
