import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, GraduationCap } from "lucide-react";

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    description: string;
    category: string;
    thumbnail?: string | null;
    educator: { name: string };
    _count: { lessons: number; enrollments: number };
  };
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <Badge variant="secondary" className="text-xs">{course.category}</Badge>
        </div>
        <Link href={`/courses/${course.id}`} className="hover:underline">
          <h3 className="font-semibold text-lg line-clamp-2 mt-2">{course.title}</h3>
        </Link>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm text-gray-600 line-clamp-3">{course.description}</p>
        <div className="flex items-center gap-1 mt-3 text-sm text-gray-500">
          <GraduationCap className="h-4 w-4" />
          <span>{course.educator.name}</span>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t pt-4">
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1"><BookOpen className="h-3.5 w-3.5" />{course._count.lessons} lessons</span>
          <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{course._count.enrollments} enrolled</span>
        </div>
        <Button size="sm" variant="outline" asChild>
          <Link href={`/courses/${course.id}`}>View</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
