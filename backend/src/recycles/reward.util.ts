type ConditionKey = 'NEW' | 'LIKE_NEW' | 'GOOD' | 'FAIR' | 'POOR';

const conditionMultiplier: Record<ConditionKey, number> = {
  NEW: 1.2,
  LIKE_NEW: 1.1,
  GOOD: 1.0,
  FAIR: 0.8,
  POOR: 0.6,
};

const baseRewardByType: Record<string, number> = {
  PHONE: 80,
  LAPTOP: 150,
  TABLET: 110,
  CONSOLE: 120,
  OTHER: 60,
};

export function calculateReward(productTypeRaw: string, conditionRaw: string) {
  const productType = (productTypeRaw || '').trim().toUpperCase();
  const condition = (conditionRaw || '').trim().toUpperCase() as ConditionKey;

  const base = baseRewardByType[productType] ?? baseRewardByType.OTHER;
  const mult = conditionMultiplier[condition] ?? 0.7;

  return Math.max(1, Math.round(base * mult));
}