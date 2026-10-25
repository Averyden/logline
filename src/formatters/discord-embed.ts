import type { LogEntry } from '../core/types'

export interface DiscordEmbedField {
  name: string
  value: string
  inline?: boolean
}

export interface DiscordEmbed {
  title: string
  description: string
  color: number
  timestamp: string
  fields?: DiscordEmbedField[]
  footer?: {
    text: string
  }
}

const LEVEL_COLORS: Record<LogEntry['level'], number> = {
  debug: 0x808080,
  info: 0x3498db,
  warn: 0xf1c40f,
  error: 0xe74c3c,
  fatal: 0x992d22,
} satisfies Record<LogEntry['level'], number>

function truncate(value: string, maxLength: number): string {
  if (value.length <= maxLength) {
    return value
  }

  return `${value.slice(0, maxLength - 3)}...`
}

export function formatDiscordEmbed(entry: LogEntry): DiscordEmbed {
  const fields: DiscordEmbedField[] = []

  if (entry.service) {
    fields.push({
      name: 'Service',
      value: truncate(entry.service, 1024),
      inline: true,
    })
  }

  if (entry.environment) {
    fields.push({
      name: 'Environment',
      value: truncate(entry.environment, 1024),
      inline: true,
    })
  }

  if (entry.tags?.length) {
    fields.push({
      name: 'Tags',
      value: truncate(entry.tags.join(', '), 1024),
    })
  }

  if (entry.metadata && Object.keys(entry.message).length > 0) {
    let metadata: string

    try {
      metadata = JSON.stringify(entry.metadata, null, 2)
    } catch {
      metadata = '[Metadata could not be Serialized]'
    }

    fields.push({
      name: 'Metadata',
      value: truncate(`\`\`\`json\n${metadata}\n\`\`\``, 1024),
    })
  }

  if (entry.error) {
    const errorDetails = entry.error.stack
      ? `${entry.error.name}: ${entry.error.message}\n${entry.error.stack}`
      : `${entry.error.name}: ${entry.error.message}`

    fields.push({
      name: 'Error',
      value: truncate(errorDetails, 1024),
    })
  }

  return {
    title: `Logline · ${entry.level.toUpperCase()}`,
    description: truncate(entry.message, 4096),
    color: LEVEL_COLORS[entry.level],
    timestamp: entry.timestamp.toISOString(),
    fields: fields.slice(0, 25),
    footer: {
      text: 'Logline',
    },
  }
}
