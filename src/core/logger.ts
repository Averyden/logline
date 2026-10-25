import type { Transport } from '../transports/transport'
import type { LogLevel } from './levels'

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
