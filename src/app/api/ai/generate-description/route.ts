import { createGroq } from "@ai-sdk/groq";
import { streamText } from "ai";
import { auth } from "@/lib/auth";

const groq = createGroq();

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, category } = await req.json();

  if (!title) {
    return Response.json({ error: "Title is required" }, { status: 400 });
  }

  const result = streamText({
    model: groq("llama-3.3-70b-versatile"),
    prompt: `Write a compelling course description for an online course titled "${title}"${category ? ` in the "${category}" category` : ""}.

The description should:
- Be 2-3 paragraphs
- Highlight what students will learn
- Mention prerequisites if applicable
- Be engaging and professional
- Be around 150-200 words

Write only the description, no title or headings.`,
  });

  return result.toTextStreamResponse();
}
