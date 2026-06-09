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
import {Client, Events, GatewayIntentBits, Message, Guild} from 'discord.js';

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

export interface AppContext {
	messages: Message[];
	setMessages: Dispatch<SetStateAction<Message[]>>;
	guilds: Guild[];
	setGuilds: Dispatch<SetStateAction<Guild[]>>;
	focusedGuildId: string | null;
	setFocusedGuildId: Dispatch<SetStateAction<string | null>>;
}

export const AppContext = createContext<AppContext | null>(null);

function App() {
	const [ready, setReady] = useState(false);
	const [messages, setMessages] = useState<Message[]>([]);
	const [guilds, setGuilds] = useState<Guild[]>([]);
	const [focusedGuildId, setFocusedGuildId] = useState<string | null>(null);
	const [focusedElement] = useState<AppElements>(AppElements.GUILDS);

	const Context: AppContext = {
		messages: messages,
		setMessages: setMessages,
		guilds: guilds,
		setGuilds: setGuilds,
		focusedGuildId: focusedGuildId,
		setFocusedGuildId: setFocusedGuildId,
	};

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
				setFocusedGuildId(fetchedGuilds[0]!.id);
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
		<AppContext.Provider value={Context}>
			{ready ? (
				<MainPage />
			) : (
				<Text color={'blue'} italic>
					Bot loading...
				</Text>
			)}
		</AppContext.Provider>
	);
}

render(<App />);

client.login(process.env['BOT_TOKEN']);
