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
import {Client, Events, GatewayIntentBits, Message} from 'discord.js';
import {TuiGuild, TuiChannel, TuiMessage} from './utils/domain.js';

process.loadEnvFile('.env');

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	],
});

export enum AppElements {
	GUILDS,
	CHANNELS,
	__LENGTH,
}

export interface MessageContext {
	messages: TuiMessage[];
	setMessages: Dispatch<SetStateAction<TuiMessage[]>>;
}

export interface ChannelContext {
	channels: TuiChannel[];
	setChannels: Dispatch<SetStateAction<TuiChannel[]>>;
	focusedChannelId: string | null;
}

export interface GuildContext {
	guilds: TuiGuild[];
	setGuilds: Dispatch<SetStateAction<TuiGuild[]>>;
	focusedGuildId: string | null;
}

export interface AppContext {
	focusedElement: AppElements;
}

export const MessageContext = createContext<MessageContext | null>(null);
export const ChannelContext = createContext<ChannelContext | null>(null);
export const GuildContext = createContext<GuildContext | null>(null);
export const AppContext = createContext<AppContext | null>(null);

function App() {
	const [ready, setReady] = useState(false);
	const [messages, setMessages] = useState<TuiMessage[]>([]);
	const [guilds, setGuilds] = useState<TuiGuild[]>([]);
	const [focusedGuildId, setFocusedGuildId] = useState<string | null>(null);
	const [channels, setChannels] = useState<TuiChannel[]>([]);
	const [focusedChannelId, setFocusedChannelId] = useState<string | null>(null);
	const [focusedElement, setFocusedElement] = useState<AppElements>(
		AppElements.GUILDS,
	);

	const messageContext: MessageContext = {
		messages,
		setMessages,
	};
	const channelContext: ChannelContext = {
		channels,
		setChannels,
		focusedChannelId,
	};
	const guildContext: GuildContext = {
		guilds,
		setGuilds,
		focusedGuildId,
	};
	const appContext: AppContext = {
		focusedElement
	};

	useEffect(() => {
		const handleMessage = (m: Message) => {
			setMessages(prev => [...prev, new TuiMessage(m)]);
		};
		const handleReady = async () => {
			const allOAuthGuilds = await client.guilds.fetch();
			const fetchedGuilds = await Promise.all(
				Array.from(allOAuthGuilds.values()).map(g => g.fetch()),
			);

			const wrappedGuilds = fetchedGuilds.map(g => new TuiGuild(g));
			setGuilds(wrappedGuilds);
			if (wrappedGuilds.length > 0) {
				setFocusedGuildId(wrappedGuilds[0]!.id);
			}
			setReady(true);
		};

		client.on(Events.MessageCreate, handleMessage);
		client.on(Events.ClientReady, handleReady);

		return () => {
			client.off(Events.MessageCreate, handleMessage);
		};
	}, [client]);

	useEffect(() => {
		const updateChannels = async () => {
			if (!focusedGuildId) return;
			const focusedGuild = guilds.find(g => g.id === focusedGuildId);
			if (focusedGuild) {
				const fetchedChannels = await focusedGuild.fetchChannels();
				setChannels(fetchedChannels);
				setFocusedChannelId(fetchedChannels[0]!.id);
			}
		};
		updateChannels();
	}, [focusedGuildId, guilds]);

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
			if (focusedElement === AppElements.CHANNELS && channels.length > 0) {
				const currentIndex = channels.findIndex(c => c.id === focusedChannelId);
				if (currentIndex !== -1) {
					let nextIndex = currentIndex;
					if (key.downArrow) {
						nextIndex = (currentIndex + 1) % channels.length;
					} else if (key.upArrow) {
						nextIndex = (currentIndex - 1 + channels.length) % channels.length;
					}
					setFocusedChannelId(channels[nextIndex]!.id);
				}
			}
		}
		if (key.leftArrow || key.rightArrow) {
			const currentFocus = focusedElement;
			let nextIndex = currentFocus;
			if (key.leftArrow) {
				nextIndex =
					(currentFocus - 1 + AppElements.__LENGTH) % AppElements.__LENGTH;
			} else if (key.rightArrow) {
				nextIndex = (currentFocus + 1) % AppElements.__LENGTH;
			}
			setFocusedElement(nextIndex);
		}
	});

	return (
		<AppContext value={appContext}>
			<GuildContext value={guildContext}>
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
			</GuildContext>
		</AppContext>
	);
}

render(<App />);

client.login(process.env['BOT_TOKEN']);
