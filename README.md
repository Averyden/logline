# Logline

[![npm version](https://img.shields.io/npm/v/@averyden/logline)](https://www.npmjs.com/package/@averyden/logline)
[![TypeScript](https://img.shields.io/badge/TypeScript-5%2B-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Lightweight structured logging for TypeScript apps. Logline gives you a small, typed logger with log levels, metadata support, sanitized error output, console transport, and optional Discord webhook delivery.

## Features

- Typed `debug`, `info`, `warn`, `error`, and `fatal` logging
- Structured `tags` and `metadata` payloads
- Error serialization with stack traces for `Error` values
- Configurable minimum log level filtering
- Built-in `ConsoleTransport`
- Optional `DiscordTransport` for webhook notifications

## Installation

```bash
npm install @averyden/logline
```

Or with Bun or pnpm:

```bash
bun add @averyden/logline
pnpm add @averyden/logline
```

## Quick start

```ts
import { ConsoleTransport, createLogger } from '@averyden/logline'

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

## API

```ts
import {
  createLogger,
  ConsoleTransport,
  DiscordTransport,
  type LogLevel,
  type Logger,
} from '@averyden/logline'
```

### createLogger

```ts
const logger = createLogger({
  service?: string
  environment?: string
  minLevel?: 'debug' | 'info' | 'warn' | 'error' | 'fatal'
  transports: Array<ConsoleTransport | DiscordTransport>
})
```

### Logger methods

```ts
logger.debug(message: string, context?: { tags?: string[]; metadata?: Record<string, unknown> }): void
logger.info(message: string, context?: { tags?: string[]; metadata?: Record<string, unknown> }): void
logger.warn(message: string, error?: unknown, context?: { tags?: string[]; metadata?: Record<string, unknown> }): void
logger.error(message: string, error?: unknown, context?: { tags?: string[]; metadata?: Record<string, unknown> }): void
logger.fatal(message: string, error?: unknown, context?: { tags?: string[]; metadata?: Record<string, unknown> }): void
```

## Log levels

Supported levels, from least to most severe, are:

```ts
'debug' | 'info' | 'warn' | 'error' | 'fatal'
```

Use `minLevel` to filter log entries before they reach any transport:

```ts
const logger = createLogger({
  minLevel: 'warn',
  transports: [new ConsoleTransport()],
})
```

## Transports

### ConsoleTransport

The default console transport writes structured logs to stdout/stderr-like console output.

```ts
import { ConsoleTransport, createLogger } from '@averyden/logline'

const logger = createLogger({
  service: 'orders',
  transports: [new ConsoleTransport()],
})
```

### DiscordTransport

Send log entries to a Discord webhook.

```ts
import {
  ConsoleTransport,
  createLogger,
  DiscordTransport,
} from '@averyden/logline'

const logger = createLogger({
  service: 'checkout-api',
  transports: [
    new ConsoleTransport(),
    new DiscordTransport({
      webhookUrl: process.env.DISCORD_WEBHOOK_URL!,
    }),
  ],
})

logger.warn('Payment provider response was slow', undefined, {
  metadata: { latencyMs: 2400 },
})
```

The webhook URL must use HTTPS and point to a valid `discord.com/api/webhooks/...` endpoint. Store it in a `.env` file as `DISCORD_WEBHOOK_URL` and read it from `process.env.DISCORD_WEBHOOK_URL`.

## License

MIT
