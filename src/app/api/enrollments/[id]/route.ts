import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const enrollment = await db.enrollment.findUnique({ where: { id } });
    if (!enrollment || enrollment.userId !== session.user.id) {
      return NextResponse.json({ error: "Enrollment not found" }, { status: 404 });
    }

    const { progress } = await req.json();
    if (typeof progress !== "number" || progress < 0 || progress > 100) {
      return NextResponse.json({ error: "Progress must be 0-100" }, { status: 400 });
    }

    const updated = await db.enrollment.update({
      where: { id },
      data: { progress },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update enrollment" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const enrollment = await db.enrollment.findUnique({ where: { id } });
    if (!enrollment || enrollment.userId !== session.user.id) {
      return NextResponse.json({ error: "Enrollment not found" }, { status: 404 });
    }

    await db.enrollment.delete({ where: { id } });
    return NextResponse.json({ message: "Unenrolled successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to unenroll" }, { status: 500 });
  }
}
