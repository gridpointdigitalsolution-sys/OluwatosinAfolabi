export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import Groq from "groq-sdk";
import { NextResponse } from "next/server";
import type { ApiResponse } from "@/lib/types";
import { getGroqKey } from "@/lib/env";

const SYSTEM_PROMPT = `You are a wise, gentle Christian pastor with deep faith and a warm, nurturing spirit.
When given a theme, respond with EXACTLY this format and nothing else — two lines only:

QUOTE: [Your original spiritual quote here, 1-2 sentences, no quotation marks]
VERSE: [KJV Bible reference, e.g. John 3:16 or Philippians 4:13]

Example response:
QUOTE: God's grace is not earned but freely given, a river that never runs dry for those who seek Him.
VERSE: Ephesians 2:8`;

export async function POST(request: Request): Promise<NextResponse<ApiResponse>> {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ ok: false, error: "Invalid theme" }, { status: 400 });
    }

    const theme =
      body !== null &&
      typeof body === "object" &&
      "theme" in body &&
      typeof (body as Record<string, unknown>).theme === "string"
        ? ((body as Record<string, unknown>).theme as string).trim()
        : "";

    if (!theme) {
      return NextResponse.json({ ok: false, error: "Invalid theme" }, { status: 400 });
    }

    const apiKey = getGroqKey();
    if (!apiKey) {
      return NextResponse.json({ ok: false, error: "Server misconfigured" }, { status: 500 });
    }

    const groq = new Groq({ apiKey });

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `The theme is: ${theme}` },
      ],
      max_tokens: 300,
      temperature: 0.8,
    });

    const text = completion.choices[0]?.message?.content?.trim() ?? "";

    let quote = "";
    let verseReference = "";

    const quoteMatch = text.match(/^QUOTE:\s*(.+)/m);
    const verseMatch = text.match(/^VERSE:\s*(.+)/m);

    if (quoteMatch && verseMatch) {
      quote = quoteMatch[1].trim();
      verseReference = verseMatch[1].trim();
    } else {
      // Fallback: last line that looks like a Bible ref is the verse, rest is the quote
      const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
      const bibleRefPattern = /^[1-3]?\s*[A-Za-z]+\s+\d+:\d+/;
      const verseLineIdx = lines.findLastIndex((l) => bibleRefPattern.test(l));
      if (verseLineIdx !== -1) {
        verseReference = lines[verseLineIdx];
        quote = lines.filter((_, i) => i !== verseLineIdx).join(" ").trim();
      }
    }

    if (!quote || !verseReference) {
      return NextResponse.json(
        { ok: false, error: "Failed to parse model response" },
        { status: 502 }
      );
    }

    let verseText = "";
    try {
      const bibleRes = await fetch(
        `https://bible-api.com/${encodeURIComponent(verseReference)}?translation=kjv`
      );
      if (bibleRes.ok) {
        const bibleJson = await bibleRes.json() as { text?: string };
        if (typeof bibleJson.text === "string") {
          verseText = bibleJson.text.trim().replace(/\s+/g, " ");
        }
      }
    } catch {
      // non-critical
    }

    return NextResponse.json({ ok: true, data: { theme, quote, verseText, verseReference } });
  } catch (err) {
    console.error("[generate-quote]", err);
    return NextResponse.json(
      { ok: false, error: "Failed to generate quote" },
      { status: 500 }
    );
  }
}
