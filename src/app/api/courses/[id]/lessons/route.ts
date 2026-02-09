import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { lessonSchema } from "@/lib/validations/lesson";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const lessons = await db.lesson.findMany({
      where: { courseId: id },
      orderBy: { order: "asc" },
    });
    return NextResponse.json(lessons);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch lessons" }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: courseId } = await params;
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const course = await db.course.findUnique({ where: { id: courseId } });
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }
    if (course.educatorId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();

    // Auto-calculate order if not provided
    const maxOrder = await db.lesson.aggregate({
      where: { courseId },
      _max: { order: true },
    });
    const nextOrder = (maxOrder._max.order ?? -1) + 1;

    const data = { ...body, order: body.order ?? nextOrder };
    const parsed = lessonSchema.safeParse(data);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const lesson = await db.lesson.create({
      data: { ...parsed.data, courseId },
    });

    return NextResponse.json(lesson, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create lesson" }, { status: 500 });
  }
}
