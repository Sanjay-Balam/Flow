import Link from "next/link";
import { GraduationCap, Github, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-blue-600" />
            <span className="font-semibold">EduFlow</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>Built by Sanjay Balam</span>
            <Link href="https://github.com/balamsanjay" target="_blank" className="hover:text-gray-900 transition-colors">
              <Github className="h-5 w-5" />
            </Link>
            <Link href="https://linkedin.com/in/balamsanjay" target="_blank" className="hover:text-gray-900 transition-colors">
              <Linkedin className="h-5 w-5" />
            </Link>
          </div>
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} EduFlow. Built with Next.js
          </p>
        </div>
      </div>
    </footer>
  );
}
