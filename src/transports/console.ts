import type { LogEntry } from '../core/types'
import type { LogLevel } from '../core/levels'
import type { Transport } from './transport'

export interface ConsoleTransportOptions {
  minLevel?: LogLevel
}

export class ConsoleTransport implements Transport {
  readonly minLevel: LogLevel

  constructor(options: ConsoleTransportOptions = {}) {
    this.minLevel = options.minLevel ?? 'debug'
  }

  log(entry: LogEntry): void {
    const timestamp = entry.timestamp.toISOString()
    const prefix = `[${timestamp}] [${entry.level.toUpperCase()}]`
    const service = entry.service ? ` [${entry.service}]` : ''
    const environment = entry.environment ? ` [${entry.environment}]` : ''

    const output = `${prefix}${service}${environment} ${entry.message}`

    switch (entry.level) {
      case 'debug':
        console.debug(output, entry.metadata ?? '')
        break
      case 'info':
        console.info(output, entry.metadata ?? '')
        break
      case 'warn':
        console.warn(output, entry.metadata ?? '')
        break
      case 'error':
      case 'fatal':
        console.error(output, entry.metadata ?? '')
        break
    }

    if (entry.tags?.length) {
      console.log('  Tags:', entry.tags.join(', '))
    }

    if (entry.error) {
      console.error(`  ${entry.error.name}: ${entry.error.message}`)

      if (entry.error.stack) {
        console.error(entry.error.stack)
      }
    }
  }
}
