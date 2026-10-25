import { expect, test } from 'bun:test'
import { sanitizeMetadata } from '../src/utils/sanitize'

test('redacts sensitive keys', () => {
  const result = sanitizeMetadata({
    username: 'foo',
    password: 'bar2000',
    apiKey: 'oooo-scary-api-key',
    authorization: 'Bearer abc123',
  })

  expect(result).toEqual({
    username: 'foo',
    password: '[REDACTED]',
    apiKey: '[REDACTED]',
    authorization: '[REDACTED]',
  })
})

test('redacts sensitive keys in nested objects and arrays', () => {
  const result = sanitizeMetadata({
    database: {
      credentials: {
        password: 'foobar',
      },
    },
    requests: [{ accessToken: 'foo123' }, { path: '/tasks' }],
  })

  expect(result).toEqual({
    database: {
      credentials: '[REDACTED]',
    },
    requests: [{ accessToken: '[REDACTED]' }, { path: '/tasks' }],
  })
})

test('does not mutate the original metadata', () => {
  const metadata = {
    password: 'secret',
  }

  sanitizeMetadata(metadata)

  expect(metadata.password).toBe('secret')
})

test('handles circular references', () => {
  const metadata: Record<string, unknown> = {
    name: 'test',
  }

  metadata.self = metadata

  expect(sanitizeMetadata(metadata)).toEqual({
    name: 'test',
    self: '[Circular]',
  })
})
