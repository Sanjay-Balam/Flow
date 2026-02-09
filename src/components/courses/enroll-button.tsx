"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, CheckCircle } from "lucide-react";

interface EnrollButtonProps {
  courseId: string;
  isEnrolled: boolean;
  userRole?: string;
  isLoggedIn: boolean;
}

export function EnrollButton({ courseId, isEnrolled, userRole, isLoggedIn }: EnrollButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (!isLoggedIn) {
    return (
      <Button onClick={() => router.push("/login")} className="w-full">
        Login to Enroll
      </Button>
    );
  }

  if (userRole !== "STUDENT") return null;

  if (isEnrolled) {
    return (
      <Button disabled variant="secondary" className="w-full">
        <CheckCircle className="mr-2 h-4 w-4" /> Enrolled
      </Button>
    );
  }

  const handleEnroll = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });
      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Failed to enroll");
        return;
      }
      toast.success("Successfully enrolled!");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleEnroll} disabled={loading} className="w-full">
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Enroll Now
    </Button>
  );
}
