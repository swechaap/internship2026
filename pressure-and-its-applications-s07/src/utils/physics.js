export function pressure(force, area) {
  const safeArea = Math.max(Number(area), 0.001);
  return Number(force) / safeArea;
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function formatNumber(value, digits = 1) {
  return Number(value).toLocaleString(undefined, {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits
  });
}
