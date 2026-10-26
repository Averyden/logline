import type { Transport } from '../transports/transport'
import { LOG_LEVELS, type LogLevel } from './levels'
import type { LogEntry, SerializedError } from './types'
import { sanitizeMetadata, sanitizeString } from '../utils/sanitize'

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

/**
 * Determine whether a log level meets the configured minimum severity.
 *
 * @param level - The log level to evaluate.
 * @param minLevel - The minimum allowed log level.
 * @returns True when the level is at or above the minimum threshold.
 */
function shouldLog(level: LogLevel, minLevel: LogLevel): boolean {
  return LOG_LEVELS.indexOf(level) >= LOG_LEVELS.indexOf(minLevel)
}

/**
 * Convert an unknown error value into a sanitized serialized error payload.
 *
 * @param error - The original error or non-error value to serialize.
 * @returns A sanitized error representation, or undefined when no error was provided.
 */
function serializeError(error: unknown): SerializedError | undefined {
  if (error instanceof Error) {
    return {
      name: sanitizeString(error.name),
      message: sanitizeString(error.message),
      stack: error.stack ? sanitizeString(error.stack) : undefined,
    }
  }

  if (error === undefined) {
    return undefined
  }

  return {
    name: 'UnknownError',
    message: sanitizeString(String(error)),
  }
}

/**
 * Create a logger instance bound to the given service metadata and transports.
 *
 * @param options - Configuration for the logger, including service metadata and transports.
 * @returns A logger API for writing debug, info, warn, error, and fatal entries.
 */
export function createLogger(options: LoggerOptions): Logger {
  const minLevel = options.minLevel ?? 'info'

  /**
   * Write a sanitized log entry to each configured transport.
   *
   * @param level - The severity associated with the log entry.
   * @param message - The human-readable message body.
   * @param error - Optional error metadata to include with the entry.
   * @param context - Optional tags and metadata to attach to the entry.
   */
  function write(level: LogLevel, message: string, error?: unknown, context?: LogContext): void {
    if (!shouldLog(level, minLevel)) {
      return
    }

    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      message: sanitizeString(message),
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
    /**
     * Log a debug message.
     *
     * @param message - The message to log.
     * @param context - Optional metadata to include.
     */
    debug: (message, context) => write('debug', message, undefined, context),
    /**
     * Log an informational message.
     *
     * @param message - The message to log.
     * @param context - Optional metadata to include.
     */
    info: (message, context) => write('info', message, undefined, context),
    /**
     * Log a warning message.
     *
     * @param message - The message to log.
     * @param error - Optional error details associated with the warning.
     * @param context - Optional metadata to include.
     */
    warn: (message, error, context) => write('warn', message, error, context),
    /**
     * Log an error message.
     *
     * @param message - The message to log.
     * @param error - Optional error details associated with the error.
     * @param context - Optional metadata to include.
     */
    error: (message, error, context) => write('error', message, error, context),
    /**
     * Log a fatal message.
     *
     * @param message - The message to log.
     * @param error - Optional error details associated with the fatal error.
     * @param context - Optional metadata to include.
     */
    fatal: (message, error, context) => write('fatal', message, error, context),
  }
}
