/**
 * Convert various date formats to a Date object
 * @param value - Value to convert to Date (string, number, Date, or Firebase timestamp object)
 * @returns Date object or null if conversion fails
 *
 * @example
 * ```typescript
 * // String dates
 * toDate("2024-01-15"); // Date object
 * toDate("2024-01-15T10:30:00Z"); // Date object
 *
 * // Number timestamps
 * toDate(1705312800000); // Date object
 * toDate(1705312800); // Date object (seconds)
 *
 * // Date objects
 * toDate(new Date()); // Same Date object
 * toDate(new Date("invalid")); // null
 *
 * // Firebase timestamp objects
 * toDate({ _seconds: 1705312800, _nanoseconds: 500000000 }); // Date object
 * toDate({ seconds: 1705312800, nanoseconds: 500000000 }); // Date object
 *
 * // Invalid values
 * toDate(null); // null
 * toDate(undefined); // null
 * toDate("invalid-date"); // null
 * ```
 */
export function toDate(value: unknown): Date | null {
  if (!value) return null
  if (value instanceof Date) return isNaN(value.getTime()) ? null : value
  if (typeof value === 'string' || typeof value === 'number') {
    const d = new Date(value)
    return isNaN(d.getTime()) ? null : d
  }
  if (typeof value === 'object') {
    const seconds =
      (value as { _seconds?: number; seconds?: number })._seconds ??
      (value as { _seconds?: number; seconds?: number }).seconds
    const nanos =
      (value as { _nanoseconds?: number; nanoseconds?: number })._nanoseconds ??
      (value as { _nanoseconds?: number; nanoseconds?: number }).nanoseconds ??
      0
    if (typeof seconds === 'number') {
      const ms = seconds * 1000 + Math.floor(nanos / 1e6)
      const d = new Date(ms)
      return isNaN(d.getTime()) ? null : d
    }
  }
  return null
}

export function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10)
}

export function computeDateRange(
  preset?: string,
  from?: string,
  to?: string
): { from?: string; to?: string } | undefined {
  const today = new Date()
  if (preset && preset !== 'all' && preset !== 'custom') {
    const d = new Date(today)
    const days = preset === '7d' ? 7 : preset === '30d' ? 30 : preset === '90d' ? 90 : 0
    d.setDate(d.getDate() - days)
    return { from: toISODate(d), to: toISODate(today) }
  }
  if (preset === 'custom' || (!preset && (from || to))) {
    return { from, to }
  }
  return undefined
}
