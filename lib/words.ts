export const THEME_WORDS = [
  "Love", "Peace", "Joy", "Hope", "Faith", "Family", "Giving", "Compassion",
  "Strength", "Grace", "Purpose", "Healing", "Light", "Wisdom", "Prayer",
  "Kindness", "Patience", "Gratitude", "Courage", "Renewal", "Abundance",
  "Blessing", "Mercy", "Serenity",
] as const;

export type ThemeWord = (typeof THEME_WORDS)[number];
