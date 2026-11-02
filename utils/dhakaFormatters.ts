export const MASTER_SPRING = { type: "spring" as const, stiffness: 400, damping: 30, mass: 0.8 };

export const formatBDT = (amount: number): string => {
  return `৳${Math.round(amount).toLocaleString("en-IN")}`;
};

export const formatLakhCrore = (amount: number): string => {
  if (amount >= 10000000) return `৳${(amount / 10000000).toFixed(2)} Crore`;
  if (amount >= 100000) return `৳${(amount / 100000).toFixed(2)} Lakh`;
  return `৳${Math.round(amount).toLocaleString("en-IN")}`;
};
