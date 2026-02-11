export function secondsToMinutes(seconds: number): number {
  return seconds > 0 ? Math.ceil(seconds / 60) : 0;
}

export function formatTimeLimit(seconds: number | undefined): number {
  if (!seconds || seconds <= 0) return 0;
  return Math.ceil(seconds / 60);
}

export function formatTimeUsed(seconds: number | undefined): number {
  return Math.ceil((seconds || 0) / 60);
}

export function formatLimitDisplay(original: number, extended: number): string {
  return extended > 0 ? `${original} → ${original + extended}` : `${original}`;
}
