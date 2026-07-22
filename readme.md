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

Create a `.env` file in the project root and set your bot values based on `.env.example`.

```env
BOT_TOKEN=your-discord-bot-token
chatbox-id=chatbox
focused-bg=blue
focused-fg=white
main-fg=gray
color-offline=gray
color-online=green
color-idle=yellow
color-dnd=red
```

The app loads environment variables from `.env` using `process.loadEnvFile('.env')`.

### Environment variables

- `BOT_TOKEN` - your Discord bot token used to authenticate the client
- `chatbox-id` - Ink focus ID for the chat input field
- `focused-bg` - background color for focused menu options
- `focused-fg` - foreground color for focused menu options
- `main-fg` - default foreground color for menu text and labels
- `color-offline` - color used when a member is offline
- `color-online` - color used when a member is online
- `color-idle` - color used when a member is idle
- `color-dnd` - color used when a member has Do Not Disturb status

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
