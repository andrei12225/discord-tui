#!/usr/bin/env node
import React, {
	createContext,
	Dispatch,
	SetStateAction,
	useEffect,
	useState,
} from 'react';
import {render, Text, useInput} from 'ink';
import MainPage from './main.js';
import {Client, Events, GatewayIntentBits, Message, Guild, CategoryChannel, ForumChannel, MediaChannel, NewsChannel, StageChannel, TextChannel, VoiceChannel} from 'discord.js';

process.loadEnvFile('.env');

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	],
});

enum AppElements {
	GUILDS,
}

export type TuiChannel = (CategoryChannel | NewsChannel | StageChannel | TextChannel | VoiceChannel | ForumChannel | MediaChannel | undefined)

export interface MessageContext {
	messages: Message[];
	setMessages: Dispatch<SetStateAction<Message[]>>;
}

export interface ChannelContext {
	channels: TuiChannel[];
	setChannels: Dispatch<SetStateAction<TuiChannel[]>>;
	focusedChannelId: string | null;
	setFocusedChannelId: Dispatch<SetStateAction<string | null>>;
}

export interface GuildContext {
	guilds: Guild[];
	setGuilds: Dispatch<SetStateAction<Guild[]>>;
	focusedGuildId: string | null;
	setFocusedGuildId: Dispatch<SetStateAction<string | null>>;
}

export const MessageContext = createContext<MessageContext | null>(null);
export const GuildContext = createContext<GuildContext | null>(null);
export const ChannelContext = createContext<ChannelContext | null>(null);

function App() {
	const [ready, setReady] = useState(false);
	const [messages, setMessages] = useState<Message[]>([]);
	const [guilds, setGuilds] = useState<Guild[]>([]);
	const [focusedGuildId, setFocusedGuildId] = useState<string | null>(null);
	const [channels, setChannels] = useState<TuiChannel[]>([]);
	const [focusedChannelId, setFocusedChannelId] = useState<string | null>(null);
	const [focusedElement] = useState<AppElements>(AppElements.GUILDS);

	const messageContext: MessageContext = {
		messages,
		setMessages,
	};
	const guildContext: GuildContext = {
		guilds,
		setGuilds,
		focusedGuildId,
		setFocusedGuildId,
	};
	const channelContext: ChannelContext = {
		channels,
		setChannels,
		focusedChannelId,
		setFocusedChannelId
	}

	useEffect(() => {
		const handleMessage = (m: Message) => {
			setMessages(prev => [...prev, m]);
		};
		const handleReady = async () => {
			const allOAuthGuilds = await client.guilds.fetch();
			const fetchedGuilds = await Promise.all(
				Array.from(allOAuthGuilds.values()).map(g => g.fetch()),
			);

			setGuilds(fetchedGuilds);
			if (fetchedGuilds.length > 0) {
				const focusedGuild = fetchedGuilds[0]!;
				setFocusedGuildId(focusedGuild.id);

				const guildChannelsCollection = await focusedGuild.channels.fetch();
				const fetchGuildChannels: TuiChannel[] = await Promise.all(
					Array.from(guildChannelsCollection.values()).map(c => c?.fetch())
				);

				setChannels(fetchGuildChannels);
			}
			setReady(true);
		};

		client.on(Events.MessageCreate, handleMessage);
		client.on(Events.ClientReady, handleReady);

		return () => {
			client.off(Events.MessageCreate, handleMessage);
		};
	}, [client]);

	useInput((_, key) => {
		if (key.downArrow || key.upArrow) {
			if (focusedElement === AppElements.GUILDS && guilds.length > 0) {
				const currentIndex = guilds.findIndex(g => g.id === focusedGuildId);
				if (currentIndex !== -1) {
					let nextIndex = currentIndex;
					if (key.downArrow) {
						nextIndex = (currentIndex + 1) % guilds.length;
					} else if (key.upArrow) {
						nextIndex = (currentIndex - 1 + guilds.length) % guilds.length;
					}
					setFocusedGuildId(guilds[nextIndex]!.id);
				}
			}
		}
	});

	return (
		<GuildContext.Provider value={guildContext}>
			<ChannelContext value={channelContext}>
				<MessageContext value={messageContext}>
					{ready ? (
						<MainPage />
					) : (
						<Text color={'blue'} italic>
							Bot loading...
						</Text>
					)}
				</MessageContext>
			</ChannelContext>
		</GuildContext.Provider>
	);
}

render(<App />);

client.login(process.env['BOT_TOKEN']);
