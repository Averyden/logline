import type { LogEntry } from '../core/types'
import type { LogLevel } from '../core/levels'

export interface Transport {
  readonly minLevel: LogLevel
  log(entry: LogEntry): void | Promise<void>
}
