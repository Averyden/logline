const SENSITIVE_KEY_PATTERN =
  /password|passwd|secret|token|authorization|api[-_]?key|access[-_]?key|private[-_]?key|cookie|webhook|credential/i

const SENSITIVE_ASSIGNMENT_PATTERN =
  /\b(password|passwd|secret|token|authorization|api[-_]?key|access[-_]?key|private[-_]?key|cookie|webhook(?:url)?)\b(\s*[:=]\s*)(?:Bearer\s+\S+|Basic\s+\S+|"[^"]*"|'[^']*'|[^\s,;]+)/gi

const DATABASE_CREDENTIAL_PATTERN = /\b([a-z][a-z0-9+.-]*:\/\/[^:\s/@]+:)[^@\s/]+@/gi

const REDACTED = '[REDACTED]'

/**
 * Remove potentially sensitive values from plain strings before logging.
 *
 * @param value - The raw string to sanitize.
 * @returns The sanitized string with secret-like values redacted.
 */
export function sanitizeString(value: string): string {
  return value
    .replace(SENSITIVE_ASSIGNMENT_PATTERN, '$1$2[REDACTED]')
    .replace(DATABASE_CREDENTIAL_PATTERN, '$1[REDACTED]@')
}

/**
 * Recursively sanitize metadata values while guarding against circular references.
 *
 * @param value - The metadata value to sanitize.
 * @param seen - Tracks objects already visited during recursion.
 * @returns A sanitized clone of the value.
 */
function sanitizeValue(value: unknown, seen: WeakSet<object>): unknown {
  if (value === null || typeof value !== 'object') {
    return value
  }

  if (seen.has(value)) {
    return '[Circular]'
  }

  seen.add(value)

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeValue(item, seen))
  }

  const sanitized: Record<string, unknown> = {}

  for (const [key, item] of Object.entries(value)) {
    sanitized[key] = SENSITIVE_KEY_PATTERN.test(key) ? REDACTED : sanitizeValue(item, seen)
  }

  return sanitized
}

/**
 * Sanitize metadata objects by redacting keys and values that may contain secrets.
 *
 * @param metadata - The metadata object to sanitize.
 * @returns A new sanitized metadata object.
 */
export function sanitizeMetadata(metadata: Record<string, unknown>): Record<string, unknown> {
  return sanitizeValue(metadata, new WeakSet()) as Record<string, unknown>
}
