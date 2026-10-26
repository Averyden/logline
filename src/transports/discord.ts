import type { LogEntry } from '../core/types'
import type { Transport } from './transport'
import { formatDiscordEmbed } from '../formatters/discord-embed'

export interface DiscordTransportOptions {
  webhookUrl: string
}

export class DiscordTransport implements Transport {
  private readonly webhookUrl: string

  /**
   * Create a Discord webhook transport for sending log entries.
   *
   * @param options - The Discord webhook configuration.
   * @throws {Error} When the provided webhook URL is not a valid Discord webhook endpoint.
   */
  constructor(options: DiscordTransportOptions) {
    const url = new URL(options.webhookUrl)

    if (
      url.protocol !== 'https:' ||
      url.hostname !== 'discord.com' ||
      !url.pathname.startsWith('/api/webhooks/')
    ) {
      throw new Error('Invalid Discord webhook URL')
    }

    this.webhookUrl = url.toString()
  }

  /**
   * Send a serialized log entry to the configured Discord webhook.
   *
   * @param entry - The log entry to publish.
   * @returns A promise that resolves when the webhook request succeeds.
   * @throws {Error} When the webhook request fails or the response is not successful.
   */
  async log(entry: LogEntry): Promise<void> {
    const response = await fetch(this.webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        embeds: [formatDiscordEmbed(entry)],
        allowed_mentions: {
          parse: [],
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`Discord webhook request failed with status ${response.status}`)
    }
  }
}
