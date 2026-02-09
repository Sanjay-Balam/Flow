import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const enrollments = await db.enrollment.findMany({
      where: { userId: session.user.id },
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

    return NextResponse.json(enrollments);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch enrollments" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "STUDENT") {
      return NextResponse.json({ error: "Only students can enroll" }, { status: 403 });
    }

    const { courseId } = await req.json();
    if (!courseId) {
      return NextResponse.json({ error: "Course ID is required" }, { status: 400 });
    }

    const course = await db.course.findUnique({ where: { id: courseId } });
    if (!course || course.status !== "PUBLISHED") {
      return NextResponse.json({ error: "Course not found or not published" }, { status: 404 });
    }

    const existing = await db.enrollment.findUnique({
      where: { userId_courseId: { userId: session.user.id, courseId } },
    });
    if (existing) {
      return NextResponse.json({ error: "Already enrolled" }, { status: 409 });
    }

    const enrollment = await db.enrollment.create({
      data: { userId: session.user.id, courseId },
    });

    return NextResponse.json(enrollment, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to enroll" }, { status: 500 });
  }
}
