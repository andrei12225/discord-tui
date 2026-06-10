#!/usr/bin/env node
import React, {useEffect, useState} from 'react';
import {render, Text, useInput} from 'ink';
import {Client, Events, GatewayIntentBits, Message} from 'discord.js';
import {TuiGuild, TuiMessage} from './utils/domain.js';
import {GuildProvider, useAppGuilds} from './utils/GuildManager.js';
import {ChannelProvider, useAppChannels} from './utils/ChannelManager.js';
import {MessageProvider, useAppMessages} from './utils/MessageManager.js';
import {AppElements, FocusProvider, useAppFocus} from './utils/FocusManager.js';
import MainPage from './main.js';

process.loadEnvFile('.env');

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	],
});

function AppInner() {
	const [ready, setReady] = useState(false);
	const guildsManager = useAppGuilds();
	const channelsManager = useAppChannels();
	const messagesManager = useAppMessages();
	const focusManager = useAppFocus();

	useEffect(() => {
		const handleMessage = (m: Message) => {
			messagesManager.addMessage(new TuiMessage(m));
		};
		const handleReady = async () => {
			const allOAuthGuilds = await client.guilds.fetch();
			const fetchedGuilds = await Promise.all(
				Array.from(allOAuthGuilds.values()).map(g => g.fetch()),
			);

			const wrappedGuilds = fetchedGuilds.map(g => new TuiGuild(g));
			guildsManager.setList(wrappedGuilds);
			if (wrappedGuilds.length > 0) {
				guildsManager.setFocusedGuildId(wrappedGuilds[0]!.id);
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
			if (!guildsManager.selectedId) return;
			const selectedGuild = guildsManager.getSelectedGuild();
			if (selectedGuild) {
				const fetchedChannels = await selectedGuild.fetchChannels();
				channelsManager.setList(fetchedChannels);
				if (fetchedChannels.length > 0) {
					channelsManager.setFocusedChannelId(fetchedChannels[0]!.id);
				}
			}
		};
		updateChannels();
	}, [guildsManager.selectedId]);

	useInput((_, key) => {
		if (key.downArrow || key.upArrow) {
			key.downArrow
				? guildsManager.focusNext()
				: guildsManager.focusPrevious();
			key.downArrow
				? channelsManager.focusNext()
				: channelsManager.focusPrevious();
		}
		if (key.return) {
			if (focusManager.focusedElement === AppElements.GUILDS) {
				guildsManager.selectFocusedGuild();
				focusManager.focusLeft();
			}
		}
	});

	return ready ? (
		<MainPage />
	) : (
		<Text color={'blue'} italic>
			Bot loading...
		</Text>
	);
}

function App() {
	return (
		<FocusProvider>
			<GuildProvider>
				<ChannelProvider>
					<MessageProvider>
						<AppInner />
					</MessageProvider>
				</ChannelProvider>
			</GuildProvider>
		</FocusProvider>
	);
}

render(<App />);

client.login(process.env['BOT_TOKEN']);
