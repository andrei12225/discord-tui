#!/usr/bin/env node
import React, {useEffect, useRef, useState} from 'react';
import {render, Text, useInput, useWindowSize} from 'ink';
import {Client, Events, GatewayIntentBits, Presence} from 'discord.js';
import {GuildProvider, useAppGuilds} from './utils/GuildManager.js';
import {ChannelProvider, useAppChannels} from './utils/ChannelManager.js';
import {MessageProvider, useAppMessages} from './utils/MessageManager.js';
import MainPage from './main.js';
import { MemberProvider, useAppMembers } from './utils/MemberManager.js';

process.loadEnvFile('.env');

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildPresences
	],
});

function AppInner() {
	const [ready, setReady] = useState(false);
	const guildsManager = useAppGuilds();
	const channelsManager = useAppChannels();
	const messagesManager = useAppMessages();
	const membersManager = useAppMembers();
	const {rows, columns} = useWindowSize();

	const channelsManagerRef = useRef(channelsManager);
	channelsManagerRef.current = channelsManager;
	const membersManagerRef = useRef(membersManager);
	membersManagerRef.current = membersManager;

	useEffect(() => {
		const handleReady = async () => {
			await guildsManager.fetchAndSetAllGuilds(client);

			setReady(true);
		};
		const handlePresenceUpdate = async (_: Presence | null, newPresence: Presence) => {
			const selectedChannel = channelsManagerRef.current.getSelectedChannel();
			if (!selectedChannel) return;
			if (!newPresence.member) return;
			// If the member that updated presence isn't in the selected channel, do nothing
			if (!selectedChannel.members.has(newPresence.member.id)) return;
			await membersManagerRef.current.updatePresence(newPresence.member.id);
		};

		client.on(Events.MessageCreate, messagesManager.handleNewMessage);
		client.on(Events.PresenceUpdate, handlePresenceUpdate);
		client.on(Events.ClientReady, handleReady);

		return () => {
			client.off(Events.MessageCreate, messagesManager.handleNewMessage);
			client.off(Events.PresenceUpdate, handlePresenceUpdate);
		};
	}, [client]);

	useEffect(() => {
		channelsManager.fetchAndSetAllChannels(guildsManager.getSelectedGuild());
	}, [guildsManager.selectedId]);

	useEffect(() => {
		const selectedChannel = channelsManager.getSelectedChannel();
		messagesManager.fetchAndSetAllMessages(
			selectedChannel,
			rows,
			columns,
		);
		membersManager.fetchAndSetAllMembers(selectedChannel, rows);
	}, [channelsManager.selectedId]);

	useEffect(() => {
		messagesManager.updateMessagesHeight(rows, columns);
	}, [rows, messagesManager.list.length]);

	useEffect(() => {
		membersManager.updateMembersHeight(rows);
	}, [rows, membersManager.list.length]);

	useInput(async (_, key) => {
		if (key.escape) {
			if (channelsManager.hasSelectedChannel()) {
				guildsManager.deselectGuild();
				channelsManager.deselectChannel();
				channelsManager.setList([]);
				messagesManager.clearAll();
				membersManager.clearAll();
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
		<GuildProvider>
			<ChannelProvider>
				<MemberProvider>
					<MessageProvider>
						<AppInner />
					</MessageProvider>
				</MemberProvider>
			</ChannelProvider>
		</GuildProvider>
	);
}

render(<App />);

client.login(process.env['BOT_TOKEN']);
