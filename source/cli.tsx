#!/usr/bin/env node
import React, { createContext, Dispatch, SetStateAction, useEffect, useState } from 'react';
import {render, Text, useInput} from 'ink';
import MainPage from './main.js';
import {Client, Events, GatewayIntentBits, Message} from 'discord.js';
import { TuiGuild } from './utils/GuildManager.js';

process.loadEnvFile('.env');

const client = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]});

enum AppElements {
	GUILDS
}

export interface AppContext {
	messages: Message[];
	setMessages: Dispatch<SetStateAction<Message[]>>;
	guilds: TuiGuild[];
	setGuilds: Dispatch<SetStateAction<TuiGuild[]>>;
};

export const AppContext = createContext<AppContext | null>(null);

function App() {
	const [ready, setReady] = useState(false);
	const [messages, setMessages] = useState<Message[]>([]);
	const [guilds, setGuilds] = useState<TuiGuild[]>([]);
	const [focusedElement, setFocusedElement] = useState<AppElements>(AppElements.GUILDS);
	
	const Context: AppContext = {
		messages: messages,
		setMessages: setMessages,
		guilds: guilds,
		setGuilds: setGuilds
	}

	useEffect(() => {
		const handleMessage = (m: Message) => {
			setMessages(prev => [...prev, m]);
		};
		const handleReady = async () => {
			const allOAuthGuilds = await client.guilds.fetch();

			allOAuthGuilds.forEach(async g => {
				const fetchedGuild = await g.fetch();
				const appGuild = fetchedGuild as TuiGuild;
				appGuild.isFocused = false;

				setGuilds(prev => [...prev, appGuild]);
			});

			setReady(true);
		};

		client.on(Events.MessageCreate, handleMessage);
		client.on(Events.ClientReady, handleReady);

		return () => {
			client.off(Events.MessageCreate, handleMessage);
		}
	}, [client]);

	useInput((_, key) => {
		if (key.downArrow) {
			switch (focusedElement) {
				case AppElements.GUILDS:

			}
		}
	});

	return (
		<AppContext.Provider value={Context}>
			{
				ready 
				?
				<MainPage />
				:
				<Text color={"blue"} italic>
					Bot loading...
				</Text>
			}
		</AppContext.Provider>
	)
}

render(<App/>);

client.login(process.env['BOT_TOKEN']);