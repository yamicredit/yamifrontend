const MS_PER_DAY = 1000 * 60 * 60 * 24;

export function formatNaira(amount: number, showKobo = false): string {
  const rounded = showKobo ? amount : Math.round(amount);
  return `₦${rounded.toLocaleString('en-NG', {
    minimumFractionDigits: showKobo ? 2 : 0,
    maximumFractionDigits: showKobo ? 2 : 0
  })}`;
}

export function formatCompactNaira(amount: number): string {
  if (amount >= 1_000_000) return `₦${(amount / 1_000_000).toFixed(1)}m`;
  if (amount >= 1_000) return `₦${Math.round(amount / 1_000)}k`;
  return `₦${amount}`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-NG', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

export function formatShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-NG', {
    day: '2-digit',
    month: 'short'
  });
}

export function startOfDay(date: Date): Date {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

export function daysUntil(iso: string): number {
  const target = startOfDay(new Date(iso)).getTime();
  const today = startOfDay(new Date()).getTime();
  return Math.round((target - today) / MS_PER_DAY);
}

export function dueLabel(iso: string): string {
  const days = daysUntil(iso);
  if (days === 0) return 'Due today';
  if (days === 1) return 'Due tomorrow';
  if (days > 0) return `Due in ${days} days`;
  if (days === -1) return '1 day overdue';
  return `${Math.abs(days)} days overdue`;
}

export function relativeDay(iso: string): string {
  const days = daysUntil(iso);
  if (days === 0) return 'Today';
  if (days === -1) return 'Yesterday';
  if (days < 0) return `${Math.abs(days)} days ago`;
  if (days === 1) return 'Tomorrow';
  return `In ${days} days`;
}

export function isoDaysFromNow(days: number): string {
  const date = startOfDay(new Date());
  date.setDate(date.getDate() + days);
  return date.toISOString();
}