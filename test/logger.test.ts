import { describe, expect, test } from 'bun:test'
import { createLogger } from '../src/core/logger'
import type { LogEntry } from '../src/core/types'
import type { Transport } from '../src/transports/transport'

describe('createLogger', () => {
  test('sends entries to the transport', () => {
    const entries: LogEntry[] = []

    const transport: Transport = {
      log(entry) {
        entries.push(entry)
      },
    }

    const logger = createLogger({
      minLevel: 'debug',
      transports: [transport],
    })

    logger.info('Hello, Logline!')

    expect(entries).toHaveLength(1)
    expect(entries[0]?.message).toBe('Hello, Logline!')
    expect(entries[0]?.level).toBe('info')
  })

  test('filters entries below the minimum level', () => {
    const entries: LogEntry[] = []

    const transport: Transport = {
      log(entry) {
        entries.push(entry)
      },
    }

    const logger = createLogger({
      minLevel: 'warn',
      transports: [transport],
    })

    logger.debug('Filtered')
    logger.info('Filtered')
    logger.warn('Accepted')
    logger.error('Accepted')

    expect(entries).toHaveLength(2)
    expect(entries[0]?.message).toBe('Accepted')
    expect(entries[1]?.message).toBe('Accepted')
  })

  test('serializes Error instances', () => {
    const entries: LogEntry[] = []

    const transport: Transport = {
      log(entry) {
        entries.push(entry)
      },
    }

    const logger = createLogger({
      minLevel: 'debug',
      transports: [transport],
    })

    const error = new TypeError('Scooby diabetes diagnosis')

    logger.error('Something went wrong', error)

    expect(entries).toHaveLength(1)
    expect(entries[0]?.error).toMatchObject({
      name: 'TypeError',
      message: 'Scooby diabetes diagnosis',
    })
    expect(entries[0]?.error?.stack).toBeDefined()
  })

  test('handles non-Error values', () => {
    const entries: LogEntry[] = []

    const transport: Transport = {
      log(entry) {
        entries.push(entry)
      },
    }

    const logger = createLogger({
      minLevel: 'debug',
      transports: [transport],
    })

    logger.error('Something went wrong', 'uh oh')

    expect(entries[0]?.error).toEqual({
      name: 'UnknownError',
      message: 'uh oh',
    })
  })
})

test('redacts sensitive values in log messages', () => {
  const entries: LogEntry[] = []
  const transport: Transport = {
    log: (entry) => {
      entries.push(entry)
    },
  }

  const logger = createLogger({
    transports: [transport],
  })

  logger.error('Request failed: token="abc123" password=hunter2')

  expect(entries[0]?.message).toBe('Request failed: token=[REDACTED] password=[REDACTED]')
})
