export { createLogger } from './core/logger'
export type { Logger, LoggerOptions, LogContext } from './core/logger'

export { LOG_LEVELS } from './core/levels'
export type { LogLevel } from './core/levels'
export type { LogEntry, SerializedError } from './core/types'

export { ConsoleTransport } from './transports/console'
export type { ConsoleTransportOptions } from './transports/console'

export { DiscordTransport } from './transports/discord'
export type { DiscordTransportOptions } from './transports/discord'
export { formatDiscordEmbed } from './formatters/discord-embed'
export type { DiscordEmbed, DiscordEmbedField } from './formatters/discord-embed'
