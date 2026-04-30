export function getGroqKey(): string {
  // 1. Standard process.env — works on Hostinger and all production hosts
  const fromEnv = (process.env.GROQ_API_KEY ?? "").trim();
  if (fromEnv) return fromEnv;

  // 2. Fallback: read .env.local directly (local dev only — Turbopack bug)
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs = require("fs");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const path = require("path");
    const envPath = path.join(process.cwd(), ".env.local");
    const content = fs.readFileSync(envPath, "utf-8");
    for (const line of content.split("\n")) {
      const t = line.trim();
      if (t.startsWith("GROQ_API_KEY=")) {
        const val = t.slice("GROQ_API_KEY=".length).trim();
        if (val) return val;
      }
    }
  } catch {
    // .env.local doesn't exist in production — expected
  }
  return "";
}
