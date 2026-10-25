import type { LogLevel } from './levels'

export interface LogEntry {
  timestamp: Date
  level: LogLevel
  message: string
  service?: string
  environment?: string
  tags?: string[]
  metadata?: Record<string, unknown>
  error?: SerializedError
}

export interface SerializedError {
  name: string
  message: string
  stack?: string
}
