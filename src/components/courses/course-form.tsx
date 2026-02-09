"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCompletion } from "@ai-sdk/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Sparkles } from "lucide-react";

const CATEGORIES = ["Web Development", "Data Science", "Design", "Marketing", "Business", "Other"];

interface CourseFormProps {
  course?: {
    id: string;
    title: string;
    description: string;
    category: string;
    status: string;
  };
}

export function CourseForm({ course }: CourseFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(course?.title || "");
  const [description, setDescription] = useState(course?.description || "");
  const [category, setCategory] = useState(course?.category || "");
  const [status, setStatus] = useState(course?.status || "DRAFT");

  const { complete, completion, isLoading: aiLoading } = useCompletion({
    api: "/api/ai/generate-description",
    streamProtocol: "text",
    onFinish: (_prompt, completion) => {
      setDescription(completion);
      toast.success("Description generated!");
    },
    onError: () => {
      toast.error("Failed to generate description. Check your GROQ_API_KEY.");
    },
  });

  const isEdit = !!course;

  const handleGenerateDescription = async () => {
    if (!title.trim()) {
      toast.error("Enter a course title first");
      return;
    }
    setDescription("");
    complete("", { body: { title, category } });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isEdit ? `/api/courses/${course.id}` : "/api/courses";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, category, status }),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Failed to save course");
        return;
      }

      const data = await res.json();
      toast.success(isEdit ? "Course updated!" : "Course created!");
      router.push(isEdit ? `/courses/${course.id}/edit` : `/courses/${data.id}/edit`);
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEdit ? "Edit Course" : "Create New Course"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Course Title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Full-Stack Web Development" required />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="description">Description</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleGenerateDescription}
                disabled={aiLoading}
              >
                {aiLoading ? (
                  <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-3 w-3" />
                )}
                {aiLoading ? "Generating..." : "Generate with AI"}
              </Button>
            </div>
            <Textarea id="description" value={aiLoading ? completion : description} onChange={(e) => setDescription(e.target.value)} placeholder="What will students learn?" rows={5} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (<SelectItem key={cat} value={cat}>{cat}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="PUBLISHED">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button type="submit" disabled={loading || aiLoading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEdit ? "Update Course" : "Create Course"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
