export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getGroqKey } from "@/lib/env";

export async function GET() {
  const key = getGroqKey();
  return NextResponse.json({
    keyFound: !!key,
    keyLength: key.length,
    keyPrefix: key ? key.slice(0, 7) + "..." : "MISSING",
  });
}
