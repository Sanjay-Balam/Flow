"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, Trash2, Edit, Loader2 } from "lucide-react";

interface Lesson {
  id: string;
  title: string;
  content: string;
  order: number;
}

interface LessonEditorProps {
  courseId: string;
  lessons: Lesson[];
}

export function LessonEditor({ courseId, lessons: initialLessons }: LessonEditorProps) {
  const router = useRouter();
  const [lessons, setLessons] = useState(initialLessons);
  const [open, setOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setTitle("");
    setContent("");
    setEditingLesson(null);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const isEditing = !!editingLesson;
      const url = isEditing
        ? `/api/courses/${courseId}/lessons/${editingLesson.id}`
        : `/api/courses/${courseId}/lessons`;
      const method = isEditing ? "PUT" : "POST";

      const body: any = { title, content };
      if (isEditing) body.order = editingLesson.order;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Failed to save lesson");
        return;
      }

      toast.success(isEditing ? "Lesson updated!" : "Lesson added!");
      setOpen(false);
      resetForm();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (lessonId: string) => {
    if (!confirm("Delete this lesson?")) return;
    try {
      const res = await fetch(`/api/courses/${courseId}/lessons/${lessonId}`, { method: "DELETE" });
      if (!res.ok) {
        toast.error("Failed to delete lesson");
        return;
      }
      toast.success("Lesson deleted");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  const openEdit = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setTitle(lesson.title);
    setContent(lesson.content);
    setOpen(true);
  };

  const openCreate = () => {
    resetForm();
    setOpen(true);
  };

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Lessons ({lessons.length})</CardTitle>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={openCreate}><Plus className="h-4 w-4 mr-1" /> Add Lesson</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingLesson ? "Edit Lesson" : "Add New Lesson"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Lesson title" />
              </div>
              <div className="space-y-2">
                <Label>Content</Label>
                <Textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Lesson content..." rows={6} />
              </div>
              <Button onClick={handleSave} disabled={loading} className="w-full">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingLesson ? "Update Lesson" : "Add Lesson"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {lessons.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No lessons yet. Add your first lesson!</p>
        ) : (
          <div className="space-y-2">
            {lessons.map((lesson, i) => (
              <div key={lesson.id} className="flex items-center gap-3 p-3 rounded-lg border">
                <div className="flex items-center justify-center h-7 w-7 rounded-full bg-blue-100 text-blue-600 text-xs font-medium shrink-0">{i + 1}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{lesson.title}</p>
                  <p className="text-xs text-gray-500 truncate">{lesson.content}</p>
                </div>
                <Button size="icon" variant="ghost" onClick={() => openEdit(lesson)}><Edit className="h-4 w-4" /></Button>
                <Button size="icon" variant="ghost" className="text-red-500" onClick={() => handleDelete(lesson.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
