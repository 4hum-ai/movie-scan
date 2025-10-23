/**
 * Color mapping for rating levels based on their keys
 * @param key - The rating level key (e.g., 'G', 'PG', 'R', 'NC-17')
 * @returns Tailwind CSS background color class
 */
export function getRatingLevelColorClass(key: string): string {
  const keyLower = key.toLowerCase()

  // General rating patterns
  if (keyLower.includes('p') && !keyLower.includes('pg')) return 'bg-green-50'
  if (keyLower.includes('k')) return 'bg-blue-50'
  if (keyLower.includes('13')) return 'bg-yellow-50'
  if (keyLower.includes('16')) return 'bg-orange-50'
  if (keyLower.includes('18')) return 'bg-red-50'
  if (keyLower.includes('c')) return 'bg-red-100'
  if (keyLower.includes('g')) return 'bg-green-50'
  if (keyLower.includes('pg')) return 'bg-blue-50'
  if (keyLower.includes('r')) return 'bg-orange-50'
  if (keyLower.includes('nc')) return 'bg-red-50'
  if (keyLower.includes('u')) return 'bg-green-50'
  if (keyLower.includes('12')) return 'bg-yellow-50'
  if (keyLower.includes('15')) return 'bg-red-50'

  // FSK (German) rating system
  if (keyLower.includes('fsk')) {
    if (keyLower.includes('0')) return 'bg-green-50'
    if (keyLower.includes('6')) return 'bg-blue-50'
    if (keyLower.includes('12')) return 'bg-yellow-50'
    if (keyLower.includes('16')) return 'bg-orange-50'
    if (keyLower.includes('18')) return 'bg-red-50'
  }

  return 'bg-gray-50'
}

/**
 * Color mapping for different rating systems
 */
export const RATING_SYSTEM_COLORS = {
  GENERAL: 'bg-gray-50',
  CHILDREN: 'bg-green-50',
  TEEN: 'bg-yellow-50',
  ADULT: 'bg-red-50',
  RESTRICTED: 'bg-orange-50',
} as const
