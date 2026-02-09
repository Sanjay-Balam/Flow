export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { BookOpen, Users, GraduationCap, ArrowRight, Sparkles, Shield, Zap } from "lucide-react";
import { CourseCard } from "@/components/courses/course-card";

export default async function HomePage() {
  const [courseCount, studentCount, educatorCount, featuredCourses] = await Promise.all([
    db.course.count({ where: { status: "PUBLISHED" } }),
    db.user.count({ where: { role: "STUDENT" } }),
    db.user.count({ where: { role: "EDUCATOR" } }),
    db.course.findMany({
      where: { status: "PUBLISHED" },
      include: {
        educator: { select: { name: true } },
        _count: { select: { lessons: true, enrollments: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
  ]);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            Learn Without <span className="text-blue-600">Limits</span>
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">
            Discover expert-led courses, expand your skills, and transform your career with EduFlow&apos;s modern learning platform.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/courses">Browse Courses <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-blue-600">{courseCount}+</p>
              <p className="text-gray-600 mt-1">Published Courses</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-green-600">{studentCount}+</p>
              <p className="text-gray-600 mt-1">Active Students</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-purple-600">{educatorCount}+</p>
              <p className="text-gray-600 mt-1">Expert Educators</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      {featuredCourses.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-2">Featured Courses</h2>
            <p className="text-gray-600 text-center mb-10">Start learning from our top courses</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
            <div className="text-center mt-8">
              <Button variant="outline" size="lg" asChild>
                <Link href="/courses">View All Courses <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* How it works */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">1. Create an Account</h3>
                <p className="text-gray-600 text-sm">Sign up as a student or educator in seconds</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">2. Browse Courses</h3>
                <p className="text-gray-600 text-sm">Explore courses across various categories</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                  <GraduationCap className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">3. Start Learning</h3>
                <p className="text-gray-600 text-sm">Enroll and learn at your own pace</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">Why EduFlow?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Sparkles className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">AI-Powered</h3>
              <p className="text-sm text-gray-600">AI-generated course descriptions to help educators create compelling content</p>
            </div>
            <div className="text-center">
              <Shield className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Secure & Reliable</h3>
              <p className="text-sm text-gray-600">JWT authentication with role-based access control</p>
            </div>
            <div className="text-center">
              <Zap className="h-8 w-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Lightning Fast</h3>
              <p className="text-sm text-gray-600">Server-side rendering with Next.js 16 for optimal performance</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Learning?</h2>
          <p className="text-blue-100 mb-8 max-w-lg mx-auto">Join thousands of students and educators on EduFlow</p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/register">Create Free Account <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
