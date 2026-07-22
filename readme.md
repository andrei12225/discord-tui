# discord_tui

A terminal-based Discord client built with React, Ink, and Discord.js.

`discord_tui` provides a text-based interface for browsing guilds, channels, messages, and members directly from the terminal.

## Features

- Terminal UI powered by Ink and React
- Discord gateway integration through `discord.js`
- Guild and channel navigation
- Message rendering for active channels with live `messageCreate` updates
- Member list updates for `guildMemberAdd` and `guildMemberRemove`
- Presence updates for active members
- Responsive layout for terminal window size changes

## Requirements

- Node.js 16 or newer
- A Discord bot token with the following gateway intents enabled:
  - `Guilds`
  - `GuildMessages`
  - `MessageContent`
  - `GuildMembers`
  - `GuildPresences`

## Installation

```bash
npm install
```

## Configuration

Create a `.env` file in the project root and set your bot token:

```env
BOT_TOKEN=your-discord-bot-token
```

The app loads environment variables from `.env` using `process.loadEnvFile('.env')`.

## Development

Build the project:

```bash
npm run build
```

Run the project in development mode:

```bash
npm run dev
```

Start the app after compiling:

```bash
npm start
```

## Usage

After building and configuring the bot token, run:

```bash
npm start
```

The UI launches in the terminal and connects to Discord using the configured bot token.

### Controls

- `Esc` to deselect the current channel and return to guild/channel navigation
- `/` to focus the chat input when a channel is selected

## Testing

Run linting and tests with:

```bash
npm test
```

## Project Structure

- `source/cli.tsx` - application entry point and Discord client setup
- `source/main.tsx` - terminal layout and main page composition
- `source/components/` - UI components for guilds, messages, and members
- `source/utils/` - data and state management for Discord guilds, channels, messages, and members

## License

MIT
