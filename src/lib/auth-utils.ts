import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function getCurrentUser() {
  const session = await auth();
  return session?.user;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireRole(role: string) {
  const user = await requireAuth();
  if ((user as any).role !== role) redirect("/dashboard");
  return user;
}
