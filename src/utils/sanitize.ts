const SENSITIVE_KEY_PATTERN =
  /password|passwd|secret|token|authorization|api[-_]?key|private[-_]?key|cookie|webhook|credential/i

const REDACTED = '[REDACTED]'

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

export function sanitizeMetadata(metadata: Record<string, unknown>): Record<string, unknown> {
  return sanitizeValue(metadata, new WeakSet()) as Record<string, unknown>
}
