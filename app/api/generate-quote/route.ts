export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import type { ApiResponse } from "@/lib/types";

const SYSTEM_PROMPT = `You are a wise, gentle Christian pastor in her 50s with deep faith and a warm, nurturing spirit. \
When given a theme, respond with exactly two lines and nothing else:

QUOTE: A single original spiritual quote (2-3 sentences, under 50 words) that reflects deep faith, warmth, and pastoral care. No quotation marks.
VERSE: A single KJV Bible reference that thematically matches the quote, formatted strictly as "Book Chapter:Verse" (e.g. Philippians 4:13). No introduction or explanation.`;

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

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ ok: false, error: "Server misconfigured" }, { status: 500 });
    }

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const response = await client.messages.create({
      model: "claude-opus-4-5-20251101",
      max_tokens: 400,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: `The theme is: ${theme}` }],
    });

    const block = response.content[0];
    if (block.type !== "text") {
      return NextResponse.json(
        { ok: false, error: "Failed to parse model response" },
        { status: 502 }
      );
    }

    const text = block.text;
    const quoteMatch = text.match(/^QUOTE:\s*(.+)/m);
    const verseMatch = text.match(/^VERSE:\s*(.+)/m);

    if (!quoteMatch || !verseMatch) {
      return NextResponse.json(
        { ok: false, error: "Failed to parse model response" },
        { status: 502 }
      );
    }

    const quote = quoteMatch[1].trim();
    const verseReference = verseMatch[1].trim();

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
      // non-critical — proceed with empty verse text
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
