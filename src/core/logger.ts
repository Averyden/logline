import type { Transport } from '../transports/transport'
import { LOG_LEVELS, type LogLevel } from './levels'
import type { LogEntry, SerializedError } from './types'
import { sanitizeMetadata } from '../utils/sanitize'

export interface LogContext {
  tags?: string[]
  metadata?: Record<string, unknown>
}

export interface LoggerOptions {
  service?: string
  environment?: string
  minLevel?: LogLevel
  transports: Transport[]
}

export interface Logger {
  debug(message: string, context?: LogContext): void
  info(message: string, context?: LogContext): void
  warn(message: string, error?: unknown, context?: LogContext): void
  error(message: string, error?: unknown, context?: LogContext): void
  fatal(message: string, error?: unknown, context?: LogContext): void
}

function shouldLog(level: LogLevel, minLevel: LogLevel): boolean {
  return LOG_LEVELS.indexOf(level) >= LOG_LEVELS.indexOf(minLevel)
}

function serializeError(error: unknown): SerializedError | undefined {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    }
  }

  if (error === undefined) {
    return undefined
  }

  return {
    name: 'UnknownError',
    message: String(error),
  }
}

export function createLogger(options: LoggerOptions): Logger {
  const minLevel = options.minLevel ?? 'info'

  function write(level: LogLevel, message: string, error?: unknown, context?: LogContext): void {
    if (!shouldLog(level, minLevel)) {
      return
    }

    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      message,
      service: options.service,
      environment: options.environment,
      tags: context?.tags,
      metadata: context?.metadata ? sanitizeMetadata(context.metadata) : undefined,
      error: serializeError(error),
    }

    for (const transport of options.transports) {
      try {
        const result = transport.log(entry)

        if (result instanceof Promise) {
          void result.catch((transportError: unknown) => {
            console.error('Logline transport failed:', transportError)
          })
        }
      } catch (transportError: unknown) {
        console.error('Logline transport failed:', transportError)
      }
    }
  }

  return {
    debug: (message, context) => write('debug', message, undefined, context),
    info: (message, context) => write('info', message, undefined, context),
    warn: (message, error, context) => write('warn', message, error, context),
    error: (message, error, context) => write('error', message, error, context),
    fatal: (message, error, context) => write('fatal', message, error, context),
  }
}
