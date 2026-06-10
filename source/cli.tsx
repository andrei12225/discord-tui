#!/usr/bin/env node
import React, {useEffect, useState} from 'react';
import {render, Text, useInput, useWindowSize} from 'ink';
import {Client, Events, GatewayIntentBits} from 'discord.js';
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
	const {rows, columns} = useWindowSize();

	useEffect(() => {
		const handleReady = async () => {
			await guildsManager.fetchAndSetAllGuilds(client);

			setReady(true);
		};

		client.on(Events.MessageCreate, messagesManager.handleNewMessage);
		client.on(Events.ClientReady, handleReady);

		return () => {
			client.off(Events.MessageCreate, messagesManager.handleNewMessage);
		};
	}, [client]);

	useEffect(() => {
		channelsManager.fetchAndSetAllChannels(guildsManager.getSelectedGuild());
	}, [guildsManager.selectedId]);

	useEffect(() => {
		messagesManager.fetchAndSetAllMessages(channelsManager.getFocusedChannel(), rows, columns);
	}, [channelsManager.selectedId]);

	useEffect(() => {
		messagesManager.updateMessagesHeight(rows, columns);
	}, [rows, messagesManager.list.length]);

	useInput(async (_, key) => {
		if (key.downArrow || key.upArrow) {
			if (focusManager.focusedElement === AppElements.GUILDS)
				key.downArrow
					? guildsManager.focusNext()
					: guildsManager.focusPrevious();
			if (focusManager.focusedElement === AppElements.CHANNELS)
				key.downArrow
					? channelsManager.focusNext()
					: channelsManager.focusPrevious();
		}
		if (key.return) {
			if (focusManager.focusedElement === AppElements.GUILDS) {
				guildsManager.selectFocusedGuild();
				focusManager.setFocusedElement(AppElements.CHANNELS);
			}
			if (focusManager.focusedElement === AppElements.CHANNELS) {
				channelsManager.selectFocusedChannel();
			}
		}
		if (key.escape) {
			if (focusManager.focusedElement === AppElements.CHANNELS) {
				guildsManager.deselectGuild();
				channelsManager.setList([]);
				messagesManager.clearAll();
				focusManager.setFocusedElement(AppElements.GUILDS);
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
