import type { LogEntry } from '../core/types'
import type { LogLevel } from '../core/levels'

export interface Transport {
  log(entry: LogEntry): void | Promise<void>
}
