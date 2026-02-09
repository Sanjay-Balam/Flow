"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { useCallback, useState, useEffect } from "react";

const CATEGORIES = ["Web Development", "Data Science", "Design", "Marketing", "Business"];

export function CourseFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");

  useEffect(() => {
    setSearch(searchParams.get("search") || "");
  }, [searchParams]);

  const updateParams = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    router.push(`/courses?${params.toString()}`);
  }, [router, searchParams]);

  const handleSearch = () => {
    updateParams("search", search);
  };

  const clearFilters = () => {
    setSearch("");
    router.push("/courses");
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-8">
      <div className="flex-1 flex gap-2">
        <Input
          placeholder="Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="max-w-sm"
        />
        <Button onClick={handleSearch} size="icon" variant="outline">
          <Search className="h-4 w-4" />
        </Button>
      </div>
      <Select value={searchParams.get("category") || ""} onValueChange={(v) => updateParams("category", v)}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent>
          {CATEGORIES.map((cat) => (
            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      {(searchParams.get("search") || searchParams.get("category")) && (
        <Button variant="ghost" onClick={clearFilters} size="icon">
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
