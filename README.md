# Logline

[![Version](https://img.shields.io/github/package-json/v/Averyden/logline?label=Version&color=blue)](https://github.com/Averyden/logline/blob/master/package.json)
[![Built with Bun](https://img.shields.io/badge/built%20with-Bun-14151A?logo=bun&logoColor=white)](https://bun.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5%2B-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Build and publish](https://github.com/Averyden/logline/actions/workflows/publish.yml/badge.svg)](https://github.com/Averyden/logline/actions/workflows/publish.yml)

Logline is a small, typed logging library for Bun and TypeScript. It supports log levels, structured metadata, error serialization, console output, and Discord webhook delivery.

## Requirements

- [Bun](https://bun.com) 1.4 or newer
- TypeScript support through Bun

## Install

```bash
bun install
```

## Usage

Create a logger with one or more transports. The default minimum level is `info`.

```ts
import { ConsoleTransport, createLogger } from './src'

const logger = createLogger({
  service: 'checkout-api',
  environment: 'production',
  transports: [new ConsoleTransport()],
})

logger.info('Checkout started', {
  tags: ['checkout'],
  metadata: { orderId: 'order-123' },
})

try {
  await processCheckout()
} catch (error) {
  logger.error('Checkout failed', error, {
    metadata: { orderId: 'order-123' },
  })
}
```

Supported levels, from least to most severe, are `debug`, `info`, `warn`, `error`, and `fatal`. Set `minLevel` to filter entries before they reach transports:

```ts
const logger = createLogger({
  minLevel: 'warn',
  transports: [new ConsoleTransport()],
})
```

## Discord webhooks

Add a Discord transport alongside the console transport. Webhook URLs must use HTTPS and the `discord.com/api/webhooks/` endpoint.

```ts
import { ConsoleTransport, createLogger } from './src'
import { DiscordTransport } from './src/transports/discord'

const logger = createLogger({
  service: 'checkout-api',
  transports: [
    new ConsoleTransport(),
    new DiscordTransport({
      webhookUrl: Bun.env.DISCORD_WEBHOOK_URL!,
    }),
  ],
})

logger.warn('Payment provider response was slow', undefined, {
  metadata: { latencyMs: 2400 },
})
```

Create the environment file:

```bash
cp .env.example .env
```

Fill in `DISCORD_WEBHOOK_URL` in `.env`. On PowerShell, use `Copy-Item .env.example .env` instead.

The repository includes a real webhook smoke test in `sandbox/discord-webhook.ts`. Run it only when `DISCORD_WEBHOOK_URL` is configured:

```bash
bun run sandbox/discord-webhook.ts
```

## Development

Run the test suite with:

```bash
bun test
```

The public entry point is `src/index.ts`. It exports the logger factory, log levels and types, and `ConsoleTransport`; import `DiscordTransport` directly from `src/transports/discord` when it is needed.
