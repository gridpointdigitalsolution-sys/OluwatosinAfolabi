import fs from "fs";
import path from "path";

function readFromEnvFile(key: string): string {
  try {
    const envPath = path.join(process.cwd(), ".env.local");
    const content = fs.readFileSync(envPath, "utf-8");
    for (const line of content.split("\n")) {
      if (line.startsWith(`${key}=`)) {
        const val = line.slice(key.length + 1).trim();
        if (val) return val;
      }
    }
  } catch {
    // production uses real env vars
  }
  return "";
}

export function getGroqKey(): string {
  return process.env.GROQ_API_KEY || readFromEnvFile("GROQ_API_KEY");
}
