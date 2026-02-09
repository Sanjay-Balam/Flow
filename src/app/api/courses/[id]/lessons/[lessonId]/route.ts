import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { lessonSchema } from "@/lib/validations/lesson";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string; lessonId: string }> }
) {
  try {
    const { id: courseId, lessonId } = await params;
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const course = await db.course.findUnique({ where: { id: courseId } });
    if (!course || course.educatorId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const lesson = await db.lesson.findUnique({ where: { id: lessonId } });
    if (!lesson || lesson.courseId !== courseId) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    const body = await req.json();
    const parsed = lessonSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const updated = await db.lesson.update({
      where: { id: lessonId },
      data: parsed.data,
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update lesson" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string; lessonId: string }> }
) {
  try {
    const { id: courseId, lessonId } = await params;
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const course = await db.course.findUnique({ where: { id: courseId } });
    if (!course || course.educatorId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const lesson = await db.lesson.findUnique({ where: { id: lessonId } });
    if (!lesson || lesson.courseId !== courseId) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    await db.lesson.delete({ where: { id: lessonId } });
    return NextResponse.json({ message: "Lesson deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete lesson" }, { status: 500 });
  }
}
