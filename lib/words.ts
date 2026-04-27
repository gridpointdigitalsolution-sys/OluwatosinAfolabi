export const THEME_WORDS = [
  // Original set
  "Love", "Peace", "Joy", "Hope", "Faith", "Family", "Giving", "Compassion",
  "Strength", "Grace", "Purpose", "Healing", "Light", "Wisdom", "Prayer",
  "Kindness", "Patience", "Gratitude", "Courage", "Renewal", "Abundance",
  "Blessing", "Mercy", "Serenity",

  // New additions
  "Redemption", "Salvation", "Truth", "Righteousness", "Holiness", "Obedience",
  "Deliverance", "Restoration", "Covenant", "Promise", "Victory", "Endurance",
  "Perseverance", "Humility", "Purity", "Authority", "Dominion", "Overflow",
  "Provision", "Refuge", "Shield", "Fortress", "Rock", "Shepherd", "Calling",
  "Anointing", "Breakthrough", "Revival", "Transformation", "Freedom",
  "Inheritance", "Justice", "Favor", "Glory", "Honor", "Rejoicing",
  "Steadfastness", "Faithfulness", "Compassionate", "Uprightness", "Boldness",
  "Watchfulness", "Discernment", "Renewing", "Harvest", "Sowing", "Lightbearer",
  "Peacemaker", "Servanthood", "Obedient", "Marriage", "Parenthood", "Motherhood",
  "Fatherhood", "Unity", "Commitment", "Fidelity", "Nurture", "Discipline", "Legacy",
] as const;

export type ThemeWord = (typeof THEME_WORDS)[number];
