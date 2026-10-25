import { expect, test } from 'bun:test'
import { formatDiscordEmbed } from '../src/formatters/discord-embed'
import type { LogEntry } from '../src/core/types'

const entry: LogEntry = {
  timestamp: new Date('2026-10-25T12:00:00.000Z'),
  level: 'error',
  message: 'Failed to load tasks',
  service: 'logline',
  environment: 'test',
  tags: ['database'],
  metadata: {
    operation: 'loadTasks',
  },
  error: {
    name: 'Error',
    message: 'Connection refused',
  },
}

test('formats a log entry as a Discord embed', () => {
  const embed = formatDiscordEmbed(entry)

  expect(embed.title).toBe('Logline · ERROR')
  expect(embed.description).toBe('Failed to load tasks')
  expect(embed.color).toBe(0xe74c3c)
  expect(embed.timestamp).toBe('2026-10-25T12:00:00.000Z')

  expect(embed.fields).toContainEqual({
    name: 'Service',
    value: 'logline',
    inline: true,
  })

  expect(embed.fields).toContainEqual({
    name: 'Error',
    value: 'Error: Connection refused',
  })
})
