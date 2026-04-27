import fs from "fs";
import path from "path";

function readFromEnvFile(key: string): string {
  try {
    const envPath = path.join(process.cwd(), ".env.local");
    const content = fs.readFileSync(envPath, "utf-8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (trimmed.startsWith(`${key}=`)) {
        const val = trimmed.slice(key.length + 1).trim();
        if (val) return val;
      }
    }
  } catch {
    // .env.local does not exist in production — that is expected
  }
  return "";
}

export function getGroqKey(): string {
  // process.env works in production (Hostinger env vars dashboard)
  // readFromEnvFile is the local dev fallback for Next.js Turbopack worker isolation
  return (process.env.GROQ_API_KEY ?? "").trim() || readFromEnvFile("GROQ_API_KEY");
}
